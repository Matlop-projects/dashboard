import {  NgFor, NgIf } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { IPaignatotValue } from '../paginator/paginator.component';

export enum EType {
  text="text",
  image="image",
  object="object",
  status="status",
  index="index"
}
interface INested{
  img:string,
  text:string
}
export interface IcolHeader {
    header:string,
     keyName:string,
     type:EType,
     nested?:INested
}
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [TableModule,NgFor,NgIf],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})

export class TableComponent implements OnInit ,OnChanges{
  @Input()showrecordIndex=false
  @Input({required:true})records:any=[]
  @Input()hasPaginator:boolean=true
  filterdRecords:any=[]
  @Input({required:true})colsHeader:IcolHeader[]=[]
  // @Input()paginatorValue:IPaignatotValue={
  //     first:0,
  //     page:0,
  //     pageCount:0,
  //     rows:0
  // }
ngOnInit() {
  this.filterdRecords=this.records
  console.log("TableComponent  ngOnInit   this.filterdRecords:",  this.filterdRecords)
  // console.log("'''''---------'''''")
  //    if(this.hasPaginator)
  //     this.filterdRecords=  this.paginateArray(this.records,{
  //       first:0,
  //       page:1,
  //       pageCount:0,
  //       rows:5
  //     })
 }
ngOnChanges() {
  this.filterdRecords=this.records
  // console.log("''''''''''")
  //   this.filterdRecords=  this.paginateArray(this.records,this.paginatorValue)


}
// //  { page, first, rows }: { page: number; first: number; rows: number }
//  paginateArray(array: any[],paginatorValue:any ) {
//   const startIndex = (paginatorValue.first) + (paginatorValue.page + 1) * paginatorValue.rows;
//   console.log("dd", startIndex,'------------------', startIndex + paginatorValue.rows)
//   return array.slice(startIndex, startIndex + paginatorValue.rows);
// }
}