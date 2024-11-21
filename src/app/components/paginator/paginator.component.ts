import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
export interface IPaginator {
  label?:string;
  showFirstLastIcon?: boolean;
  totalRecords: number;
  displayItem: number;
}
export interface IPaignatotValue{
  page: number, 
  first: number, 
  rows: number, 
  pageCount:number
}
@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [PaginatorModule, ButtonModule, DividerModule, FormsModule,DropdownModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {
  @Output()onPageChangeValue =new EventEmitter();
  @Input({required:true})paginatorOptions:IPaginator={
     displayItem:10,
     totalRecords:0,
     label:'Item per page',
     showFirstLastIcon:false
  }

  first: number = 0;

  onPageChange(event: any) {
      console.log("PaginatorComponent  onPageChange  event:", event)
      this.first = event.first;
      this.paginatorOptions.displayItem = event.rows;
      this.onPageChangeValue.emit(event)
  }

 
}
