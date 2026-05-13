import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

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
export class TrainerDashboard implements OnInit {
  activeFeature: string = 'home';
  trainerName: string = 'Trainer';

  stats = { assignedMembers: 12, sessionsToday: 4, upcomingSessions: 7 };

  assignedMembers = [
    { id: 1, name: 'Alice Johnson', email: 'alice@email.com', goal: 'Weight Loss',  sessionsThisMonth:  8 },
    { id: 2, name: 'Bob Smith',     email: 'bob@email.com',   goal: 'Muscle Gain',  sessionsThisMonth: 10 },
    { id: 3, name: 'David Brown',   email: 'david@email.com', goal: 'Endurance',    sessionsThisMonth:  6 },
    { id: 4, name: 'Eva Green',     email: 'eva@email.com',   goal: 'Flexibility',  sessionsThisMonth:  5 },
    { id: 5, name: 'Carlos Rivera', email: 'carlos@email.com',goal: 'Strength',     sessionsThisMonth:  9 },
  ];

  sessions = [
    { id: 1, member: 'Alice Johnson', date: '2026-05-12', time: '08:30', duration: '60 min', status: 'Completed'   },
    { id: 2, member: 'Bob Smith',     date: '2026-05-12', time: '10:00', duration: '45 min', status: 'Completed'   },
    { id: 3, member: 'David Brown',   date: '2026-05-12', time: '13:00', duration: '60 min', status: 'In Progress' },
    { id: 4, member: 'Eva Green',     date: '2026-05-12', time: '15:00', duration: '45 min', status: 'Scheduled'   },
    { id: 5, member: 'Carlos Rivera', date: '2026-05-13', time: '09:00', duration: '60 min', status: 'Scheduled'   },
  ];

  schedule = [
    { day: 'Monday',    time: '08:00 – 09:00', member: 'Alice Johnson', type: 'Strength Training' },
    { day: 'Monday',    time: '10:00 – 10:45', member: 'Bob Smith',     type: 'HIIT'              },
    { day: 'Tuesday',   time: '09:00 – 10:00', member: 'Carlos Rivera', type: 'Strength Training' },
    { day: 'Wednesday', time: '08:30 – 09:30', member: 'Alice Johnson', type: 'Cardio'            },
    { day: 'Wednesday', time: '14:00 – 15:00', member: 'David Brown',   type: 'Endurance'         },
    { day: 'Thursday',  time: '10:00 – 10:45', member: 'Eva Green',     type: 'Flexibility'       },
    { day: 'Friday',    time: '08:00 – 09:00', member: 'Bob Smith',     type: 'Strength Training' },
  ];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const name = this.authService.getFirstName();
    if (name) this.trainerName = name;
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
      members: 'Assigned Members',
      attendance: 'Session Attendance',
      schedule: 'Weekly Schedule',
    };
    return titles[this.activeFeature] || 'Dashboard';
  }
}
