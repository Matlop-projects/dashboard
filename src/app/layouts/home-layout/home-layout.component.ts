import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { LanguageService } from '../../services/language.service';
import { ToasterService } from '../../services/toaster.service';
import { SideNavComponent } from '../../components/side-nav/side-nav.component';

@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [RouterOutlet , Toast ,SideNavComponent],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.scss'
})
export class HomeLayoutComponent {

  selectedLang: any;
  languageService = inject(LanguageService);
  toaster = inject(ToasterService);


  ngOnInit(): void {
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.toaster.successToaster('GENERAL');
    })
  }

}
