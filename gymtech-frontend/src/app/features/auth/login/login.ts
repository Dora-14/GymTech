import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
 * 
 * Structure:
 * - Uses Angular's standalone component feature (no module needed)
 * - Uses CommonModule for *ngIf directive (showing/hiding the modal)
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
  imports: [CommonModule],  // CommonModule provides *ngIf, *ngFor, and other directives
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  /**
   * Modal State Flag
   * 
   * Controls whether the sign-up modal is visible or hidden.
   * - true: Modal is open and visible
   * - false: Modal is closed and hidden
   * 
   * This is used in the template with *ngIf to show/hide the modal overlay and modal box
   */
  isSignupModalOpen: boolean = false;

  /**
   * openSignupModal() method
   * 
   * Called when the user clicks "Sign up here" button
   * 
   * Purpose:
   * - Opens the sign-up modal by setting the flag to true
   * - The *ngIf in the template will detect this change and display the modal
   * 
   * Future enhancement:
   * - Reset form fields when opening modal
   * - Prevent body scroll when modal is open
   */
  openSignupModal(): void {
    console.log('Opening sign-up modal');
    this.isSignupModalOpen = true;
  }

  /**
   * closeSignupModal() method
   * 
   * Called when:
   * - User clicks the X button in the modal header
   * - User clicks the dark overlay behind the modal
   * 
   * Purpose:
   * - Closes the sign-up modal by setting the flag to false
   * - The *ngIf in the template will detect this change and hide the modal
   * 
   * Future enhancement:
   * - Show confirmation if user has entered data (prevent accidental loss)
   * - Reset form fields
   */
  closeSignupModal(): void {
    console.log('Closing sign-up modal');
    this.isSignupModalOpen = false;
  }

  /**
   * onLogin() method
   * 
   * This is called when the user clicks the "Log In" button on the login form.
   * Currently, it's a placeholder that will be expanded with:
   * - Form validation
   * - API call to authenticate user
   * - Error handling
   * - Navigation to dashboard on success
   * 
   * Future implementation:
   * - Inject AuthService and call login(username, password)
   * - Handle success: navigate to dashboard
   * - Handle error: display error message in the form
   */
  onLogin(): void {
    console.log('Login button clicked');
    // TODO: Add authentication logic here
    // This will integrate with an AuthService once we create it
  }

  /**
   * onSignup() method
   * 
   * This is called when the user clicks the "Create Account" button in the modal.
   * Currently, it's a placeholder that will be expanded with:
   * - Form validation (all fields required, email format, password matching, etc.)
   * - API call to create a new user account
   * - Error handling
   * - Success message and redirect to login
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
   * - Handle success: close modal, show success message, redirect to login
   * - Handle error: display error message in the modal
   */
  onSignup(): void {
    console.log('Sign-up button clicked');
    // TODO: Add sign-up logic here
    // This will integrate with an AuthService once we create it
    // For now, just close the modal and log the action
    this.closeSignupModal();
  }
}
