import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [DrawerModule],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss'
})
export class DrawerComponent implements OnInit, OnChanges {
  @Output() onClose = new EventEmitter()
  @Input() visible: boolean = false;
  @Input() header: string = ""
  languageService = inject(LanguageService);
  selectedLang: any;

  ngOnInit() {
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
    })
  }

  ngOnChanges() {
  }

  onHide($event:any){
    this.onClose.emit(true)

  }

}
