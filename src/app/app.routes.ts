import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ProvidersComponent } from './pages/providers/providers.component';
import { WorkingHoursComponent } from './pages/working-hours/working-hours.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'forget_password', component: ForgetPasswordComponent },
      { path: 'reset_password', component: ResetPasswordComponent },
    ]
  },
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'providers', component: ProvidersComponent },
      { path: 'working_hours', component: WorkingHoursComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'profile', component: ProfileComponent },
    ]
  },
  {path: '**', component: NotFoundComponent}
];
