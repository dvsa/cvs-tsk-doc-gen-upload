// import { ReasonForIssue } from "../../src/enums/reasonForIssue.enum";
import { IAxle } from '../../src/models/vehicleTechRecord';
import { generateVehicle } from './unitTestUtils';
import { MinistryPlateDocument } from '../../src/models/ministryPlate';
import { Request } from '../../src/models/request';
import { DocumentName } from '../../src/enums/documentName.enum';
import { ReasonForIssue } from '../../src/enums/reasonForIssue.enum';

describe('Document Model tests', () => {
  let request: Request;

  beforeEach(() => {
    request = {
      documentName: DocumentName.MINISTRY,
      vehicle: generateVehicle(),
      recipientEmailAddress: 'customer@example.com',
      plate: {
        plateSerialNumber: '12345',
        plateIssueDate: '2023-02-27T12:34:56.789Z',
        plateReasonForIssue: ReasonForIssue.DESTROYED,
        plateIssuer: 'user',
      },
    };
  });

  it('should convert a request into a Ministry Plate Document', () => {
    const document = new MinistryPlateDocument(request);
    expect(document).toBeTruthy();
  });

  it('should only populate 4 axles if there are more on the vehicle', () => {
    request.vehicle.techRecord.axles = [
      {
        tyres: {
          tyreSize: '1',
          plyRating: '2',
          fitmentCode: '3',
        },
        weights: {
          gbWeight: 123,
          eecWeight: 123,
          designWeight: 123,
        },
      },
      {
        tyres: {
          tyreSize: '1',
          plyRating: '2',
          fitmentCode: '3',
        },
        weights: {
          gbWeight: 123,
          eecWeight: 123,
          designWeight: 123,
        },
      },
      {
        tyres: {
          tyreSize: '1',
          plyRating: '2',
          fitmentCode: '3',
        },
        weights: {
          gbWeight: 123,
          eecWeight: 123,
          designWeight: 123,
        },
      },
      {
        tyres: {
          tyreSize: '1',
          plyRating: '2',
          fitmentCode: '3',
        },
        weights: {
          gbWeight: 123,
          eecWeight: 123,
          designWeight: 123,
        },
      },
      {
        tyres: {
          tyreSize: '9',
          plyRating: '9',
          fitmentCode: '9',
        },
        weights: {
          gbWeight: 999,
          eecWeight: 999,
          designWeight: 999,
        },
      },
    ] as IAxle[];
    const document = new MinistryPlateDocument(request);
    expect(document.PLATES_DATA.axles.axle4.weights.gbWeight).toBe('123');
  });

  it('should apply no water mark for prod', () => {
    process.env.BRANCH = 'prod';
    const document = new MinistryPlateDocument(request);
    expect(document.Watermark).toBe('');
  });

  it('should have trl attributes if vehicle is a trailer', () => {
    request.vehicle.techRecord.vehicleType = 'trl';
    const document = new MinistryPlateDocument(request);
    expect(document).toBeTruthy();
  });

  it('should handle 0 axles', () => {
    request.vehicle.techRecord.axles = [] as IAxle[];
    const document = new MinistryPlateDocument(request);
    expect(document).toBeTruthy();
  });

  it('should handle 1 axle', () => {
    const document = new MinistryPlateDocument(request);
    expect(document).toBeTruthy();
  });

  it('should handle 2 axles', () => {
    request.vehicle.techRecord.axles = [
      {
        tyres: {
          tyreSize: '1',
          plyRating: '2',
          fitmentCode: '3',
        },
        weights: {
          gbWeight: 123,
          eecWeight: 123,
          designWeight: 123,
        },
      },
      {
        tyres: {
          tyreSize: '1',
          plyRating: '2',
          fitmentCode: '3',
        },
        weights: {
          gbWeight: 123,
          eecWeight: 123,
          designWeight: 123,
        },
      },
    ] as IAxle[];
    const document = new MinistryPlateDocument(request);
    expect(document).toBeTruthy();
  });

  it('should handle 3 axles', () => {
    request.vehicle.techRecord.axles = [
      {
        tyres: {
          tyreSize: '1',
          plyRating: '2',
          fitmentCode: '3',
        },
        weights: {
          gbWeight: 123,
          eecWeight: 123,
          designWeight: 123,
        },
      },
      {
        tyres: {
          tyreSize: '1',
          plyRating: '2',
          fitmentCode: '3',
        },
        weights: {
          gbWeight: 123,
          eecWeight: 123,
          designWeight: 123,
        },
      },
      {
        tyres: {
          tyreSize: '1',
          plyRating: '2',
          fitmentCode: '3',
        },
        weights: {
          gbWeight: 123,
          eecWeight: 123,
          designWeight: 123,
        },
      },
    ] as IAxle[];
    const document = new MinistryPlateDocument(request);
    expect(document).toBeTruthy();
  });

  it('should handle 4 axles', () => {
    const vehicle = generateVehicle();
    vehicle.techRecord.axles = [
      {
        tyres: {
          tyreSize: '1',
          plyRating: '2',
          fitmentCode: '3',
        },
        weights: {
          gbWeight: 123,
          eecWeight: 123,
          designWeight: 123,
        },
      },
      {
        tyres: {
          tyreSize: '1',
          plyRating: '2',
          fitmentCode: '3',
        },
        weights: {
          gbWeight: 123,
          eecWeight: 123,
          designWeight: 123,
        },
      },
      {
        tyres: {
          tyreSize: '1',
          plyRating: '2',
          fitmentCode: '3',
        },
        weights: {
          gbWeight: 123,
          eecWeight: 123,
          designWeight: 123,
        },
      },
      {
        tyres: {
          tyreSize: '1',
          plyRating: '2',
          fitmentCode: '3',
        },
        weights: {
          gbWeight: 123,
          eecWeight: 123,
          designWeight: 123,
        },
      },
    ] as IAxle[];
    const document = new MinistryPlateDocument(request);
    expect(document).toBeTruthy();
  });

  it('should create attributes if vehicle is missing properties', () => {
    request.vehicle.techRecord.vehicleType = 'trl';
    request.vehicle.techRecord.manufactureYear = undefined;
    request.vehicle.techRecord.grossGbWeight = undefined;
    request.vehicle.techRecord.grossEecWeight = undefined;
    request.vehicle.techRecord.grossDesignWeight = undefined;
    request.vehicle.techRecord.trainGbWeight = undefined;
    request.vehicle.techRecord.trainEecWeight = undefined;
    request.vehicle.techRecord.trainDesignWeight = undefined;
    request.vehicle.techRecord.maxTrainGbWeight = undefined;
    request.vehicle.techRecord.maxTrainEecWeight = undefined;
    request.vehicle.techRecord.dimensions.length = undefined;
    request.vehicle.techRecord.dimensions.width = undefined;
    const document = new MinistryPlateDocument(request);
    expect(document).toBeTruthy();
  });

  it('should add S3 metadata', () => {
    process.env.DOCUMENT_LINK_URL = 'https://unit-testing.jest.example.com/metadata/documents/';

    const document = new MinistryPlateDocument(request);

    expect(document.metaData['document-type']).toBe(DocumentName.MINISTRY);
    expect(document.metaData['date-of-issue']).toBe('27/02/2023');
    expect(document.metaData.email).toBe(request.recipientEmailAddress);
  });
});
