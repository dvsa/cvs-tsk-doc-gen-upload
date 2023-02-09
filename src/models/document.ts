import { Axles, MinistryPlate } from './ministryPlate';

export interface MinistryDocument {
  Reissue?: {
    Reason: string,
  }
  PLATE_DATA: MinistryPlate,
  WATERMARK: string,
}
export const generateMinistryDocumentModel = (vehicle: IVehicleRecord): MinistryDocument => {
  const document: MinistryDocument = {} as MinistryDocument;
  const techRecord = vehicle.techRecord[0];
  const plateData: Partial<MinistryPlate> = {
    PlateSerialNumber: techRecord.plates.plateSerialNumber,
    DtpNumber: techRecord.brakes.dtpNumber,
    PrimaryVrm: vehicle.primaryVrm,
    Vin: vehicle.vin,
    VariantNumber: techRecord.variantNumber,
    ApprovalTypeNumber: techRecord.approvalTypeNumber,
    Make: techRecord.make,
    Model: techRecord.model,
    FunctionCode: techRecord.functionCode,
    RegnDate: techRecord.regnDate,
    ManufactureYear: techRecord.manufactureYear.toString(),
    GrossGbWeight: techRecord.grossGbWeight.toString(),
    GrossEecWeight: techRecord.grossEecWeight.toString(),
    GrossDesignWeight: techRecord.grossDesignWeight.toString(),
    TrainGbWeight: techRecord.trainGbWeight.toString(),
    TrainEecWeight: techRecord.trainEecWeight.toString(),
    TrainDesignWeight: techRecord.trainDesignWeight.toString(),
    MaxTrainGbWeight: techRecord.maxTrainGbWeight.toString(),
    MaxTrainEecWeight: techRecord.maxTrainEecWeight.toString(),
    DimensionLength: techRecord.dimensions.length.toString(),
    DimensionWidth: techRecord.dimensions.width.toString(),
    PlateIssueDate: techRecord.plates.plateIssueDate,
    TyreUseCode: techRecord.tyreUseCode,
    Axles: populateAxles(techRecord.axles),
  };

  if (techRecord.vehicleType === 'hgv') {
    plateData.MaxLoadOnCoupling = techRecord.maxLoadOnCoupling.toString();
    plateData.FrontAxleTo5thWheelCouplingMin = techRecord.frontAxleTo5thWheelCouplingMin.toString();
    plateData.FrontAxleTo5thWheelCouplingMax = techRecord.frontAxleTo5thWheelCouplingMax.toString();
    plateData.CouplingCenterToRearTrlMax = techRecord.couplingCenterToRearTrlMax.toString();
    plateData.CouplingCenterToRearTrlMin = techRecord.couplingCenterToRearTrlMin.toString();
    plateData.SpeedLimiterMrk = techRecord.speedLimiterMrk.toString();
  }

  document.PLATE_DATA = plateData as MinistryPlate;
  document.WATERMARK = (process.env.BRANCH === 'prod') ? '' : 'NOT VALID';
  document.Reissue = { Reason: techRecord.plates.plateReasonForIssue };

  return document;
};

const populateAxles = (axles: IAxle[]): Axles => {
  const plateAxles: Axles = {
    Axle1: {}, Axle2: {}, Axle3: {}, Axle4: {},
  } as Axles;
  const termincatingCondition = axles.length < 3 ? axles.length : 4;
  for (let i = 0; i < termincatingCondition; i++) {
    plateAxles[`Axle${i + 1}`] = {
      Weights: {
        GbWeight: axles[i].weights.gbWeight.toString(),
        EecWeight: axles[i].weights.eecWeight.toString(),
        DesignWeight: axles[i].weights.designWeight.toString(),
      },
      Tyres: {
        TyreSize: axles[i].tyres.tyreSize,
        PlyRating: axles[i].tyres.plyRating,
        FitmentCode: axles[i].tyres.fitmentCode,
      },
    };
  }
  return plateAxles;
};
