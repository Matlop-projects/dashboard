import { Component, inject } from '@angular/core';
import { EType, IcolHeader, TableComponent } from '../../../components/table/table.component';
import { IPaginator, IPaignatotValue, PaginatorComponent } from '../../../components/paginator/paginator.component';
import { NgIf } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [TableComponent,PaginatorComponent,NgIf],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.scss'
})
export class FaqsComponent {

  private ApiService =inject(ApiService)
  private router =inject(Router)
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
  faqsList:any=[]
    columns:IcolHeader []= [
        { keyName: 'questionId', header: 'Id',type:EType.text},
        { keyName: 'enTitle', header: 'Title (en)',type:EType.text },
        { keyName: 'arTitle', header: 'Title(ar)',type:EType.text },
        { keyName: 'enDescription', header: 'Description(en)',type:EType.text },
        { keyName: 'enTitle', header: 'Description(Ar)',type:EType.text},
    ];
  ngOnInit() {
    this.getAllFAQS()
    
    // this.data=products  
    // this.paginatorOptions.totalRecords=this.data.length
  }

 getAllFAQS(){
   this.ApiService.get(environment.baseUrl,'FAQs/GetAll').subscribe((res:any) => {
     if(res){
      this.faqsList=res.data
      // this.paginatorOptions.totalRecords=res.data.length
      console.log("FaqsComponent  this.ApiService.get  res:", this.faqsList)
     }
      
   })
 }
 addFAQS(){
  this.router.navigateByUrl('faqs/add')
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
