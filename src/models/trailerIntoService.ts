/* eslint-disable no-underscore-dangle */
import { DocumentName } from '../enums/documentName.enum';
import { DocumentModel } from './documentModel';
import { Request } from './request';
import { IApplicantDetails } from './vehicleTechRecord';

export class TrailerIntoServiceDocument extends DocumentModel {
  constructor(request: Request) {
    super(request.recipientEmailAddress);
    const { vehicle, letter } = request;
    const { techRecord } = vehicle;

    this.setDocumentType(DocumentName.TRAILER_INTO_SERVICE);
    this.filename = `letter_${request.vehicle.systemNumber}_${request.vehicle.vin}`;

    this.vin = vehicle.vin;
    this.trailerId = vehicle.trailerId;
    this.applicantDetails = techRecord.applicantDetails;
    this.setLetterDateRequested(letter.letterDateRequested);
    this.approvalTypeNumber = techRecord.approvalTypeNumber;
    this.paragraphId = letter.paragraphId;

    // S3 metadata
    this.metaData.vin = vehicle.vin;
    this.metaData['trailer-id'] = vehicle.trailerId;
    this.metaData['approval-type-number'] = techRecord.approvalTypeNumber;
    this.metaData['letter-type'] = letter.letterType;
    this.metaData['paragraph-id'] = letter.paragraphId.toString();
  }

  vin: string;

  trailerId: string;

  applicantDetails: IApplicantDetails;

  letterDateRequested: string;

  setLetterDateRequested = (value: string) => {
    this.letterDateRequested = value;
    this.setDateOfIssue(value);
  }

  approvalTypeNumber: string;

  paragraphId: number;
}
