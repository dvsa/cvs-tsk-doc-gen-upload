import { ADRCertificateTypes } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrCertificateTypes.enum.js';
import { DocumentName } from '../../src/enums/documentName.enum';
import { AdrPassCertificateDocument } from '../../src/models/adrPassCertificate';
import { Request } from '../../src/models/request';
import { generateVehicle } from './unitTestUtils';

describe('Document Model tests', () => {
  let request: Request;

  beforeEach(() => {
    request = {
      documentName: DocumentName.ADR_PASS_CERTIFICATE,
      techRecord: generateVehicle(),
      recipientEmailAddress: 'customer@example.com',
      adrCertificate: {
        createdByName: 'mr example',
        generatedTimestamp: new Date().toISOString(),
        certificateId: 'adrPass_1234567_123456',
        certificateType: ADRCertificateTypes.PASS,
      },
    };
  });

  it('should convert a request into a Trailer Into Service Document', () => {
    const document = new AdrPassCertificateDocument(request);
    expect(document).toBeTruthy();
  });

  it('should add S3 metadata', () => {
    process.env.DOCUMENT_LINK_URL = 'https://unit-testing.jest.example.com/metadata/documents/';

    const document = new AdrPassCertificateDocument(request);

    expect(document.metaData['document-type']).toBe(DocumentName.ADR_PASS_CERTIFICATE);
    expect(document.metaData.vin).toBe(request.techRecord.vin);
    expect(document.metaData.email).toBe('customer@example.com');
  });
});
