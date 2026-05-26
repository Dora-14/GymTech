import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MemberService } from '../../services/member.service';
import { TrainerService } from '../../services/trainer.service';
import { SubscriptionService } from '../../services/subscription.service';
import { PaymentService } from '../../services/payment.service';
import { AttendanceService } from '../../services/attendance.service';
import { StatsService } from '../../services/stats.service';
import { UserService } from '../../services/user.service';
import { Stats } from '../../models/stats.model';
import { Member, CreateMemberRequest } from '../../models/member.model';
import { Trainer, CreateTrainerRequest, AssignTrainerRequest } from '../../models/trainer.model';
import { Subscription, CreateSubscriptionRequest } from '../../models/subscription.model';
import { Payment } from '../../models/payment.model';
import { Attendance } from '../../models/attendance.model';
import { UserAccount, CreateUserRequest } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  activeFeature = 'home';
  adminName = '';

  stats: Stats = { totalMembers: 0, totalTrainers: 0, activeSubscriptions: 0, totalRevenue: 0 };

  members: Member[] = [];
  memberForm: CreateMemberRequest = { fullName: '', email: '', phone: '', dateOfBirth: '' };
  editingMemberId: number | null = null;
  memberError = '';
  memberSuccess = '';

  trainers: Trainer[] = [];
  trainerForm: CreateTrainerRequest = { fullName: '', speciality: '', phone: '' };
  editingTrainerId: number | null = null;
  trainerError = '';
  trainerSuccess = '';
  assignForm: AssignTrainerRequest = { memberId: 0, trainerId: 0 };
  showAssignForm = false;

  subscriptionMemberId = '';
  subscriptions: Subscription[] = [];
  subForm: CreateSubscriptionRequest = { type: '', price: 0, durationDays: 0, startDate: '', memberId: 0 };
  subError = '';
  subSuccess = '';

  paymentMemberId = '';
  payments: Payment[] = [];
  paymentForm = { amount: 0, method: '', memberId: 0 };
  paymentError = '';
  paymentSuccess = '';

  attendanceMemberId = '';
  attendanceList: Attendance[] = [];

  users: UserAccount[] = [];
  userForm: CreateUserRequest = { username: '', passwordHash: '', email: '', role: 'Receptionist' };
  editingUserId: number | null = null;
  userError = '';
  userSuccess = '';

  // Search & Filter
  searchFilterText = '';
  searchFilterRole = 'all';
  searchFilterSub = 'all';
  allSearchMembers: Member[] = [];
  allSearchTrainers: Trainer[] = [];
  allSearchUsers: UserAccount[] = [];
  allSearchSubscriptions: Subscription[] = [];

  // Reports
  reportPayments: Payment[] = [];
  reportAttendances: Attendance[] = [];
  reportSubscriptions: Subscription[] = [];
  reportMembers: Member[] = [];
  reportLoaded = false;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private memberService: MemberService,
    private trainerService: TrainerService,
    private subscriptionService: SubscriptionService,
    private paymentService: PaymentService,
    private attendanceService: AttendanceService,
    private statsService: StatsService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.adminName = this.authService.getUsername();
    this.loadStats();
  }

  navigateTo(feature: string): void {
    this.activeFeature = feature;
    this.clearMessages();
    if (feature === 'members') this.loadMembers();
    if (feature === 'trainers') this.loadTrainers();
    if (feature === 'users-roles') this.loadUsers();
    if (feature === 'search') this.loadSearchData();
    if (feature === 'reports') this.loadReportData();
    this.cdr.detectChanges();
  }

  logout(): void {
    this.authService.logout();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getPageTitle(): string {
    const titles: { [key: string]: string } = {
      home: 'Dashboard', reports: 'Generate Reports', search: 'Search & Filter',
      attendance: 'Attendance Log', trainers: 'Manage Trainers', payments: 'Manage Payments',
      subscriptions: 'Manage Subscriptions', members: 'Manage Members', 'users-roles': 'Manage Users & Roles',
    };
    return titles[this.activeFeature] || 'Dashboard';
  }

  clearMessages(): void {
    this.memberError = this.memberSuccess = '';
    this.trainerError = this.trainerSuccess = '';
    this.subError = this.subSuccess = '';
    this.paymentError = this.paymentSuccess = '';
    this.userError = this.userSuccess = '';
  }

  loadStats(): void {
    this.statsService.get().subscribe({ next: s => { this.stats = s; this.cdr.detectChanges(); } });
  }

  loadSearchData(): void {
    this.memberService.getAll().subscribe({ next: m => { this.allSearchMembers = m; this.cdr.detectChanges(); } });
    this.trainerService.getAll().subscribe({ next: t => { this.allSearchTrainers = t; this.cdr.detectChanges(); } });
    this.userService.getAll().subscribe({ next: u => { this.allSearchUsers = u; this.cdr.detectChanges(); } });
    this.subscriptionService.getAll().subscribe({ next: s => { this.allSearchSubscriptions = s; this.cdr.detectChanges(); } });
  }

  loadReportData(): void {
    this.reportLoaded = false;
    let loaded = 0;
    const done = () => { if (++loaded === 4) { this.reportLoaded = true; this.cdr.detectChanges(); } };
    this.paymentService.getAll().subscribe({ next: p => { this.reportPayments = p; done(); }, error: () => done() });
    this.attendanceService.getAll().subscribe({ next: a => { this.reportAttendances = a; done(); }, error: () => done() });
    this.subscriptionService.getAll().subscribe({ next: s => { this.reportSubscriptions = s; done(); }, error: () => done() });
    this.memberService.getAll().subscribe({ next: m => { this.reportMembers = m; done(); }, error: () => done() });
  }

  get reportMonthName(): string {
    return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  private monthIncome(monthOffset: number): number {
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    return this.reportPayments
      .filter(p => { const d = new Date(p.date); return d.getMonth() === target.getMonth() && d.getFullYear() === target.getFullYear(); })
      .reduce((sum, p) => sum + p.amount, 0);
  }

  get thisMonthIncome(): number { return this.monthIncome(0); }
  get lastMonthIncome(): number { return this.monthIncome(-1); }

  private monthAttendance(monthOffset: number): number {
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    return this.reportAttendances
      .filter(a => { const d = new Date(a.date); return d.getMonth() === target.getMonth() && d.getFullYear() === target.getFullYear(); }).length;
  }

  get thisMonthAttendance(): number { return this.monthAttendance(0); }
  get lastMonthAttendance(): number { return this.monthAttendance(-1); }

  computeChange(current: number, previous: number): { pct: number; dir: 'up' | 'down' | 'flat' } {
    if (previous === 0) return { pct: current > 0 ? 100 : 0, dir: current > 0 ? 'up' : 'flat' };
    const pct = Math.round(((current - previous) / previous) * 100);
    return { pct: Math.abs(pct), dir: pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat' };
  }

  get incomeChange() { return this.computeChange(this.thisMonthIncome, this.lastMonthIncome); }
  get attendanceChange() { return this.computeChange(this.thisMonthAttendance, this.lastMonthAttendance); }

  get newSubsThisMonth(): { sub: Subscription; memberName: string }[] {
    const now = new Date();
    return this.reportSubscriptions
      .filter(s => { const d = new Date(s.startDate); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); })
      .map(s => ({ sub: s, memberName: this.reportMembers.find(m => m.memberId === s.memberId)?.fullName ?? `Member #${s.memberId}` }));
  }

  get membersNotRenewed(): { member: Member; expiredDate: string }[] {
    const activeMemberIds = new Set(this.reportSubscriptions.filter(s => s.isActive).map(s => s.memberId));
    const result: { member: Member; expiredDate: string }[] = [];
    for (const m of this.reportMembers) {
      if (activeMemberIds.has(m.memberId)) continue;
      const expired = this.reportSubscriptions.filter(s => s.memberId === m.memberId && !s.isActive);
      if (expired.length === 0) continue;
      const latest = [...expired].sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())[0];
      result.push({ member: m, expiredDate: latest.endDate });
    }
    return result;
  }

  onSearchFilterChange(): void { this.cdr.detectChanges(); }

  get filteredSearchPeople(): { id: number; role: string; fullName: string; detail: string; phone: string; subStatus: string; subType: string }[] {
    const q = this.searchFilterText.toLowerCase();
    const result: { id: number; role: string; fullName: string; detail: string; phone: string; subStatus: string; subType: string }[] = [];

    if (this.searchFilterRole === 'all' || this.searchFilterRole === 'member') {
      for (const m of this.allSearchMembers) {
        if (q && !m.fullName.toLowerCase().includes(q) && !m.email.toLowerCase().includes(q)) continue;
        const subs = this.allSearchSubscriptions.filter(s => s.memberId === m.memberId);
        const activeSub = subs.find(s => s.isActive && s.type !== 'Trainer');
        const subStatus = subs.filter(s => s.type !== 'Trainer').length === 0 ? 'None' : activeSub ? 'Active' : 'Expired';
        const subType = activeSub?.type ?? '';
        if (this.searchFilterSub !== 'all' && this.searchFilterSub !== subStatus.toLowerCase()) continue;
        result.push({ id: m.memberId, role: 'Member', fullName: m.fullName, detail: m.email, phone: m.phone, subStatus, subType });
      }
    }

    if (this.searchFilterRole === 'all' || this.searchFilterRole === 'trainer') {
      for (const t of this.allSearchTrainers) {
        if (q && !t.fullName.toLowerCase().includes(q)) continue;
        result.push({ id: t.trainerId, role: 'Trainer', fullName: t.fullName, detail: t.speciality, phone: t.phone, subStatus: '—', subType: '' });
      }
    }

    if (this.searchFilterRole === 'all' || this.searchFilterRole === 'receptionist') {
      for (const u of this.allSearchUsers) {
        if (u.role !== 'Receptionist') continue;
        if (q && !u.username.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) continue;
        result.push({ id: u.userId, role: 'Receptionist', fullName: u.username, detail: u.email, phone: '—', subStatus: '—', subType: '' });
      }
    }

    return result;
  }

  loadMembers(): void {
    this.memberService.getAll().subscribe({ next: m => { this.members = m; this.cdr.detectChanges(); } });
  }

  startEditMember(m: Member): void {
    this.editingMemberId = m.memberId;
    this.memberForm = { fullName: m.fullName, email: m.email, phone: m.phone, dateOfBirth: m.dateOfBirth };
    this.cdr.detectChanges();
  }

  cancelEditMember(): void {
    this.editingMemberId = null;
    this.memberForm = { fullName: '', email: '', phone: '', dateOfBirth: '' };
    this.cdr.detectChanges();
  }

  saveMember(): void {
    if (this.editingMemberId !== null) {
      this.memberService.update(this.editingMemberId, this.memberForm).subscribe({
        next: () => { this.memberSuccess = 'Member updated.'; this.editingMemberId = null; this.memberForm = { fullName: '', email: '', phone: '', dateOfBirth: '' }; this.loadMembers(); this.cdr.detectChanges(); },
        error: err => { this.memberError = err?.error?.message ?? 'Failed to update.'; this.cdr.detectChanges(); }
      });
    } else {
      this.memberService.create(this.memberForm).subscribe({
        next: () => { this.memberSuccess = 'Member added.'; this.memberForm = { fullName: '', email: '', phone: '', dateOfBirth: '' }; this.loadMembers(); this.cdr.detectChanges(); },
        error: err => { this.memberError = err?.error?.message ?? 'Failed to add.'; this.cdr.detectChanges(); }
      });
    }
  }

  deleteMember(id: number): void {
    if (!confirm('Delete this member?')) return;
    this.memberService.delete(id).subscribe({
      next: () => { this.memberSuccess = 'Member deleted.'; this.loadMembers(); this.cdr.detectChanges(); },
      error: err => { this.memberError = err?.error?.message ?? 'Failed to delete.'; this.cdr.detectChanges(); }
    });
  }

  loadTrainers(): void {
    this.trainerService.getAll().subscribe({ next: t => { this.trainers = t; this.cdr.detectChanges(); } });
  }

  startEditTrainer(t: Trainer): void {
    this.editingTrainerId = t.trainerId;
    this.trainerForm = { fullName: t.fullName, speciality: t.speciality, phone: t.phone };
    this.cdr.detectChanges();
  }

  cancelEditTrainer(): void {
    this.editingTrainerId = null;
    this.trainerForm = { fullName: '', speciality: '', phone: '' };
    this.cdr.detectChanges();
  }

  saveTrainer(): void {
    if (this.editingTrainerId !== null) {
      this.trainerService.update(this.editingTrainerId, this.trainerForm).subscribe({
        next: () => { this.trainerSuccess = 'Trainer updated.'; this.editingTrainerId = null; this.trainerForm = { fullName: '', speciality: '', phone: '' }; this.loadTrainers(); this.cdr.detectChanges(); },
        error: err => { this.trainerError = err?.error?.message ?? 'Failed to update.'; this.cdr.detectChanges(); }
      });
    } else {
      this.trainerService.create(this.trainerForm).subscribe({
        next: () => { this.trainerSuccess = 'Trainer added.'; this.trainerForm = { fullName: '', speciality: '', phone: '' }; this.loadTrainers(); this.cdr.detectChanges(); },
        error: err => { this.trainerError = err?.error?.message ?? 'Failed to add.'; this.cdr.detectChanges(); }
      });
    }
  }

  deleteTrainer(id: number): void {
    if (!confirm('Delete this trainer?')) return;
    this.trainerService.delete(id).subscribe({
      next: () => { this.trainerSuccess = 'Trainer deleted.'; this.loadTrainers(); this.cdr.detectChanges(); },
      error: err => { this.trainerError = err?.error?.message ?? 'Failed to delete.'; this.cdr.detectChanges(); }
    });
  }

  assignTrainer(): void {
    this.trainerService.assign(this.assignForm).subscribe({
      next: () => { this.trainerSuccess = 'Trainer assigned.'; this.showAssignForm = false; this.assignForm = { memberId: 0, trainerId: 0 }; this.cdr.detectChanges(); },
      error: err => { this.trainerError = err?.error?.message ?? 'Failed to assign.'; this.cdr.detectChanges(); }
    });
  }

  loadSubscriptions(): void {
    const id = parseInt(this.subscriptionMemberId);
    if (!id) return;
    this.subscriptionService.getByMember(id).subscribe({ next: s => { this.subscriptions = s; this.cdr.detectChanges(); } });
  }

  createSubscription(): void {
    const id = parseInt(this.subscriptionMemberId);
    if (!id) return;
    this.subForm.memberId = id;
    this.subscriptionService.create(this.subForm).subscribe({
      next: () => { this.subSuccess = 'Subscription created.'; this.subForm = { type: '', price: 0, durationDays: 0, startDate: '', memberId: 0 }; this.loadSubscriptions(); this.cdr.detectChanges(); },
      error: err => { this.subError = err?.error?.message ?? 'Failed.'; this.cdr.detectChanges(); }
    });
  }

  loadPayments(): void {
    const id = parseInt(this.paymentMemberId);
    if (!id) return;
    this.paymentService.getByMember(id).subscribe({ next: p => { this.payments = p; this.cdr.detectChanges(); } });
  }

  recordPayment(): void {
    const id = parseInt(this.paymentMemberId);
    if (!id) return;
    this.paymentForm.memberId = id;
    this.paymentService.create(this.paymentForm).subscribe({
      next: () => { this.paymentSuccess = 'Payment recorded.'; this.paymentForm = { amount: 0, method: '', memberId: 0 }; this.loadPayments(); this.cdr.detectChanges(); },
      error: err => { this.paymentError = err?.error?.message ?? 'Failed.'; this.cdr.detectChanges(); }
    });
  }

  loadAttendance(): void {
    const id = parseInt(this.attendanceMemberId);
    if (!id) return;
    this.attendanceService.getByMember(id).subscribe({ next: a => { this.attendanceList = a; this.cdr.detectChanges(); } });
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({ next: u => { this.users = u; this.cdr.detectChanges(); } });
  }

  startEditUser(u: UserAccount): void {
    this.editingUserId = u.userId;
    this.userForm = { username: u.username, passwordHash: u.passwordHash, email: u.email, role: u.role };
    this.cdr.detectChanges();
  }

  cancelEditUser(): void {
    this.editingUserId = null;
    this.userForm = { username: '', passwordHash: '', email: '', role: 'Receptionist' };
    this.cdr.detectChanges();
  }

  saveUser(): void {
    if (this.editingUserId !== null) {
      this.userService.update(this.editingUserId, this.userForm).subscribe({
        next: () => { this.userSuccess = 'User updated.'; this.editingUserId = null; this.userForm = { username: '', passwordHash: '', email: '', role: 'Receptionist' }; this.loadUsers(); this.cdr.detectChanges(); },
        error: err => { this.userError = err?.error?.message ?? 'Failed.'; this.cdr.detectChanges(); }
      });
    } else {
      this.userService.create(this.userForm).subscribe({
        next: () => { this.userSuccess = 'User created.'; this.userForm = { username: '', passwordHash: '', email: '', role: 'Receptionist' }; this.loadUsers(); this.cdr.detectChanges(); },
        error: err => { this.userError = err?.error?.message ?? 'Failed.'; this.cdr.detectChanges(); }
      });
    }
  }

  deleteUser(id: number): void {
    if (!confirm('Delete this user?')) return;
    this.userService.delete(id).subscribe({
      next: () => { this.userSuccess = 'User deleted.'; this.loadUsers(); this.cdr.detectChanges(); },
      error: err => { this.userError = err?.error?.message ?? 'Failed.'; this.cdr.detectChanges(); }
    });
  }
}
