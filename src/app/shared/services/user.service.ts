import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User, UsersResponse} from '../models/user.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  registerUser(user: User): Observable<void> {
    return this.http.post<void>('/api/users', user);
  }

  getUsers(pageIndex: number, pageSize: number): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`/api/users?pageSize=${pageSize}&pageIndex=${pageIndex}`);
  }

}
