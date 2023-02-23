import { Request } from "./request";
import { DocumentName } from "../enums/documentName.enum";
import { VehicleType } from "../enums/vehicleType.enum";
import { DocumentModel } from "./documentModel";
import { IAxle } from "./vehicleTechRecord";

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

export class MinistryPlateDocument extends DocumentModel {
  constructor(request: Request) {
    super(request.recipientEmailAddress);
    const { vehicle, plate } = request;
    const { techRecord } = vehicle;

    this.documentType = DocumentName.MINISTRY;
    this.filename = `plate_${request.plate.plateSerialNumber}`;

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
      Axles: this.populateAxles(techRecord.axles),
    };

    if (techRecord.vehicleType === VehicleType.HGV) {
      plateData.MaxLoadOnCoupling = techRecord.maxLoadOnCoupling?.toString();
      plateData.FrontAxleTo5thWheelCouplingMin = techRecord.frontAxleTo5thWheelCouplingMin?.toString();
      plateData.FrontAxleTo5thWheelCouplingMax = techRecord.frontAxleTo5thWheelCouplingMax?.toString();
      plateData.SpeedLimiterMrk = techRecord.speedLimiterMrk?.toString();
    }

    if (techRecord.vehicleType === VehicleType.TRL) {
      plateData.CouplingCenterToRearTrlMax = techRecord.couplingCenterToRearTrlMax?.toString();
      plateData.CouplingCenterToRearTrlMin = techRecord.couplingCenterToRearTrlMin?.toString();
    }

    this.PLATES_DATA = plateData as MinistryPlate;
    this.Reissue = { Reason: plate.plateReasonForIssue };

    // S3 metadata
    this.metaData['vrm'] = vehicle.primaryVrm;
  };

  private populateAxles = (axles: IAxle[]): Axles => {
    const plateAxles: Axles = {
      Axle1: {},
      Axle2: {},
      Axle3: {},
      Axle4: {},
    } as Axles;
    const terminatingCondition = Math.min(axles.length, 4);
    for (let i = 0; i < terminatingCondition; i++) {
      plateAxles[`Axle${i + 1}`] = {
        Weights: {
          GbWeight: axles[i].weights?.gbWeight?.toString(),
          EecWeight: axles[i].weights?.eecWeight?.toString(),
          DesignWeight: axles[i].weights?.designWeight?.toString(),
        },
        Tyres: {
          TyreSize: axles[i].tyres?.tyreSize,
          PlyRating: axles[i].tyres?.plyRating,
          FitmentCode: axles[i].tyres?.fitmentCode,
        },
      };
    }
    return plateAxles;
  };

  Reissue?: {
    Reason: string;
  };
  PLATES_DATA: MinistryPlate;
  Watermark: string;
};
