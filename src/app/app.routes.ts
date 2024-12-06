import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './core/auth.guard';
import { FaqsTableComponent } from './pages/fAQs/faqs-table/faqs-table.component';
import { FagsDetailsComponent } from './pages/fAQs/fags-details/fags-details.component';
import { CountriesDetailsComponent } from './pages/countries/countries-details/countries-details.component';
import { WorkingHoursTableComponent } from './pages/working-hours/working-hours-table/working-hours-table.component';
import { WorkingHoursDetailsComponent } from './pages/working-hours/working-hours-details/working-hours-details.component';
import { CountriesTableComponent } from './pages/countries/countries-table/countries-table.component';
import { CityDetailsComponent } from './pages/cities/city-details/city-details.component';
import { CitiesTableComponent } from './pages/cities/cities-table/cities-table.component';
import { CancelReasonTableComponent } from './pages/cancel-reason/cancel-reason-table/cancel-reason-table.component';
import { CancelReasonDetailsComponent } from './pages/cancel-reason/cancel-reason-details/cancel-reason-details.component';
import { ComplaintTableComponent } from './pages/complaint/complaint-table/complaint-table.component';
import { ComplaintDetailsComponent } from './pages/complaint/complaint-details/complaint-details.component';
import { ContractTypeTableComponent } from './pages/contract-type/contract-type-table/contract-type-table.component';
import { ContractTypeDetailsComponent } from './pages/contract-type/contract-type-details/contract-type-details.component';
import { CoponeTableComponent } from './pages/copone/copone-table/copone-table.component';
import { CoponeDetailsComponent } from './pages/copone/copone-details/copone-details.component';
import { TermsConditionsTableComponent } from './pages/terms-conditions/terms-conditions-table/terms-conditions-table.component';
import { TermsConditionsDetailsComponent } from './pages/terms-conditions/terms-conditions-details/terms-conditions-details.component';
import { PrivacyPolicyTableComponent } from './pages/privacy-policy/privacy-policy-table/privacy-policy-table.component';
import { PrivacyPolicyDetailsComponent } from './pages/privacy-policy/privacy-policy-details/privacy-policy-details.component';
import { PaymentWayTableComponent } from './pages/payment-way/payment-way-table/payment-way-table.component';
import { PaymentWayDetailsComponent } from './pages/payment-way/payment-way-details/payment-way-details.component';
import { ServicesTableComponent } from './pages/services/services-table/services-table.component';
import { ServicesDetailsComponent } from './pages/services/services-details/services-details.component';
import { ClientTableComponent } from './pages/clients/client-table/client-table.component';
import { ClientDetailsComponent } from './pages/clients/client-details/client-details.component';
import { TechnicalTableComponent } from './pages/technicals/technical-table/technical-table.component';
import { TechnicalDetailsComponent } from './pages/technicals/technical-details/technical-details.component';
import { PackageTableComponent } from './pages/package/package-table/package-table.component';
import { PackageDetailsComponent } from './pages/package/package-details/package-details.component';
import { TechnicalSpecialistTableComponent } from './pages/technical-specialist/technical-specialist-table/technical-specialist-table.component';
import { TechnicalSpecialistDetailsComponent } from './pages/technical-specialist/technical-specialist-details/technical-specialist-details.component';

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
    canActivate: [],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'working_hours', component: WorkingHoursTableComponent },
      { path: 'working_hours/add', component: WorkingHoursDetailsComponent },
      { path: 'working_hours/edit/:id', component: WorkingHoursDetailsComponent },
      { path: 'working_hours/view/:id', component: WorkingHoursDetailsComponent },
      { path: 'settings', component: SettingsComponent ,
        children: [
          { path: 'faqs', component: FaqsTableComponent },
          { path: 'faqs/add', component: FagsDetailsComponent },
          { path: 'faqs/edit/:id', component: FagsDetailsComponent },
          { path: 'faqs/view/:id', component: FagsDetailsComponent },

          { path: 'terms_conditions', component: TermsConditionsTableComponent },
          { path: 'terms_conditions/add', component: TermsConditionsDetailsComponent },
          { path: 'terms_conditions/edit/:id', component: TermsConditionsDetailsComponent },
          { path: 'terms_conditions/view/:id', component: TermsConditionsDetailsComponent },

          { path: 'privacy_policy', component: PrivacyPolicyTableComponent },
          { path: 'privacy_policy/add', component: PrivacyPolicyDetailsComponent },
          { path: 'privacy_policy/edit/:id', component: PrivacyPolicyDetailsComponent },
          { path: 'privacy_policy/view/:id', component: PrivacyPolicyDetailsComponent },
        ]
      },
      { path: 'profile', component: ProfileComponent },

      { path: 'services', component: ServicesTableComponent },
      { path: 'service/add', component: ServicesDetailsComponent },
      { path: 'service/view/:id', component: ServicesDetailsComponent },
      { path: 'service/edit/:id', component: ServicesDetailsComponent },

      { path: 'country', component: CountriesTableComponent },
      { path: 'country/add', component: CountriesDetailsComponent },
      { path: 'country/view/:id', component: CountriesDetailsComponent },
      { path: 'country/edit/:id', component: CountriesDetailsComponent },

      { path: 'clients', component: ClientTableComponent },
      { path: 'client/add', component: ClientDetailsComponent },
      { path: 'client/view/:id', component: ClientDetailsComponent },
      { path: 'client/edit/:id', component: ClientDetailsComponent },

      { path: 'technicals', component: TechnicalTableComponent },
      { path: 'technical/add', component: TechnicalDetailsComponent },
      { path: 'technical/view/:id', component: TechnicalDetailsComponent },
      { path: 'technical/edit/:id', component: TechnicalDetailsComponent },

      { path: 'city', component: CitiesTableComponent },
      { path: 'city/add', component: CityDetailsComponent },
      { path: 'city/view/:id', component: CityDetailsComponent },
      { path: 'city/edit/:id', component: CityDetailsComponent },

      { path: 'cancel-reason', component: CancelReasonTableComponent },
      { path: 'cancel-reason/add', component: CancelReasonDetailsComponent },
      { path: 'cancel-reason/view/:id', component: CancelReasonDetailsComponent },
      { path: 'cancel-reason/edit/:id', component: CancelReasonDetailsComponent },

      { path: 'complaint', component: ComplaintTableComponent },
      { path: 'complaint/add', component: ComplaintDetailsComponent },
      { path: 'complaint/view/:id', component: ComplaintDetailsComponent },
      { path: 'complaint/edit/:id', component: ComplaintDetailsComponent },

      { path: 'contract-type', component: ContractTypeTableComponent },
      { path: 'contract-type/add', component: ContractTypeDetailsComponent },
      { path: 'contract-type/view/:id', component: ContractTypeDetailsComponent },
      { path: 'contract-type/edit/:id', component: ContractTypeDetailsComponent },

      { path: 'copone', component: CoponeTableComponent },
      { path: 'copone/add', component: CoponeDetailsComponent },
      { path: 'copone/view/:id', component: CoponeDetailsComponent },
      { path: 'copone/edit/:id', component: CoponeDetailsComponent },

      { path: 'paymentWay', component: PaymentWayTableComponent },
      { path: 'paymentWay/add', component: PaymentWayDetailsComponent },
      { path: 'paymentWay/view/:id', component: PaymentWayDetailsComponent },
      { path: 'paymentWay/edit/:id', component: PaymentWayDetailsComponent },

      { path: 'package', component: PackageTableComponent },
      { path: 'package/add', component: PackageDetailsComponent },
      { path: 'package/view/:id', component: PackageDetailsComponent },
      { path: 'package/edit/:id', component: PackageDetailsComponent },

      { path: 'technical-specialist', component: TechnicalSpecialistTableComponent },
      { path: 'technical-specialist/add', component: TechnicalSpecialistDetailsComponent },
      { path: 'technical-specialist/view/:id', component: TechnicalSpecialistDetailsComponent },
      { path: 'technical-specialist/edit/:id', component: TechnicalSpecialistDetailsComponent },
    ]
  },
  {path: '**', component: NotFoundComponent}
];
