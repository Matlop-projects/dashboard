import { Component, Inject, inject} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { AutoComplete } from 'primeng/autocomplete';
import { Select } from 'primeng/select';
import { LanguageService } from '../../services/language.service';
import { ToasterService } from '../../services/toaster.service';
import { DOCUMENT, NgFor } from '@angular/common';
import { PrimeNG } from 'primeng/config';
import { InputGroup } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { NotificationsComponent } from "../notifications/notifications.component";



interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [TranslateModule,TranslatePipe, RouterModule, AutoComplete, FormsModule, Select, NotificationsComponent , InputGroup, InputTextModule, NgFor, NotificationsComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  items = [
    { "route": "/dashboard", "nameEn": "DASHBOARD", "nameAr": "لوحة التحكم", "name": "DASHBOARD - لوحة التحكم" },
    { "route": "/clients", "nameEn": "CLIENTS", "nameAr": "العملاء", "name": "CLIENTS - العملاء" },
    { "route": "/technicals", "nameEn": "TECHNICALS", "nameAr": "الفنيين", "name": "TECHNICALS - الفنيين" },
    { "route": "/orders", "nameEn": "ORDERS", "nameAr": "الطلبات", "name": "ORDERS - الطلبات" },
    { "route": "/special-order", "nameEn": "SPECIAL ORDERS", "nameAr": "الطلبات الخاصة", "name": "SPECIAL ORDERS - الطلبات الخاصة" },
    { "route": "/services", "nameEn": "SERVICES", "nameAr": "الخدمات", "name": "SERVICES - الخدمات" },
    { "route": "/contract-type", "nameEn": "CONTRACT TYPE", "nameAr": "نوع العقد", "name": "CONTRACT TYPE - نوع العقد" },
    { "route": "/package", "nameEn": "PACKAGE", "nameAr": "الباقات", "name": "PACKAGE - الباقات" },
    { "route": "/working_hours", "nameEn": "WORKING HOURS", "nameAr": "ساعات العمل", "name": "WORKING HOURS - ساعات العمل" },
    { "route": "/country", "nameEn": "COUNTRIES", "nameAr": "الدول", "name": "COUNTRIES - الدول" },
    { "route": "/city", "nameEn": "CITIES", "nameAr": "المدن", "name": "CITIES - المدن" },
    { "route": "/cancel-reason", "nameEn": "CANCEL REASON", "nameAr": "سبب الإلغاء", "name": "CANCEL REASON - سبب الإلغاء" },
    { "route": "/complaint", "nameEn": "COMPLAINT", "nameAr": "الشكاوى", "name": "COMPLAINT - الشكاوى" },
    { "route": "/copone", "nameEn": "COUPON", "nameAr": "الكوبونات", "name": "COUPON - الكوبونات" },
    { "route": "/paymentWay", "nameEn": "PAYMENT WAY", "nameAr": "طرق الدفع", "name": "PAYMENT WAY - طرق الدفع" },
    { "route": "/technical-specialist", "nameEn": "TECHNICAL SPECIALIST", "nameAr": "تخصص الفني", "name": "TECHNICAL SPECIALIST - تخصص الفني" },
    { "route": "/contact-us", "nameEn": "CONTACT US", "nameAr": "اتصل بنا", "name": "CONTACT US - اتصل بنا" },
    { "route": "/about-us", "nameEn": "ABOUT US", "nameAr": "من نحن", "name": "ABOUT US - من نحن" }
  ]

  filteredItems: any;
  value:any;
  langOptions = [
    { name: 'English', code: 'en', icon: 'assets/images/icons/en-lang.png' },
    { name: 'العربية', code: 'ar', icon: 'assets/images/icons/ar-lang.png' },
  ];
  selectedLang: string = localStorage.getItem('lang') || 'en';
  languageService = inject(LanguageService);
  toaster = inject(ToasterService);

  constructor(@Inject(DOCUMENT) private document: Document,private primeng: PrimeNG , private router: Router) {}


  search(event: AutoCompleteCompleteEvent) {
    if (!this.items || this.items.length === 0) {
      console.warn("Items list is empty or undefined");
      return;
    }

    const query = event.query.toLowerCase();
    this.filteredItems = this.items.filter((item: any) =>
      item.name.toLowerCase().includes(query) || item.name.toLowerCase().includes(query)
    );
  }

  navigateToRoute(selectedItem: any) {
    console.log(selectedItem);

    if (selectedItem && selectedItem.value.route) {
      this.router.navigate([selectedItem.value.route]);
    }
  }



  ngOnInit(): void {
    this.primeng.ripple.set(true);
    this.initAppTranslation();
  }

  public initAppTranslation() {
    this.languageService.changeAppDirection(this.selectedLang);
    this.languageService.changeHtmlLang(this.selectedLang);
    this.languageService.use(this.selectedLang);
  }

  onLangChange() {
    this.languageService.change(this.selectedLang)
    this.document.body.dir = this.selectedLang === 'ar' ? 'rtl' : 'ltr';
    this.selectedLang === 'en'
      ? document.getElementsByTagName('html')[0].setAttribute('dir', 'ltr')
      : document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
    this.selectedLang === 'en'
      ? document.getElementsByTagName('html')[0].setAttribute('lang', 'en')
      : document.getElementsByTagName('html')[0].setAttribute('lang', 'ar');

      document.documentElement.setAttribute('lang', this.selectedLang);
      if (this.selectedLang === 'ar') {
        document.documentElement.classList.add('arabic');
      } else {
        document.documentElement.classList.remove('arabic');
      }

  }

  logout() {
    localStorage.removeItem('token');

  }
}
