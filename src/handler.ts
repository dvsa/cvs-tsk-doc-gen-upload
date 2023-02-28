import { Handler, SQSBatchResponse, SQSEvent } from 'aws-lambda';
import { TextDecoder } from 'util';
import logger from './observability/logger';
import { DocumentModel } from './models/documentModel';
import { Request } from './models/request';
import { invokePdfGenLambda } from './services/Lamba.service';
import { uploadPdfToS3 } from './services/S3.service';
import { getDocumentFromRequest } from './models/documentModel.factory';

export const handler: Handler = async (event: SQSEvent): Promise<SQSBatchResponse> => {
  logger.debug("Function triggered'.");
  if (!event || !event.Records || !event.Records.length) {
    logger.error('ERROR: event is not defined.');
    throw new Error('Event is empty');
  }

  const altPromiseArray = event.Records.map((sqsRecord) => {
    const request = JSON.parse(sqsRecord.body) as Request;

    const document: DocumentModel = getDocumentFromRequest(request);
    return generateAndUpload(document, request);
  });

  const results = await Promise.allSettled(altPromiseArray);
  const ids = results
    .map((result, index) => (result.status === 'fulfilled' ? null : event.Records[index].messageId))
    .filter((item) => item !== null);
  return {
    batchItemFailures: ids.map((id) => ({ itemIdentifier: id })),
  };
};

const generateAndUpload = async (document: DocumentModel, request: Request) => {
  try {
    logger.info(`Starting lambda to lambda invoke (data): ${JSON.stringify(document)}`);
    const response = await invokePdfGenLambda(document, request.documentName);
    logger.info('Finished lambda to lambda invoke, checking response');

    if (response.StatusCode !== 200) {
      logger.error(`Error invoking doc gen (lambda call failed with ${response.StatusCode}`);
      throw new Error(`Error invoking doc gen (lambda call failed with ${response.StatusCode}`);
    }
    const responseString: string = new TextDecoder().decode(response.Payload);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const responseJson: any = JSON.parse(responseString);
    if (responseJson.statusCode !== 200) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Error returned from doc gen (${responseJson.statusCode}): ${responseJson.body}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const responseBuffer: Buffer = Buffer.from(responseJson.body, 'base64');
    document.setFileSize(responseBuffer.byteLength);

    logger.info(`Starting s3 upload for file: ${process.env.BRANCH}/${document.filename}`);
    await uploadPdfToS3(responseBuffer, document.metaData, document.filename);
    logger.info('Finished s3 upload');
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};
