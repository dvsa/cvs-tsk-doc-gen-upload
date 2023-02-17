import { IVehicleRecord } from './vehicleTechRecord';

export interface Request {
  documentName: string;
  vehicle: IVehicleRecord;
  plate?: Plates;
  letter?: Letter;
}
export interface Plates {
  plateSerialNumber?: string;
  plateIssueDate?: string;
  plateReasonForIssue?: PlateReasonForIssue;
  plateIssuer?: string;
}

export enum PlateReasonForIssue {
  FREE_REPLACEMENT = 'Free replacement',
  REPLACEMENT = 'Replacement',
  DESTROYED = 'Destroyed',
  PROVISIONAL = 'Provisional',
  ORIGINAL = 'Original',
  MANUAL = 'Manual',
}

export interface Letter {
  letterType: LetterType;
  paragraphId: ParagraphId;
  letterIssuer: string;
  letterDateRequested: string;
}

export enum LetterType {
  TRL_ACCEPTANCE = 'trailer acceptance',
  TRL_REJECTION = 'trailer rejection',
}

export enum ParagraphId {
  PARAGRAPH_3 = 3,
  PARAGRAPH_4 = 4,
  PARAGRAPH_5 = 5,
  PARAGRAPH_6 = 6,
  PARAGRAPH_7 = 7,
}
