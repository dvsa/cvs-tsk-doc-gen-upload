import { PutObjectCommandOutput, S3 } from '@aws-sdk/client-s3';
import { InvokeCommandOutput, LambdaClient } from '@aws-sdk/client-lambda';
import * as Handler from '../../src/handler';
import pass from '../resources/sqsPass.json';
import { addMiddleware, generateVehicle } from './unitTestUtils';
import * as DocumentGeneration from '../../src/models/document';
import { generateMinistryDocumentModel } from '../../src/models/document';
import { PlateReasonForIssue } from '../../src/models/request';
import { invokePdfGenLambda } from '../../src/services/Lamba.service';
import { uploadPdfToS3 } from '../../src/services/S3.service';

describe('handler tests', () => {
  const plate = {
    plateSerialNumber: '12345',
    plateIssueDate: new Date().toISOString(),
    plateReasonForIssue: PlateReasonForIssue.DESTROYED,
    plateIssuer: 'user',
  };

  beforeEach(() => {
    process.env.DOC_GEN_NAME = 'test';
  });

  it('should throw an error for empty sqs event', async () => {
    const sqsEvent = {};
    try {
      await Handler.handler(sqsEvent, undefined, () => true);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(err.message).toBe('Event is empty');
    }
  });

  it('should throw an error if document type not supported', async () => {
    const sqsEvent = pass;
    sqsEvent.Records[0].body = JSON.stringify({
      documentName: 'NOTSUPPORTED',
      vehicle: {},
      plate,
    });
    try {
      await Handler.handler(sqsEvent, undefined, () => true);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(err.message).toBe('Document Type not supported');
    }
  });

  it('should generate the plate object', async () => {
    const sqsEvent = pass;
    sqsEvent.Records[0].body = JSON.stringify({
      documentName: 'VTG6_VTG7',
      vehicle: generateVehicle(),
      plate,
    });

    const ministryPlateSpy = jest.spyOn(DocumentGeneration, 'generateMinistryDocumentModel');
    await Handler.handler(sqsEvent, undefined, () => true);
    expect(ministryPlateSpy).toHaveBeenCalledTimes(1);
  });

  describe('invokePdfGenLambda', () => {
    it('should return a 200 on successful pdf generation', async () => {
      const lambdaClient = new LambdaClient({ region: 'eu-west-1' });
      lambdaClient.middlewareStack.add(addMiddleware(<InvokeCommandOutput>{ StatusCode: 200 }));
      const res = await invokePdfGenLambda(
        generateMinistryDocumentModel(generateVehicle(), plate),
        'VTG6_VTG7',
        lambdaClient,
      );
      expect(res.StatusCode).toBe(200);
    });
  });
  describe('uploadPdfToS3', () => {
    it('should return a PutObjectCommandOutput on success', async () => {
      const s3Client = new S3({ region: 'eu-west-1' });
      s3Client.middlewareStack.add(addMiddleware(<PutObjectCommandOutput>{ VersionId: '1' }));
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const res = await uploadPdfToS3('', {}, 'test', s3Client);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.VersionId).toBe('1');
    });
  });
});
