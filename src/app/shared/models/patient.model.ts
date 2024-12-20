export class Patient {
  constructor(
    public id: number,
    public uuid: string,
    public policyNumber: string,
    public fullName: string,
    public gender: GENDER,
    public birthDate: Date,
  ) {
  }

}

export class PatientsResponse {
  constructor(
    public patients: Patient[],
    public totalAmount: number,
  ) {
  }

}

export class PatientData {

}

export enum GENDER {
  MALE='male',
  FEMALE='female',
  NON_SPECIFIED='nonSpecified',
}
