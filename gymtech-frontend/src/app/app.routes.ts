import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { ReceptionistDashboard } from './features/dashboard/receptionist-dashboard';
import { TrainerDashboard } from './features/dashboard/trainer-dashboard';
import { MemberDashboard } from './features/dashboard/member-dashboard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'receptionist-dashboard', component: ReceptionistDashboard, canActivate: [authGuard] },
  { path: 'trainer-dashboard', component: TrainerDashboard, canActivate: [authGuard] },
  { path: 'member-dashboard', component: MemberDashboard, canActivate: [authGuard] }
];
