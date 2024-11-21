import { Component } from '@angular/core';
import { TableComponent } from "../../components/table/table.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
