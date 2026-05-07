import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemberDashboard } from './member-dashboard';
import { Router } from '@angular/router';

class RouterStub {
  lastUrl: string = '';
  navigate(url: any[]) { this.lastUrl = url[0]; }
}

describe('Member Dashboard', () => {
  let component: MemberDashboard;
  let fixture: ComponentFixture<MemberDashboard>;
  let routerStub: RouterStub;

  beforeEach(async () => {
    routerStub = new RouterStub();
    await TestBed.configureTestingModule({
      imports: [MemberDashboard],
      providers: [{ provide: Router, useValue: routerStub }]
    }).compileComponents();

    fixture = TestBed.createComponent(MemberDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show member greeting', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.user-greeting')?.textContent).toContain('Member');
  });

  it('should display subscription stats on home feature', () => {
    component.activeFeature = 'home';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Current Subscription');
  });

  it('should redirect to login on logout', () => {
    component.logout();
    expect(routerStub.lastUrl).toBe('/login');
  });
});