import { Component, inject } from '@angular/core';
import { EType, IcolHeader, TableComponent } from '../../../components/table/table.component';
import { IPaginator, IPaignatotValue, PaginatorComponent } from '../../../components/paginator/paginator.component';
import { ApiService } from '../../../services/api.service';
import { environment } from '../../../../environments/environment';
import { Router, RouterModule } from '@angular/router';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Panel } from 'primeng/panel';
import { NgFor } from '@angular/common';
import { LanguageService } from '../../../services/language.service';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Card } from 'primeng/card';


@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [TableComponent, PaginatorComponent, Card, NgFor, Accordion, AccordionHeader, AccordionPanel, AccordionContent, FormsModule, BreadcrumpComponent, RouterModule, InputTextModule],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.scss'
})
export class FaqsComponent {

  private ApiService = inject(ApiService)
  private router = inject(Router)
  paginatorOptions: IPaginator = {
    displayItem: 5,
    totalRecords: 0,
  }
  paginatorValue: IPaignatotValue = {
    first: 0,
    page: 1,
    pageCount: 0,
    rows: 0
  }

  bredCrumb: IBreadcrumb = {
    crumbs: [
      {
        label: 'Home',
        routerLink: '/dashboard',
      },
      {
        label: 'FAQs',
      },
    ]
  }

  searchValue: any = '';
  filteredData: any;

  faqsList: any = []
  columns: IcolHeader[] = [
    { keyName: 'questionId', header: 'Id', type: EType.text },
    { keyName: 'enTitle', header: 'Question (en)', type: EType.text },
    { keyName: 'arTitle', header: 'Question (ar)', type: EType.text },
    { keyName: 'enDescription', header: 'Answer (en)', type: EType.text },
    { keyName: 'enTitle', header: 'Answer (Ar)', type: EType.text },
  ];

  selectedLang: any;
  languageService = inject(LanguageService);

  ngOnInit() {
    this.getAllFAQS();
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
    })
    // this.data=products
    // this.paginatorOptions.totalRecords=this.data.length
  }

  getAllFAQS() {
    this.ApiService.get(environment.baseUrl, 'FAQs/GetAll').subscribe((res: any) => {
      if (res) {
        this.faqsList = res.data;
        this.filteredData = [...this.faqsList]; // Initialize filtered data
        this.paginatorOptions.totalRecords = res.data.length;
        console.log('FAQs loaded:', this.faqsList);
      }

    })
  }

  onPageChange(event: any) {
    this.paginatorValue = event
    // console.log("DashboardComponent  onPageChange  this.paginatorValue:", this.paginatorValue)
    // this.datafilterd =this.paginateArray(this.data,event)
  }

  filterData() {
    this.faqsList = this.filteredData;
    const search = this.searchValue.toLowerCase();
    console.log(search);
    console.log(this.searchValue.length);


    if (this.searchValue.length == 1) {
      this.faqsList = this.filteredData;
      return;
    }

    this.faqsList = this.faqsList.filter((item: any) =>
      item.enTitle.toLowerCase().includes(search) ||
      item.arTitle.toLowerCase().includes(search) ||
      item.enDescription.toLowerCase().includes(search) ||
      item.arDescription.toLowerCase().includes(search)
    );
  }

  // paginateArray(array: any[], { page, first, rows }: { page: number; first: number; rows: number }) {
  //   const startIndex = (first) + (page + 1) * rows;
  //   return array.slice(startIndex, startIndex + rows);
  // }
}
