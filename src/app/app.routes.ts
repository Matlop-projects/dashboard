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
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './core/auth.guard';
import { FaqsTableComponent } from './pages/fAQs/faqs-table/faqs-table.component';
import { FagsDetailsComponent } from './pages/fAQs/fags-details/fags-details.component';
import { CountriesComponent } from './pages/countries/countries/countries.component';
import { CountriesDetailsComponent } from './pages/countries/countries-details/countries-details.component';
import { WorkingHoursTableComponent } from './pages/working-hours/working-hours-table/working-hours-table.component';
import { WorkingHoursDetailsComponent } from './pages/working-hours/working-hours-details/working-hours-details.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
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
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'providers', component: ProvidersComponent },
      { path: 'working_hours', component: WorkingHoursTableComponent },
      { path: 'working_hours/add', component: WorkingHoursDetailsComponent },
      { path: 'working_hours/edit/:id', component: WorkingHoursDetailsComponent },
      { path: 'working_hours/view/:id', component: WorkingHoursDetailsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'faqs', component: FaqsTableComponent },
      { path: 'faqs/add', component: FagsDetailsComponent },
      { path: 'faqs/edit/:id', component: FagsDetailsComponent },
      { path: 'faqs/view/:id', component: FagsDetailsComponent },
      { path: 'country', component: CountriesComponent },
      { path: 'country/add', component: CountriesDetailsComponent },
      { path: 'country/view/:id', component: CountriesDetailsComponent },
      { path: 'country/view/:id', component: CountriesDetailsComponent },

    ]
  },
  {path: '**', component: NotFoundComponent}
];
