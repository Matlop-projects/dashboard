import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Tree } from 'primeng/tree';
@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [NgClass,RouterLink,RouterLinkActive,Tree],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {
  menu=[
    {
      id:1,
      name:'home',
      path:'/home',
      icon:'',
      selected:false
    },
    {
      id:2,
      name:'home',
      path:'/user',
      icon:'',
      selected:false
    },
    {
      id:3,
      name:'home',
      path:'/m',
      icon:'',
      selected:false
    }
  ]
  closeMenu:boolean=false
  openMenu:boolean=true
  close(){
   this.openMenu=!this.openMenu
  console.log("SideNavComponent  close  this.closeMenu=:", this.openMenu)
  }
  onMouseOver(){
  
    if(!this.openMenu)
      this.closeMenu=false
   
  }
  onMouseLeave(){
    if(!this.openMenu)
      this.closeMenu=true
    
  }

  navigateToPath(path:any){
  console.log("SideNavComponent  navigateToPath  path:", path)

  }

  
    /* NodeService */
 asd ={
  key: '0',
  label: 'Documents',
  data: 'Documents Folder',
  icon: 'pi pi-fw pi-inbox',
  children: [
      {
          key: '0-0',
          label: 'Work',
          data: 'Work Folder',
          icon: 'pi pi-fw pi-cog',
          children: [
              { key: '0-0-0', label: 'Expenses.doc', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
              { key: '0-0-1', label: 'Resume.doc', icon: 'pi pi-fw pi-file', data: 'Resume Document' }
          ]
      },
      {
          key: '0-1',
          label: 'Home',
          data: 'Home Folder',
          icon: 'pi pi-fw pi-home',
          children: [{ key: '0-1-0', label: 'Invoices.txt', icon: 'pi pi-fw pi-file', data: 'Invoices for this month' }]
      }
  ]
}

}
