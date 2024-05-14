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

  it('should convert a request into an ADR pass Document', () => {
    const document = new AdrPassCertificateDocument(request);
    expect(document).toBeTruthy();
    expect(document.filename).toContain('adr_pass');
    expect(document.filename).toContain(request.techRecord.systemNumber);
    expect(document.filename).toContain(request.adrCertificate.generatedTimestamp);
  });

  it('should populate applicant details fields correctly', () => {
    const document = new AdrPassCertificateDocument(request);
    expect(document.ADR_DATA.applicantDetails.name).toBe(request.techRecord.techRecord_adrDetails_applicantDetails_name);
    expect(document.ADR_DATA.applicantDetails.address1).toBe(request.techRecord.techRecord_adrDetails_applicantDetails_street);
    expect(document.ADR_DATA.applicantDetails.address2).toBe(request.techRecord.techRecord_adrDetails_applicantDetails_city);
    expect(document.ADR_DATA.applicantDetails.postTown).toBe(request.techRecord.techRecord_applicantDetails_postTown);
    expect(document.ADR_DATA.applicantDetails.postCode).toBe(request.techRecord.techRecord_adrDetails_applicantDetails_postcode);
  });

  it('should add S3 metadata correctly', () => {
    process.env.DOCUMENT_LINK_URL = 'https://unit-testing.jest.example.com/metadata/documents/';

    const document = new AdrPassCertificateDocument(request);

    expect(document.metaData['document-type']).toBe(DocumentName.ADR_PASS_CERTIFICATE);
    expect(document.metaData.vin).toBe(request.techRecord.vin);
    expect(document.metaData.email).toBe('customer@example.com');
    expect(document.metaData['cert-type']).toBe('ADR01C');
    expect(document.metaData['cert-index']).toBe('1');
    expect(document.metaData['total-certs']).toBe('1');
    expect(document.metaData['test-type-name']).toBe('ADR');
    expect(document.metaData['test-type-result']).toBe(request.adrCertificate.certificateType.toLowerCase());
  });
});
