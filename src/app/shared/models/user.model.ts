export class User {
  constructor(
    public id: string,
    public fullName: string,
    public username: string,
    public email: string,
    public role: string,
  ) {
  }
}

export class UsersResponse {
  constructor(
    public users: User[],
    public totalAmount: number,
  ) {
  }
}

export enum ROLE {
  DOCTOR = 'doctor',
  ADMIN = 'admin',
}
