import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest, RegisterRequest } from '../../../core/models/auth.models';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  currentPage: 'login' | 'signup' = 'login';

  // ── Login form model ──────────────────────────────────────────────────────
  loginEmail: string = '';
  loginPassword: string = '';

  // ── Register form model ───────────────────────────────────────────────────
  signupFirstName: string = '';
  signupLastName: string = '';
  signupEmail: string = '';
  signupPhone: string = '';
  signupPassword: string = '';
  signupConfirmPassword: string = '';

  // ── UI state ──────────────────────────────────────────────────────────────
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  goToSignup(): void {
    this.currentPage = 'signup';
    this.clearMessages();
  }

  goToLogin(): void {
    this.currentPage = 'login';
    this.clearMessages();
  }

  onLogin(): void {
    this.clearMessages();

    if (!this.loginEmail || !this.loginPassword) {
      this.errorMessage = 'Please enter your email and password.';
      return;
    }

    this.isLoading = true;
    const credentials: LoginRequest = {
      email: this.loginEmail,
      password: this.loginPassword
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        const route = this.authService.getDashboardRouteForRole(response.role);
        this.router.navigate([route]);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message ?? 'Invalid email or password. Please try again.';
      }
    });
  }

  onSignup(): void {
    this.clearMessages();

    if (!this.signupFirstName || !this.signupLastName || !this.signupEmail ||
        !this.signupPhone || !this.signupPassword || !this.signupConfirmPassword) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    if (this.signupPassword !== this.signupConfirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (this.signupPassword.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    this.isLoading = true;
    const userData: RegisterRequest = {
      firstName: this.signupFirstName,
      lastName: this.signupLastName,
      email: this.signupEmail,
      phoneNumber: this.signupPhone,
      password: this.signupPassword
    };

    this.authService.register(userData).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Account created successfully! Please log in.';
        this.resetSignupForm();
        setTimeout(() => this.goToLogin(), 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message ?? 'Registration failed. Please try again.';
      }
    });
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private resetSignupForm(): void {
    this.signupFirstName = '';
    this.signupLastName = '';
    this.signupEmail = '';
    this.signupPhone = '';
    this.signupPassword = '';
    this.signupConfirmPassword = '';
  }
}
