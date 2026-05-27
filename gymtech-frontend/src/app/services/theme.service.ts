import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly themeKey = 'theme';
  private readonly themeSignal = signal<'light' | 'dark'>('dark');

  constructor() {
    const savedTheme = localStorage.getItem(this.themeKey);
    const theme = savedTheme === 'light' ? 'light' : 'dark';
    this.themeSignal.set(theme);
    this.applyTheme();
  }

  get isDarkMode(): boolean {
    return this.themeSignal() === 'dark';
  }

  toggleTheme(): void {
    const nextTheme = this.isDarkMode ? 'light' : 'dark';
    this.themeSignal.set(nextTheme);
    localStorage.setItem(this.themeKey, nextTheme);
    this.applyTheme();
  }

  private applyTheme(): void {
    if (typeof document === 'undefined' || !document.body) return;
    document.body.classList.toggle('light-theme', !this.isDarkMode);
  }
}
