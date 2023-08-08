/* eslint-disable no-underscore-dangle */
import { DocumentName } from '../enums/documentName.enum';
import { DocumentModel } from './documentModel';
import { Request } from './request';

export class TrailerIntoServiceDocument extends DocumentModel {
  constructor(request: Request) {
    super(request.recipientEmailAddress);
    const { techRecord, letter } = request;

    this.setDocumentType(DocumentName.TRAILER_INTO_SERVICE);
    this.filename = `letter_${techRecord.systemNumber}_${techRecord.vin}`;

    this.vin = techRecord.vin;
    this.trailerId = techRecord.trailerId;
    this.applicantDetails = {
      name: techRecord.techRecord_applicantDetails_name,
      address1: techRecord.techRecord_applicantDetails_address1,
      address2: techRecord.techRecord_applicantDetails_address2,
      address3: techRecord.techRecord_applicantDetails_address3,
      postTown: techRecord.techRecord_applicantDetails_postTown,
      postCode: techRecord.techRecord_applicantDetails_postCode,
    };
    this.setLetterDateRequested(letter.letterDateRequested);
    this.approvalTypeNumber = techRecord.techRecord_approvalTypeNumber;
    this.paragraphId = letter.paragraphId;

    // S3 metadata
    this.metaData.vin = techRecord.vin;
    this.metaData['trailer-id'] = techRecord.trailerId;
    this.metaData['approval-type-number'] = techRecord.techRecord_approvalTypeNumber;
    this.metaData['letter-type'] = letter.letterType;
    this.metaData['paragraph-id'] = letter.paragraphId.toString();
  }

  vin: string;

  trailerId: string;

  applicantDetails: {
    name?: string;
    address1?: string;
    address2?: string;
    postTown?: string;
    address3?: string;
    postCode?: string;
    telephoneNumber?: string;
  };

  letterDateRequested: string;

  setLetterDateRequested = (value: string) => {
    this.letterDateRequested = value;
    this.setDateOfIssue(value);
  };

  approvalTypeNumber: string;

  paragraphId: number;
}
