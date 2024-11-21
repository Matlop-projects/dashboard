import { Component, OnInit } from '@angular/core';
import { EType, IcolHeader, TableComponent } from "../../components/table/table.component";
import { IPaginator, IPaignatotValue, PaginatorComponent } from '../../components/paginator/paginator.component';
import { products } from '../../conts';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TableComponent,PaginatorComponent,NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  paginatorOptions:IPaginator={
    displayItem:5,
    totalRecords:0,
  }
  paginatorValue:IPaignatotValue={
    first:0,
    page:1,
    pageCount:0,
    rows:0
  }
  data:any=[]
    columns:IcolHeader []= [
        { keyName: '', header: '',type:EType.index},
        { keyName: 'code', header: 'Code',type:EType.text},
        { keyName: 'name', header: 'Name',type:EType.text },
        { keyName: 'category', header: 'Category',type:EType.text },
        { keyName: 'imaged', header: 'imag',type:EType.image },
        { keyName: 'asd', header: 'prod',type:EType.object ,nested:{img:'image',text:'name'}},
        { keyName: 'status', header: 'prod',type:EType.status},
    ];
  ngOnInit() {
    this.data=products  
    this.paginatorOptions.totalRecords=this.data.length
  }

  onPageChange(event:any){
    this.paginatorValue=event
    console.log("DashboardComponent  onPageChange  this.paginatorValue:", this.paginatorValue)
// this.datafilterd =this.paginateArray(this.data,event)
  }
 
  // paginateArray(array: any[], { page, first, rows }: { page: number; first: number; rows: number }) {
  //   const startIndex = (first) + (page + 1) * rows;
  //   return array.slice(startIndex, startIndex + rows);
  // }
}
