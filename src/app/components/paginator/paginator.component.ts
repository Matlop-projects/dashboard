import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { NgIf } from '@angular/common';
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
  imports: [PaginatorModule, ButtonModule, DividerModule, FormsModule,DropdownModule,NgIf],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent implements OnInit ,OnChanges{
  @Output()onPageChangeValue =new EventEmitter();
  @Input({required:true})records:any=[]
  @Input({required:true})paginatorOptions:IPaginator={
     displayItem:10,
     totalRecords:this.records.length,
     label:'Item per page',
     showFirstLastIcon:false
  }

  first: number = 0;
ngOnInit() {
  // console.log("Paginator innnnnt:", this.records)

}
ngOnChanges(){
  this.paginatorOptions.totalRecords=this.records.length
  // console.log("Paginator innnnnt:", this.records)

}
  onPageChange(event: any) {
      // console.log("PaginatorComponent  onPageChange  event:", event)
      this.first = event.first;
      this.paginatorOptions.displayItem = event.rows;
      this.onPageChangeValue.emit(event)
  }


}
