import { Request } from './request';
import { DocumentName } from '../enums/documentName.enum';
import { VehicleType } from '../enums/vehicleType.enum';
import { DocumentModel } from './documentModel';
import { IAxle, ITechRecord, VehicleConfiguration } from './vehicleTechRecord';

export type MinistryPlate = {
  plateSerialNumber: string;
  dtpNumber: string;
  primaryVrm: string;
  vin: string;
  variantNumber: string;
  approvalTypeNumber: string;
  make: string;
  model: string;
  speedLimiterMrk: string;
  functionCode: string;
  regnDate: string;
  manufactureYear: string;
  grossGbWeight: string;
  grossEecWeight: string;
  grossDesignWeight: string;
  trainGbWeight: string;
  trainEecWeight: string;
  trainDesignWeight: string;
  maxTrainGbWeight: string;
  maxTrainEecWeight: string;
  maxLoadOnCoupling: string;
  dimensionLength: string;
  dimensionWidth: string;
  frontVehicleTo5thWheelCouplingMin: string;
  frontVehicleTo5thWheelCouplingMax: string;
  couplingCenterToRearTrlMax: string;
  couplingCenterToRearTrlMin: string;
  plateIssueDate: string;
  tyreUseCode: string;
  axles: Axles;
};

export type Axles = {
  axle1: Axle;
  axle2: Axle;
  axle3: Axle;
  axle4: Axle;
};

type Axle = {
  weights: Weight;
  tyres: Tyre;
};

type Weight = {
  gbWeight: string;
  eecWeight: string;
  designWeight: string;
};

type Tyre = {
  tyreSize: string;
  plyRating: string;
  fitmentCode: string;
};

export class MinistryPlateDocument extends DocumentModel {
  constructor(request: Request) {
    super(request.recipientEmailAddress);
    const { vehicle, plate } = request;
    const { techRecord } = vehicle;

    this.setDocumentType(DocumentName.MINISTRY);
    this.filename = `plate_${request.plate.plateSerialNumber}`;
    this.setDateOfIssue(plate.plateIssueDate);

    const plateData: Partial<MinistryPlate> = {
      plateSerialNumber: plate.plateSerialNumber,
      dtpNumber: techRecord.brakes.dtpNumber,
      primaryVrm: vehicle.primaryVrm ?? vehicle.trailerId,
      vin: vehicle.vin,
      variantNumber: techRecord.variantNumber,
      approvalTypeNumber: techRecord.approvalTypeNumber,
      functionCode: this.calculateFunctionCode(
        techRecord.vehicleType,
        techRecord.roadFriendly,
        techRecord.vehicleConfiguration,
      ),
      make: techRecord.make,
      model: techRecord.model,
      regnDate: techRecord.regnDate,
      manufactureYear: techRecord.manufactureYear?.toString(),
      grossGbWeight: techRecord.grossGbWeight?.toString(),
      grossEecWeight: techRecord.grossEecWeight?.toString(),
      grossDesignWeight: techRecord.grossDesignWeight?.toString(),
      trainGbWeight: techRecord.trainGbWeight?.toString(),
      trainEecWeight: techRecord.trainEecWeight?.toString(),
      trainDesignWeight: techRecord.trainDesignWeight?.toString(),
      maxTrainGbWeight: techRecord.maxTrainGbWeight?.toString(),
      maxTrainEecWeight: techRecord.maxTrainEecWeight?.toString(),
      dimensionLength: techRecord.dimensions.length?.toString(),
      dimensionWidth: techRecord.dimensions.width?.toString(),
      plateIssueDate: plate.plateIssueDate,
      tyreUseCode: techRecord.tyreUseCode,
      axles: this.populateAxles(techRecord.axles, techRecord),
    };

    if (techRecord.vehicleType === VehicleType.HGV) {
      plateData.frontVehicleTo5thWheelCouplingMin = techRecord.frontVehicleTo5thWheelCouplingMin?.toString();
      plateData.frontVehicleTo5thWheelCouplingMax = techRecord.frontVehicleTo5thWheelCouplingMax?.toString();
      plateData.speedLimiterMrk = techRecord.speedLimiterMrk ? 'Yes' : 'No';
    }

    if (techRecord.vehicleType === VehicleType.TRL) {
      plateData.maxLoadOnCoupling = techRecord.maxLoadOnCoupling?.toString();
      plateData.couplingCenterToRearTrlMax = techRecord.couplingCenterToRearTrlMax?.toString();
      plateData.couplingCenterToRearTrlMin = techRecord.couplingCenterToRearTrlMin?.toString();
    }

    this.PLATES_DATA = plateData as MinistryPlate;
    this.Reissue = { Reason: plate.plateReasonForIssue };

    // S3 metadata
    this.metaData.vrm = vehicle.primaryVrm ?? vehicle.trailerId;
  }

  private populateAxles = (axles: IAxle[], techRecord: ITechRecord): Axles => {
    const plateAxles: Axles = {
      axle1: {},
      axle2: {},
      axle3: {},
      axle4: {},
    } as Axles;
    const terminatingCondition = Math.min(axles.length, 4);
    const generateTrlEec = !!(
      techRecord.vehicleType === VehicleType.TRL && techRecord.couplingCenterToRearAxleMax <= 12000
    );
    for (let i = 0; i < terminatingCondition; i++) {
      plateAxles[`axle${i + 1}`] = {
        weights: {
          gbWeight: axles[i].weights?.gbWeight?.toString(),
          eecWeight:
            techRecord.vehicleType === VehicleType.HGV || generateTrlEec
              ? axles[i].weights?.eecWeight?.toString()
              : null,
          designWeight: axles[i].weights?.designWeight?.toString(),
        },
        tyres: {
          tyreSize: axles[i].tyres?.tyreSize,
          plyRating: axles[i].tyres?.dataTrAxles ?? axles[i].tyres?.plyRating,
          fitmentCode: axles[i].tyres?.fitmentCode,
        },
      };
    }
    return plateAxles;
  };

  private calculateFunctionCode(vehicleType, roadFriendlySuspension, vehicleConfiguration): string {
    if (vehicleType === VehicleType.TRL && roadFriendlySuspension) {
      return 'R';
    }

    if (vehicleType === VehicleType.HGV) {
      let functionCode: string | null;

      if (vehicleConfiguration === VehicleConfiguration.ARTICULATED) {
        functionCode = 'ARTIC';
      }

      if (vehicleConfiguration === VehicleConfiguration.RIGID) {
        functionCode = 'RIGID';
      }

      if (roadFriendlySuspension) {
        functionCode += ' R';
      }
      return functionCode;
    }

    return null;
  }

  Reissue?: {
    Reason: string;
  };

  PLATES_DATA: MinistryPlate;

  Watermark: string;
}
