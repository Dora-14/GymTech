import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

/**
 * Login Component
 * 
 * This component handles the admin login page for the GymTech application.
 * It includes both a login form and a sign-up modal for new users.
 * 
 * Key Features:
 * - Two-column login layout (welcome panel + login form)
 * - Sign-up modal with user role selection
 * - Modal state management (open/close)
 * - Navigation to dashboard after login
 * 
 * Structure:
 * - Uses Angular's standalone component feature (no module needed)
 * - Uses CommonModule for *ngIf directive (showing/hiding the modal)
 * - Uses FormsModule for form handling
 * - Uses Router for navigation to dashboard
 * - Loads the HTML template from login.html
 * - Loads the CSS styles from login.css
 * 
 * Future enhancements:
 * - Form validation and error messages
 * - Integration with authentication service
 * - Form binding with ReactiveFormsModule
 * - Password reset link
 * - Remember me functionality
 */

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],  // Added FormsModule for proper form handling
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  /**
   * Current Auth Page State
   * 
   * Controls which page/form is displayed.
   * - 'login': Shows the login form
   * - 'signup': Shows the sign-up form
   * 
   * This is used in the template with *ngIf to show/hide the appropriate form
   */
  currentPage: 'login' | 'signup' = 'login';

  /**
   * Constructor - Dependency Injection
   * Injects the Router service to enable navigation between pages
   */
  constructor(private router: Router) {}

  /**
   * goToSignup() method
   * 
   * Called when the user clicks "Sign up here" link on login form
   * 
   * Purpose:
   * - Switches the page to show the signup form
   * - The *ngIf in the template will detect this change and display the signup form
   */
  goToSignup(): void {
    console.log('Switching to sign-up page');
    this.currentPage = 'signup';
  }

  /**
   * goToLogin() method
   * 
   * Called when the user clicks the back button or after successful signup
   * 
   * Purpose:
   * - Switches the page back to show the login form
   * - The *ngIf in the template will detect this change and display the login form
   */
  goToLogin(): void {
    console.log('Switching back to login page');
    this.currentPage = 'login';
  }

  /**
   * onLogin() method
   * 
   * This is called when the user clicks the "Log In" button on the login form.
   * Navigates to the dashboard after login.
   * 
   * Future implementation:
   * - Form validation
   * - API call to authenticate user
   * - Error handling
   * - Store authentication token
   */
  onLogin(): void {
    console.log('Login successful - Navigating to dashboard');
    // TODO: Add form validation and authentication here
    this.router.navigate(['/dashboard']);
  }

  /**
   * onSignup() method
   * 
   * This is called when the user clicks the "Create Account" button on the signup form.
   * After account creation, it switches back to the login page.
   * 
   * Form fields to collect:
   * - First Name: user's first name for identification
   * - Last Name: user's last name for identification
   * - Email: for password recovery and notifications
   * - Phone Number: for contact and SMS notifications
   * - Password: encrypted and stored securely
   * - Confirm Password: ensures user typed password correctly
   * 
   * Future implementation:
   * - Inject AuthService and call signup(userData)
   * - Validate all fields before sending to API
   * - Validate that password and confirm password match
   * - Handle success: show success message, redirect to login
   * - Handle error: display error message in the form
   */
  onSignup(): void {
    console.log('Account created successfully - Returning to login');
    // TODO: Add sign-up logic here
    // This will integrate with an AuthService once we create it
    // After successful account creation, switch back to login page
    this.goToLogin();
  }
}
