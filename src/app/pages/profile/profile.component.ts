import { Component } from '@angular/core';
import { BreadcrumpComponent } from "../../components/breadcrump/breadcrump.component";
import { IBreadcrumb } from '../../components/breadcrump/cerqel-breadcrumb.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [BreadcrumpComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  bredCrumb: IBreadcrumb = {
    crumbs: [
      {
        label: 'Home',
        routerLink: '/dashboard',
      },
      {
        label: 'Profile',
      },
    ]
  }

}
