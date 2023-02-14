import { Handler, SQSBatchResponse, SQSEvent } from 'aws-lambda';
import logger from './observability/logger';
import { generateMinistryDocumentModel } from './models/document';
import { Request } from './models/request';
import { DocumentType } from './models/documentName.enum';
import { invokePdfGenLambda } from './services/Lamba.service';
import { uploadPdfToS3 } from './services/S3.service';

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
      documentData = generateMinistryDocumentModel(request.vehicle, request.plate);
      fileName = `plate_${request.plate.plateSerialNumber}`;
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
    logger.info(JSON.stringify(result));
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

export { handler, generateAndUpload };
