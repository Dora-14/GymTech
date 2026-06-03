import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemberDashboard } from './member-dashboard';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MemberService } from '../../services/member.service';
import { SubscriptionService } from '../../services/subscription.service';
import { PaymentService } from '../../services/payment.service';
import { AttendanceService } from '../../services/attendance.service';
import { TrainerService } from '../../services/trainer.service';
import { ThemeService } from '../../services/theme.service';
import { of, throwError } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Member Dashboard Vitest Tests', () => {
  let component: MemberDashboard;
  let fixture: ComponentFixture<MemberDashboard>;
  let routerMock: any;
  let attendanceServiceMock: any;
  let subscriptionServiceMock: any;

  beforeEach(async () => {
    routerMock = { navigate: vi.fn() };

    attendanceServiceMock = {
      getByMember: vi.fn().mockReturnValue(of([])),
      checkIn: vi.fn().mockReturnValue(of({}))
    };

    subscriptionServiceMock = {
      getPlans: vi.fn().mockReturnValue(of([])),
      getByMember: vi.fn().mockReturnValue(of([])),
      create: vi.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [MemberDashboard],
      providers: [
        { provide: Router, useValue: routerMock },
        {
          provide: AuthService,
          useValue: {
            getUsername: vi.fn().mockReturnValue('John Doe'),
            getMemberId: vi.fn().mockReturnValue(12),
            logout: vi.fn()
          }
        },
        { provide: SubscriptionService, useValue: subscriptionServiceMock },
        { provide: MemberService, useValue: { getById: vi.fn().mockReturnValue(of({ fullName: 'John Doe', memberId: 12 })) } },
        { provide: ThemeService, useValue: { isDarkMode: false, toggleTheme: vi.fn() } },
        { provide: PaymentService, useValue: { getByMember: vi.fn().mockReturnValue(of([])) } },
        { provide: AttendanceService, useValue: attendanceServiceMock },
        { provide: TrainerService, useValue: { getAll: vi.fn().mockReturnValue(of([])) } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MemberDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Executes ngOnInit safely
  });

  // --- Infrastructure & Routing Tests ---

  it('should show member greeting', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.querySelector('.user-greeting')?.textContent).toContain('Welcome, John Doe');
  });

  it('should redirect to login on logout', () => {
    component.logout();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  // --- Core Business Logic Tests ---

  it('should correctly format day duration labels into human-readable months', () => {
    expect(component.formatDuration(30)).toBe('1 Month');
    expect(component.formatDuration(90)).toBe('3 Months');
    expect(component.formatDuration(180)).toBe('6 Months');
    expect(component.formatDuration(365)).toBe('12 Months');
  });

  it('should block manual subscription requests if the member already has an active plan', () => {
    // Inject active subscription to trigger early return block guard
    component.activeSubscription = { subscriptionId: 1, type: 'Gold', price: 200, durationDays: 30, startDate: '2026-01-01', endDate: '2026-02-01', isActive: true, memberId: 12 };
    const fakePlan = { subscriptionPlanId: 1, name: 'Gold', price: 200, durationDays: 30, description: 'Test', badge: 'Test' };

    component.subscribeToPlan(fakePlan);

    expect(component.subscribeError).toContain('You already have an active Gold subscription.');
    expect(subscriptionServiceMock.create).not.toHaveBeenCalled();
  });

  it('should handle successful user self-check-ins and reload attendance arrays', () => {
    const attendanceSpy = vi.spyOn(component, 'loadAttendance');
    attendanceServiceMock.checkIn.mockReturnValue(of({}));

    component.checkInToday();

    expect(attendanceServiceMock.checkIn).toHaveBeenCalledWith(12);
    expect(component.checkInSuccess).toBe('Checked in successfully!');
    expect(attendanceSpy).toHaveBeenCalled();
  });

  it('should catch user check-in duplication attempts and apply an error message string', () => {
    const errorMessage = 'Already checked in today.';
    attendanceServiceMock.checkIn.mockReturnValue(throwError(() => ({ error: { message: errorMessage } })));

    component.checkInToday();

    expect(component.checkInError).toBe(errorMessage);
    expect(component.checkInSuccess).toBe('');
  });

  it('should calculate zero values correctly for daysRemaining calculation loops when no active subscription exists', () => {
    component.activeSubscription = null;
    expect(component.daysRemaining()).toBe(0);
  });

  it('should correctly calculate days remaining until subscription expiration', () => {
    // 1. Set a stable reference time for "today"
    const today = new Date();
    
    // 2. Create an expiration date exactly 5 days into the future
    const fiveDaysFuture = new Date();
    fiveDaysFuture.setDate(today.getDate() + 5);
    const endDateString = fiveDaysFuture.toISOString().split('T')[0];

    // 3. Inject this structure into the component state
    component.activeSubscription = { 
      subscriptionId: 1, 
      type: 'Gold', 
      price: 200, 
      durationDays: 30, 
      startDate: '2026-01-01', 
      endDate: endDateString, 
      isActive: true, 
      memberId: 12 
    };

    // The calculation should cleanly round and match our 5-day offset
    expect(component.daysRemaining()).toBe(5);
  });

 it('should accurately count attendance visits filtering out older months', () => {
    const now = new Date();
    const currentMonthStr = now.toISOString().split('T')[0]; // Current month
    
    // Create an old record from a different month context
    const pastDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const pastMonthStr = pastDate.toISOString().split('T')[0];

    component.attendance = [
      { attendanceId: 1, date: currentMonthStr, memberId: 12, checkInTime: '18:00' }, // <-- Added checkInTime
      { attendanceId: 2, date: currentMonthStr, memberId: 12, checkInTime: '09:30' }, // <-- Added checkInTime
      { attendanceId: 3, date: pastMonthStr, memberId: 12, checkInTime: '14:15' }    // <-- Added checkInTime
    ];

    expect(component.visitsThisMonth()).toBe(2);
  });
});