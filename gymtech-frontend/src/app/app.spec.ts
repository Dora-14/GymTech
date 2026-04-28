import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, gymtech-frontend');
  });

  //tester

  it('should have a username input field', () => {
    const compiled = fixture.nativeElement;
    const username = compiled.querySelector(ínput[type = "text"]);
    expect(username).toBeTruthy();
  });

  it('should have a password input field', () => {
    const compiled = fixture.nativeElement;
    const Password = compiled.querySelector(ínput[type = "password"]);
    expect(Password).toBeTruthy();
  });

  it('should have a Log In button', () => {
    const compiled = fixture.nativeElement;
    const loginButton = compiled.querySelector('button');
    expect(loginButton).toBeTruthy();
  });

  it('should have a link to the sign-up page', () => {
    const compiled = fixture.nativeElement;
    const signUpLink = compiled.querySelector('a');
    expect(signUpLink).toBeTruthy();

    const linkPath = signUpLink.getAttribute('routerLink') || signUpLink.getAttribute('href');
    expect(linkPath).toContain('/signUp')
  });

  //till here

});
