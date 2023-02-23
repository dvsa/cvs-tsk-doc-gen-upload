import { ReasonForIssue } from '../enums/reasonForIssue.enum';
import { LetterType } from '../enums/letterType.enum';
import { IVehicleRecord } from './vehicleTechRecord';
import { ParagraphId } from '../enums/paragraphId.enum';

export interface Request {
  documentName: string;
  vehicle: IVehicleRecord;
  recipientEmailAddress: string;
  plate?: Plates;
  letter?: Letter;
}
export interface Plates {
  plateSerialNumber?: string;
  plateIssueDate?: string;
  plateReasonForIssue?: ReasonForIssue;
  plateIssuer?: string;
}

export interface Letter {
  letterType: LetterType;
  paragraphId: ParagraphId;
  letterIssuer: string;
  letterDateRequested: string;
}
