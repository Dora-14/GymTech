import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

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
export class MemberDashboard implements OnInit {
  activeFeature: string = 'home';
  memberName: string = 'Member';
  isDarkMode = localStorage.getItem('theme') !== 'light';

toggleTheme() {
  this.isDarkMode = !this.isDarkMode;
  document.body.classList.toggle('light-theme', !this.isDarkMode);
  localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
}

  profile = {
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice@email.com',
    phone: '0721 000 001',
    joinDate: '2025-01-15',
    trainer: 'Marcus Lee',
  };

  subscription = {
    plan: 'Premium',
    startDate: '2026-05-01',
    endDate: '2026-11-01',
    daysRemaining: 173,
    status: 'Active',
    price: 139.99,
    features: ['Full Gym Access', 'Personal Trainer', 'Nutrition Plan', 'Spa & Sauna'],
  };

  paymentHistory = [
    { id: 1, date: '2026-05-01', plan: 'Premium (6 Months)',  amount: 139.99, status: 'Paid' },
    { id: 2, date: '2025-11-01', plan: 'Premium (6 Months)',  amount: 139.99, status: 'Paid' },
    { id: 3, date: '2025-08-01', plan: 'Standard (3 Months)', amount:  79.99, status: 'Paid' },
    { id: 4, date: '2025-05-01', plan: 'Basic (1 Month)',     amount:  29.99, status: 'Paid' },
  ];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const name = this.authService.getFirstName();
    if (name) {
      this.memberName = name;
      this.profile.firstName = name;
    }
  }

  navigateTo(feature: string): void {
    this.activeFeature = feature;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getPageTitle(): string {
    const titles: { [key: string]: string } = {
      home: 'Dashboard Home',
      profile: 'My Profile',
      payments: 'Payment History',
      subscription: 'Subscription Status',
    };
    return titles[this.activeFeature] || 'Dashboard';
  }
}
