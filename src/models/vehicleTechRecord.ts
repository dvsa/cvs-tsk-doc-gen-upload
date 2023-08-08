export interface ITechRecord {
  primaryVrm: string;
  vin: string;
  systemNumber: string;
  partialVin?: string;
  trailerId: string;
  techRecord_createdAt: string;
  techRecord_createdByName: string;
  techRecord_createdById: string;
  techRecord_lastUpdatedAt: string;
  techRecord_lastUpdatedByName: string;
  techRecord_lastUpdatedById: string;
  techRecord_updateType: string;
  techRecord_reasonForCreation: string;
  techRecord_statusCode: string;
  techRecord_vehicleType: string;
  techRecord_plates_plateSerialNumber: string;
  techRecord_plates_plateIssueDate: string;
  techRecord_plates_plateReasonForIssue: string;
  techRecord_plates_plateIssuer: string;
  techRecord_brakes_brakeCode: string;
  techRecord_brakes_brakeCodeOriginal: string;
  techRecord_brakes_dtpNumber: string;
  techRecord_brakes_dataTrBrakeOne: string;
  techRecord_brakes_dataTrBrakeTwo: string;
  techRecord_brakes_dataTrBrakeThree: string;
  techRecord_brakes_retarderBrakeOne: string;
  techRecord_brakes_retarderBrakeTwo: string;
  techRecord_brakes_brakeForceWheelsNotLocked_serviceBrakeForceA: number;
  techRecord_brakes_brakeForceWheelsNotLocked_secondaryBrakeForceA: number;
  techRecord_brakes_brakeForceWheelsNotLocked_parkingBrakeForceA: number;
  techRecord_brakes_brakeForceWheelsUpToHalfLocked_serviceBrakeForceB: number;
  techRecord_brakes_brakeForceWheelsUpToHalfLocked_secondaryBrakeForceB: number;
  techRecord_brakes_brakeForceWheelsUpToHalfLocked_parkingBrakeForceB: number;
  techRecord_approvalTypeNumber: string;
  techRecord_variantNumber: string;
  techRecord_variantVersionNumber: string;
  techRecord_make: string;
  techRecord_model: string;
  techRecord_seatsLowerDeck: number;
  techRecord_seatsUpperDeck: number;
  techRecord_standingCapacity: number;
  techRecord_speedLimiterMrk: boolean;
  techRecord_modelLiteral: string;
  techRecord_functionCode: string;
  techRecord_grossEecWeight: number;
  techRecord_trainGbWeight: number;
  techRecord_trainEecWeight: number;
  techRecord_trainDesignWeight: number;
  techRecord_maxTrainGbWeight: number;
  techRecord_maxTrainEecWeight: number;
  techRecord_maxTrainDesignWeight: number;
  techRecord_tyreUseCode: string;
  techRecord_manufactureYear: number;
  techRecord_regnDate: string;
  techRecord_grossGbWeight: number;
  techRecord_grossDesignWeight: number;
  techRecord_axles: IAxle[];
  techRecord_maxLoadOnCoupling: number;
  techRecord_dimensions_length: number;
  techRecord_dimensions_width: number;
  techRecord_dimensions_height?: number;
  techRecord_dimensions_axleSpacing_axles: string[];
  techRecord_dimensions_axleSpacing_value: number[];
  techRecord_frontVehicleTo5thWheelCouplingMin: number;
  techRecord_frontVehicleTo5thWheelCouplingMax: number;
  techRecord_couplingCenterToRearTrlMin: number;
  techRecord_couplingCenterToRearTrlMax: number;
  techRecord_couplingCenterToRearAxleMin: number;
  techRecord_couplingCenterToRearAxleMax: number;
  techRecord_applicantDetails_name?: string;
  techRecord_applicantDetails_address1?: string;
  techRecord_applicantDetails_address2?: string;
  techRecord_applicantDetails_postTown?: string;
  techRecord_applicantDetails_address3?: string;
  techRecord_applicantDetails_postCode?: string;
  telephoneNumber?: string;
  techRecord_roadFriendly: boolean;
  techRecord_vehicleConfiguration: VehicleConfiguration;
}

export interface IAxle {
  parkingBrakeMrk: boolean;
  axleNumber: number;
  weights_kerbWeight: number;
  weights_ladenWeight: number;
  weights_gbWeight: number;
  weights_designWeight: number;
  weights_eecWeight: number;
  weights_brakeActuator: number;
  weights_leverLength: number;
  weights_springBrakeParking: boolean;
  tyres_tyreSize: string;
  tyres_plyRating: string;
  tyres_fitmentCode: string;
  tyres_dataTrAxles: number;
  tyres_tyreCode: number;
  tyres_speedCategorySymbol: string;
}

export enum VehicleConfiguration {
  RIGID = 'rigid',
  ARTICULATED = 'articulated',
  CENTRE_AXLE_DRAWBAR = 'centre axle drawbar',
  SEMI_CAR_TRANSPORTER = 'semi-car transporter',
  SEMI_TRAILER = 'semi-trailer',
  LOW_LOADER = 'low loader',
  OTHER = 'other',
  DRAWBAR = 'drawbar',
  FOUR_IN_LINE = 'four-in-line',
  DOLLY = 'dolly',
  FULL_DRAWBAR = 'full drawbar',
  LONG_SEMI_TRAILER = 'long semi-trailer',
}
