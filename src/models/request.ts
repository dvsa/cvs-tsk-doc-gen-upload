import { LetterType } from '../enums/letterType.enum';
import { ParagraphId } from '../enums/paragraphId.enum';
import { ReasonForIssue } from '../enums/reasonForIssue.enum';
import { ITechRecord } from './vehicleTechRecord';

export interface Request {
  documentName: string;
  techRecord: ITechRecord;
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
