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
            label: 'Features',
            icon: 'pi pi-star',
            // routerLink:'/settings/faqs'
        },
        {
            label: 'Public Pages',
            icon: 'pi pi-globe',
            items: [
                {
                    label: 'FAQs',
                    icon: 'pi pi-question',
                    routerLink:'/settings/faqs'
                },
                {
                    label: 'Blocks',
                    icon: 'pi pi-server'
                },
                {
                    label: 'UI Kit',
                    icon: 'pi pi-pencil'
                }
            ]
        }
    ]
}
}

