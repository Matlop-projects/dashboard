import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [TableModule,NgFor,NgIf,JsonPipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  cols = [
    { display: 'code', header: 'Code',type:'text'},
    { display: 'name', header: 'Name',type:'text' },
    { display: 'category', header: 'Category',type:'text' },
    { display: 'imaged', header: 'imag',type:'image' },
    { display: 'asd', header: 'prod',type:'object' ,obj:{img:'image',text:'name'}},
    { display: 'status', header: 'prod',type:'status'},


    
];
products=[
  {
    id: '1000',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    imaged: 'https://primefaces.org/cdn/primeng/images/demo/product/bamboo-watch.jpg',
    asd:{
         name:'aaaa',
         image:'https://primefaces.org/cdn/primeng/images/demo/product/bamboo-watch.jpg'
    },
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5,
    status:'complete'
},
{
  id: '1000',
  code: 'f230fh0g3',
  name: 'Bamboo Watch',
  description: 'Product Description',
  imaged: 'https://primefaces.org/cdn/primeng/images/demo/product/bamboo-watch.jpg',
  price: 65,
  category: 'Accessories',
  quantity: 24,
  inventoryStatus: 'INSTOCK',
  rating: 5,
  status:'inProgress',
  asd:{
    name:'mmm',
    image:'https://primefaces.org/cdn/primeng/images/demo/product/bamboo-watch.jpg'
},
},
{
  id: '1000',
  code: 'f230fh0g3',
  name: 'Bamboo Watch',
  description: 'Product Description',
  imaged: 'https://primefaces.org/cdn/primeng/images/demo/product/bamboo-watch.jpg',
  price: 65,
  category: 'Accessories',
  quantity: 24,
  inventoryStatus: 'INSTOCK',
  rating: 5,
  status:'cancel',
  asd:{
    name:'ccc',
    image:'https://primefaces.org/cdn/primeng/images/demo/product/bamboo-watch.jpg'
},
},
]
}
