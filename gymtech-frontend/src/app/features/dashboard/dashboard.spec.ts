import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dashboard } from './dashboard';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StatsService } from '../../services/stats.service';
import { ThemeService } from '../../services/theme.service';
import { MemberService } from '../../services/member.service';
import { TrainerService } from '../../services/trainer.service';
import { SubscriptionService } from '../../services/subscription.service';
import { PaymentService } from '../../services/payment.service';
import { AttendanceService } from '../../services/attendance.service';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Admin Dashboard Vitest Tests', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let routerMock: any;

  beforeEach(async () => {
    routerMock = { navigate: vi.fn() };

    const emptyMock = { getAll: vi.fn().mockReturnValue(of([])) };

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        { provide: Router, useValue: routerMock },
        { 
          provide: AuthService, 
          useValue: { 
            getUsername: vi.fn().mockReturnValue('Admin'), 
            logout: vi.fn() 
          } 
        },
        { 
          provide: StatsService, 
          useValue: { 
            get: vi.fn().mockReturnValue(of({ totalMembers: 0, totalTrainers: 0, activeSubscriptions: 0, totalRevenue: 0 })) 
          } 
        },
        { provide: ThemeService, useValue: { isDarkMode: false, toggleTheme: vi.fn() } },
        { provide: MemberService, useValue: emptyMock },
        { provide: TrainerService, useValue: emptyMock },
        { provide: SubscriptionService, useValue: emptyMock },
        { provide: PaymentService, useValue: emptyMock },
        { provide: AttendanceService, useValue: emptyMock },
        { provide: UserService, useValue: emptyMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Executes ngOnInit cleanly
  });

  // --- Existing Infrastructure Tests ---

  it('should navigate to different features and update title', () => {
    component.navigateTo('members');
    expect(component.activeFeature).toBe('members');
    expect(component.getPageTitle()).toBe('Manage Members');
  });

  it('should redirect to login on logout', () => {
    component.logout();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  // --- New Core Business Logic Tests ---

  it('should correctly clear error and success states when clearing messages', () => {
    component.memberError = 'Failed';
    component.paymentSuccess = 'Saved';

    component.clearMessages();

    expect(component.memberError).toBe('');
    expect(component.paymentSuccess).toBe('');
  });

  it('should calculate relative percentage direction change signatures flawlessly', () => {
    // Test upward trajectory calculation
    const upChange = component.computeChange(150, 100);
    expect(upChange.pct).toBe(50);
    expect(upChange.dir).toBe('up');

    // Test downward trajectory calculation
    const downChange = component.computeChange(75, 100);
    expect(downChange.pct).toBe(25);
    expect(downChange.dir).toBe('down');

    // Test zero baseline guard edge case
    const zeroBaselineChange = component.computeChange(50, 0);
    expect(zeroBaselineChange.pct).toBe(100);
    expect(zeroBaselineChange.dir).toBe('up');
  });

  it('should filter combined data lists properly based on current text query inputs', () => {
    // Populate isolated dataset values inside internal search filter caches
    component.allSearchMembers = [
      { memberId: 1, fullName: 'System Administrator', email: 'admin@gym.com', phone: '000', dateOfBirth: '', registrationDate: '' },
      { memberId: 2, fullName: 'Standard Client', email: 'client@gym.com', phone: '111', dateOfBirth: '',  registrationDate: '' }
    ];
    component.searchFilterRole = 'member';
    component.searchFilterSub = 'all';
    
    component.searchFilterText = 'ADMIN'; // Match by substring name parameter
    let filteredResults = component.filteredSearchPeople;
    expect(filteredResults.length).toBe(1);
    expect(filteredResults[0].fullName).toBe('System Administrator');
  });

  it('should accurately parse historical payment dates to calculate current month index totals', () => {
    const today = new Date();
    const currentMonthString = today.toISOString().split('T')[0];

    // Setup dummy historical record lists
    component.reportPayments = [
      { paymentId: 1, amount: 250, method: 'Card', date: currentMonthString, memberId: 10 },
      { paymentId: 2, amount: 150, method: 'Cash', date: currentMonthString, memberId: 11 }
    ];

    expect(component.thisMonthIncome).toBe(400);
  });

  it('should only flag reportLoaded as true after all 4 parallel service streams resolve', () => {
    // 1. Spy on the services utilized by the report loader loop
    const paymentSpy = vi.spyOn(TestBed.inject(PaymentService), 'getAll');
    const attendanceSpy = vi.spyOn(TestBed.inject(AttendanceService), 'getAll');
    const subscriptionSpy = vi.spyOn(TestBed.inject(SubscriptionService), 'getAll');
    const memberSpy = vi.spyOn(TestBed.inject(MemberService), 'getAll');

    // 2. Initialize the workflow execution step
    component.loadReportData();

    // Verify the concurrent streams are actively triggered
    expect(paymentSpy).toHaveBeenCalled();
    expect(attendanceSpy).toHaveBeenCalled();
    expect(subscriptionSpy).toHaveBeenCalled();
    expect(memberSpy).toHaveBeenCalled();
    
    // The flag should flip to true because our provider stubs return resolved observables instantly
    expect(component.reportLoaded).toBe(true);
  });

  it('should accurately isolate expired members and find their latest subscription end date', () => {
    // 1. Seed members into the search report pool
    component.reportMembers = [
      { memberId: 101, fullName: 'Churned Member', email: 'c@gym.com', phone: '123', dateOfBirth: '', registrationDate: ''  },
      { memberId: 102, fullName: 'Active Member', email: 'a@gym.com', phone: '456', dateOfBirth: '', registrationDate: ''  }
    ];

    // 2. Setup subscription history mirroring active vs expired profiles
    component.reportSubscriptions = [
      // Member 101 has two expired subscriptions
      { subscriptionId: 1, type: 'Basic', price: 100, durationDays: 30, startDate: '2026-01-01', endDate: '2026-02-01', isActive: false, memberId: 101 },
      { subscriptionId: 2, type: 'Basic', price: 100, durationDays: 30, startDate: '2026-02-01', endDate: '2026-03-01', isActive: false, memberId: 101 }, // Latest expiration target
      // Member 102 has an active subscription
      { subscriptionId: 3, type: 'Gold', price: 200, durationDays: 30, startDate: '2026-05-01', endDate: '2026-06-01', isActive: true, memberId: 102 }
    ];

    const unrenewedList = component.membersNotRenewed;

    // It should filter out the active member, isolate the churned member, and grab their LATEST end date
    expect(unrenewedList.length).toBe(1);
    expect(unrenewedList[0].member.fullName).toBe('Churned Member');
    expect(unrenewedList[0].expiredDate).toBe('2026-03-01');
  });

  it('should exclusively isolate receptionists matching search parameters when the role filter is applied', () => {
    // Populate the admin user tracking account array state cache
    component.allSearchUsers = [
      { userId: 1, username: 'receptionist_bob', passwordHash: '###', email: 'bob@gym.com', role: 'Receptionist' },
      { userId: 2, username: 'admin_clara', passwordHash: '###', email: 'clara@gym.com', role: 'Admin' }
    ];
    
    // Set active filter criteria targets
    component.searchFilterRole = 'receptionist';
    component.searchFilterText = 'BOB';

    const results = component.filteredSearchPeople;

    // It should completely drop the Admin user layout and surface Bob
    expect(results.length).toBe(1);
    expect(results[0].fullName).toBe('receptionist_bob');
    expect(results[0].role).toBe('Receptionist');
  });
});