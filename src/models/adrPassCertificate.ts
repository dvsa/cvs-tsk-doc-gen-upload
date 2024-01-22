import { ADRCertificateTypes } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrCertificateTypes.enum.js';
import { DocumentName } from '../enums/documentName.enum';
import { DocumentModel } from './documentModel';
import { Request } from './request';

export type AdrCert = {
  vin: string;
  make: string;
  vrm: string;
  applicantDetails: {
    name?: string;
    address1?: string;
    address2?: string;
    postTown?: string;
    address3?: string;
    postCode?: string;
    telephoneNumber?: string;
  };
  adrVehicleType: string;
  permittedDangerousGoods: string[];
  brakeEndurance: boolean;
  weight: string;
  tankManufacturer: string;
  tc2InitApprovalNo: string;
  tankManufactureSerialNo: string;
  yearOfManufacture: string;
  tankCode: string;
  specialProvisions: string;
  tankStatement: {
    substancesPermitted: string;
    statements: string;
    productList: string;
  };
  notes: string;
  replacement: boolean;
};

export class AdrPassCertificateDocument extends DocumentModel {
  constructor(request: Request) {
    super('');
    const { techRecord, adrCertificate } = request;

    this.setDocumentType(DocumentName.ADR_PASS_CERTIFICATE);
    this.filename = `adr_pass_${techRecord.systemNumber}_${adrCertificate.generatedTimestamp}`;

    // S3 metadata
    this.metaData.vin = techRecord.vin;
    this.metaData['should-email-certificate'] = 'false';

    const adrData: AdrCert = {
      // ADR data
      vin: techRecord.vin,
      make: techRecord.techRecord_make,
      vrm: techRecord.techRecord_vehicleType === 'hgv' ? techRecord.primaryVrm : techRecord.trailerId,
      applicantDetails: {
        name: techRecord.techRecord_adrDetails_applicantDetails_name,
        address1: techRecord.techRecord_adrDetails_applicantDetails_street,
        address2: techRecord.techRecord_adrDetails_applicantDetails_city,
        postTown: techRecord.techRecord_adrDetails_applicantDetails_town,
        postCode: techRecord.techRecord_adrDetails_applicantDetails_postcode,
      },
      adrVehicleType: techRecord.techRecord_adrDetails_vehicleDetails_type,
      permittedDangerousGoods: techRecord.techRecord_adrDetails_permittedDangerousGoods,
      brakeEndurance: techRecord.techRecord_adrDetails_brakeEndurance,
      weight: techRecord.techRecord_adrDetails_weight,
      tankManufacturer: techRecord.techRecord_adrDetails_tank_tankDetails_tankManufacturer,
      tankManufactureSerialNo: techRecord.techRecord_adrDetails_tank_tankDetails_tankManufacturerSerialNo,
      tc2InitApprovalNo: techRecord.techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo,
      yearOfManufacture: techRecord.techRecord_adrDetails_tank_tankDetails_yearOfManufacture?.toString(),
      tankCode: techRecord.techRecord_adrDetails_tank_tankDetails_tankCode,
      specialProvisions: techRecord.techRecord_adrDetails_tank_tankDetails_specialProvisions,
      tankStatement: {
        substancesPermitted: techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted,
        statements: techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_statement,
        productList: techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_productList,
      },
      notes: techRecord.techRecord_adrDetails_adrCertificateNotes,
      replacement: request.adrCertificate.certificateType === ADRCertificateTypes.REPLACEMENT,
    };

    this.ADR_DATA = adrData;
  }

  ADR_DATA: AdrCert;
}
