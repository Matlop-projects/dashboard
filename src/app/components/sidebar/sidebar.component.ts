import { NgFor, UpperCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';
import { LanguageService } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { menuItems } from '../../conts';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgFor , Tooltip ,UpperCasePipe, TranslateModule , RouterModule , RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  baseImageUrl=environment.baseImageUrl
  selectedLang: any;
  languageService = inject(LanguageService);
  userDate=JSON.parse(localStorage.getItem('userData')as any);
  defaultImage=this.userDate.gender==1?'assets/images/arabian-man.png':'assets/images/arabian-woman.png'
  routingList = menuItems

  ngOnInit(): void {
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
    })
  }

}
