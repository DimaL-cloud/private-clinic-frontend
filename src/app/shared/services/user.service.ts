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

  editUser(uuid: string, user: User): Observable<void> {
    return this.http.put<void>(`/api/users/${uuid}`, user);
  }

  removeUser(uuid: string): Observable<void> {
    return this.http.delete<void>(`/api/users/${uuid}`);
  }

}
