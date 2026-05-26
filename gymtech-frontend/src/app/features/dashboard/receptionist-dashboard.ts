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
import { Member, CreateMemberRequest } from '../../models/member.model';
import { CreateSubscriptionRequest, Subscription, SubscriptionPlan } from '../../models/subscription.model';
import { Trainer } from '../../models/trainer.model';

interface PersonEntry {
  id: number; role: string; fullName: string;
  detail: string; phone: string; subStatus: string;
}

@Component({
  selector: 'app-receptionist-dashboard',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './receptionist-dashboard.html',
  styleUrl: './receptionist-dashboard.css',
})
export class ReceptionistDashboard implements OnInit {
  activeFeature = 'home';
  isDarkMode = false;
  receptionistName = '';

  memberSearchQuery = '';
  searchResults: Member[] = [];
  memberError = '';
  memberSuccess = '';

  checkInMemberId = '';
  checkInError = '';
  checkInSuccess = '';

  subMemberId = '';
  plans: SubscriptionPlan[] = [];
  selectedPlan: SubscriptionPlan | null = null;
  selectedTrainerId = 0;
  subForm: CreateSubscriptionRequest = { type: '', price: 0, durationDays: 0, startDate: '', memberId: 0 };
  subError = '';
  subSuccess = '';

  payMemberId = '';
  paymentForm = { amount: 0, method: '', memberId: 0 };
  paymentError = '';
  paymentSuccess = '';

  // Search & Filter
  allMembers: Member[] = [];
  allTrainers: Trainer[] = [];
  allSubscriptions: Subscription[] = [];
  filterRole = 'all';
  filterSub = 'all';
  filterText = '';

