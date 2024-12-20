export class Medicine {
  constructor(
    public id: number,
    public name: string,
    public composition: string,
    public type: MedicineType,
    public usageRecommendation: string,
  ) {
  }
}

export enum MedicineType {
  TABLET = "tablet",
  SYRUP = "syrup",
  POWDER = "powder",
  CAPSULE = "capsule",
  OINTMENT = "ointment",
  INJECTION = "injection",
  OTHER = "other"
}
