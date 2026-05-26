import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attendance } from '../models/attendance.model';

const API = 'http://localhost:5062/api/attendance';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  constructor(private http: HttpClient) {}

  checkIn(memberId: number): Observable<Attendance> {
    return this.http.post<Attendance>(`${API}/checkin/${memberId}`, {});
  }

  getByMember(memberId: number): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${API}/member/${memberId}`);
  }

  getAll(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${API}/all`);
  }
}
