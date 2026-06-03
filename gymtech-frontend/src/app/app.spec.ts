import { TestBed } from '@angular/core/testing';
import { App } from './app'; // Component name matches your 'export class App'
import { ThemeService } from './services/theme.service';
import { Router } from '@angular/router';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('App Component Vitest Tests', () => {
  let themeServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    routerMock = {
      navigate: vi.fn()
    };

    // Mock the ThemeService completely so it doesn't execute its real initialization logic
    themeServiceMock = {
      isDarkMode: false,
      toggleTheme: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [App], // Standalone component goes in imports
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ThemeService, useValue: themeServiceMock } // <-- Intercept and neutralize ThemeService
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});