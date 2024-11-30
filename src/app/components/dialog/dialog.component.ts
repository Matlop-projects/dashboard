import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [Dialog,ButtonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
@Input()visible:boolean=false
@Input()header:string='Confirmation'
@Input()message:string='You will lost your changes ?'
}
