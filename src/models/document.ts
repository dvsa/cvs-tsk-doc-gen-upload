import { Axles, MinistryPlate } from './ministryPlate';
import { Plates } from './request';

export interface MinistryDocument {
  Reissue?: {
    Reason: string;
  };
  PLATES_DATA: MinistryPlate;
  Watermark: string;
}

export const generateMinistryDocumentModel = (vehicle: IVehicleRecord, plate: Plates): MinistryDocument => {
  const document: MinistryDocument = {} as MinistryDocument;
  const { techRecord } = vehicle;
  const plateData: Partial<MinistryPlate> = {
    PlateSerialNumber: plate.plateSerialNumber,
    DtpNumber: techRecord.brakes.dtpNumber,
    PrimaryVrm: vehicle.primaryVrm,
    Vin: vehicle.vin,
    VariantNumber: techRecord.variantNumber,
    ApprovalTypeNumber: techRecord.approvalTypeNumber,
    Make: techRecord.make,
    Model: techRecord.model,
    FunctionCode: techRecord.functionCode,
    RegnDate: techRecord.regnDate,
    ManufactureYear: techRecord.manufactureYear?.toString(),
    GrossGbWeight: techRecord.grossGbWeight?.toString(),
    GrossEecWeight: techRecord.grossEecWeight?.toString(),
    GrossDesignWeight: techRecord.grossDesignWeight?.toString(),
    TrainGbWeight: techRecord.trainGbWeight?.toString(),
    TrainEecWeight: techRecord.trainEecWeight?.toString(),
    TrainDesignWeight: techRecord.trainDesignWeight?.toString(),
    MaxTrainGbWeight: techRecord.maxTrainGbWeight?.toString(),
    MaxTrainEecWeight: techRecord.maxTrainEecWeight?.toString(),
    DimensionLength: techRecord.dimensions.length?.toString(),
    DimensionWidth: techRecord.dimensions.width?.toString(),
    PlateIssueDate: plate.plateIssueDate,
    TyreUseCode: techRecord.tyreUseCode,
    Axles: populateAxles(techRecord.axles),
  };

  if (techRecord.vehicleType === 'hgv') {
    plateData.MaxLoadOnCoupling = techRecord.maxLoadOnCoupling?.toString();
    plateData.FrontAxleTo5thWheelCouplingMin = techRecord.frontAxleTo5thWheelCouplingMin?.toString();
    plateData.FrontAxleTo5thWheelCouplingMax = techRecord.frontAxleTo5thWheelCouplingMax?.toString();
    plateData.SpeedLimiterMrk = techRecord.speedLimiterMrk?.toString();
  }

  if (techRecord.vehicleType === 'trl') {
    plateData.CouplingCenterToRearTrlMax = techRecord.couplingCenterToRearTrlMax?.toString();
    plateData.CouplingCenterToRearTrlMin = techRecord.couplingCenterToRearTrlMin?.toString();
  }

  document.PLATES_DATA = plateData as MinistryPlate;
  document.Watermark = process.env.BRANCH === 'prod' ? '' : 'NOT VALID';
  document.Reissue = { Reason: plate.plateReasonForIssue };

  return document;
};

const populateAxles = (axles: IAxle[]): Axles => {
  const plateAxles: Axles = {
    Axle1: {},
    Axle2: {},
    Axle3: {},
    Axle4: {},
  } as Axles;
  const termincatingCondition = axles.length < 3 ? axles.length : 4;
  for (let i = 0; i < termincatingCondition; i++) {
    plateAxles[`Axle${i + 1}`] = {
      Weights: {
        GbWeight: axles[i].weights.gbWeight?.toString(),
        EecWeight: axles[i].weights.eecWeight?.toString(),
        DesignWeight: axles[i].weights.designWeight?.toString(),
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
