import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';
import { LanguageService } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { menuItems } from '../../contants';

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

  routingList = menuItems

  ngOnInit(): void {
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
    })
  }

}
