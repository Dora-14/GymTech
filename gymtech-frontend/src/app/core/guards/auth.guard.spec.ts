import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { environment } from '../../../environments/environment';

describe('AuthGuard Vitest Tests', () => {
  let authServiceMock: any;
  let routerMock: any;
  const mockUrlTree = {} as UrlTree;

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = { url: '/protected-route' } as RouterStateSnapshot;

  beforeEach(() => {
    authServiceMock = {
      isAuthenticated: vi.fn(),
      getUsername: vi.fn().mockReturnValue('Test Admin')
    };

    routerMock = {
      navigate: vi.fn(),
      createUrlTree: vi.fn().mockReturnValue(mockUrlTree)
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });


    environment.devBypassAuth = false;
  });

  it('should allow access if the user is logged in', () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);

    const canActivate = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    expect(canActivate).toBe(true);
    expect(routerMock.createUrlTree).not.toHaveBeenCalled();
  });

  it('should block access and return UrlTree if user is not logged in', () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);

    const canActivate = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    expect(canActivate).toBe(mockUrlTree);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
  });

  it('should immediately return true and bypass authentication if devBypassAuth is explicitly enabled', () => {

    environment.devBypassAuth = true;

    authServiceMock.isAuthenticated.mockReturnValue(false);

    const canActivate = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    expect(canActivate).toBe(true);
    expect(authServiceMock.isAuthenticated).not.toHaveBeenCalled();
    expect(routerMock.createUrlTree).not.toHaveBeenCalled();
  });

  it('should respect normal authentication rules and check the service when devBypassAuth is disabled', () => {

    environment.devBypassAuth = false;

    authServiceMock.isAuthenticated.mockReturnValue(true);

    const canActivate = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    expect(canActivate).toBe(true);
    expect(authServiceMock.isAuthenticated).toHaveBeenCalled();
  });
});
