import { JsonPipe, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ValidationHandlerPipePipe } from '../pipes/validation-handler-pipe.pipe';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    ValidationHandlerPipePipe
  ],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss'
})
export class InputTextComponent {
  @Input() label!: string;
  @Input() readOnly: boolean=false;
  @Input() disabled: boolean=false;
  @Input() placeholder: string = '';
  @Input() control: any =new FormControl();
}
