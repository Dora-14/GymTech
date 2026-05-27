import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Login } from './login';
import { AuthService } from '../../../core/services/auth.service';

describe('Login Component Jasmine Tests', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceMock: any;

  beforeEach(async () => {
    // Create a clean mock object for your authentication service
    authServiceMock = {
      login: () => {}
    };

    await TestBed.configureTestingModule({
      // Login is standalone, so it belongs in imports
      imports: [Login, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component flawlessly', () => {
    expect(component).toBeTruthy();
  });
});