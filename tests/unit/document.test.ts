import { generateMinistryDocumentModel } from '../../src/models/document';
import { PlateReasonForIssue } from '../../src/models/request';
import { IAxle } from '../../src/models/vehicleTechRecord';
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
  it('should have trl attributes if vehicle is a trailer', () => {
    const vehicle = generateVehicle();
    vehicle.techRecord.vehicleType = 'trl';
    const document = generateMinistryDocumentModel(vehicle, plate);
    expect(document).toBeTruthy();
  });

  it('should handle 0 axles', () => {
    const vehicle = generateVehicle();
    vehicle.techRecord.axles = [] as IAxle[];
    const document = generateMinistryDocumentModel(vehicle, plate);
    expect(document).toBeTruthy();
  });

  it('should handle 1 axle', () => {
    const vehicle = generateVehicle();
    const document = generateMinistryDocumentModel(vehicle, plate);
    expect(document).toBeTruthy();
  });

  it('should handle 2 axles', () => {
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
    ] as IAxle[];
    const document = generateMinistryDocumentModel(vehicle, plate);
    expect(document).toBeTruthy();
  });

  it('should handle 3 axles', () => {
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
    ] as IAxle[];
    const document = generateMinistryDocumentModel(vehicle, plate);
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
    const document = generateMinistryDocumentModel(vehicle, plate);
    expect(document).toBeTruthy();
  });

  it('should create attributes if vehicle is missing properties', () => {
    const vehicle = generateVehicle();
    vehicle.techRecord.vehicleType = 'trl';
    vehicle.techRecord.manufactureYear = undefined;
    vehicle.techRecord.grossGbWeight = undefined;
    vehicle.techRecord.grossEecWeight = undefined;
    vehicle.techRecord.grossDesignWeight = undefined;
    vehicle.techRecord.trainGbWeight = undefined;
    vehicle.techRecord.trainEecWeight = undefined;
    vehicle.techRecord.trainDesignWeight = undefined;
    vehicle.techRecord.maxTrainGbWeight = undefined;
    vehicle.techRecord.maxTrainEecWeight = undefined;
    vehicle.techRecord.dimensions.length = undefined;
    vehicle.techRecord.dimensions.width = undefined;
    const document = generateMinistryDocumentModel(vehicle, plate);
    expect(document).toBeTruthy();
  });
});
