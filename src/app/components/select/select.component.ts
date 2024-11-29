import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { Select } from 'primeng/select';
@Component({
  selector: 'app-select',
  standalone: true,
  imports: [MultiSelectModule,Select,NgIf, ReactiveFormsModule,FormsModule,ButtonModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss'
})
export class SelectComponent implements OnInit {
@Input()label:string=''
@Input()placeholder:any
@Input()showImage:boolean=false
@Input()disabled:boolean=false
@Input()readOnly:boolean=false
@Input()list:any=[]
@Input()type:string='single'
@Input()control:any =new FormControl()

ngOnInit() {
  
  console.log("SelectComponent  onChange  item:", this.list)

}
onChange(item:any){
  console.log("SelectComponent  onChange  item:", item)
}
}
