import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

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
export class ReceptionistDashboard implements OnInit {
  activeFeature: string = 'home';
  receptionistName: string = 'Receptionist';

  stats = { totalMembers: 142, todayAttendance: 37, pendingPayments: 5 };

  members = [
    { id: 1, name: 'Alice Johnson', email: 'alice@email.com', phone: '0721 000 001', subscription: 'Premium',  status: 'Active'  },
    { id: 2, name: 'Bob Smith',     email: 'bob@email.com',   phone: '0721 000 002', subscription: 'Basic',    status: 'Active'  },
    { id: 3, name: 'Carol White',   email: 'carol@email.com', phone: '0721 000 003', subscription: 'Premium',  status: 'Expired' },
    { id: 4, name: 'David Brown',   email: 'david@email.com', phone: '0721 000 004', subscription: 'Standard', status: 'Active'  },
    { id: 5, name: 'Eva Green',     email: 'eva@email.com',   phone: '0721 000 005', subscription: 'Basic',    status: 'Active'  },
  ];

  subscriptions = [
    { id: 1, name: 'Basic',    duration: '1 Month',   price:  29.99, features: 'Gym Access, Locker' },
    { id: 2, name: 'Standard', duration: '3 Months',  price:  79.99, features: 'Gym + Classes, Locker, Towel' },
    { id: 3, name: 'Premium',  duration: '6 Months',  price: 139.99, features: 'Full Access, Personal Trainer, Nutrition Plan' },
    { id: 4, name: 'Annual',   duration: '12 Months', price: 249.99, features: 'Full Access, PT, Nutrition, Spa' },
  ];

  attendance = [
    { id: 1, member: 'Alice Johnson', checkIn: '08:30', checkOut: '10:15' },
    { id: 2, member: 'Bob Smith',     checkIn: '09:00', checkOut: '10:45' },
    { id: 3, member: 'David Brown',   checkIn: '07:45', checkOut: '09:30' },
    { id: 4, member: 'Eva Green',     checkIn: '11:00', checkOut: '12:30' },
    { id: 5, member: 'Carlos Rivera', checkIn: '13:00', checkOut: '14:30' },
  ];

  payments = [
    { id: 1, member: 'Alice Johnson', amount: 139.99, date: '2026-05-10', plan: 'Premium',  status: 'Paid'    },
    { id: 2, member: 'Bob Smith',     amount:  29.99, date: '2026-05-09', plan: 'Basic',    status: 'Paid'    },
    { id: 3, member: 'David Brown',   amount:  79.99, date: '2026-05-08', plan: 'Standard', status: 'Paid'    },
    { id: 4, member: 'Eva Green',     amount:  29.99, date: '2026-05-07', plan: 'Basic',    status: 'Pending' },
    { id: 5, member: 'Carol White',   amount: 139.99, date: '2026-04-15', plan: 'Premium',  status: 'Overdue' },
  ];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const name = this.authService.getFirstName();
    if (name) this.receptionistName = name;
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
      members: 'Manage Members',
      subscriptions: 'Manage Subscriptions',
      search: 'Search & Filter Data',
      attendance: 'Record Attendance',
      payments: 'Manage Payments',
    };
    return titles[this.activeFeature] || 'Dashboard';
  }
}
