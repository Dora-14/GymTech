import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  LoginRequest, LoginResponse,
  RegisterRequest, RegisterResponse
} from '../models/auth.model';

const API = 'http://localhost:5062/api/auth';
const SESSION_KEY = 'gymtech_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem(SESSION_KEY, JSON.stringify({
          username: response.username,
          role: response.role,
          userId: response.userId,
          memberId: response.memberId ?? 0,
          trainerId: response.trainerId ?? 0
        }));
      })
    );
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${API}/register`, data);
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(SESSION_KEY);
  }

  getRole(): string {
    const session = this.getSession();
    return session?.role ?? '';
  }

  getUsername(): string {
    const session = this.getSession();
    return session?.username ?? '';
  }

  getUserId(): number {
    const session = this.getSession();
    return session?.userId ?? 0;
  }

  getMemberId(): number {
    const session = this.getSession();
    return session?.memberId ?? 0;
  }

  getTrainerId(): number {
    const session = this.getSession();
    return (session as any)?.trainerId ?? 0;
  }

  private getSession(): { username: string; role: string; userId: number; memberId: number } | null {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}
