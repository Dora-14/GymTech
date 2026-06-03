import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  isDarkMode = true;

  constructor(public router: Router) {}

  get showThemeToggle(): boolean {
    return this.router.url.includes('dashboard');
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('light-theme', !this.isDarkMode);
  }
}