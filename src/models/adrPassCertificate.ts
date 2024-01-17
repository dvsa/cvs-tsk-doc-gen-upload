import { DocumentName } from '../enums/documentName.enum';
import { DocumentModel } from './documentModel';
import { Request } from './request';

export class AdrPassCertificateDocument extends DocumentModel {
  constructor(request: Request) {
    super('');
    const { techRecord, adrCertificate } = request;

    this.Signature = {
      imageType: 'image/jpeg',
      imageData: 'lolololol',
    };

    this.setDocumentType(DocumentName.ADR_PASS_CERTIFICATE);
    this.filename = `adr_pass_${techRecord.systemNumber}_${adrCertificate.generatedTimestamp}`;

    // S3 metadata
    this.metaData.vin = techRecord.vin;
    this.metaData['should-email-certificate'] = 'false';

    // ADR data
    this.ChasisNumber = techRecord.vin;
    this.Make = techRecord.techRecord_make;
    this.Model = techRecord.techRecord_model;
    this.RegistrationNumber = techRecord.techRecord_vehicleType === 'hgv' ? techRecord.primaryVrm : techRecord.trailerId;
    this.applicantDetails = {
      name: techRecord.techRecord_applicantDetails_name,
      address1: techRecord.techRecord_applicantDetails_address1,
      address2: techRecord.techRecord_applicantDetails_address2,
      address3: techRecord.techRecord_applicantDetails_address3,
      postTown: techRecord.techRecord_applicantDetails_postTown,
      postCode: techRecord.techRecord_applicantDetails_postCode,
    };
    this.VehicleType = techRecord.techRecord_vehicleType;
    this.PermittedDangerousGoods = techRecord.techRecord_adrDetails_permittedDangerousGoods;
    this.BrakeEndurance = techRecord.techRecord_adrDetails_brakeEndurance?.toString(); // what is this lmao
    this.Weight = techRecord.techRecord_adrDetails_weight;
    this.TankManufacturer = techRecord.techRecord_adrDetails_tank_tankDetails_tankManufacturer;
    this.Tc2InitApprovalNo = techRecord.techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo;
    this.TankManufactureSerialNo = techRecord.techRecord_adrDetails_tank_tankDetails_tankManufacturerSerialNo;
    this.YearOfManufacture = techRecord.techRecord_adrDetails_tank_tankDetails_yearOfManufacture?.toString();
    this.TankCode = techRecord.techRecord_adrDetails_tank_tankDetails_tankCode;
    this.SpecialProvisions = techRecord.techRecord_adrDetails_tank_tankDetails_specialProvisions;
    this.TankStatement = {
      substancesPermitted: techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted,
      statements: techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_statement,
      town: techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_select, // This is so wrong lmao
      productList: techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_productList,
    };
    this.ExpiryDate = techRecord.techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateExpiryDate; // this is likely wrong
    this.AtfNameAtfPNumber = 'We do not have this information';
    this.Notes = techRecord.techRecord_adrDetails_adrCertificateNotes;
    this.TestTypeDate = 'we also do not have this information';
  }

  // TODO: Refactor this to match proper names we use of properties post doc-gen refactored

  Signature: {
    imageType: string;
    imageData: string;
  };

  ChasisNumber: string;

  Make: string;

  Model: string;

  RegistrationNumber: string;

  applicantDetails: {
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

  BrakeEndurance: string;

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
}
