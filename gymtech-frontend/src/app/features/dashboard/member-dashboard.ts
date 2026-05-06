import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

/**
 * Member Dashboard Component
 *
 * This is the main member dashboard that serves as the central hub after login.
 * It provides access to member-specific features and account management.
 *
 * Features Available:
 * - View Profile: View and manage personal profile information
 * - View Payment History: Check past payment records and transactions
 * - View Subscription Status: Check current subscription plan and status
 * - Logout: Exit the member session
 */

@Component({
  selector: 'app-member-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './member-dashboard.html',
  styleUrl: './member-dashboard.css',
})
export class MemberDashboard {
  /**
   * Track which feature/page is currently active
   */
  activeFeature: string = 'home';

  /**
   * Store the member username for display in top bar
   */
  memberName: string = 'Member';

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
      profile: 'View Profile',
      payments: 'Payment History',
      subscription: 'Subscription Status',
    };
    return titles[this.activeFeature] || 'Dashboard';
  }
}
