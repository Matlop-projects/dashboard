import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IEditImage } from './editImage.interface';
import { NgIf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-mode-image',
  standalone: true,
  imports: [NgIf,TranslatePipe],
  templateUrl: './edit-mode-image.component.html',
  styleUrl: './edit-mode-image.component.scss'
})
export class EditModeImageComponent {
  pattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6})([\/\w.-]*)*\/?$/;
  @Input() editImageProps!: IEditImage;
  @Input() imgWidth="50"
  @Input()type='image'
  @Input()hideEditBtn=false
  @Output() onFileRemoved =new EventEmitter()
@Input()action='Add'
  ngOnInit(): void {
   
  }
  isValidURL(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
  
      // Extract the hostname (e.g., "wardaweb-001-site1.qtempurl.com")
      const hostname = parsedUrl.hostname;
  
      // Validate that the hostname ends with a proper top-level domain (TLD)
      const validTLD = /\.(com|net|org|edu|gov|io|info|biz|co|me|tech|ai|dev|app|us|uk|ca)$/i;
      
      return validTLD.test(hostname);
    } catch (_) {
      return false;
    }
  }
  onEdit(){
    this.onFileRemoved.emit(null)

  }
}
