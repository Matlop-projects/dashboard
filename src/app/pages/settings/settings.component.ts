import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [Menubar, RouterOutlet],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Public Pages',
        icon: 'pi pi-globe',
        items: [
          {
            label: 'FAQs',
            icon: 'pi pi-question',
            routerLink: '/settings/faqs'
          },
          {
            label: 'Terms & Conditions',
            icon: 'pi pi-eject',
            routerLink: '/settings/terms_conditions'
          },
          {
            label: 'Privacy Policy',
            icon: 'pi pi-eject',
            routerLink: '/settings/privacy_policy'
          }
        ]
      },
      {
        label: 'Social Media',
        icon: 'pi pi-share-alt',
        routerLink: '/settings/social_media'
      },
      {
        label: 'Slider',
        icon: 'pi pi-images',
        routerLink: '/settings/slider'
      },
      {
        label: 'Roles',
        icon: 'pi pi-bolt',
        routerLink: '/settings/roles'
      },
      {
        label: 'District',
        icon: 'pi pi-building',
        routerLink: '/settings/district'
      },
      {
        label: 'Admin',
        icon: 'pi pi-users',
        routerLink: '/settings/admin'
      },
      {
        label: 'Add Notification',
        icon: 'pi pi-bell',
        routerLink:'/settings/add_notification'
      }
    ]
  }
}

