import { Component } from '@angular/core';

/**
 * Login Component
 * 
 * This component handles the admin login page for the GymTech application.
 * 
 * Structure:
 * - Uses Angular's standalone component feature (no module needed)
 * - Loads the HTML template from login.html
 * - Loads the CSS styles from login.css
 * 
 * Future enhancements:
 * - Form validation and error messages
 * - Integration with authentication service
 * - Remember me functionality
 * - Password reset link
 */

@Component({
  selector: 'app-login',
  imports: [],  // Will add FormsModule later when we add form validation
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  /**
   * onLogin() method
   * 
   * This is called when the user clicks the "Log In" button.
   * Currently, it's a placeholder that will be expanded with:
   * - Form validation
   * - API call to authenticate user
   * - Error handling
   * - Navigation to dashboard on success
   */
  onLogin() {
    console.log('Login button clicked');
    // TODO: Add authentication logic here
    // This will integrate with an AuthService once we create it
  }
}
