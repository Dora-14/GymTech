import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Login } from './login';
import { AuthService } from '../../../services/auth.service';
import { of, throwError } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Login Component Vitest Tests', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let routerMock: any;
  let authServiceMock: any;

  beforeEach(async () => {
    routerMock = { navigate: vi.fn() };
    
    authServiceMock = {
      login: vi.fn().mockReturnValue(of({ role: 'Admin', token: 'jwt-123' })),
      register: vi.fn().mockReturnValue(of({ success: true }))
    };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // --- Infrastructure Tests ---

  it('should create the component flawlessly', () => {
    expect(component).toBeTruthy();
  });

  it('should switch pages correctly when toggle methods are invoked', () => {
    component.goToSignup();
    expect(component.currentPage).toBe('signup');
    expect(component.loginError).toBe('');

    component.goToLogin();
    expect(component.currentPage).toBe('login');
    expect(component.signupError).toBe('');
    expect(component.signupSuccess).toBe('');
  });

  // --- Login Form Validation & Workflow Tests ---

  it('should catch missing credentials on login and set an validation error message', () => {
    component.username = '';
    component.password = '';
    
    component.onLogin();

    expect(component.loginError).toBe('Please enter your username and password.');
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('should navigate to different dashboards depending on user role responses on success', () => {
    // 1. Test Admin Redirection Path
    component.username = 'admin_user';
    component.password = 'password123';
    authServiceMock.login.mockReturnValue(of({ role: 'Admin' }));
    
    component.onLogin();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.isLoginLoading).toBe(false);

    // 2. Test Trainer Redirection Path
    authServiceMock.login.mockReturnValue(of({ role: 'Trainer' }));
    component.onLogin();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/trainer-dashboard']);

    // 3. Test Member Redirection Path
    authServiceMock.login.mockReturnValue(of({ role: 'Member' }));
    component.onLogin();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/member-dashboard']);
  });

  it('should map login API failures to user-friendly error string states', () => {
    component.username = 'wrong_user';
    component.password = 'wrong_password';
    const serverMessage = 'Invalid credentials provided.';
    authServiceMock.login.mockReturnValue(throwError(() => ({ error: { message: serverMessage } })));

    component.onLogin();

    expect(component.loginError).toBe(serverMessage);
    expect(component.isLoginLoading).toBe(false);
  });

  // --- Signup Form Validation & Workflow Tests ---

  it('should catch unpopulated fields on signup validation passes', () => {
    component.firstName = '';
    component.onSignup();
    expect(component.signupError).toBe('All fields are required.');
    expect(authServiceMock.register).not.toHaveBeenCalled();
  });

  it('should block signups if the verification password strings mismatch', () => {
    component.firstName = 'John';
    component.lastName = 'Doe';
    component.email = 'john@gym.com';
    component.phone = '123456789';
    component.signupPassword = 'SecurePass123';
    component.confirmPassword = 'DifferentPass123'; // Mismatch!

    component.onSignup();

    expect(component.signupError).toBe('Passwords do not match.');
    expect(authServiceMock.register).not.toHaveBeenCalled();
  });

  it('should invoke registration API and trigger navigation fallback delay on success', () => {
    // 1. Tell Vitest to hijack the native JavaScript setTimeout timer
    vi.useFakeTimers();

    component.firstName = 'John';
    component.lastName = 'Doe';
    component.email = 'john@gym.com';
    component.phone = '123456789';
    component.signupPassword = 'SecurePass123';
    component.confirmPassword = 'SecurePass123';

    const loginRedirectSpy = vi.spyOn(component, 'goToLogin');

    component.onSignup();

    expect(authServiceMock.register).toHaveBeenCalled();
    expect(component.signupSuccess).toBe('Account created! You can now log in.');
    expect(component.isSignupLoading).toBe(false);

    // 2. Fast-forward Vitest's clock by 1500ms instantly
    vi.advanceTimersByTime(1500);
    
    expect(loginRedirectSpy).toHaveBeenCalled();

    // 3. Clear fake timers so other tests aren't affected
    vi.useRealTimers();
  });

  it('should fallback to the main admin dashboard route if the authentication role is unrecognized', () => {
    component.username = 'guest_user';
    component.password = 'password123';
    // Emulate a response containing a non-standard or arbitrary user role string
    authServiceMock.login.mockReturnValue(of({ role: 'SuperUser' }));

    component.onLogin();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should map signup API failures to user-friendly error strings and disable loading states', () => {
    component.firstName = 'John';
    component.lastName = 'Doe';
    component.email = 'john@gym.com';
    component.phone = '123456789';
    component.signupPassword = 'SecurePass123';
    component.confirmPassword = 'SecurePass123';

    const serverErrorMessage = 'Email address is already in use.';
    authServiceMock.register.mockReturnValue(throwError(() => ({ error: { message: serverErrorMessage } })));

    component.onSignup();

    expect(component.signupError).toBe(serverErrorMessage);
    expect(component.isSignupLoading).toBe(false);
  });
});