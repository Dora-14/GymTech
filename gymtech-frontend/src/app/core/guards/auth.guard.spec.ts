import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service'; // Ensure this path points correctly to your service
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('AuthGuard', () => {
  let authServiceMock: any;
  let routerMock: any;
  
  // Mock arguments required by the functional guard signature
  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = { url: '/protected-route' } as RouterStateSnapshot;

  beforeEach(() => {
    authServiceMock = {
      isLoggedIn: vi.fn(),
      getUserRole: vi.fn()
    };
    
    routerMock = {
      navigate: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });
  });

  it('should allow access if the user is logged in', () => {
    authServiceMock.isLoggedIn.mockReturnValue(true);

    // Pass the required mock route and state parameters into the guard function
    const canActivate = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    expect(canActivate).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should block access and redirect to /login if user is not logged in', () => {
    authServiceMock.isLoggedIn.mockReturnValue(false);

    // Pass the required mock route and state parameters here as well
    const canActivate = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    expect(canActivate).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});