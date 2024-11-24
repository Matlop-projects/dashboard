import { JsonPipe, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Editor } from 'primeng/editor';
import { ValidationHandlerPipePipe } from '../../pipes/validation-handler-pipe.pipe';
@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [Editor,ReactiveFormsModule,FormsModule,NgIf,ValidationHandlerPipePipe,JsonPipe],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent {
  @Input() label!: string;
  @Input() readOnly: boolean=false;
  @Input() disabled: boolean=false;
  @Input() placeholder: string = '';
  @Input() control: any =new FormControl();
}
