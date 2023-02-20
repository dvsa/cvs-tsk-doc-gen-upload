import { IApplicantDetails } from './vehicleTechRecord';

export type TrlServiceLetter = {
  vin: string;
  trailerId: string;
  applicantDetails: IApplicantDetails;
  letterDateRequested: string;
  approvalTypeNumber: string;
  paragraphId: number;
};
