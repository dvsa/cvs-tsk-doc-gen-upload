import { IVehicleRecord } from '../../src/models/vehicleTechRecord';

export const generateVehicle = () => ({
  primaryVrm: '123',
  vin: '123',
  techRecord: {
    vehicleType: 'hgv',
    plates: {
      plateReasonForIssue: 'REPLACEMENT',
      plateSerialNumber: '1233423452',
    },
    brakes: {
      dtpNumber: '',
    },
    variantNumber: '',
    approvalTypeNumber: 'APPROVAL-TYPE-NUMBER/1234567',
    make: '',
    model: '',
    functionCode: '',
    regnDate: '',
    manufactureYear: '',
    grossGbWeight: '',
    grossEecWeight: '',
    grossDesignWeight: '',
    trainGbWeight: '',
    trainEecWeight: '',
    trainDesignWeight: '',
    maxTrainGbWeight: '',
    maxTrainEecWeight: '',
    dimensions: {
      length: '',
      width: '',
    },
    tyreUseCode: '',
    maxLoadOnCoupling: 123,
    frontAxleTo5thWheelCouplingMin: 123,
    frontAxleTo5thWheelCouplingMax: 123,
    couplingCenterToRearTrlMax: 123,
    couplingCenterToRearTrlMin: 123,
    speedLimiterMrk: 123,
    axles: [
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
    ],
    applicantDetails: {
      name: 'Dr T Railer',
      address1: 'Address Line 1',
      address2: 'Address Line 2',
      postTown: 'Postal Town',
      address3: 'Address Line 3',
      postcode: 'PO1 1ST',
    },
  },
} as unknown as IVehicleRecord);

export const addMiddleware = <ResponseType>(response: ResponseType) => (_, _2) => async (_3) => Promise.resolve({ output: response, response: {} });
