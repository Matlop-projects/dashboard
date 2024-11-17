import { NgClass } from '@angular/common';
import { Component, DoCheck, OnChanges, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Tree } from 'primeng/tree';
@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [NgClass,RouterLink,RouterLinkActive,Tree],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent implements OnChanges ,DoCheck ,OnInit{
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
    },
    {
      id:3,
      name:'home',
      path:'/m',
      icon:'',
      selected:false
    },
    {
      id:3,
      name:'home',
      path:'/m',
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
    , {
      id:3,
      name:'home',
      path:'/m',
      icon:'',
      selected:false
    }
  ]
  showCollabseMenu:boolean=false
  closeMenu:boolean=false
  openMenu:boolean=true
  ngOnChanges() {
    if(this.showCollabseMenu)
     this.displaySmallScreen()
  }
  ngDoCheck() {
    if(this.showCollabseMenu)
     this.displaySmallScreen()
  }
  ngOnInit() {
      this.displaySmallScreen()
  }

  displaySmallScreen(){
    if(window.innerWidth<500){
      this.showCollabseMenu=true;
      this.openMenu=false;
      this.closeMenu=true
    }
      
    else
    this.showCollabseMenu=false

    console.log("SideNavComponent  displaySmallScreen  window.innerWidth:", window.innerWidth)

  }
  close(){
   this.openMenu=!this.openMenu
  //  if(this.openMenu)
  //    this.openMenu=false
   this.displaySmallScreen()
   
  }
  collapse_menu(){
    this.showCollabseMenu=false;
    this.closeMenu=false;
    this.openMenu=true
    console.log("SideNavComponent  collapse_menu   this.showCollabseMenu:",  this.showCollabseMenu)
  }
  onMouseOver(){
    console.log('gg',this.showCollabseMenu)

    if(!this.openMenu)
      this.closeMenu=false
   
  }
  onMouseLeave(){
    console.log('gg',this.showCollabseMenu)
    if(!this.openMenu)
      this.closeMenu=true
    
  }

  navigateToPath(path:any){
  console.log("SideNavComponent  navigateToPath  path:", path)

  }

  
    /* NodeService */


}
