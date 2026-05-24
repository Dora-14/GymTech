import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReceptionistDashboard } from './receptionist-dashboard';
import { Router } from '@angular/router';

class RouterStub {
  lastUrl: string = '';
  navigate(url: any[]) { this.lastUrl = url[0]; }
}

describe('Receptionist Dashboard', () => {
  let component: ReceptionistDashboard;
  let fixture: ComponentFixture<ReceptionistDashboard>;
  let routerStub: RouterStub;

  beforeEach(async () => {
    routerStub = new RouterStub();
    await TestBed.configureTestingModule({
      imports: [ReceptionistDashboard],
      providers: [{ provide: Router, useValue: routerStub }]
    }).compileComponents();

    fixture = TestBed.createComponent(ReceptionistDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show receptionist greeting and dashboard home title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.user-greeting')?.textContent).toContain('Receptionist');
    expect(component.getPageTitle()).toBe('Dashboard Home');
  });

  it('should display receptionist operational stats', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Today\'s Attendance');
    expect(compiled.textContent).toContain('Pending Payments');
  });

  it('should switch to Manage Subscriptions feature', () => {
    component.navigateTo('subscriptions');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Manage Subscriptions');
  });

  it('should redirect to login on logout', () => {
    component.logout();
    expect(routerStub.lastUrl).toBe('/login');
  });
});