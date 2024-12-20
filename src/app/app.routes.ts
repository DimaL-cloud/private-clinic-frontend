import { Routes } from '@angular/router';
import {LoginComponent} from './modules/login/login.component';
import {AuthGuard} from './shared/guards/auth.guard';
import {HomeComponent} from './modules/home/home.component';
import {AdminPanelComponent} from './modules/admin-panel/admin-panel.component';
import {ResetPasswordComponent} from './modules/reset-password/reset-password.component';
import {ForgotPasswordComponent} from './modules/forgot-password/forgot-password.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'admin-panel', component: AdminPanelComponent, canActivate: [AuthGuard] }
];
