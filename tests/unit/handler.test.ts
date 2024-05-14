/* eslint-disable import/first */
const mockInvokePdfGenLambda = jest.fn();
const mockUploadPdfToS3 = jest.fn();

import { InvokeCommandOutput, LambdaClient } from '@aws-sdk/client-lambda';
import { PutObjectCommandOutput, S3 } from '@aws-sdk/client-s3';
import { ADRCertificateTypes } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrCertificateTypes.enum';
import { DocumentName } from '../../src/enums/documentName.enum';
import { ReasonForIssue } from '../../src/enums/reasonForIssue.enum';
import * as Handler from '../../src/handler';
import * as DocumentGeneration from '../../src/models/documentModel.factory';
import { MinistryPlateDocument } from '../../src/models/ministryPlate';
import { Request } from '../../src/models/request';
import { invokePdfGenLambda } from '../../src/services/Lambda.service';
import { uploadPdfToS3 } from '../../src/services/S3.service';
import pass from '../resources/sqsPass.json';
import { addMiddleware, generateVehicle } from './unitTestUtils';

jest.mock('../../src/services/Lambda.service', () => ({
  invokePdfGenLambda: mockInvokePdfGenLambda,
}));
jest.mock('../../src/services/S3.service', () => ({
  uploadPdfToS3: mockUploadPdfToS3,
}));

describe('Handler function tests', () => {
  beforeEach(() => {
    process.env.DOC_GEN_NAME = 'test';
  });

  describe('Ministry plates document generation', () => {
    const request: Request = {
      documentName: DocumentName.MINISTRY,
      techRecord: generateVehicle(),
      recipientEmailAddress: 'customer@example.com',
      plate: {
        plateSerialNumber: '12345',
        plateIssueDate: new Date().toISOString(),
        plateReasonForIssue: ReasonForIssue.DESTROYED,
        plateIssuer: 'user',
      },
    };

    it('should generate the ministry plates document object from SQS event', async () => {
      const sqsEvent = pass;
      sqsEvent.Records[0].body = JSON.stringify({
        documentName: 'VTG6_VTG7',
        techRecord: generateVehicle(),
        plate: request.plate,
      });

      const documentSpy = jest.spyOn(DocumentGeneration, 'getDocumentFromRequest');
      await Handler.handler(sqsEvent, undefined, () => true);
      expect(documentSpy).toHaveBeenCalledTimes(1);
    });

    describe('invokePdfGenLambda function', () => {
      it('should return a 200 status code on successful PDF generation', async () => {
        const lambdaClient = new LambdaClient({ region: 'eu-west-1' });
        const response: InvokeCommandOutput = { StatusCode: 200 } as InvokeCommandOutput;
        lambdaClient.middlewareStack.add(addMiddleware(response));
        mockInvokePdfGenLambda.mockResolvedValueOnce(response);

        const res = await invokePdfGenLambda(new MinistryPlateDocument(request), 'VTG6_VTG7', lambdaClient);
        expect(res.StatusCode).toBe(200);
      });
    });
  });

  describe('ADR pass certificate generation', () => {
    it('should generate the ADR pass certificate document object from SQS event', async () => {
      process.env.BRANCH = 'local';
      const sqsEvent = pass;
      sqsEvent.Records[0].body = JSON.stringify({
        documentName: DocumentName.ADR_PASS_CERTIFICATE,
        techRecord: generateVehicle(),
        adrCertificate: {
          createdByName: 'mr example',
          generatedTimestamp: new Date().toISOString(),
          certificateId: 'adrPass_1234567_123456',
          certificateType: ADRCertificateTypes.PASS,
        },
      });

      mockInvokePdfGenLambda.mockResolvedValueOnce({
        StatusCode: 200,
        Payload: new TextEncoder().encode(JSON.stringify({
          statusCode: 200,
          body: Buffer.from('pdf data').toString('base64'),
        })),
      });
      mockUploadPdfToS3.mockResolvedValueOnce({});

      const documentSpy = jest.spyOn(DocumentGeneration, 'getDocumentFromRequest');
      await Handler.handler(sqsEvent, undefined, () => true);
      expect(documentSpy).toHaveBeenCalledTimes(2);
      expect(mockInvokePdfGenLambda).toHaveBeenCalled();
      expect(mockUploadPdfToS3).toHaveBeenCalled();
    });
  });

  describe('Error handling', () => {
    it('should throw an error for an empty SQS event', async () => {
      const sqsEvent = {};
      await expect(Handler.handler(sqsEvent, undefined, () => true)).rejects.toThrow('Event is empty');
    });

    it('should throw an error if document type is not supported', async () => {
      const sqsEvent = pass;
      sqsEvent.Records[0].body = JSON.stringify({
        documentName: 'NOTSUPPORTED',
        vehicle: {},
        plate: {},
      });
      await expect(Handler.handler(sqsEvent, undefined, () => true)).rejects.toThrow('Document Type is not supported');
    });
  });

  describe('uploadPdfToS3 function', () => {
    it('should return a VersionId on successful upload to S3', async () => {
      const s3Client = new S3({ region: 'eu-west-1' });
      const response: PutObjectCommandOutput = { VersionId: '1' } as PutObjectCommandOutput;
      s3Client.middlewareStack.add(addMiddleware(response));
      mockUploadPdfToS3.mockResolvedValueOnce(response);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const res = await uploadPdfToS3('', {}, 'test', s3Client);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.VersionId).toBe('1');
    });
  });
});
