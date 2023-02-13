interface IVehicleRecord {
  primaryVrm: string;
  vin: string;
  systemNumber: string;
  partialVin?: string;
  trailerId: string;
  techRecord: ITechRecord;
}

interface ITechRecord {
  createdAt: string;
  createdByName: string;
  createdById: string;
  lastUpdatedAt: string;
  lastUpdatedByName: string;
  lastUpdatedById: string;
  updateType: string;
  reasonForCreation: string;
  statusCode: string;
  vehicleType: string;
  plates: IPlates;
  brakes: {
    brakeCode: string;
    brakeCodeOriginal: string;
    dtpNumber: string;
    dataTrBrakeOne: string;
    dataTrBrakeTwo: string;
    dataTrBrakeThree: string;
    retarderBrakeOne: string;
    retarderBrakeTwo: string;
    brakeForceWheelsNotLocked: {
      serviceBrakeForceA: number;
      secondaryBrakeForceA: number;
      parkingBrakeForceA: number;
    };
    brakeForceWheelsUpToHalfLocked: {
      serviceBrakeForceB: number;
      secondaryBrakeForceB: number;
      parkingBrakeForceB: number;
    };
  };
  approvalTypeNumber: string;
  variantNumber: string;
  variantVersionNumber: string;
  make: string;
  model: string;
  seatsLowerDeck: number;
  seatsUpperDeck: number;
  standingCapacity: number;
  speedLimiterMrk: boolean;
  modelLiteral: string;
  functionCode: string;
  grossEecWeight: number;
  trainGbWeight: number;
  trainEecWeight: number;
  trainDesignWeight: number;
  maxTrainGbWeight: number;
  maxTrainEecWeight: number;
  maxTrainDesignWeight: number;
  tyreUseCode: string;
  manufactureYear: number;
  regnDate: string;
  grossGbWeight: number;
  grossDesignWeight: number;
  axles: IAxle[];
  maxLoadOnCoupling: number;
  dimensions: IDimensions;
  frontAxleTo5thWheelCouplingMin: number;
  frontAxleTo5thWheelCouplingMax: number;
  couplingCenterToRearTrlMin: number;
  couplingCenterToRearTrlMax: number;
}

interface IPlates {
  plateSerialNumber: string;
  plateIssueDate: string;
  plateReasonForIssue: string;
  plateIssuer: string;
}

interface IAxle {
  parkingBrakeMrk: boolean;
  axleNumber: number;
  weights: {
    kerbWeight: number;
    ladenWeight: number;
    gbWeight: number;
    designWeight: number;
    eecWeight: number;
    brakeActuator: number;
    leverLength: number;
    springBrakeParking: boolean;
  };
  tyres: {
    tyreSize: string;
    plyRating: string;
    fitmentCode: string;
    dataTrAxles: number;
    tyreCode: number;
    speedCategorySymbol: string;
  };
}

type IDimensions = {
  length: number;
  width: number;
  height?: number;
  axleSpacing: [
    {
      axles: string;
      value: number;
    },
  ];
};
