import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

class RouterStub {
  lastNavigatedUrl: string = '';
  navigate(commands: any[]) {
    this.lastNavigatedUrl = commands[0];
  }
}

describe('Login Component Tests', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let router: Router;
  let routerStub: RouterStub;

  beforeEach(async () => {

    routerStub = new RouterStub();
    await TestBed.configureTestingModule({
      
      imports: [Login, RouterTestingModule.withRoutes([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  // --- LOGIN FORM TESTS ---

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show login form by default', () => {
    expect(component.currentPage).toBe('login');
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.form-title')?.textContent).toContain('Login');
  });

  it('should have a username and password input field', () => {
    const compiled = fixture.nativeElement as HTMLElement;
   
    expect(compiled.querySelector('input[type="text"]')).toBeTruthy();
    expect(compiled.querySelector('input[type="password"]')).toBeTruthy();
  });

  it('should navigate to dashboard on successful login', () => {

    component.onLogin();
    expect(routerStub.lastNavigatedUrl).toBe('/dashboard');
  });

  // --- SIGNUP FORM TESTS ---

  it('should switch to signup form when goToSignup is called', () => {
    component.goToSignup();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.form-title')?.textContent).toContain('Create Account');
  });

  it('should render all 6 required signup input fields', () => {
    component.goToSignup();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    const fieldIds = [
      '#signup-firstname', '#signup-lastname', '#signup-email', 
      '#signup-phone', '#signup-password', '#signup-confirmpassword'
    ];

    fieldIds.forEach(id => {
      expect(compiled.querySelector(id)).toBeTruthy();
    });
  });

  it('should have "required" attribute on ALL signup fields', () => {
    component.goToSignup();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    const fieldIds = [
      '#signup-firstname', '#signup-lastname', '#signup-email', 
      '#signup-phone', '#signup-password', '#signup-confirmpassword'
    ];

    fieldIds.forEach(id => {
      const input = compiled.querySelector(id);
      expect(input?.hasAttribute('required')).toBe(true);
    });
  });

  it('should switch back to login when "Login Here" button is clicked', () => {
    component.goToSignup(); // Start at signup
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const backToLoginBtn = compiled.querySelector('.auth-link') as HTMLButtonElement;
    backToLoginBtn.click();
    fixture.detectChanges();
    
    expect(component.currentPage).toBe('login');
    expect(compiled.querySelector('.form-title')?.textContent).toContain('Login');
  });
});