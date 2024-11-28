import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';
@Component({
  selector: 'app-check-box',
  standalone: true,
  imports: [Checkbox],
  templateUrl: './check-box.component.html',
  styleUrl: './check-box.component.scss'
})
export class CheckBoxComponent {
@Input()label:string='';
@Input()disabled:boolean=false;
@Input()control:any =new FormControl()

}
