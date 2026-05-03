import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

/**
 * Trainer Dashboard Component
 *
 * This is the main trainer dashboard that serves as the central hub after login.
 * It provides access to trainer-specific features and member management.
 *
 * Features Available:
 * - View Assigned Members: See members assigned to this trainer
 * - Record Attendance: Track member attendance in sessions
 * - View Schedule: Check training schedule and sessions
 * - Logout: Exit the trainer session
 */

@Component({
  selector: 'app-trainer-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './trainer-dashboard.html',
  styleUrl: './trainer-dashboard.css',
})
export class TrainerDashboard {
  /**
   * Track which feature/page is currently active
   */
  activeFeature: string = 'home';

  /**
   * Store the trainer username for display in top bar
   */
  trainerName: string = 'Trainer';

  constructor(private router: Router) {}

  /**
   * Navigate to a specific feature/page
   */
  navigateTo(feature: string): void {
    this.activeFeature = feature;
    console.log(`Navigating to: ${feature}`);
  }

  /**
   * Logout function - redirects to login page
   */
  logout(): void {
    console.log('Logging out...');
    this.router.navigate(['/login']);
  }

  /**
   * Get the page title based on active feature
   */
  getPageTitle(): string {
    const titles: { [key: string]: string } = {
      home: 'Dashboard Home',
      members: 'View Assigned Members',
      attendance: 'Record Attendance',
      schedule: 'View Schedule',
    };
    return titles[this.activeFeature] || 'Dashboard';
  }
}
