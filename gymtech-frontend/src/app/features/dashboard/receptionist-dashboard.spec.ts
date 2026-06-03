import { SubscriptionPlan } from './../../models/subscription.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReceptionistDashboard } from './receptionist-dashboard';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MemberService } from '../../services/member.service';
import { SubscriptionService } from '../../services/subscription.service';
import { PaymentService } from '../../services/payment.service';
import { AttendanceService } from '../../services/attendance.service';
import { TrainerService } from '../../services/trainer.service';
import { ThemeService } from '../../services/theme.service';
import { of } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Receptionist Dashboard Vitest Tests', () => {
  let component: ReceptionistDashboard;
  let fixture: ComponentFixture<ReceptionistDashboard>;
  let routerMock: any;

  beforeEach(async () => {
    routerMock = { navigate: vi.fn() };

    const genericServiceMock = {
      getAll: vi.fn().mockReturnValue(of([])),
      search: vi.fn().mockReturnValue(of([])),
      create: vi.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [ReceptionistDashboard],
      providers: [
        { provide: Router, useValue: routerMock },
        { 
          provide: AuthService, 
          useValue: { 
            getUsername: vi.fn().mockReturnValue('Receptionist Alice'), 
            logout: vi.fn() 
          } 
        },
        { 
          provide: SubscriptionService, 
          useValue: { 
            getPlans: vi.fn().mockReturnValue(of([])), 
            getAll: vi.fn().mockReturnValue(of([])) 
          } 
        },
        { provide: TrainerService, useValue: genericServiceMock },
        { provide: MemberService, useValue: genericServiceMock },
        { provide: ThemeService, useValue: { isDarkMode: false, toggleTheme: vi.fn() } },
        { provide: PaymentService, useValue: genericServiceMock },
        { provide: AttendanceService, useValue: genericServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ReceptionistDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Correctly triggers real ngOnInit setup parameters safely
  });

  it('should show receptionist greeting and dashboard home title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.user-greeting')?.textContent).toContain('Receptionist');
    expect(component.getPageTitle()).toBe('Dashboard Home');
  });

  it('should display receptionist operational welcome message layout', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.textContent).toContain('Welcome to GymTech Receptionist Dashboard');
    expect(compiled.textContent).toContain('Manage daily gym operations efficiently');
  });

  it('should switch to Create Subscription feature view on navigation target', () => {
    component.navigateTo('subscriptions');
    fixture.detectChanges(); 
    
    expect(component.activeFeature).toBe('subscriptions');
    expect(component.getPageTitle()).toBe('Create Subscription');
  });

  it('should redirect to login on logout sequence invocation', () => {
    component.logout();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should display an error message if an invalid member ID is provided for check-in', () => {
    component.checkInMemberId = 'abc'; // Invalid ID string
    
    component.checkIn();
    
    expect(component.checkInError).toBe('Enter a valid member ID.');
    expect(component.checkInSuccess).toBe('');
  });

  it('should block subscription creation if the Trainer plan is selected but no trainer is picked', () => {
    // Simulate selecting a Trainer plan structure
    component.subMemberId = '42';
    component.selectedPlan = { name: 'Trainer', price: 500, durationDays: 30, description: 'Personal training plan description', badge: 'Premium'};
    component.selectedTrainerId = 0; // No trainer selected!

    component.createSubscription();

    expect(component.subError).toBe('Please select a trainer for the Trainer plan.');
    expect(component.subSuccess).toBe('');
  });

  it('should filter members case-insensitively by full name or email matching the query', () => {
    // Populate mock array data
    component.allMembers = [
      { memberId: 1, fullName: 'Alex Smith', email: 'alex@gym.com', phone: '123', dateOfBirth: '', registrationDate: ''},
      { memberId: 2, fullName: 'Becca Jones', email: 'bjones@gym.com', phone: '456', dateOfBirth: '', registrationDate: ''}
    ];
    component.filterRole = 'member';
    
    // Set search criteria
    component.filterText = 'ALEX';
    
    const results = component.filteredPeople;
    
    expect(results.length).toBe(1);
    expect(results[0].fullName).toBe('Alex Smith');
  });

  it('should clear form values and populate a success message on successful payment tracking', () => {
    // Setup form state
    component.payMemberId = '99';
    component.paymentForm = { amount: 150, method: 'Cash', memberId: 99 };
    
    component.recordPayment(); // Triggers the mocked create stream
    
    expect(component.paymentSuccess).toContain('Payment of 150 RON recorded for member #99');
    expect(component.paymentForm.amount).toBe(0);
    expect(component.paymentForm.method).toBe('');
  });
});