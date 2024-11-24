import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [MultiSelectModule,NgIf],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss'
})
export class SelectComponent {
@Input()label:string=''
@Input()placeholder:string=''
@Input()showImage:boolean=false
@Input()list:any=[]

}
