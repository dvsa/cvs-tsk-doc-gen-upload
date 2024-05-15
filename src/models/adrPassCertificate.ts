import { ADRCertificateTypes } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrCertificateTypes.enum.js';
import { ADRCompatibilityGroupJ } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrCompatibilityGroupJ.enum.js';
import { DocumentName } from '../enums/documentName.enum';
import { DocumentModel } from './documentModel';
import { HgvTrlLgv, Request } from './request';

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
    statement: string;
    productList: string;
  };
  notes: string;
  replacement: boolean;
  batteryListNumber: string;
  m145Statement: boolean;
  compatibilityGroupJ: boolean;
};

export class AdrPassCertificateDocument extends DocumentModel {
  constructor(request: Request) {
    super(request.recipientEmailAddress);
    const { techRecord, adrCertificate } = request;

    this.setDocumentType(DocumentName.ADR_PASS_CERTIFICATE);
    this.filename = `adr_pass_${techRecord.systemNumber}_${adrCertificate.generatedTimestamp}`;

    const totalCerts = techRecord.techRecord_adrPassCertificateDetails?.length ?? 1;

    // S3 metadata
    this.metaData.vin = techRecord.vin;
    this.metaData.vrm = techRecord.techRecord_vehicleType === 'trl' ? techRecord.trailerId : techRecord.primaryVrm;
    this.metaData['cert-type'] = 'ADR01C';
    this.metaData['cert-index'] = totalCerts.toString();
    this.metaData['total-certs'] = totalCerts.toString();
    this.metaData['test-type-name'] = 'ADR';
    this.metaData['test-type-result'] = adrCertificate.certificateType.toLowerCase();

    // ADR data
    const adrData: AdrCert = {
      vin: techRecord.vin,
      make: techRecord.techRecord_vehicleType === 'lgv' ? '' : techRecord.techRecord_make,
      vrm: techRecord.techRecord_vehicleType === 'trl' ? techRecord.trailerId : techRecord.primaryVrm,
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
      weight: techRecord.techRecord_adrDetails_weight?.toString(),
      tankManufacturer: techRecord.techRecord_adrDetails_tank_tankDetails_tankManufacturer,
      tankManufactureSerialNo: techRecord.techRecord_adrDetails_tank_tankDetails_tankManufacturerSerialNo,
      tc2InitApprovalNo: techRecord.techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo,
      yearOfManufacture: techRecord.techRecord_adrDetails_tank_tankDetails_yearOfManufacture?.toString(),
      tankCode: techRecord.techRecord_adrDetails_tank_tankDetails_tankCode,
      specialProvisions: techRecord.techRecord_adrDetails_tank_tankDetails_specialProvisions,
      tankStatement: {
        substancesPermitted: techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted,
        statement: techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_statement,
        productList: this.formatProductList(techRecord),
      },
      notes: techRecord.techRecord_adrDetails_adrCertificateNotes,
      replacement: request.adrCertificate.certificateType === ADRCertificateTypes.REPLACEMENT,
      batteryListNumber: techRecord.techRecord_adrDetails_batteryListNumber,
      m145Statement: techRecord.techRecord_adrDetails_m145Statement,
      compatibilityGroupJ: techRecord.techRecord_adrDetails_compatibilityGroupJ === ADRCompatibilityGroupJ.I,
    };

    this.ADR_DATA = adrData;
  }

  formatProductList = (techRecord: HgvTrlLgv) => {
    let productList = '';
    if (techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo) {
      techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo.forEach(
        // eslint-disable-next-line no-return-assign
        (unNumber) => (productList += `${unNumber} `),
      );
    }
    if (techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo) {
      productList += `${techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo} `;
    }
    return productList === '' ? null : productList;
  };

  ADR_DATA: AdrCert;
}
