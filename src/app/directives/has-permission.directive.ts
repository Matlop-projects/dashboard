import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PermissionsService } from '../services/permissions.service';

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private hasView = false;

  @Input() appHasPermission: string = ''; // Module name
  @Input() appHasPermissionAction: 'view' | 'create' | 'update' | 'delete' = 'view';
  
  // Support microsyntax: *appHasPermission="moduleName; action: 'create'"
  @Input() set appHasPermissionThen(templateRef: TemplateRef<any>) {
    // This is for microsyntax support
  }
  
  @Input() set action(value: 'view' | 'create' | 'update' | 'delete') {
    this.appHasPermissionAction = value;
  }

  constructor(
    private permissionsService: PermissionsService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log(`🔧 Directive initialized for module: "${this.appHasPermission}", action: "${this.appHasPermissionAction}"`);
    
    // Small delay to ensure permissions are loaded
    setTimeout(() => {
      this.updateView();
    }, 0);
    
    // Listen for permission changes
    this.permissionsService.permissions$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        console.log(`🔄 Permissions changed, updating view for ${this.appHasPermission}`);
        this.updateView();
        this.cdr.markForCheck();
      });
  }

  private updateView(): void {
    const hasPermission = this.checkPermission();
    
    console.log(`📍 UpdateView called:`, {
      module: this.appHasPermission,
      action: this.appHasPermissionAction,
      hasPermission,
      currentlyShowing: this.hasView
    });
    
    if (hasPermission && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
      console.log(`✅ SHOWING element for ${this.appHasPermission} - ${this.appHasPermissionAction}`);
    } else if (!hasPermission && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
      console.log(`❌ HIDING element for ${this.appHasPermission} - ${this.appHasPermissionAction}`);
    } else if (!hasPermission && !this.hasView) {
      // Make absolutely sure it's cleared
      this.viewContainer.clear();
      console.log(`🔒 Element remains hidden for ${this.appHasPermission} - ${this.appHasPermissionAction}`);
    } else if (hasPermission && this.hasView) {
      console.log(`👁️ Element remains visible for ${this.appHasPermission} - ${this.appHasPermissionAction}`);
    }
  }

  private checkPermission(): boolean {
    if (!this.appHasPermission) {
      console.warn('⚠️ No module name specified for permission check');
      return true; // If no permission specified, show by default
    }

    let hasPermission = false;

    switch (this.appHasPermissionAction) {
      case 'view':
        hasPermission = this.permissionsService.canView(this.appHasPermission);
        break;
      case 'create':
        hasPermission = this.permissionsService.canCreate(this.appHasPermission);
        break;
      case 'update':
        hasPermission = this.permissionsService.canUpdate(this.appHasPermission);
        break;
      case 'delete':
        hasPermission = this.permissionsService.canDelete(this.appHasPermission);
        break;
      default:
        hasPermission = false;
    }

    return hasPermission;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

