export interface Request {
  documentName: string;
  vehicle: IVehicleRecord;
  plate: Plates;
}
export interface Plates {
  plateSerialNumber?: string;
  plateIssueDate?: string;
  plateReasonForIssue?: PlateReasonForIssue;
  plateIssuer?: string;
}

export enum PlateReasonForIssue {
  FREE_REPLACEMENT = 'Free replacement',
  REPLACEMENT = 'Replacement',
  DESTROYED = 'Destroyed',
  PROVISIONAL = 'Provisional',
  ORIGINAL = 'Original',
  MANUAL = 'Manual',
}
