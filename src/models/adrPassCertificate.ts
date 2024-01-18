import { DocumentName } from '../enums/documentName.enum';
import { DocumentModel } from './documentModel';
import { Request } from './request';

export type AdrCert = {
  // TODO: Refactor this to match proper names we use of properties post doc-gen refactored
  ChasisNumber: string;
  Make: string;
  Model: string;
  RegistrationNumber: string;
  ApplicantDetails: {
    name?: string;
    address1?: string;
    address2?: string;
    postTown?: string;
    address3?: string;
    postCode?: string;
    telephoneNumber?: string;
  };
  VehicleType: string;
  PermittedDangerousGoods: string[];
  BrakeEndurance: boolean;
  Weight: string;
  TankManufacturer: string;
  Tc2InitApprovalNo: string;
  TankManufactureSerialNo: string;
  YearOfManufacture: string;
  TankCode: string;
  SpecialProvisions: string;
  TankStatement: {
    substancesPermitted: string;
    statements: string;
    town: string;
    productList: string;
  };
  ExpiryDate: string;
  AtfNameAtfPNumber: string;
  Notes: string;
  TestTypeDate: string;
};

export class AdrPassCertificateDocument extends DocumentModel {
  constructor(request: Request) {
    super('');
    const { techRecord, adrCertificate } = request;

    this.Signature = {
      ImageType: 'image/jpeg',
      ImageData: 'lolololol',
    };

    this.setDocumentType(DocumentName.ADR_PASS_CERTIFICATE);
    this.filename = `adr_pass_${techRecord.systemNumber}_${adrCertificate.generatedTimestamp}`;

    // S3 metadata
    this.metaData.vin = techRecord.vin;
    this.metaData['should-email-certificate'] = 'false';

    const adrData: AdrCert = {
      // ADR data
      ChasisNumber: techRecord.vin,
      Make: techRecord.techRecord_make,
      Model: techRecord.techRecord_model,
      RegistrationNumber: techRecord.techRecord_vehicleType === 'hgv' ? techRecord.primaryVrm : techRecord.trailerId,
      ApplicantDetails: {
        name: techRecord.techRecord_applicantDetails_name,
        address1: techRecord.techRecord_applicantDetails_address1,
        address2: techRecord.techRecord_applicantDetails_address2,
        address3: techRecord.techRecord_applicantDetails_address3,
        postTown: techRecord.techRecord_applicantDetails_postTown,
        postCode: techRecord.techRecord_applicantDetails_postCode,
      },
      VehicleType: techRecord.techRecord_vehicleType,
      PermittedDangerousGoods: techRecord.techRecord_adrDetails_permittedDangerousGoods,
      BrakeEndurance: techRecord.techRecord_adrDetails_brakeEndurance,
      Weight: techRecord.techRecord_adrDetails_weight,
      TankManufacturer: techRecord.techRecord_adrDetails_tank_tankDetails_tankManufacturer,
      Tc2InitApprovalNo: techRecord.techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo,
      TankManufactureSerialNo: techRecord.techRecord_adrDetails_tank_tankDetails_tankManufacturerSerialNo,
      YearOfManufacture: techRecord.techRecord_adrDetails_tank_tankDetails_yearOfManufacture?.toString(),
      TankCode: techRecord.techRecord_adrDetails_tank_tankDetails_tankCode,
      SpecialProvisions: techRecord.techRecord_adrDetails_tank_tankDetails_specialProvisions,
      TankStatement: {
        substancesPermitted: techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted,
        statements: techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_statement,
        town: techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_select, // This is so wrong lmao
        productList: techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_productList,
      },
      ExpiryDate: techRecord.techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateExpiryDate, // this is likely wrong
      AtfNameAtfPNumber: 'We do not have this information',
      Notes: techRecord.techRecord_adrDetails_adrCertificateNotes,
      TestTypeDate: 'we also do not have this information',
    };

    this.ADR_DATA = adrData;
  }

  Signature: {
    ImageType: string;
    ImageData: string;
  };

  ADR_DATA: AdrCert;
}
