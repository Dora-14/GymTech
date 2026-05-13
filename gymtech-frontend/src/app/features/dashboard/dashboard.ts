import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

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
export class Dashboard implements OnInit {
  activeFeature: string = 'home';
  adminName: string = 'Admin';

  stats = { totalMembers: 142, activeTrainers: 8, monthlyRevenue: 12540 };

  members = [
    { id: 1, name: 'Alice Johnson',  email: 'alice@email.com',  phone: '0721 000 001', subscription: 'Premium',  status: 'Active'  },
    { id: 2, name: 'Bob Smith',      email: 'bob@email.com',    phone: '0721 000 002', subscription: 'Basic',    status: 'Active'  },
    { id: 3, name: 'Carol White',    email: 'carol@email.com',  phone: '0721 000 003', subscription: 'Premium',  status: 'Expired' },
    { id: 4, name: 'David Brown',    email: 'david@email.com',  phone: '0721 000 004', subscription: 'Standard', status: 'Active'  },
    { id: 5, name: 'Eva Green',      email: 'eva@email.com',    phone: '0721 000 005', subscription: 'Basic',    status: 'Active'  },
  ];

  trainers = [
    { id: 1, name: 'Marcus Lee',   email: 'marcus@gymtech.com', specialization: 'Strength Training', assignedMembers: 12 },
    { id: 2, name: 'Sarah Connor', email: 'sarah@gymtech.com',  specialization: 'Cardio & HIIT',      assignedMembers:  9 },
    { id: 3, name: 'James Miller', email: 'james@gymtech.com',  specialization: 'Yoga & Flexibility', assignedMembers:  7 },
    { id: 4, name: 'Nina Torres',  email: 'nina@gymtech.com',   specialization: 'CrossFit',           assignedMembers: 11 },
  ];

  subscriptions = [
    { id: 1, name: 'Basic',    duration: '1 Month',   price:  29.99, features: 'Gym Access, Locker' },
    { id: 2, name: 'Standard', duration: '3 Months',  price:  79.99, features: 'Gym + Classes, Locker, Towel' },
    { id: 3, name: 'Premium',  duration: '6 Months',  price: 139.99, features: 'Full Access, Personal Trainer, Nutrition Plan' },
    { id: 4, name: 'Annual',   duration: '12 Months', price: 249.99, features: 'Full Access, PT, Nutrition, Spa' },
  ];

  payments = [
    { id: 1, member: 'Alice Johnson', amount: 139.99, date: '2026-05-10', plan: 'Premium',  status: 'Paid'    },
    { id: 2, member: 'Bob Smith',     amount:  29.99, date: '2026-05-09', plan: 'Basic',    status: 'Paid'    },
    { id: 3, member: 'David Brown',   amount:  79.99, date: '2026-05-08', plan: 'Standard', status: 'Paid'    },
    { id: 4, member: 'Eva Green',     amount:  29.99, date: '2026-05-07', plan: 'Basic',    status: 'Pending' },
    { id: 5, member: 'Carol White',   amount: 139.99, date: '2026-04-15', plan: 'Premium',  status: 'Overdue' },
  ];

  attendance = [
    { id: 1, member: 'Alice Johnson', date: '2026-05-12', checkIn: '08:30', checkOut: '10:15', trainer: 'Marcus Lee'   },
    { id: 2, member: 'Bob Smith',     date: '2026-05-12', checkIn: '09:00', checkOut: '10:45', trainer: '—'            },
    { id: 3, member: 'David Brown',   date: '2026-05-12', checkIn: '07:45', checkOut: '09:30', trainer: 'Sarah Connor' },
    { id: 4, member: 'Eva Green',     date: '2026-05-12', checkIn: '11:00', checkOut: '12:30', trainer: '—'            },
    { id: 5, member: 'Carol White',   date: '2026-05-11', checkIn: '16:00', checkOut: '17:45', trainer: 'Nina Torres'  },
  ];

  users = [
    { id: 1, name: 'Admin User',      email: 'admin@gymtech.com',     role: 'Admin',        status: 'Active'   },
    { id: 2, name: 'Reception Front', email: 'reception@gymtech.com', role: 'Receptionist', status: 'Active'   },
    { id: 3, name: 'Marcus Lee',      email: 'marcus@gymtech.com',    role: 'Trainer',      status: 'Active'   },
    { id: 4, name: 'Alice Johnson',   email: 'alice@email.com',       role: 'Member',       status: 'Active'   },
    { id: 5, name: 'Carol White',     email: 'carol@email.com',       role: 'Member',       status: 'Inactive' },
  ];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const name = this.authService.getFirstName();
    if (name) this.adminName = name;
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
      home: 'Dashboard',
      reports: 'Generate Reports',
      search: 'Search & Filter Data',
      attendance: 'Record Attendance',
      trainers: 'Manage Trainers',
      payments: 'Manage Payments',
      subscriptions: 'Manage Subscriptions',
      members: 'Manage Members',
      'users-roles': 'Manage Users & Roles',
    };
    return titles[this.activeFeature] || 'Dashboard';
  }
}
