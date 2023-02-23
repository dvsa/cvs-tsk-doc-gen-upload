/* eslint-disable no-underscore-dangle */
import { DocumentName } from '../enums/documentName.enum';

export class DocumentModel {
  constructor(recipientEmailAddress: string) {
    this.dateOfIssue = new Date().toISOString();
    this.Watermark = process.env.BRANCH === 'prod' ? '' : 'NOT VALID';

    this.metaData.email = recipientEmailAddress;
    this.metaData['should-email-certificate'] = `${process.env.SHOULD_EMAIL_CERTIFICATE}`;
  }

  Watermark: string;

  private _documentType: DocumentName;

  private _filename: string;

  get documentType(): DocumentName { return this._documentType; }

  set documentType(value: DocumentName) {
    this._documentType = value;
    this.metaData['document-type'] = value;
  }

  get filename(): string { return this._filename; }

  set filename(value: string) {
    this._filename = value;
    this.metaData['link-to-document'] = `${process.env.DOCUMENT_LINK_URL}/${value}`;
  }

  set fileSize(value: number) { this.metaData['file-size'] = value.toString(); }

  set dateOfIssue(value: string) { this.metaData['date-of-issue'] = value; }

  metaData: Record<string, string> = {
    'file-format': 'pdf',
  };
}
