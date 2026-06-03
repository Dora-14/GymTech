import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainerDashboard } from './trainer-dashboard';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MemberService } from '../../services/member.service';
import { AttendanceService } from '../../services/attendance.service';
import { TrainerService } from '../../services/trainer.service';
import { ThemeService } from '../../services/theme.service';
import { of, throwError } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Trainer Dashboard Vitest Tests', () => {
  let component: TrainerDashboard;
  let fixture: ComponentFixture<TrainerDashboard>;
  let routerMock: any;
  let memberServiceMock: any;
  let attendanceServiceMock: any;
  let trainerServiceMock: any;

  beforeEach(async () => {
    routerMock = { navigate: vi.fn() };

    memberServiceMock = {
      getAll: vi.fn().mockReturnValue(of([])),
      search: vi.fn().mockReturnValue(of([]))
    };

    attendanceServiceMock = {
      checkIn: vi.fn().mockReturnValue(of({})),
      getByMember: vi.fn().mockReturnValue(of([]))
    };

    trainerServiceMock = {
      getById: vi.fn().mockReturnValue(of({ fullName: 'Trainer Bob', trainerId: 4 })),
      getMembersByTrainer: vi.fn().mockReturnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [TrainerDashboard],
      providers: [
        { provide: Router, useValue: routerMock },
        {
          provide: AuthService,
          useValue: {
            getTrainerId: vi.fn().mockReturnValue(4),
            getUsername: vi.fn().mockReturnValue('Trainer Bob'),
            logout: vi.fn()
          }
        },
        { provide: TrainerService, useValue: trainerServiceMock },
        { provide: ThemeService, useValue: { isDarkMode: false, toggleTheme: vi.fn() } },
        { provide: MemberService, useValue: memberServiceMock },
        { provide: AttendanceService, useValue: attendanceServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TrainerDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Executes ngOnInit safely
  });

  // --- Existing Infrastructure Tests ---

  it('should update feature and title when navigating to schedule', () => {
    component.navigateTo('schedule');
    expect(component.activeFeature).toBe('schedule');
    expect(component.getPageTitle()).toBe('Schedule');
  });

  it('should display trainer-specific stat cards on home page', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.textContent).toContain('Welcome to GymTech Trainer Dashboard');
    expect(compiled.textContent).toContain('Manage your training sessions');
    expect(compiled.textContent).toContain('Total Members');
  });

  it('should redirect to login on logout', () => {
    component.logout();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  // --- New Core Business Logic Tests ---

  it('should fallback to username if getTrainerId returns 0 on initialization', () => {
    // Reset component and manually adjust dependencies for this isolated scenario
    const authService = TestBed.inject(AuthService);
    vi.spyOn(authService, 'getTrainerId').mockReturnValue(0);
    vi.spyOn(authService, 'getUsername').mockReturnValue('Backup Trainer Name');

    component.ngOnInit();

    expect(component.trainerId).toBe(0);
    expect(component.trainerName).toBe('Backup Trainer Name');
  });

  it('should clear error and success messages when navigating to a new feature', () => {
    component.checkInError = 'Some old error';
    component.checkInSuccess = 'Success!';

    component.navigateTo('members');

    expect(component.checkInError).toBe('');
    expect(component.checkInSuccess).toBe('');
  });

  it('should call memberService.search and update members list on a valid search string', () => {
    const mockSearchData = [{ memberId: 9, fullName: 'Tracked Client', email: 'c@gym.com', phone: '123', dateOfBirth: '' }];
    memberServiceMock.search.mockReturnValue(of(mockSearchData));
    component.memberSearchQuery = 'Tracked';

    component.searchMembers();

    expect(memberServiceMock.search).toHaveBeenCalledWith('Tracked');
    expect(component.members).toEqual(mockSearchData);
    expect(component.memberError).toBe('');
  });

  it('should catch search failures and set the appropriate memberError message', () => {
    memberServiceMock.search.mockReturnValue(throwError(() => new Error('API down')));
    component.memberSearchQuery = 'Error Query';

    component.searchMembers();

    expect(component.memberError).toBe('Search failed.');
  });

  it('should block member check-in if the parsed input ID is invalid or 0', () => {
    component.checkInMemberId = ''; // Empty string parses to NaN
    component.checkIn();

    expect(component.checkInError).toBe('Enter a valid member ID.');
    expect(attendanceServiceMock.checkIn).not.toHaveBeenCalled();

    component.checkInMemberId = 'abc'; // Text parses to NaN
    component.checkIn();

    expect(component.checkInError).toBe('Enter a valid member ID.');
  });

  it('should clear form fields and update success string on successful client check-in', () => {
    component.checkInMemberId = '105';
    attendanceServiceMock.checkIn.mockReturnValue(of({}));

    component.checkIn();

    expect(attendanceServiceMock.checkIn).toHaveBeenCalledWith(105);
    expect(component.checkInSuccess).toBe('Member #105 checked in.');
    expect(component.checkInMemberId).toBe('');
    expect(component.checkInError).toBe('');
  });

  it('should fetch trainer-specific clients on init if a valid trainerId is present', () => {
    const trainerSpy = vi.spyOn(TestBed.inject(TrainerService), 'getMembersByTrainer');
    const memberSpy = vi.spyOn(TestBed.inject(MemberService), 'getAll');

    // 1. Clear out the call history from the beforeEach() startup
    trainerSpy.mockClear();
    memberSpy.mockClear();

    // 2. Run the actual target test sequence
    component.trainerId = 4;
    component.loadMembers();

    expect(trainerSpy).toHaveBeenCalledWith(4);
    expect(memberSpy).not.toHaveBeenCalled();
  });

  it('should fetch all gym members on init if trainerId is 0 (Admin/Global mode)', () => {
    const trainerSpy = vi.spyOn(TestBed.inject(TrainerService), 'getMembersByTrainer');
    const memberSpy = vi.spyOn(TestBed.inject(MemberService), 'getAll');

    // 1. Clear out the call history from the beforeEach() startup
    trainerSpy.mockClear();
    memberSpy.mockClear();

    // 2. Run the actual target test sequence
    component.trainerId = 0;
    component.loadMembers();

    expect(memberSpy).toHaveBeenCalled();
    expect(trainerSpy).not.toHaveBeenCalled(); // This will now pass cleanly!
  });
});