import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainerDashboard } from './trainer-dashboard';
import { Router } from '@angular/router';

class RouterStub {
  lastUrl: string = '';
  navigate(url: any[]) { this.lastUrl = url[0]; }
}

describe('Trainer Dashboard', () => {
  let component: TrainerDashboard;
  let fixture: ComponentFixture<TrainerDashboard>;
  let routerStub: RouterStub;

  beforeEach(async () => {
    routerStub = new RouterStub();
    await TestBed.configureTestingModule({
      imports: [TrainerDashboard],
      providers: [{ provide: Router, useValue: routerStub }]
    }).compileComponents();

    fixture = TestBed.createComponent(TrainerDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should update feature and title when navigating to schedule', () => {
    component.navigateTo('schedule');
    expect(component.activeFeature).toBe('schedule');
    expect(component.getPageTitle()).toBe('View Schedule');
  });

  it('should display trainer-specific stat cards on home page', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Assigned Members');
    expect(compiled.textContent).toContain('Upcoming Sessions');
  });

  it('should redirect to login on logout', () => {
    component.logout();
    expect(routerStub.lastUrl).toBe('/login');
  });
});