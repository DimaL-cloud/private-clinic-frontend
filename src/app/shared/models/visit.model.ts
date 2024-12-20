import {Medicine} from './medicine.model';

export class Visit {
  constructor(
    public id: string,
    public date: Date,
    public type: VisitType,
    public reason: string,
    public result: string,
    public diagnosis: string,
    public medicines: Medicine[],
  ) {
  }
}

export enum VisitType {
  CONSULTATION = "consultation",
  DIAGNOSIS = "diagnosis",
  TREATMENT = "treatment",
  FOLLOW_UP = "followUp",
  PREVENTION = "prevention",
  CHECKUP = "checkup",
  EMERGENCY = "emergency",
  SURGERY = "surgery",
  VACCINATION = "vaccination",
  OTHER = "other"
}
