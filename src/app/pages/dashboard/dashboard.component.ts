import { NgFor, NgIf } from '@angular/common';
import { Component} from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf,NgFor],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  items:any=[
   {
     name:'عدد العملاء',
     value:' 80',
     img:'assets/images/cr-1.PNG'
   },
   {
    name:'عدد موظفي الادارة',
    value:' 17',
    img:'assets/images/cr-2.PNG'
  },
  {
    name:'عدد مقدمي الخدمة',
    value:' 69',
    img:'assets/images/cr-3.PNG'
  },
  {
    name:'عدد الدول',
    value:' 2',
    img:'assets/images/cr-1.PNG'
  },
  {
    name:'عدد المدن',
    value:' 25',
    img:'assets/images/cr-4.PNG'
  },
  {
   name:'عدد الاقسام',
   value:' 50',
   img:'assets/images/cr-2.PNG'
 },
 {
   name:'عدد الطلبات',
   value:' 16',
   img:'assets/images/cr-3.PNG'
 },
 {
   name:' اجمالي طلبات اليوم',
   value:' 25',
   img:'assets/images/cr-1.PNG'
 },
 {
  name:' اجمالي طلبات الاسبوع',
  value:' 250',
  img:'assets/images/cr-2.PNG'
},
{
 name:' اجمالي طلبات الشهر',
 value:' 0',
 img:'assets/images/cr-2.PNG'
},
{
  name:' اجمالي الارباح الشهر',
  value:' 0',
  img:'assets/images/cr-4.PNG'
},
{
 name:'عدد طلبات الموبايل',
 value:' 25',
 img:'assets/images/cr-3.PNG'
}
  ]
}
