import { Injectable } from '@angular/core';
import {Patient, PatientsResponse} from '../models/patient.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import {Visit} from '../models/visit.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private http: HttpClient,
              private datePipe: DatePipe) { }

  getPatients(pageSize: number, pageIndex: number): Observable<PatientsResponse> {
    return this.http.get<PatientsResponse>(`/api/patients?pageSize=${pageSize}&pageIndex=${pageIndex}&sortColumnName=id&sortDirection=asc`);
  }

  savePatient(patient: Patient): Observable<void> {
    const formattedPatient = {
      ...patient,
      birthDate: this.datePipe.transform(patient.birthDate, 'yyyy-MM-dd')  // Format the date
    };
    return this.http.post<void>('/api/patients', formattedPatient);
  }

  editPatient(uuid: string, patient: Patient): Observable<void> {
    const formattedPatient = {
      ...patient,
      birthDate: this.datePipe.transform(patient.birthDate, 'yyyy-MM-dd')
    };
    return this.http.patch<void>(`/api/patients/${uuid}`, formattedPatient);
  }

  removePatient(uuid: string): Observable<void> {
    return this.http.delete<void>(`/api/patients/${uuid}`);
  }

  getPatientVisits(uuid: string): Observable<Visit[]> {
    return this.http.get<Visit[]>(`/api/patients/${uuid}/visits`);
  }

  saveVisit(uuid: string, visit: Visit): Observable<void> {
    const formattedVisit = {
      ...visit,
      date: this.datePipe.transform(visit.date, 'yyyy-MM-dd')  // Format the date
    };
    return this.http.post<void>(`/api/patients/${uuid}/visits`, formattedVisit);
  }

  editVisit(uuid: string, visit: Visit): Observable<void> {
    const formattedVisit = {
      ...visit,
      date: this.datePipe.transform(visit.date, 'yyyy-MM-dd')
    };
    return this.http.patch<void>(`/api/patients/${uuid}/visits/${visit.id}`, formattedVisit);
  }

  removeVisit(visitId: string): Observable<void> {
    return this.http.delete<void>(`/api/patients/ignored/visits/${visitId}`);
  }

  generateReport(uuid: string): Observable<Blob> {
    return this.http.get(`/api/patients/${uuid}/visits/report`, { responseType: 'blob' });
  }

}
