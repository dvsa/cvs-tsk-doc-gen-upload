import { generateVehicle } from './unitTestUtils';
import { Request } from '../../src/models/request';
import { DocumentName } from '../../src/enums/documentName.enum';
import { LetterType } from '../../src/enums/letterType.enum';
import { ParagraphId } from '../../src/enums/paragraphId.enum';
import { TrailerIntoServiceDocument } from '../../src/models/trailerIntoService';

describe('Document Model tests', () => {
  let request: Request;

  beforeEach(() => {
    request = {
      documentName: DocumentName.MINISTRY,
      vehicle: generateVehicle(),
      recipientEmailAddress: 'customer@example.com',
      letter: {
        letterType: LetterType.TRL_ACCEPTANCE,
        letterIssuer: 'user',
        letterDateRequested: '2023-02-23T12:34:56.789Z',
        paragraphId: ParagraphId.PARAGRAPH_6,
      },
    };
  });

  it('should convert a request into a Trailer Into Service Document', () => {
    const document = new TrailerIntoServiceDocument(request);
    expect(document).toBeTruthy();
  });

  it('should add S3 metadata', () => {
    process.env.DOCUMENT_LINK_URL = 'https://unit-testing.jest.example.com/metadata/documents/';

    const document = new TrailerIntoServiceDocument(request);

    expect(document.metaData['document-type']).toBe(DocumentName.TRAILER_INTO_SERVICE);
    expect(document.metaData.vin).toBe(request.vehicle.vin);
    expect(document.metaData['trailer-id']).toBe(request.vehicle.trailerId);
    expect(document.metaData['approval-type-number']).toBe(request.vehicle.techRecord.approvalTypeNumber);
    expect(document.metaData['date-of-issue']).toBe('23/02/2023');
    expect(document.metaData.email).toBe(request.recipientEmailAddress);
  });
});
