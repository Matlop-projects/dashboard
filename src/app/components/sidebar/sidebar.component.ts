import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';
import { LanguageService } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { menuItems } from '../../conts';
import { environment } from '../../../environments/environment';
import { PermissionsService } from '../../services/permissions.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgFor, NgIf, Tooltip, UpperCasePipe, TranslateModule, RouterModule, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  baseImageUrl=environment.baseImageUrl
  selectedLang: any;
  userDate=JSON.parse(localStorage.getItem('userData')as any);
  defaultImage=this.userDate.gender==1?'assets/images/arabian-man.png':'assets/images/arabian-woman.png'
  routingList = menuItems
  filteredRoutingList: any[] = menuItems;

  constructor(
    private languageService: LanguageService,
    private permissionsService: PermissionsService
  ) {}

  ngOnInit(): void {
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
    })

    // Filter menu items based on permissions
    this.filterMenuByPermissions();
    
    // Subscribe to permissions changes
    this.permissionsService.permissions$.subscribe(() => {
      this.filterMenuByPermissions();
    });
  }

  private filterMenuByPermissions(): void {
    this.filteredRoutingList = this.routingList.filter(item => {
      // Always show Dashboard
      if (item.moduleName === 'Dashboard' || item.moduleName === 'Dashborad') {
        return true;
      }
      // Check if user has view permission for this module
      return this.permissionsService.canView(item.moduleName);
    });
  }

  canViewSettings(): boolean {
    // Check if user has permission to view any settings module
    const settingsModules = ['Settings', 'Admin', 'District', 'FAQs', 'Notification', 
                             'OrderDefaultImage', 'OurClients', 'PrivacyPolicy', 
                             'Roles', 'Slider', 'TermsAndConditions'];
    
    return settingsModules.some(module => this.permissionsService.canView(module));
  }

  canViewProfile(): boolean {
    const permissions = this.permissionsService.getPermissions();
    
    if (!permissions || !permissions.modules) {
      return false;
    }
    const hasProfilePermission = this.permissionsService.canView('Profile');
    return hasProfilePermission;
  }

}
