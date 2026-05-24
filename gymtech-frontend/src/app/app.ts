import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('gymtech-frontend');

   isDarkMode = true;
   showThemeButton = false;

 ngOnInit() {
  const savedTheme = localStorage.getItem('theme');

  this.isDarkMode = savedTheme !== 'light';
  document.body.classList.toggle('light-theme', !this.isDarkMode);
   this.showThemeButton = !window.location.pathname.includes('/login');
}

  toggleTheme() {
     
  this.isDarkMode = !this.isDarkMode;

  document.body.classList.toggle('light-theme', !this.isDarkMode);
  localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');

  console.log('Theme changed:', this.isDarkMode ? 'dark' : 'light');
  
}
}
