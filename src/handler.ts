import { Handler, SQSBatchResponse, SQSEvent } from 'aws-lambda';
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { Readable } from 'stream';
import { Blob } from 'buffer';
import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import logger from './observability/logger';
import { generateMinistryDocumentModel } from './models/document';
import { Request } from './models/request';
import { DocumentType } from './models/documentName.enum';

const handler: Handler = async (event: SQSEvent): Promise<SQSBatchResponse> => {
  logger.debug("Function triggered'.");
  if (!event || !event.Records || !event.Records.length) {
    logger.error('ERROR: event is not defined.');
    throw new Error('Event is empty');
  }

  const altPromiseArray = event.Records.map((sqsRecord) => {
    const request = JSON.parse(sqsRecord.body) as Request;
    let documentData;
    let fileName: string;
    if (request.documentName === DocumentType.MINISTRY || request.documentName === DocumentType.MINISTRY_TRL) {
      documentData = generateMinistryDocumentModel(request.vehicle);
      fileName = `plate_${request.vehicle.techRecord.plates.plateSerialNumber}`;
    } else {
      throw new Error('Document Type not supported');
    }
    return generateAndUpload(documentData, request, fileName);
  });

  const results = await Promise.allSettled(altPromiseArray);
  const ids = results
    .map((result, index) => (result.status === 'fulfilled' ? null : event.Records[index].messageId))
    .filter((item) => item !== null);
  return {
    batchItemFailures: ids.map((id) => ({ itemIdentifier: id })),
  };
};

const generateAndUpload = async (documentData, request: Request, fileName: string) => {
  try {
    logger.info('Starting lambda to lambda invoke');
    const result = await invokePdfGenLambda(documentData, request.documentName);
    logger.info('Finishing lambda to lambda invoke');
    const responseBuffer: Buffer = Buffer.from(result.Payload.toString(), 'base64');
    const metaData = {
      'date-of-issue': Date.now().toString(),
      'cert-type': request.documentName,
      'file-format': 'pdf',
      'file-size': responseBuffer.byteLength.toString(),
      'should-email-certificate': 'false',
    };
    logger.info(`Starting s3 upload for file: ${fileName}`);
    await uploadPdfToS3(responseBuffer, metaData, fileName);
    logger.info('Finishing s3 upload');
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const invokePdfGenLambda = async (docGenPayload, documentType: string, lambdaClient?: LambdaClient) => {
  const client = lambdaClient ?? new LambdaClient({ region: 'eu-west-1' });
  const payload: any = JSON.stringify({
    httpMethod: 'POST',
    pathParameters: {
      documentName: documentType,
      documentDirectory: 'CVS',
    },
    json: true,
    body: JSON.stringify(docGenPayload),
  });
  const command = new InvokeCommand({
    FunctionName: process.env.DOC_GEN_NAME,
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    Payload: payload,
  });

  const response = await client.send(command);
  return response;
};

const uploadPdfToS3 = async (
  data: Buffer | Uint8Array | Blob | string | Readable,
  metadata: Record<string, string>,
  fileName: string,
  s3?: S3,
): Promise<any> => {
  const s3Client = s3 ?? new S3({ region: 'eu-west-1' });
  return s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.BUCKETNAME,
      Key: `${process.env.BUCKETFOLDER}/${fileName}`,
      Body: data,
      Metadata: metadata,
    }),
  );
};

export {
  handler, invokePdfGenLambda, uploadPdfToS3, generateAndUpload,
};
