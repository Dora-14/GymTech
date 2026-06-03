import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'gymtech_token';
  private readonly USER_KEY = 'gymtech_user';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    if (environment.devBypassAuth) {
      const mock: AuthResponse = {
        token: 'dev-mock-token',
        role: 'Admin',
        userId: 0,
        firstName: 'Dev',
        email: credentials.email
      };
      return of(mock).pipe(tap(r => this.saveSession(r)));
    }
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.saveSession(response))
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    if (environment.devBypassAuth) {
      const mock: AuthResponse = {
        token: 'dev-mock-token',
        role: 'Member',
        userId: 0,
        firstName: userData.firstName,
        email: userData.email
      };
      return of(mock);
    }
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserRole(): string | null {
    const user = this.getStoredUser();
    return user ? user.role : null;
  }

  getFirstName(): string | null {
    const user = this.getStoredUser();
    return user ? user.firstName : null;
  }

  getDashboardRouteForRole(role: string): string {
    switch (role.toLowerCase()) {
      case 'admin':        return '/dashboard';
      case 'receptionist': return '/receptionist-dashboard';
      case 'trainer':      return '/trainer-dashboard';
      case 'member':       return '/member-dashboard';
      default:             return '/login';
    }
  }

  private saveSession(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response));
  }

  private getStoredUser(): AuthResponse | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthResponse;
    } catch {
      return null;
    }
  }
}
