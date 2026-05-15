import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { ReceptionistDashboard } from './features/dashboard/receptionist-dashboard';
import { TrainerDashboard } from './features/dashboard/trainer-dashboard';
import { MemberDashboard } from './features/dashboard/member-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'receptionist-dashboard', component: ReceptionistDashboard },
  { path: 'trainer-dashboard', component: TrainerDashboard },
  { path: 'member-dashboard', component: MemberDashboard }
];
