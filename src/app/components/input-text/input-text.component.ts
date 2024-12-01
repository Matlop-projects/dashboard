import { JsonPipe, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ValidationHandlerPipePipe } from '../../pipes/validation-handler-pipe.pipe';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    ValidationHandlerPipePipe,
    InputTextModule
  ],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss'
})
export class InputTextComponent {
  @Input() label!: string;
  @Input() readOnly: boolean = false;
  @Input() disabled: boolean = false;
  @Input() placeholder: string = '';
  @Input() control: any = new FormControl();


  OnInit(){
    console.log("InputTextComponent  control:", this.control)

  }
}
