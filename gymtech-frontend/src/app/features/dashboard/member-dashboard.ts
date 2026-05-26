import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MemberService } from '../../services/member.service';
import { SubscriptionService } from '../../services/subscription.service';
import { PaymentService } from '../../services/payment.service';
import { AttendanceService } from '../../services/attendance.service';
import { TrainerService } from '../../services/trainer.service';
import { Member } from '../../models/member.model';
import { Subscription, SubscriptionPlan } from '../../models/subscription.model';
import { Payment } from '../../models/payment.model';
import { Attendance } from '../../models/attendance.model';
import { Trainer } from '../../models/trainer.model';

@Component({
  selector: 'app-member-dashboard',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './member-dashboard.html',
  styleUrl: './member-dashboard.css',
})
export class MemberDashboard implements OnInit {
  activeFeature = 'home';
  memberName = '';
  memberId = 0;

  profile: Member | null = null;
  subscriptions: Subscription[] = [];
  activeSubscription: Subscription | null = null;
  activeTrainerSubscription: Subscription | null = null;
  plans: SubscriptionPlan[] = [];
  payments: Payment[] = [];
  attendance: Attendance[] = [];

  loadError = '';
  subscribeError = '';
  subscribeSuccess = '';
  checkInError = '';
  checkInSuccess = '';

  // Trainer plan picker
  trainers: Trainer[] = [];
  pendingPlan: SubscriptionPlan | null = null;
  selectedTrainerId = 0;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private memberService: MemberService,
    private subscriptionService: SubscriptionService,
    private paymentService: PaymentService,
    private attendanceService: AttendanceService,
    private trainerService: TrainerService
  ) {}

  ngOnInit(): void {
    this.memberName = this.authService.getUsername();
    this.memberId = this.authService.getMemberId();
    this.loadPlans();
    if (this.memberId) {
      this.loadProfile();
      this.loadSubscriptions();
    }
  }

  navigateTo(feature: string): void {
    this.activeFeature = feature;
    if (feature === 'payments' && this.payments.length === 0) this.loadPayments();
    if (feature === 'attendance') this.loadAttendance();
    this.cdr.detectChanges();
  }

  logout(): void {
    this.authService.logout();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getPageTitle(): string {
    const titles: { [key: string]: string } = {
      home: 'Dashboard Home', profile: 'My Profile',
      subscription: 'Subscription Status', payments: 'Payment History', attendance: 'Attendance History',
    };
    return titles[this.activeFeature] || 'Dashboard';
  }

  loadPlans(): void {
    this.subscriptionService.getPlans().subscribe({ next: p => { this.plans = p; this.cdr.detectChanges(); } });
  }

  subscribeToPlan(plan: SubscriptionPlan): void {
    if (!this.memberId) { this.subscribeError = 'No member account linked.'; this.cdr.detectChanges(); return; }
    const isTrainer = plan.name === 'Trainer';
    const blocking = isTrainer ? this.activeTrainerSubscription : this.activeSubscription;
    if (blocking) { this.subscribeError = `You already have an active ${blocking.type} subscription.`; this.cdr.detectChanges(); return; }
    if (plan.name === 'Trainer') {
      this.pendingPlan = plan;
      this.selectedTrainerId = 0;
      this.subscribeError = '';
      if (this.trainers.length === 0) this.trainerService.getAll().subscribe({ next: t => { this.trainers = t; this.cdr.detectChanges(); } });
      this.cdr.detectChanges();
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    this.subscriptionService.create({ type: plan.name, price: plan.price, durationDays: plan.durationDays, startDate: today, memberId: this.memberId }).subscribe({
      next: () => { this.subscribeSuccess = `Successfully subscribed to ${plan.name}!`; this.subscribeError = ''; this.loadSubscriptions(); this.cdr.detectChanges(); },
      error: err => { this.subscribeError = err?.error?.message ?? 'Subscription failed.'; this.subscribeSuccess = ''; this.cdr.detectChanges(); }
    });
  }

  confirmTrainerSubscription(): void {
    if (!this.pendingPlan || !this.selectedTrainerId) return;
    const today = new Date().toISOString().split('T')[0];
    this.subscriptionService.create({ type: this.pendingPlan.name, price: this.pendingPlan.price, durationDays: this.pendingPlan.durationDays, startDate: today, memberId: this.memberId }).subscribe({
      next: () => {
        this.trainerService.assign({ memberId: this.memberId, trainerId: this.selectedTrainerId }).subscribe();
        this.subscribeSuccess = 'Successfully subscribed to Trainer plan!';
        this.subscribeError = '';
        this.pendingPlan = null;
        this.selectedTrainerId = 0;
        this.loadSubscriptions();
        this.cdr.detectChanges();
      },
      error: err => { this.subscribeError = err?.error?.message ?? 'Subscription failed.'; this.subscribeSuccess = ''; this.cdr.detectChanges(); }
    });
  }

  cancelTrainerPicker(): void {
    this.pendingPlan = null;
    this.selectedTrainerId = 0;
    this.subscribeError = '';
    this.cdr.detectChanges();
  }

  formatDuration(days: number): string {
    if (days <= 31) return '1 Month';
    if (days <= 92) return '3 Months';
    if (days <= 185) return '6 Months';
    return '12 Months';
  }

  loadProfile(): void {
    this.memberService.getById(this.memberId).subscribe({
      next: m => { this.profile = m; this.cdr.detectChanges(); },
      error: () => { this.loadError = 'Could not load profile.'; this.cdr.detectChanges(); }
    });
  }

  loadSubscriptions(): void {
    this.subscriptionService.getByMember(this.memberId).subscribe({
      next: s => {
        this.subscriptions = s;
        this.activeSubscription = s.find(x => x.isActive && x.type !== 'Trainer') ?? null;
        this.activeTrainerSubscription = s.find(x => x.isActive && x.type === 'Trainer') ?? null;
        this.cdr.detectChanges();
      }
    });
  }

  loadPayments(): void {
    this.paymentService.getByMember(this.memberId).subscribe({
      next: p => { this.payments = p; this.cdr.detectChanges(); }
    });
  }

  loadAttendance(): void {
    this.attendanceService.getByMember(this.memberId).subscribe({
      next: a => { this.attendance = a; this.cdr.detectChanges(); }
    });
  }

  checkInToday(): void {
    this.checkInError = '';
    this.checkInSuccess = '';
    this.attendanceService.checkIn(this.memberId).subscribe({
      next: () => {
        this.checkInSuccess = 'Checked in successfully!';
        this.loadAttendance();
        this.cdr.detectChanges();
      },
      error: err => {
        this.checkInError = err?.error?.message ?? 'Already checked in today or check-in failed.';
        this.cdr.detectChanges();
      }
    });
  }

  daysRemaining(): number {
    if (!this.activeSubscription) return 0;
    const end = new Date(this.activeSubscription.endDate);
    const today = new Date();
    return Math.max(0, Math.ceil((end.getTime() - today.getTime()) / 86400000));
  }

  daysRemainingTrainer(): number {
    if (!this.activeTrainerSubscription) return 0;
    const end = new Date(this.activeTrainerSubscription.endDate);
    const today = new Date();
    return Math.max(0, Math.ceil((end.getTime() - today.getTime()) / 86400000));
  }

  visitsThisMonth(): number {
    const now = new Date();
    return this.attendance.filter(a => {
      const d = new Date(a.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  }
}