  // Edit member
  editingMember: Member | null = null;
  editForm: CreateMemberRequest = { fullName: '', email: '', phone: '', dateOfBirth: '' };
  editError = '';
  editSuccess = '';

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
    this.receptionistName = this.authService.getUsername();
    this.loadPlans();
    this.trainerService.getAll().subscribe({ next: t => { this.allTrainers = t; this.cdr.detectChanges(); } });
  }

  navigateTo(feature: string): void {
    this.activeFeature = feature;
    this.clearMessages();
    if (feature === 'search' && this.allMembers.length === 0) this.loadSearchData();
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
      home: 'Dashboard Home', members: 'Member Search',
      subscriptions: 'Create Subscription', attendance: 'Record Attendance', payments: 'Record Payment',
    };
    return titles[this.activeFeature] || 'Dashboard';
  }

  clearMessages(): void {
    this.memberError = this.memberSuccess = '';
    this.checkInError = this.checkInSuccess = '';
    this.subError = this.subSuccess = '';
    this.paymentError = this.paymentSuccess = '';
    this.editError = this.editSuccess = '';
  }

  loadPlans(): void {
    this.subscriptionService.getPlans().subscribe({ next: p => { this.plans = p; this.cdr.detectChanges(); } });
  }

  selectPlan(plan: SubscriptionPlan): void {
    this.selectedPlan = plan;
    this.subForm.type = plan.name;
    this.subForm.price = plan.price;
    this.subForm.durationDays = plan.durationDays;
    this.cdr.detectChanges();
  }

  formatDuration(days: number): string {
    if (days <= 31) return '1 Month';
    if (days <= 92) return '3 Months';
    if (days <= 185) return '6 Months';
    return '12 Months';
  }

  searchMembers(): void {
    if (!this.memberSearchQuery.trim()) return;
    this.memberService.search(this.memberSearchQuery).subscribe({
      next: m => { this.searchResults = m; this.cdr.detectChanges(); },
      error: () => { this.memberError = 'Search failed.'; this.cdr.detectChanges(); }
    });
  }

  checkIn(): void {
    const id = parseInt(this.checkInMemberId);
    if (!id) { this.checkInError = 'Enter a valid member ID.'; this.cdr.detectChanges(); return; }
    this.attendanceService.checkIn(id).subscribe({
      next: () => { this.checkInSuccess = `Member #${id} checked in successfully.`; this.checkInMemberId = ''; this.cdr.detectChanges(); },
      error: err => { this.checkInError = err?.error?.message ?? 'Check-in failed.'; this.cdr.detectChanges(); }
    });
  }

  createSubscription(): void {
    const id = parseInt(this.subMemberId);
    if (!id) { this.subError = 'Enter a valid member ID.'; this.cdr.detectChanges(); return; }
    if (this.selectedPlan?.name === 'Trainer' && !this.selectedTrainerId) {
      this.subError = 'Please select a trainer for the Trainer plan.'; this.cdr.detectChanges(); return;
    }
    this.subForm.memberId = id;
    this.subscriptionService.create(this.subForm).subscribe({
      next: () => {
        if (this.selectedPlan?.name === 'Trainer' && this.selectedTrainerId) {
          this.trainerService.assign({ memberId: id, trainerId: this.selectedTrainerId }).subscribe();
        }
        this.subSuccess = `Subscription created for member #${id}.`;
        this.subForm = { type: '', price: 0, durationDays: 0, startDate: '', memberId: 0 };
        this.selectedTrainerId = 0;
        this.cdr.detectChanges();
      },
      error: err => { this.subError = err?.error?.message ?? 'Failed.'; this.cdr.detectChanges(); }
    });
  }

  recordPayment(): void {
    const id = parseInt(this.payMemberId);
    if (!id) { this.paymentError = 'Enter a valid member ID.'; this.cdr.detectChanges(); return; }
    this.paymentForm.memberId = id;
    this.paymentService.create(this.paymentForm).subscribe({
      next: () => { this.paymentSuccess = `Payment of ${this.paymentForm.amount} RON recorded for member #${id}.`; this.paymentForm = { amount: 0, method: '', memberId: 0 }; this.cdr.detectChanges(); },
      error: err => { this.paymentError = err?.error?.message ?? 'Failed.'; this.cdr.detectChanges(); }
    });
  }

  loadSearchData(): void {
    this.memberService.getAll().subscribe({ next: m => { this.allMembers = m; this.cdr.detectChanges(); } });
    this.trainerService.getAll().subscribe({ next: t => { this.allTrainers = t; this.cdr.detectChanges(); } });
    this.subscriptionService.getAll().subscribe({ next: s => { this.allSubscriptions = s; this.cdr.detectChanges(); } });
  }

  get filteredPeople(): PersonEntry[] {
    const q = this.filterText.toLowerCase();
    const result: PersonEntry[] = [];
    if (this.filterRole !== 'trainer') {
      for (const m of this.allMembers) {
        if (q && !m.fullName.toLowerCase().includes(q) && !m.email.toLowerCase().includes(q)) continue;
        const subs = this.allSubscriptions.filter(s => s.memberId === m.memberId);
        const active = subs.find(s => s.isActive);
        const subStatus = subs.length === 0 ? 'None' : active ? 'Active' : 'Expired';
        if (this.filterSub !== 'all' && this.filterSub !== subStatus.toLowerCase()) continue;
        result.push({ id: m.memberId, role: 'Member', fullName: m.fullName, detail: m.email, phone: m.phone, subStatus });
      }
    }
    if (this.filterRole !== 'member') {
      for (const t of this.allTrainers) {
        if (q && !t.fullName.toLowerCase().includes(q)) continue;
        result.push({ id: t.trainerId, role: 'Trainer', fullName: t.fullName, detail: t.speciality, phone: t.phone, subStatus: '—' });
      }
    }
    return result;
  }

  startEdit(member: Member): void {
    this.editingMember = member;
    this.editForm = { fullName: member.fullName, email: member.email, phone: member.phone, dateOfBirth: member.dateOfBirth };
    this.editError = '';
    this.editSuccess = '';
    this.cdr.detectChanges();
  }

  cancelEdit(): void {
    this.editingMember = null;
    this.cdr.detectChanges();
  }

  saveEdit(): void {
    if (!this.editingMember) return;
    this.memberService.update(this.editingMember.memberId, this.editForm).subscribe({
      next: updated => {
        const idx = this.searchResults.findIndex(m => m.memberId === updated.memberId);
        if (idx >= 0) this.searchResults[idx] = updated;
        this.editingMember = null;
        this.memberSuccess = 'Member updated successfully.';
        this.cdr.detectChanges();
      },
      error: err => { this.editError = err?.error?.message ?? 'Update failed.'; this.cdr.detectChanges(); }
    });
  }

  onFilterChange(): void { this.cdr.detectChanges(); }
}
