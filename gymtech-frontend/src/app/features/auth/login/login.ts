import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  currentPage: 'login' | 'signup' = 'login';

  // Login form fields
  username: string = '';
  password: string = '';
  loginError: string = '';
  isLoginLoading: boolean = false;

  // Signup form fields
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';
  signupPassword: string = '';
  confirmPassword: string = '';
  signupError: string = '';
  signupSuccess: string = '';
  isSignupLoading: boolean = false;

  constructor(private router: Router, private authService: AuthService, private cdr: ChangeDetectorRef) {}

  goToSignup(): void {
    this.currentPage = 'signup';
    this.loginError = '';
  }

  goToLogin(): void {
    this.currentPage = 'login';
    this.signupError = '';
    this.signupSuccess = '';
  }

  onLogin(): void {
    this.loginError = '';

    if (!this.username.trim() || !this.password.trim()) {
      this.loginError = 'Please enter your username and password.';
      return;
    }

    this.isLoginLoading = true;

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (response) => {
        this.isLoginLoading = false;
        const role = response.role;
        if (role === 'Admin') this.router.navigate(['/dashboard']);
        else if (role === 'Receptionist') this.router.navigate(['/receptionist-dashboard']);
        else if (role === 'Trainer') this.router.navigate(['/trainer-dashboard']);
        else if (role === 'Member') this.router.navigate(['/member-dashboard']);
        else this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoginLoading = false;
        this.loginError = err?.error?.message ?? 'Invalid username or password.';
        this.cdr.detectChanges();
      }
    });
  }

  onSignup(): void {
    this.signupError = '';
    this.signupSuccess = '';

    if (!this.firstName.trim() || !this.lastName.trim() || !this.email.trim() ||
        !this.phone.trim() || !this.signupPassword.trim()) {
      this.signupError = 'All fields are required.';
      return;
    }

    if (this.signupPassword !== this.confirmPassword) {
      this.signupError = 'Passwords do not match.';
      return;
    }

    this.isSignupLoading = true;

    this.authService.register({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      password: this.signupPassword
    }).subscribe({
      next: () => {
        this.isSignupLoading = false;
        this.signupSuccess = 'Account created! You can now log in.';
        this.cdr.detectChanges();
        setTimeout(() => this.goToLogin(), 1500);
      },
      error: (err) => {
        this.isSignupLoading = false;
        this.signupError = err?.error?.message ?? 'Registration failed. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }
}

