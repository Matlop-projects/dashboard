import { Component, Inject, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LanguageService } from './services/language.service';
import { DOCUMENT } from '@angular/common';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ToasterService } from './services/toaster.service';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { PrimeNG } from 'primeng/config';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSpinnerModule, Select , FormsModule , TranslateModule , Toast],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService , ToasterService , PrimeNG]
})


export class AppComponent {

  showChat: boolean = false;
  langOptions = [
    { name: 'English', code: 'en', icon: 'assets/images/icons/en-lang.png' },
    { name: 'العربية', code: 'ar', icon: 'assets/images/icons/ar-lang.png' },
  ];
  selectedLang: string = localStorage.getItem('lang') || 'en'

  languageService = inject(LanguageService);
  toaster = inject(ToasterService);

  constructor(@Inject(DOCUMENT) private document: Document,private primeng: PrimeNG) { }

  ngOnInit(): void {
    this.primeng.ripple.set(true);
    this.initAppTranslation();
    this.toaster.successToaster('GENERAL');
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

  }
}
