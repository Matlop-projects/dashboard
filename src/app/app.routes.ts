import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      { 
        path: 'login', 
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
      },
      { 
        path: 'forget_password', 
        loadComponent: () => import('./pages/forget-password/forget-password.component').then(m => m.ForgetPasswordComponent)
      },
      { 
        path: 'reset_password', 
        loadComponent: () => import('./pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
      },
    ]
  },
  {
    path: '',
    loadComponent: () => import('./layouts/home-layout/home-layout.component').then(m => m.HomeLayoutComponent),
    canActivate: [authGuard],
    children: [
      { 
        path: 'dashboard', 
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      { 
        path: 'working_hours', 
        loadComponent: () => import('./pages/working-hours/working-hours-table/working-hours-table.component').then(m => m.WorkingHoursTableComponent)
      },
      { 
        path: 'working_hours/add', 
        loadComponent: () => import('./pages/working-hours/working-hours-details/working-hours-details.component').then(m => m.WorkingHoursDetailsComponent)
      },
      { 
        path: 'working_hours/edit/:id', 
        loadComponent: () => import('./pages/working-hours/working-hours-details/working-hours-details.component').then(m => m.WorkingHoursDetailsComponent)
      },
      { 
        path: 'working_hours/view/:id', 
        loadComponent: () => import('./pages/working-hours/working-hours-details/working-hours-details.component').then(m => m.WorkingHoursDetailsComponent)
      },
      { 
        path: 'settings', 
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent),
        canActivate: [authGuard],
        children: [
          { 
            path: 'faqs', 
            loadComponent: () => import('./pages/fAQs/faqs-table/faqs-table.component').then(m => m.FaqsTableComponent)
          },
          { 
            path: 'faqs/add', 
            loadComponent: () => import('./pages/fAQs/fags-details/fags-details.component').then(m => m.FagsDetailsComponent)
          },
          { 
            path: 'faqs/edit/:id', 
            loadComponent: () => import('./pages/fAQs/fags-details/fags-details.component').then(m => m.FagsDetailsComponent)
          },
          { 
            path: 'faqs/view/:id', 
            loadComponent: () => import('./pages/fAQs/fags-details/fags-details.component').then(m => m.FagsDetailsComponent)
          },

          { 
            path: 'blog', 
            loadComponent: () => import('./pages/blog/blog-table/blog-table.component').then(m => m.BlogTableComponent)
          },
          { 
            path: 'blog/add', 
            loadComponent: () => import('./pages/blog/blog-details/blog-details.component').then(m => m.BlogDetailsComponent)
          },
          { 
            path: 'blog/edit/:id', 
            loadComponent: () => import('./pages/blog/blog-details/blog-details.component').then(m => m.BlogDetailsComponent)
          },
          { 
            path: 'blog/view/:id', 
            loadComponent: () => import('./pages/blog/blog-details/blog-details.component').then(m => m.BlogDetailsComponent)
          },

          { 
            path: 'terms_conditions', 
            loadComponent: () => import('./pages/terms-conditions/terms-conditions-table/terms-conditions-table.component').then(m => m.TermsConditionsTableComponent)
          },
          { 
            path: 'terms_conditions/add', 
            loadComponent: () => import('./pages/terms-conditions/terms-conditions-details/terms-conditions-details.component').then(m => m.TermsConditionsDetailsComponent)
          },
          { 
            path: 'terms_conditions/edit/:id', 
            loadComponent: () => import('./pages/terms-conditions/terms-conditions-details/terms-conditions-details.component').then(m => m.TermsConditionsDetailsComponent)
          },
          { 
            path: 'terms_conditions/view/:id', 
            loadComponent: () => import('./pages/terms-conditions/terms-conditions-details/terms-conditions-details.component').then(m => m.TermsConditionsDetailsComponent)
          },

          { 
            path: 'privacy_policy', 
            loadComponent: () => import('./pages/privacy-policy/privacy-policy-table/privacy-policy-table.component').then(m => m.PrivacyPolicyTableComponent)
          },
          { 
            path: 'privacy_policy/add', 
            loadComponent: () => import('./pages/privacy-policy/privacy-policy-details/privacy-policy-details.component').then(m => m.PrivacyPolicyDetailsComponent)
          },
          { 
            path: 'privacy_policy/edit/:id', 
            loadComponent: () => import('./pages/privacy-policy/privacy-policy-details/privacy-policy-details.component').then(m => m.PrivacyPolicyDetailsComponent)
          },
          { 
            path: 'privacy_policy/view/:id', 
            loadComponent: () => import('./pages/privacy-policy/privacy-policy-details/privacy-policy-details.component').then(m => m.PrivacyPolicyDetailsComponent)
          },

          {
            path:'social_media',
            loadComponent: () => import('./pages/social-media/social-media-update/social-media-update.component').then(m => m.SocialMediaUpdateComponent)
          },

          { 
            path: 'slider', 
            loadComponent: () => import('./pages/slider/slider-table/slider-table.component').then(m => m.SliderTableComponent)
          },
          { 
            path: 'slider/add', 
            loadComponent: () => import('./pages/slider/slider-details/slider-details.component').then(m => m.SliderDetailsComponent)
          },
          { 
            path: 'slider/edit/:id', 
            loadComponent: () => import('./pages/slider/slider-details/slider-details.component').then(m => m.SliderDetailsComponent)
          },
          { 
            path: 'slider/view/:id', 
            loadComponent: () => import('./pages/slider/slider-details/slider-details.component').then(m => m.SliderDetailsComponent)
          },

          { 
            path: 'ourclient', 
            loadComponent: () => import('./pages/OurClients/ourclient-table/ourclient-table.component').then(m => m.OurClientTableComponent)
          },
          { 
            path: 'ourclient/add', 
            loadComponent: () => import('./pages/OurClients/ourclient-details/ourclient-details.component').then(m => m.OurClientDetailsComponent)
          },
          { 
            path: 'ourclient/edit/:id', 
            loadComponent: () => import('./pages/OurClients/ourclient-details/ourclient-details.component').then(m => m.OurClientDetailsComponent)
          },
          { 
            path: 'ourclient/view/:id', 
            loadComponent: () => import('./pages/OurClients/ourclient-details/ourclient-details.component').then(m => m.OurClientDetailsComponent)
          },
          
          { 
            path: 'roles', 
            loadComponent: () => import('./pages/roles/role-table/role-table.component').then(m => m.RoleTableComponent)
          },
          { 
            path: 'role/add', 
            loadComponent: () => import('./pages/roles/role-details/role-details.component').then(m => m.RoleDetailsComponent)
          },
          { 
            path: 'role/edit/:id', 
            loadComponent: () => import('./pages/roles/role-details/role-details.component').then(m => m.RoleDetailsComponent)
          },
          { 
            path: 'role/view/:id', 
            loadComponent: () => import('./pages/roles/role-details/role-details.component').then(m => m.RoleDetailsComponent)
          },

          { 
            path: 'district', 
            loadComponent: () => import('./pages/district/district-table/district-table.component').then(m => m.DistrictTableComponent)
          },
          { 
            path: 'district/add', 
            loadComponent: () => import('./pages/district/district-details/district-details.component').then(m => m.DistrictDetailsComponent)
          },
          { 
            path: 'district/edit/:id', 
            loadComponent: () => import('./pages/district/district-details/district-details.component').then(m => m.DistrictDetailsComponent)
          },
          { 
            path: 'district/view/:id', 
            loadComponent: () => import('./pages/district/district-details/district-details.component').then(m => m.DistrictDetailsComponent)
          },

          { 
            path: 'admin', 
            loadComponent: () => import('./pages/admin/admin-table/admin-table.component').then(m => m.AdminTableComponent)
          },
          { 
            path: 'admin/add', 
            loadComponent: () => import('./pages/admin/admin-details/admin-details.component').then(m => m.AdminDetailsComponent)
          },
          { 
            path: 'admin/edit/:id', 
            loadComponent: () => import('./pages/admin/admin-details/admin-details.component').then(m => m.AdminDetailsComponent)
          },
          { 
            path: 'admin/view/:id', 
            loadComponent: () => import('./pages/admin/admin-details/admin-details.component').then(m => m.AdminDetailsComponent)
          },

          { 
            path: 'add_notification', 
            loadComponent: () => import('./pages/add-notifications/add-notifications.component').then(m => m.AddNotificationsComponent)
          },
          { 
            path: 'order_images/:type', 
            loadComponent: () => import('./pages/order-images/order-images.component').then(m => m.OrderImagesComponent)
          },
        ]
      },
      { 
        path: 'profile', 
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
      },
      { 
        path: 'profile/edit/:id', 
        loadComponent: () => import('./pages/profile/edit-profile/edit-profile.component').then(m => m.EditProfileComponent)
      },

      { 
        path: 'services', 
        loadComponent: () => import('./pages/services/services-table/services-table.component').then(m => m.ServicesTableComponent)
      },
      { 
        path: 'service/add', 
        loadComponent: () => import('./pages/services/services-details/services-details.component').then(m => m.ServicesDetailsComponent)
      },
      { 
        path: 'service/view/:id', 
        loadComponent: () => import('./pages/services/services-details/services-details.component').then(m => m.ServicesDetailsComponent)
      },
      { 
        path: 'service/edit/:id', 
        loadComponent: () => import('./pages/services/services-details/services-details.component').then(m => m.ServicesDetailsComponent)
      },

      { 
        path: 'country', 
        loadComponent: () => import('./pages/countries/countries-table/countries-table.component').then(m => m.CountriesTableComponent)
      },
      { 
        path: 'country/add', 
        loadComponent: () => import('./pages/countries/countries-details/countries-details.component').then(m => m.CountriesDetailsComponent)
      },
      { 
        path: 'country/view/:id', 
        loadComponent: () => import('./pages/countries/countries-details/countries-details.component').then(m => m.CountriesDetailsComponent)
      },
      { 
        path: 'country/edit/:id', 
        loadComponent: () => import('./pages/countries/countries-details/countries-details.component').then(m => m.CountriesDetailsComponent)
      },

      { 
        path: 'clients', 
        loadComponent: () => import('./pages/clients/client-table/client-table.component').then(m => m.ClientTableComponent)
      },
      { 
        path: 'client/add', 
        loadComponent: () => import('./pages/clients/client-details/client-details.component').then(m => m.ClientDetailsComponent)
      },
      { 
        path: 'client/view/:id', 
        loadComponent: () => import('./pages/clients/client-details/client-details.component').then(m => m.ClientDetailsComponent)
      },
      { 
        path: 'client/edit/:id', 
        loadComponent: () => import('./pages/clients/client-details/client-details.component').then(m => m.ClientDetailsComponent)
      },

      { 
        path: 'technicals', 
        loadComponent: () => import('./pages/technicals/technical-table/technical-table.component').then(m => m.TechnicalTableComponent)
      },
      { 
        path: 'technical/add', 
        loadComponent: () => import('./pages/technicals/technical-details/technical-details.component').then(m => m.TechnicalDetailsComponent)
      },
      { 
        path: 'technical/view/:id', 
        loadComponent: () => import('./pages/technicals/technical-details/technical-details.component').then(m => m.TechnicalDetailsComponent)
      },
      { 
        path: 'technical/edit/:id', 
        loadComponent: () => import('./pages/technicals/technical-details/technical-details.component').then(m => m.TechnicalDetailsComponent)
      },

      { 
        path: 'city', 
        loadComponent: () => import('./pages/cities/cities-table/cities-table.component').then(m => m.CitiesTableComponent)
      },
      { 
        path: 'city/add', 
        loadComponent: () => import('./pages/cities/city-details/city-details.component').then(m => m.CityDetailsComponent)
      },
      { 
        path: 'city/view/:id', 
        loadComponent: () => import('./pages/cities/city-details/city-details.component').then(m => m.CityDetailsComponent)
      },
      { 
        path: 'city/edit/:id', 
        loadComponent: () => import('./pages/cities/city-details/city-details.component').then(m => m.CityDetailsComponent)
      },

      { 
        path: 'cancel-reason', 
        loadComponent: () => import('./pages/cancel-reason/cancel-reason-table/cancel-reason-table.component').then(m => m.CancelReasonTableComponent)
      },
      { 
        path: 'cancel-reason/add', 
        loadComponent: () => import('./pages/cancel-reason/cancel-reason-details/cancel-reason-details.component').then(m => m.CancelReasonDetailsComponent)
      },
      { 
        path: 'cancel-reason/view/:id', 
        loadComponent: () => import('./pages/cancel-reason/cancel-reason-details/cancel-reason-details.component').then(m => m.CancelReasonDetailsComponent)
      },
      { 
        path: 'cancel-reason/edit/:id', 
        loadComponent: () => import('./pages/cancel-reason/cancel-reason-details/cancel-reason-details.component').then(m => m.CancelReasonDetailsComponent)
      },

      { 
        path: 'complaint', 
        loadComponent: () => import('./pages/complaint/complaint-table/complaint-table.component').then(m => m.ComplaintTableComponent)
      },
      { 
        path: 'complaint/add', 
        loadComponent: () => import('./pages/complaint/complaint-details/complaint-details.component').then(m => m.ComplaintDetailsComponent)
      },
      { 
        path: 'complaint/view/:id', 
        loadComponent: () => import('./pages/complaint/complaint-details/complaint-details.component').then(m => m.ComplaintDetailsComponent)
      },
      { 
        path: 'complaint/edit/:id', 
        loadComponent: () => import('./pages/complaint/complaint-details/complaint-details.component').then(m => m.ComplaintDetailsComponent)
      },

      { 
        path: 'contract-type', 
        loadComponent: () => import('./pages/contract-type/contract-type-table/contract-type-table.component').then(m => m.ContractTypeTableComponent)
      },
      { 
        path: 'contract-type/add', 
        loadComponent: () => import('./pages/contract-type/contract-type-details/contract-type-details.component').then(m => m.ContractTypeDetailsComponent)
      },
      { 
        path: 'contract-type/view/:id', 
        loadComponent: () => import('./pages/contract-type/contract-type-details/contract-type-details.component').then(m => m.ContractTypeDetailsComponent)
      },
      { 
        path: 'contract-type/edit/:id', 
        loadComponent: () => import('./pages/contract-type/contract-type-details/contract-type-details.component').then(m => m.ContractTypeDetailsComponent)
      },

      { 
        path: 'copone', 
        loadComponent: () => import('./pages/copone/copone-table/copone-table.component').then(m => m.CoponeTableComponent)
      },
      { 
        path: 'copone/add', 
        loadComponent: () => import('./pages/copone/copone-details/copone-details.component').then(m => m.CoponeDetailsComponent)
      },
      { 
        path: 'copone/view/:id', 
        loadComponent: () => import('./pages/copone/copone-details/copone-details.component').then(m => m.CoponeDetailsComponent)
      },
      { 
        path: 'copone/edit/:id', 
        loadComponent: () => import('./pages/copone/copone-details/copone-details.component').then(m => m.CoponeDetailsComponent)
      },

      { 
        path: 'paymentWay', 
        loadComponent: () => import('./pages/payment-way/payment-way-table/payment-way-table.component').then(m => m.PaymentWayTableComponent)
      },
      { 
        path: 'paymentWay/add', 
        loadComponent: () => import('./pages/payment-way/payment-way-details/payment-way-details.component').then(m => m.PaymentWayDetailsComponent)
      },
      { 
        path: 'paymentWay/view/:id', 
        loadComponent: () => import('./pages/payment-way/payment-way-details/payment-way-details.component').then(m => m.PaymentWayDetailsComponent)
      },
      { 
        path: 'paymentWay/edit/:id', 
        loadComponent: () => import('./pages/payment-way/payment-way-details/payment-way-details.component').then(m => m.PaymentWayDetailsComponent)
      },

      { 
        path: 'withdrawals-transaction', 
        loadComponent: () => import('./pages/withdrawals-transaction/withdrawals-transaction.component').then(m => m.WithdrawalsTransactionComponent)
      },

      { 
        path: 'reviews', 
        loadComponent: () => import('./pages/reviews/reviews.component').then(m => m.ReviewsComponent)
      },
      { 
        path: 'reviewDetails', 
        loadComponent: () => import('./pages/reviews/review-details/review-details.component').then(m => m.ReviewDetailsComponent)
      },

      { 
        path: 'tech-reviews', 
        loadComponent: () => import('./pages/reviewtechnical-table/reviewtechnical-table.component').then(m => m.ReviewtechnicalTableComponent)
      },

      { 
        path: 'package', 
        loadComponent: () => import('./pages/package/package-table/package-table.component').then(m => m.PackageTableComponent)
      },
      { 
        path: 'package/add', 
        loadComponent: () => import('./pages/package/package-details/package-details.component').then(m => m.PackageDetailsComponent)
      },
      { 
        path: 'package/view/:id', 
        loadComponent: () => import('./pages/package/package-details/package-details.component').then(m => m.PackageDetailsComponent)
      },
      { 
        path: 'package/edit/:id', 
        loadComponent: () => import('./pages/package/package-details/package-details.component').then(m => m.PackageDetailsComponent)
      },

      { 
        path: 'technical-specialist', 
        loadComponent: () => import('./pages/technical-specialist/technical-specialist-table/technical-specialist-table.component').then(m => m.TechnicalSpecialistTableComponent)
      },
      { 
        path: 'technical-specialist/add', 
        loadComponent: () => import('./pages/technical-specialist/technical-specialist-details/technical-specialist-details.component').then(m => m.TechnicalSpecialistDetailsComponent)
      },
      { 
        path: 'technical-specialist/view/:id', 
        loadComponent: () => import('./pages/technical-specialist/technical-specialist-details/technical-specialist-details.component').then(m => m.TechnicalSpecialistDetailsComponent)
      },
      { 
        path: 'technical-specialist/edit/:id', 
        loadComponent: () => import('./pages/technical-specialist/technical-specialist-details/technical-specialist-details.component').then(m => m.TechnicalSpecialistDetailsComponent)
      },

      { 
        path: 'equipments', 
        loadComponent: () => import('./pages/equipments/equipments-table/equipments-table.component').then(m => m.EquipmentsTableComponent)
      },
      { 
        path: 'equipment/add', 
        loadComponent: () => import('./pages/equipments/equipments-details/equipments-details.component').then(m => m.EquipmentsDetailsComponent)
      },
      { 
        path: 'equipment/view/:id', 
        loadComponent: () => import('./pages/equipments/equipments-details/equipments-details.component').then(m => m.EquipmentsDetailsComponent)
      },
      { 
        path: 'equipment/edit/:id', 
        loadComponent: () => import('./pages/equipments/equipments-details/equipments-details.component').then(m => m.EquipmentsDetailsComponent)
      },

      { 
        path: 'orders', 
        loadComponent: () => import('./pages/orders/orders-table/orders-table.component').then(m => m.OrdersTableComponent)
      },
      { 
        path: 'order/add', 
        loadComponent: () => import('./pages/orders/orders-details/orders-details.component').then(m => m.OrdersDetailsComponent)
      },
      { 
        path: 'order/view/:id', 
        loadComponent: () => import('./pages/orders/orders-details/orders-details.component').then(m => m.OrdersDetailsComponent)
      },
      { 
        path: 'order/edit/:id', 
        loadComponent: () => import('./pages/orders/orders-details/orders-details.component').then(m => m.OrdersDetailsComponent)
      },

      { 
        path: 'contact-us', 
        loadComponent: () => import('./pages/contact-us/contact-us-table/contact-us-table.component').then(m => m.ContactUsTableComponent)
      },
      { 
        path: 'contact-us/add', 
        loadComponent: () => import('./pages/contact-us/contact-us-details/contact-us-details.component').then(m => m.ContactUsDetailsComponent)
      },
      { 
        path: 'contact-us/view/:id', 
        loadComponent: () => import('./pages/contact-us/contact-us-details/contact-us-details.component').then(m => m.ContactUsDetailsComponent)
      },
      { 
        path: 'contact-us/edit/:id', 
        loadComponent: () => import('./pages/contact-us/contact-us-details/contact-us-details.component').then(m => m.ContactUsDetailsComponent)
      },

      { 
        path: 'about-us', 
        loadComponent: () => import('./pages/about-us/about-us-table/about-us-table.component').then(m => m.AboutUsTableComponent)
      },
      { 
        path: 'about-us/add', 
        loadComponent: () => import('./pages/about-us/about-us-details/about-us-details.component').then(m => m.AboutUsDetailsComponent)
      },
      { 
        path: 'about-us/view/:id', 
        loadComponent: () => import('./pages/about-us/about-us-details/about-us-details.component').then(m => m.AboutUsDetailsComponent)
      },
      { 
        path: 'about-us/edit/:id', 
        loadComponent: () => import('./pages/about-us/about-us-details/about-us-details.component').then(m => m.AboutUsDetailsComponent)
      },

      { 
        path: 'special-order', 
        loadComponent: () => import('./pages/special-order/special-order-table/special-order-table.component').then(m => m.SpecialOrderTableComponent)
      },
      { 
        path: 'special-order/view/:id', 
        loadComponent: () => import('./pages/special-order/special-order-details/special-order-details.component').then(m => m.SpecialOrderDetailsComponent)
      },
      { 
        path: 'special-order/edit/:id', 
        loadComponent: () => import('./pages/special-order/special-order-details/special-order-details.component').then(m => m.SpecialOrderDetailsComponent)
      },
    ]
  },
  { 
    path: '**', 
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
