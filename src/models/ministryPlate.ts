export type MinistryPlate = {
  PlateSerialNumber: string;
  DtpNumber: string;
  PrimaryVrm: string;
  Vin: string;
  VariantNumber: string;
  ApprovalTypeNumber: string;
  Make: string;
  Model: string;
  SpeedLimiterMrk: string;
  FunctionCode: string;
  RegnDate: string;
  ManufactureYear: string;
  GrossGbWeight: string;
  GrossEecWeight: string;
  GrossDesignWeight: string;
  TrainGbWeight: string;
  TrainEecWeight: string;
  TrainDesignWeight: string;
  MaxTrainGbWeight: string;
  MaxTrainEecWeight: string;
  MaxLoadOnCoupling: string;
  DimensionLength: string;
  DimensionWidth: string;
  FrontAxleTo5thWheelCouplingMin: string;
  FrontAxleTo5thWheelCouplingMax: string;
  CouplingCenterToRearTrlMax: string;
  CouplingCenterToRearTrlMin: string;
  PlateIssueDate: string;
  TyreUseCode: string;
  Axles: Axles;
};

export type Axles = {
  Axle1: Axle;
  Axle2: Axle;
  Axle3: Axle;
  Axle4: Axle;
};

type Axle = {
  Weights: Weight;
  Tyres: Tyre;
};

type Weight = {
  GbWeight: string;
  EecWeight: string;
  DesignWeight: string;
};

type Tyre = {
  TyreSize: string;
  PlyRating: string;
  FitmentCode: string;
};
