import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member, CreateMemberRequest } from '../models/member.model';

const API = 'http://localhost:5062/api/member';

@Injectable({ providedIn: 'root' })
export class MemberService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Member[]> {
    return this.http.get<Member[]>(API);
  }

  getById(id: number): Observable<Member> {
    return this.http.get<Member>(`${API}/${id}`);
  }

  search(query: string): Observable<Member[]> {
    return this.http.get<Member[]>(`${API}/search?query=${encodeURIComponent(query)}`);
  }

  create(data: CreateMemberRequest): Observable<Member> {
    return this.http.post<Member>(API, data);
  }

  update(id: number, data: CreateMemberRequest): Observable<Member> {
    return this.http.put<Member>(`${API}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/${id}`);
  }
}
