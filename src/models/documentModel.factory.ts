import { DocumentName } from '../enums/documentName.enum';
import { DocumentModel } from './documentModel';
import { MinistryPlateDocument } from './ministryPlate';
import { Request } from './request';
import { TrailerIntoServiceDocument } from './trailerIntoService';

export const getDocumentFromRequest = (request: Request): DocumentModel => {
  switch (request.documentName) {
    case DocumentName.MINISTRY:
      return new MinistryPlateDocument(request);

    case DocumentName.TRAILER_INTO_SERVICE:
      return new TrailerIntoServiceDocument(request);

    default:
      throw new Error('Document Type is not supported');
  }
};
