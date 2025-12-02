# Role-Based Access Control (RBAC) Implementation Guide

## Overview
This system implements comprehensive role-based permissions for the dashboard application. Permissions are loaded from the backend after login and control visibility of:
- Sidebar menu items
- Create buttons
- Edit buttons
- Delete buttons
- View actions
- Table row actions

## Architecture

### 1. PermissionsService (`src/app/services/permissions.service.ts`)

The service manages user permissions throughout the application.

**Key Features:**
- Stores permissions in `sessionStorage` for persistence across page refreshes
- Provides reactive updates via `permissions$` Observable
- Offers methods to check specific permissions: `canView()`, `canCreate()`, `canUpdate()`, `canDelete()`

**Usage Example:**
```typescript
// Inject the service
permissionsService = inject(PermissionsService);

// Check permissions
if (this.permissionsService.canCreate('Client')) {
  // Show create button
}

// Subscribe to permission changes
this.permissionsService.permissions$.subscribe(() => {
  this.updatePermissions();
});
```

### 2. Login Integration (`src/app/pages/login/login.component.ts`)

Permissions are automatically stored after successful login:

```typescript
// In getOtpValue method
if (data.data.userId && data.data.roleId && data.data.modules) {
  const permissions = {
    userId: data.data.userId,
    roleId: data.data.roleId,
    roleName: data.data.roleName || '',
    modules: data.data.modules
  };
  this.permissionsService.setPermissions(permissions);
}
```

### 3. Sidebar Component (`src/app/components/sidebar/sidebar.component.ts`)

The sidebar automatically filters menu items based on `canView` permission:

```typescript
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
```

### 4. Table Component (`src/app/components/table/table.component.ts`)

The shared table component handles permissions for row actions (view, edit, delete):

```typescript
hasPermission(action: string): boolean {
  if (!this.moduleName) {
    return true; // If no module name specified, show all actions
  }

  switch (action) {
    case 'view':
      return this.permissionsService.canView(this.moduleName);
    case 'edit':
    case 'update':
      return this.permissionsService.canUpdate(this.moduleName);
    case 'delete':
      return this.permissionsService.canDelete(this.moduleName);
    case 'create':
      return this.permissionsService.canCreate(this.moduleName);
    default:
      return true;
  }
}
```

### 5. HasPermissionDirective (`src/app/directives/has-permission.directive.ts`)

A structural directive for conditional rendering based on permissions:

**Usage Example:**
```html
<!-- Show only if user can create clients -->
<button *appHasPermission="'Client'" 
        [appHasPermissionAction]="'create'">
  Add Client
</button>

<!-- Show only if user can delete orders -->
<button *appHasPermission="'Order'" 
        [appHasPermissionAction]="'delete'">
  Delete
</button>
```

## Implementation in Page Components

### Standard Pattern for Table Components

Every table component should follow this pattern:

#### TypeScript File Pattern

```typescript
export class ExampleTableComponent {
  moduleName = 'ModuleName'; // Match the module name from API
  permissionsService = inject(PermissionsService);
  hasCreatePermission: boolean = false;

  private updatePermissions(): void {
    this.hasCreatePermission = this.permissionsService.canCreate(this.moduleName);
  }

  ngOnInit() {
    // ... other initialization

    // Subscribe to permissions changes
    this.permissionsService.permissions$.subscribe(() => {
      this.updatePermissions();
    });
    this.updatePermissions();
  }
}
```

#### HTML File Pattern

```html
<div class="action-filter">
  <!-- Add permission check to create button -->
  <a *ngIf="hasCreatePermission" 
     [routerLink]="global_router_add_url_in_Table">
    +{{'shared.add_new'|translate}}
  </a>
  <span class="pi pi-filter pointer" (click)="openFilter()"></span>
</div>

<!-- Pass moduleName to table for row action permissions -->
<app-table 
  [colsHeader]="columns" 
  [records]="dataList" 
  [actions]="tableActions" 
  [moduleName]="moduleName">
</app-table>
```

## Module Names Mapping

These module names must match the `name` field in the permissions API response:

