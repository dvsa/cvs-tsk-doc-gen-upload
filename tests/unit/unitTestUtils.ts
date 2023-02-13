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
    approvalTypeNumber: '',
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
  },
} as unknown as IVehicleRecord);

export const addMiddleware = <ResponseType>(response: ResponseType) => (_, _2) => async (_3) => Promise.resolve({ output: response, response: {} });
