import { ADRCertificateDetails } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { LetterType } from '../enums/letterType.enum';
import { ParagraphId } from '../enums/paragraphId.enum';
import { ReasonForIssue } from '../enums/reasonForIssue.enum';

export interface Request {
  documentName: string;
  techRecord: HgvTrlLgv;
  recipientEmailAddress: string;
  plate?: Plates;
  letter?: Letter;
  adrCertificate?: ADRCertificateDetails;
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

export type HgvTrlLgv = TechRecordType<'hgv', 'get'> | TechRecordType<'trl', 'get'> | TechRecordType<'lgv', 'get'>;
