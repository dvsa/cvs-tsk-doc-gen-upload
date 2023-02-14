import { generateMinistryDocumentModel } from '../../src/models/document';
import { PlateReasonForIssue } from '../../src/models/request';
import { generateVehicle } from './unitTestUtils';

describe('Document tests', () => {
  const plate = {
    plateSerialNumber: '12345',
    plateIssueDate: new Date().toISOString(),
    plateReasonForIssue: PlateReasonForIssue.DESTROYED,
    plateIssuer: 'user',
  };

  it('should convert a vehicle into a Ministry Document', () => {
    const vehicle = generateVehicle();
    const document = generateMinistryDocumentModel(vehicle, plate);
    expect(document).toBeTruthy();
  });

  it('should only populate 4 axles if there are more on the vehicle', () => {
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
    const document = generateMinistryDocumentModel(vehicle, plate);
    expect(document.PLATES_DATA.Axles.Axle4.Weights.GbWeight).toBe('123');
  });
  it('should apply no water mark for prod', () => {
    process.env.BRANCH = 'prod';
    const vehicle = generateVehicle();
    const document = generateMinistryDocumentModel(vehicle, plate);
    expect(document.Watermark).toBe('');
  });
});
