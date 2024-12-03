import { Component, Input } from '@angular/core';
import { IEditImage } from './editImage.interface';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-edit-mode-image',
  standalone: true,
  imports: [NgIf],
  templateUrl: './edit-mode-image.component.html',
  styleUrl: './edit-mode-image.component.scss'
})
export class EditModeImageComponent {
  @Input() editImageProps!: IEditImage;

}
