import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

/**
 * Receptionist Dashboard Component
 *
 * This is the main receptionist dashboard that serves as the central hub after login.
 * It provides access to receptionist-specific features for daily operations.
 *
 * Features Available:
 * - Manage Members: View and manage member information
 * - Manage Subscriptions: Handle subscription plans
 * - Search/Filter Data: Search across members and other data
 * - Record Attendance: Track member attendance
 * - Manage Payments: Handle payment records
 * - Logout: Exit the receptionist session
 */

@Component({
  selector: 'app-receptionist-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './receptionist-dashboard.html',
  styleUrl: './receptionist-dashboard.css',
})
export class ReceptionistDashboard {
  /**
   * Track which feature/page is currently active
   */
  activeFeature: string = 'home';

  /**
   * Store the receptionist username for display in top bar
   */
  receptionistName: string = 'Receptionist';

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
      members: 'Manage Members',
      subscriptions: 'Manage Subscriptions',
      search: 'Search & Filter Data',
      attendance: 'Record Attendance',
      payments: 'Manage Payments',
    };
    return titles[this.activeFeature] || 'Dashboard';
  }
}
