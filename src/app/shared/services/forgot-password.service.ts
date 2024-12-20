import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  constructor(private http: HttpClient) { }

  sendPasswordResetLinkToEmail(email: string): Observable<void> {
    return this.http.post<void>('/api/auth/password/change', { email });
  }

  resetPassword(email: string, token: string, newPassword: string): Observable<void> {
    return this.http.post<void>('/api/auth/password/change/apply', { email, token, newPassword });
  }

}
