import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('AuthInterceptor Vitest Tests', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authServiceMock: any;

  beforeEach(() => {
    authServiceMock = {
      getToken: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([authInterceptor])
        ),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should automatically append a Bearer token header if the user has an active session token', () => {
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
    authServiceMock.getToken.mockReturnValue(mockToken);

    httpClient.get('/api/dashboard/stats').subscribe();

    const req = httpMock.expectOne('/api/dashboard/stats');
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

    req.flush({});
  });

  it('should pass requests through transparently without authorization headers if no token exists', () => {
    authServiceMock.getToken.mockReturnValue(null);

    httpClient.get('/api/auth/login').subscribe();

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.headers.has('Authorization')).toBe(false);

    req.flush({});
  });

  it('should isolate and execute the functional interceptor intercept loop natively', () => {
    authServiceMock.getToken.mockReturnValue('isolated-test-token');

    const dummyRequest = new HttpRequest('GET', '/api/test');

    const nextSpy: HttpHandlerFn = (req) => {
      expect(req.headers.get('Authorization')).toBe('Bearer isolated-test-token');
      return {} as any;
    };

    TestBed.runInInjectionContext(() => {
      authInterceptor(dummyRequest, nextSpy);
    });
  });
});
