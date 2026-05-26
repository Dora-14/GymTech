import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dashboard } from './dashboard';
import { Router } from '@angular/router';

class RouterStub {
  lastUrl: string = '';
  navigate(url: any[]) { this.lastUrl = url[0]; }
}

describe('Admin Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let routerStub: RouterStub;

  beforeEach(async () => {
    routerStub = new RouterStub();
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [{ provide: Router, useValue: routerStub }]
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should navigate to different features and update title', () => {
    component.navigateTo('members');
    expect(component.activeFeature).toBe('members');
    expect(component.getPageTitle()).toBe('Manage Members');
  });

  it('should redirect to login on logout', () => {
    component.logout();
    expect(routerStub.lastUrl).toBe('/login');
  });
});