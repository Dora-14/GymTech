import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MemberService } from '../../services/member.service';
import { AttendanceService } from '../../services/attendance.service';
import { TrainerService } from '../../services/trainer.service';
import { Member } from '../../models/member.model';
import { Attendance } from '../../models/attendance.model';

@Component({
  selector: 'app-trainer-dashboard',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './trainer-dashboard.html',
  styleUrl: './trainer-dashboard.css',
})
export class TrainerDashboard implements OnInit {
  activeFeature = 'home';
  isDarkMode = false;
  trainerName = '';
  trainerId = 0;

  members: Member[] = [];
  memberSearchQuery = '';
  memberError = '';

  checkInMemberId = '';
  checkInError = '';
  checkInSuccess = '';

  attendanceMemberId = '';
  attendanceList: Attendance[] = [];
  schedule: { day: string; time: string; member: string; type: string }[] = [];

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private memberService: MemberService,
    private attendanceService: AttendanceService,
    private trainerService: TrainerService
  ) {}

  ngOnInit(): void {
    this.trainerId = this.authService.getTrainerId();
    if (this.trainerId) {
      this.trainerService.getById(this.trainerId).subscribe({
        next: t => { this.trainerName = t.fullName; this.cdr.detectChanges(); }
      });
    } else {
      this.trainerName = this.authService.getUsername();
    }
    this.loadMembers();
  }

  navigateTo(feature: string): void {
    this.activeFeature = feature;
    this.checkInError = this.checkInSuccess = '';
    this.cdr.detectChanges();
  }

  logout(): void {
    this.authService.logout();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
  }

  getPageTitle(): string {
    const titles: { [key: string]: string } = {
      home: 'Dashboard Home', members: 'Members', attendance: 'Record Attendance', schedule: 'Schedule',
    };
    return titles[this.activeFeature] || 'Dashboard';
  }

  loadMembers(): void {
    if (this.trainerId) {
      this.trainerService.getMembersByTrainer(this.trainerId).subscribe({ next: m => { this.members = m; this.cdr.detectChanges(); } });
    } else {
      this.memberService.getAll().subscribe({ next: m => { this.members = m; this.cdr.detectChanges(); } });
    }
  }

  searchMembers(): void {
    if (!this.memberSearchQuery.trim()) { this.loadMembers(); return; }
    this.memberService.search(this.memberSearchQuery).subscribe({
      next: m => { this.members = m; this.cdr.detectChanges(); },
      error: () => { this.memberError = 'Search failed.'; this.cdr.detectChanges(); }
    });
  }

  checkIn(): void {
    const id = parseInt(this.checkInMemberId);
    if (!id) { this.checkInError = 'Enter a valid member ID.'; this.cdr.detectChanges(); return; }
    this.attendanceService.checkIn(id).subscribe({
      next: () => { this.checkInSuccess = `Member #${id} checked in.`; this.checkInMemberId = ''; this.cdr.detectChanges(); },
      error: err => { this.checkInError = err?.error?.message ?? 'Check-in failed.'; this.cdr.detectChanges(); }
    });
  }

  loadAttendance(): void {
    const id = parseInt(this.attendanceMemberId);
    if (!id) return;
    this.attendanceService.getByMember(id).subscribe({ next: a => { this.attendanceList = a; this.cdr.detectChanges(); } });
  }
}
