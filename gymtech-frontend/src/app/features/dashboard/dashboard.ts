import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

/**
 * Dashboard Component
 *
 * This is the main admin dashboard that serves as the central hub after login.
 * It provides navigation to all admin features and displays the main content area.
 *
 * Features Available:
 * - Generate Reports: View and download gym reports
 * - Search/Filter Data: Search across members, trainers, etc.
 * - Record Attendance: Track member attendance
 * - Manage Trainers: Add, edit, delete trainers
 * - Manage Payments: Handle payment records
 * - Manage Subscriptions: Manage subscription plans
 * - Manage Members: Add, edit, delete members
 * - Logout: Exit the admin session
 */

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  /**
   * Track which feature/page is currently active
   */
  activeFeature: string = 'home';

  /**
   * Store the admin username for display in top bar
   */
  adminName: string = 'Admin';

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
    console.log('Admin logged out');
    this.router.navigate(['/login']);
  }

  /**
   * Get the current page title based on active feature
   */
  getPageTitle(): string {
    const titles: { [key: string]: string } = {
      home: 'Dashboard',
      reports: 'Generate Reports',
      search: 'Search & Filter Data',
      attendance: 'Record Attendance',
      trainers: 'Manage Trainers',
      payments: 'Manage Payments',
      subscriptions: 'Manage Subscriptions',
      members: 'Manage Members',
    };
    return titles[this.activeFeature] || 'Dashboard';
  }
}
