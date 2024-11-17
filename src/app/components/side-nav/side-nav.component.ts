import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [NgClass],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {

  closeMenu:boolean=false
  openMenu:boolean=true
  close(){
   this.openMenu=!this.openMenu
  console.log("SideNavComponent  close  this.closeMenu=:", this.openMenu)
  }
  onMouseOver(){
  
    if(this.openMenu)
      this.closeMenu=false
    else
    this.closeMenu=true
  }
  onMouseLeave(){
    if(this.openMenu)
      this.closeMenu=true
    else
    this.closeMenu=false
  }
}
