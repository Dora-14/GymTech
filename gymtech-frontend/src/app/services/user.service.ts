import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserAccount, CreateUserRequest } from '../models/user.model';

const API = 'http://localhost:5062/api/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<UserAccount[]> {
    return this.http.get<UserAccount[]>(API);
  }

  create(data: CreateUserRequest): Observable<UserAccount> {
    return this.http.post<UserAccount>(API, data);
  }

  update(id: number, data: CreateUserRequest): Observable<UserAccount> {
    return this.http.put<UserAccount>(`${API}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/${id}`);
  }
}