| Module Name | Route | Description |
|------------|-------|-------------|
| Dashborad | /dashboard | Dashboard (note: typo in API) |
| Client | /clients | Clients Management |
| Technical | /technicals | Technicians |
| Equipment | /equipments | Equipment |
| Order | /orders | Orders |
| SpecialOrder | /special-order | Special Orders |
| Service | /services | Services |
| ContractType | /contract-type | Contract Types |
| Package | /package | Packages |
| WorkingTime | /working_hours | Working Hours |
| Country | /country | Countries |
| City | /city | Cities |
| CancelReason | /cancel-reason | Cancellation Reasons |
| Complaint | /complaint | Complaints |
| Copone | /copone | Coupons |
| PaymentWay | /paymentWay | Payment Methods |
| TechnicalSpecialist | /technical-specialist | Technical Specialists |
| ContactUs | /contact-us | Contact Us |
| AboutUs | /about-us | About Us |
| Admin | /settings/admin | Admins |
| District | /settings/district | Districts |
| FAQs | /settings/faqs | FAQs |
| Notification | /settings/add_notification | Notifications |
| OurClients | /settings/ourclient | Our Clients |
| PrivacyPolicy | /settings/privacy_policy | Privacy Policy |
| Roles | /settings/roles | Roles |
| Settings | /settings/social_media | Settings |
| Slider | /settings/slider | Slider |
| TermsAndConditions | /settings/terms_conditions | Terms & Conditions |

## Components Updated

The following components have been updated with permission controls:

### ✅ Completed
1. about-us-table
2. admin-table
3. cancel-reason-table
4. cities-table
5. clients-table
6. contact-us-table
7. contract-type-table
8. copone-table
9. countries-table
10. district-table
11. equipments-table
12. technicals-table

### 🔄 Remaining
13. faqs-table
14. ourclient-table
15. payment-way-table
16. privacy-policy-table
17. roles-table
18. services-table
19. slider-table
20. terms-conditions-table

## Testing

After implementing permissions:

1. **Test with Full Permissions:**
   - Login with admin account
   - Verify all buttons and menu items are visible

2. **Test with Limited Permissions:**
   - Login with restricted role
   - Verify only authorized menu items appear in sidebar
   - Verify create buttons only show when `canCreate` is true
   - Verify edit/delete actions only show when `canUpdate`/`canDelete` are true

3. **Test Permission Updates:**
   - Change user permissions (if supported)
   - Verify UI updates automatically

## Troubleshooting

### Buttons not hiding
1. Check if `NgIf` is imported in the component
2. Verify `moduleName` matches the API response exactly (case-sensitive)
3. Check console for permission loading errors
4. Verify `hasCreatePermission` is being updated in ngOnInit

### Sidebar menu items not filtering
1. Check `menuItems` in `src/app/conts.ts` have correct `moduleName` property
2. Verify permissions are loaded in sessionStorage
3. Check console for errors in `filterMenuByPermissions()`

### Permissions not persisting
1. Check sessionStorage in browser DevTools
2. Verify `setPermissions()` is called after login
3. Check for sessionStorage quota errors

## Best Practices

1. **Always use moduleName:** Ensure every table component has a `moduleName` property
2. **Subscribe to changes:** Always subscribe to `permissions$` in ngOnInit
3. **Update on changes:** Call `updatePermissions()` in the subscription
4. **Pass to table:** Always pass `moduleName` to `<app-table>`
5. **Consistent naming:** Module names must match API response exactly

## Security Notes

⚠️ **Important:** These permissions control UI visibility only. Backend API endpoints MUST also enforce permissions to prevent unauthorized access via direct API calls.

The frontend permission system:
- ✅ Improves user experience
- ✅ Prevents confusion
- ✅ Guides users to authorized features
- ❌ Does NOT provide security (backend must enforce)

---

## Quick Reference

### Check Single Permission
```typescript
this.permissionsService.canCreate('Client')
this.permissionsService.canUpdate('Order')
this.permissionsService.canDelete('Service')
this.permissionsService.canView('Dashboard')
```

### Use in Template (Method 1 - Property)
```html
<button *ngIf="hasCreatePermission">Create</button>
```

### Use in Template (Method 2 - Directive)
```html
<button *appHasPermission="'Client'" 
        [appHasPermissionAction]="'create'">
  Create
</button>
```

### Get Full Permissions
```typescript
const permissions = this.permissionsService.getPermissions();
console.log(permissions.modules);
```

### Clear Permissions (Logout)
```typescript
this.permissionsService.clearPermissions();
```

