import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

export interface ModulePermission {
  name: string;
  route: string;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export interface UserPermissions {
  userId: number;
  roleId: number;
  roleName: string;
  modules: ModulePermission[];
}

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private permissionsSubject = new BehaviorSubject<UserPermissions | null>(null);
  public permissions$ = this.permissionsSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadPermissionsFromStorage();
  }

  /**
   * Load permissions from API and cache in sessionStorage
   */
  loadPermissions(userId: number): Observable<any> {
    return this.apiService.get(`Role/GetUserPermissions/${userId}`).pipe(
      tap((response: any) => {
        if (response?.data) {
          this.setPermissions(response.data);
        }
      })
    );
  }

  /**
   * Set permissions directly (e.g., from login response)
   * This is a public method to be called after login
   */
  setPermissions(permissions: UserPermissions): void {
    console.log('🔐 Setting permissions:', permissions);
    this.permissionsSubject.next(permissions);
    
    try {
      // Use sessionStorage instead of localStorage to avoid large headers
      const permissionsJson = JSON.stringify(permissions);
      sessionStorage.setItem('userPermissions', permissionsJson);
      console.log('✅ Permissions saved to sessionStorage successfully');
      console.log('📋 Total modules:', permissions.modules?.length);
    } catch (error) {
      console.error('❌ Error saving permissions to sessionStorage:', error);
    }
  }

  /**
   * Load permissions from sessionStorage on service initialization
   */
  private loadPermissionsFromStorage(): void {
    const stored = sessionStorage.getItem('userPermissions');
    
    if (stored) {
      try {
        const permissions = JSON.parse(stored);
        this.permissionsSubject.next(permissions);
        console.log('📦 Permissions loaded from sessionStorage:', permissions.modules?.length, 'modules');
      } catch (error) {
        console.error('❌ Error parsing stored permissions:', error);
      }
    } else {
      console.warn('⚠️ No permissions found in sessionStorage');
    }
  }

  /**
   * Get current permissions synchronously
   */
  getPermissions(): UserPermissions | null {
    
    return this.permissionsSubject.value;
  }

  /**
   * Check if user can view a specific module
   */
  canView(moduleName: string): boolean {
    const permissions = this.getPermissions();
    
    if (!permissions) {
      return false;
    }
    
    const module = permissions.modules?.find(m => 
      m.name?.toLowerCase() === moduleName?.toLowerCase()
    );
    
    return module?.canView ?? false;
  }

  /**
   * Check if user can create in a specific module
   */
  canCreate(moduleName: string): boolean {
    const permissions = this.getPermissions();
    
    if (!permissions) {
      console.warn(`⚠️ No permissions found when checking canCreate for "${moduleName}"`);
      return false;
    }
    
    const module = permissions.modules?.find(m => 
      m.name?.toLowerCase() === moduleName?.toLowerCase()
    );
    
    const canCreate = module?.canCreate ?? false;
    console.log(`🔍 canCreate("${moduleName}"):`, canCreate, '| Module found:', !!module);
    
    return canCreate;
  }

  /**
   * Check if user can update in a specific module
   */
  canUpdate(moduleName: string): boolean {
    const permissions = this.getPermissions();
    if (!permissions) return false;
    
    const module = permissions.modules.find(m => 
      m.name.toLowerCase() === moduleName.toLowerCase()
    );
    return module?.canUpdate ?? false;
  }

  /**
   * Check if user can delete in a specific module
   */
  canDelete(moduleName: string): boolean {
    const permissions = this.getPermissions();
    if (!permissions) return false;
    
    const module = permissions.modules.find(m => 
      m.name.toLowerCase() === moduleName.toLowerCase()
    );
    return module?.canDelete ?? false;
  }

  /**
   * Get module permissions by name
   */
  getModulePermissions(moduleName: string): ModulePermission | undefined {
    const permissions = this.getPermissions();
    if (!permissions) return undefined;
    
    return permissions.modules.find(m => 
      m.name.toLowerCase() === moduleName.toLowerCase()
    );
  }

  /**
   * Clear permissions (on logout)
   */
  clearPermissions(): void {
    this.permissionsSubject.next(null);
    sessionStorage.removeItem('userPermissions');
  }

  /**
   * Check if route is accessible based on permissions
   */
  canAccessRoute(route: string): boolean {
    const permissions = this.getPermissions();
    if (!permissions) return false;

    // Clean route (remove leading slash)
    const cleanRoute = route.startsWith('/') ? route.substring(1) : route;
    
    // Check if any module has this route and canView is true
    const module = permissions.modules.find(m => 
      m.route === `/${cleanRoute}` || m.route === cleanRoute
    );
    
    return module?.canView ?? false;
  }
}

