import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';
import { LanguageService } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgFor , Tooltip , TranslateModule , RouterModule , RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  selectedLang: any;
  languageService = inject(LanguageService);

  routingList = [
    {icon: 'pi pi-home' , label: 'DASHBOARD' , route: '/dashboard'},
    {icon: 'pi pi-users' , label: 'CLIENTS' , route: '/clients'},
    {icon: 'pi pi-truck' , label: 'ORDERS' , route: '/orders'},
    {icon: 'pi pi-users' , label: 'PROVIDERS' , route: '/providers'},
    {icon: 'pi pi-clock' , label: 'WORKING HOURS' , route: '/working_hours'},

  ]

  ngOnInit(): void {
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
    })
  }

}
