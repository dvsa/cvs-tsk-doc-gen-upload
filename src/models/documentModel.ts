/* eslint-disable no-underscore-dangle */
import { format, parseISO } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { DocumentName } from '../enums/documentName.enum';

export class DocumentModel {
  constructor(recipientEmailAddress: string) {
    this.setDateOfIssue(new Date().toISOString());
    this.Watermark = process.env.BRANCH === 'prod' ? '' : 'NOT VALID';

    this.metaData.email = recipientEmailAddress;
    this.metaData['should-email-certificate'] = process.env.SHOULD_EMAIL_CERTIFICATE;
  }

  filename: string;
  Watermark: string;

  documentType: DocumentName;

  setDocumentType = (value: DocumentName) => {
    this.documentType = value;
    this.metaData['document-type'] = value;
  }

  setFileSize(value: number) { this.metaData['file-size'] = value.toString(); }

  setDateOfIssue(value: string) {
    // date is a timestamp
    this.metaData['date-of-issue'] = format(parseISO(value), 'dd/MM/yyyy', { locale: enGB });
  }

  metaData: Record<string, string> = {
    'file-format': 'pdf',
  };
}
