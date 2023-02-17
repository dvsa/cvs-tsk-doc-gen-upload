import { IApplicantDetails } from './vehicleTechRecord';

export type TrlServiceLetter = {
  Vin: string;
  TrailerID: string;
  ApplicantDetails: IApplicantDetails;
  LetterDateRequested: string;
  TypeApprovalNumber: string;
  ParagraphId: number;
};
