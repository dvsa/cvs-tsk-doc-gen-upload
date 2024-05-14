import { ADRCertificateTypes } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrCertificateTypes.enum.js';
import {
  ADRCompatibilityGroupJ,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrCompatibilityGroupJ.enum.js';
import {
  TechRecordGETHGV, TechRecordGETLGV, TechRecordGETTRL,

} from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { DocumentName } from '../../src/enums/documentName.enum';
import { AdrPassCertificateDocument } from '../../src/models/adrPassCertificate';
import { HgvTrlLgv, Request } from '../../src/models/request';
import { generateVehicle } from './unitTestUtils';

describe('AdrPassCertificateDocument', () => {
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

  describe('Constructor and data population testing', () => {
    let adrPassCertificateDocument: AdrPassCertificateDocument;

    it('should set vrm to trailerId when the vehicle type is trl', () => {
      const trlRequest = { ...request };
      trlRequest.techRecord = trlRequest.techRecord as TechRecordGETTRL;
      trlRequest.techRecord.techRecord_vehicleType = 'trl';
      trlRequest.techRecord.trailerId = 'TRL12345';

      const document = new AdrPassCertificateDocument(trlRequest);
      expect(document.ADR_DATA.vrm).toBe('TRL12345');
      expect(document.metaData.vrm).toBe('TRL12345');
    });

    it('should set vrm to primaryVrm when the vehicle type is not trl', () => {
      const hgvRequest = { ...request };
      hgvRequest.techRecord = hgvRequest.techRecord as TechRecordGETHGV;
      hgvRequest.techRecord.techRecord_vehicleType = 'hgv';
      hgvRequest.techRecord.primaryVrm = 'HGV12345';
      const document = new AdrPassCertificateDocument(hgvRequest);
      expect(document.ADR_DATA.vrm).toBe('HGV12345');
      expect(document.metaData.vrm).toBe('HGV12345');
    });

    it('should set make to an empty string when the vehicle type is lgv', () => {
      const lgvRequest = { ...request };
      lgvRequest.techRecord = lgvRequest.techRecord as TechRecordGETLGV;
      lgvRequest.techRecord.techRecord_vehicleType = 'lgv';
      const document = new AdrPassCertificateDocument(lgvRequest);
      expect(document.ADR_DATA.make).toBe('');
    });

    it('should set make appropriately when vehicle type is not lgv', () => {
      const hgvRequest = { ...request };
      hgvRequest.techRecord = hgvRequest.techRecord as TechRecordGETHGV;
      hgvRequest.techRecord.techRecord_vehicleType = 'hgv';
      hgvRequest.techRecord.techRecord_make = 'DAF';
      const document = new AdrPassCertificateDocument(hgvRequest);
      expect(document.ADR_DATA.make).toBe('DAF');
    });

    it('should set totalCerts to the length of adrPassCertificateDetails when defined', () => {
      request.techRecord.techRecord_adrPassCertificateDetails = [{} as never];
      adrPassCertificateDocument = new AdrPassCertificateDocument(request);
      expect(adrPassCertificateDocument.metaData['total-certs']).toBe('1');
    });

    it('should set totalCerts to 1 when adrPassCertificateDetails is undefined', () => {
      delete request.techRecord.techRecord_adrPassCertificateDetails;
      adrPassCertificateDocument = new AdrPassCertificateDocument(request);
      expect(adrPassCertificateDocument.metaData['total-certs']).toBe('1');
    });

    it('should set yearOfManufacture to a string value when defined', () => {
      request.techRecord.techRecord_adrDetails_tank_tankDetails_yearOfManufacture = 2020;
      adrPassCertificateDocument = new AdrPassCertificateDocument(request);
      expect(adrPassCertificateDocument.ADR_DATA.yearOfManufacture).toBe('2020');
    });

    it('should set yearOfManufacture to be undefined when not defined', () => {
      delete request.techRecord.techRecord_adrDetails_tank_tankDetails_yearOfManufacture;
      adrPassCertificateDocument = new AdrPassCertificateDocument(request);
      expect(adrPassCertificateDocument.ADR_DATA.yearOfManufacture).toBeUndefined();
    });
  });

  it('should set weight to string value if defined', () => {
    request.techRecord.techRecord_adrDetails_weight = 1000;
    const document = new AdrPassCertificateDocument(request);
    expect(document.ADR_DATA.weight).toBe('1000');
  });

  it('should set weight to undefined if not defined', () => {
    delete request.techRecord.techRecord_adrDetails_weight;
    const document = new AdrPassCertificateDocument(request);
    expect(document.ADR_DATA.weight).toBeUndefined();
  });

  it('should handle replacement correctly when true', () => {
    request.adrCertificate.certificateType = ADRCertificateTypes.REPLACEMENT;
    const document = new AdrPassCertificateDocument(request);
    expect(document.ADR_DATA.replacement).toBe(true);
  });

  it('should handle replacement correctly when false', () => {
    request.adrCertificate.certificateType = ADRCertificateTypes.PASS;
    const document = new AdrPassCertificateDocument(request);
    expect(document.ADR_DATA.replacement).toBe(false);
  });

  it('should handle compatibilityGroupJ correctly when true', () => {
    request.techRecord.techRecord_adrDetails_compatibilityGroupJ = ADRCompatibilityGroupJ.I;
    const document = new AdrPassCertificateDocument(request);
    expect(document.ADR_DATA.compatibilityGroupJ).toBe(true);
  });

  it('should handle compatibilityGroupJ correctly when false', () => {
    request.techRecord.techRecord_adrDetails_compatibilityGroupJ = ADRCompatibilityGroupJ.E;
    const document = new AdrPassCertificateDocument(request);
    expect(document.ADR_DATA.compatibilityGroupJ).toBe(false);
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

  describe('formatProductList', () => {
    let adrPassCertificateDocument: AdrPassCertificateDocument;

    beforeEach(() => {
      adrPassCertificateDocument = new AdrPassCertificateDocument(request);
    });

    it('should return null if neither productListUnNo or productListRefNo are defined', () => {
      const techRecord = {} as HgvTrlLgv;
      const result = adrPassCertificateDocument.formatProductList(techRecord);
      expect(result).toBeNull();
    });

    it('should format productListUnNo correctly', () => {
      const techRecord = {
        techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: ['HGV1234', 'HGV5678'],
      } as HgvTrlLgv;
      const result = adrPassCertificateDocument.formatProductList(techRecord);
      expect(result).toBe('HGV1234 HGV5678 ');
    });

    it('should format productListRefNo correctly', () => {
      const techRecord = {
        techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo: 'HGV123',
      } as HgvTrlLgv;
      const result = adrPassCertificateDocument.formatProductList(techRecord);
      expect(result).toBe('HGV123 ');
    });

    it('should format both productListUnNo and productListRefNo correctly', () => {
      const techRecord = {
        techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: ['HGV1234', 'HGV5678'],
        techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo: 'HGVREF123',
      } as HgvTrlLgv;
      const result = adrPassCertificateDocument.formatProductList(techRecord);
      expect(result).toBe('HGV1234 HGV5678 HGVREF123 ');
    });
  });
});
