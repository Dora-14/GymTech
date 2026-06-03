import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();

    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.remove('light-theme');
    }

    TestBed.configureTestingModule({
      providers: [ThemeService]
    });
    service = TestBed.inject(ThemeService);
  });

  it('should be created successfully', () => {
    expect(service).toBeTruthy();
  });

  it('should default to dark mode on initialization when no saved theme exists', () => {
    expect(service.isDarkMode).toBe(true);
    if (typeof document !== 'undefined' && document.body) {
      expect(document.body.classList.contains('light-theme')).toBe(false);
    }
  });

  it('should load light theme on initialization if it was saved in localStorage', () => {

    localStorage.setItem('theme', 'light');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [ThemeService] });
    const localService = TestBed.inject(ThemeService);

    expect(localService.isDarkMode).toBe(false);
    if (typeof document !== 'undefined' && document.body) {
      expect(document.body.classList.contains('light-theme')).toBe(true);
    }
  });

  it('should toggle theme from dark to light mode correctly', () => {

    service.toggleTheme();

    expect(service.isDarkMode).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
    if (typeof document !== 'undefined' && document.body) {
      expect(document.body.classList.contains('light-theme')).toBe(true);
    }
  });

  it('should cycle back to dark mode smoothly when toggled twice', () => {
    service.toggleTheme();
    service.toggleTheme();

    expect(service.isDarkMode).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
    if (typeof document !== 'undefined' && document.body) {
      expect(document.body.classList.contains('light-theme')).toBe(false);
    }
  });
});
