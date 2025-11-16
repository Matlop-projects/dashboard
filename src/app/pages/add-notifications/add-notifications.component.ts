import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { BreadcrumpComponent } from '../../components/breadcrump/breadcrump.component';
import { IBreadcrumb } from '../../components/breadcrump/cerqel-breadcrumb.interface';
import { TranslatePipe } from '@ngx-translate/core';
import { userType } from '../../conts';
import { SelectComponent } from '../../components/select/select.component';
import { IEditImage } from '../../components/edit-mode-image/editImage.interface';
import { TextareaModule } from 'primeng/textarea';
import { LanguageService } from '../../services/language.service';

const global_PageName = 'notifications.pageName';
const global_API_create = 'Notification/send';

@Component({
  selector: 'app-add-notifications',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TextareaModule,
    TranslatePipe,
    SelectComponent,
    ButtonModule,
    InputTextComponent,
    RouterModule,
    BreadcrumpComponent,
  ],
  templateUrl: './add-notifications.component.html',
  styleUrl: './add-notifications.component.scss',
})
export class AddNotificationsComponent {
  pageName = signal<string>(global_PageName);
  private ApiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  showConfirmMessage: boolean = false;
  userTypeList = userType;
  countryList: any[] = []
  ClientsList: any[] = [];
  editImageProps: IEditImage = {
    props: {
      visible: true,
      imgSrc: '',
    },
    onEditBtn: (e?: Event) => {
      this.editImageProps.props.visible = false;
      this.editMode = false;
    },
  };
  editMode: boolean = false;

  minEndDate: Date = new Date();
  form = new FormGroup({
    notificationId: new FormControl<any>(0),
    userId: new FormControl<any>([]),
    titleEn: new FormControl('', {
      validators: [Validators.required],
    }),
    titleAr: new FormControl('', {
      validators: [Validators.required],
    }),
    userType: new FormControl<any>('', {
      validators: [Validators.required],
    }),
    countryId: new FormControl<any>(null),
    bodyEn: new FormControl<any>('', {
      validators: [Validators.required],
    }),
    bodyAr: new FormControl<any>('', {
      validators: [Validators.required],
    }),
  });

  bredCrumb: IBreadcrumb = {
    crumbs: [],
  };

  get getID() {
    return this.route.snapshot.params['id'];
  }

  get isRequiredError(): boolean {
    const control = this.form.get('image');
    return (control?.touched && control?.hasError('required')) || false;
  }
  selectedLang: any;
  languageService = inject(LanguageService);

  ngOnInit() {
    this.getAllCountry();
    this.pageName.set(global_PageName);
    this.getBreadCrumb();
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getBreadCrumb();
    });
  }

  tyepMode() {
    const url = this.router.url;
    let result = 'Add';
    if (url.includes('edit')) result = 'Edit';
    else if (url.includes('view')) result = 'View';
    else result = 'Add';
    return result;
  }

  getAllCountry(){
    this.ApiService.get('Country/GetAll').subscribe((res: any) => {
      if (res.data) {
        this.countryList = res.data.map((item: any) => ({
          name: this.selectedLang == 'ar' ? item.arName : item.enName,
          code: item.countryId,
        }));
      }
    });
  }

  getBreadCrumb() {
    this.bredCrumb = {
      crumbs: [
        {
          label: this.languageService.translate('Home'),
          routerLink: '/dashboard',
        },
        {
          label: this.languageService.translate(
            this.pageName() + '_' + this.tyepMode() + '_crumb'
          ),
        },
      ],
    };
  }
  onUserTypeChange(event: number) {
    console.log(
      '🚀 ~ AddNotificationsComponent ~ getAllClientsByUserType ~ res:',
      event
    );
    this.ClientsList = [];
    this.form.get('userId')?.setValue([]);
    
    // Only call API if both userType and countryId are selected
    const countryId = this.form.get('countryId')?.value;
    if (countryId) {
      this.getAllClientsByUserType(event, countryId);
    }
  }

  onCountryChange(event: number) {
    console.log('Country changed:', event);
    this.ClientsList = [];
    this.form.get('userId')?.setValue([]);
    
    // Only call API if both userType and countryId are selected
    const userTypeValue = this.form.get('userType')?.value;
    if (userTypeValue && event) {
      this.getAllClientsByUserType(userTypeValue, event);
    }
  }
  
  getAllClientsByUserType(userTypeId: number, countryId: number) {
    // Only call API if both parameters are provided
    if (!userTypeId || !countryId) {
      return;
    }
    
    this.ApiService.get('Client/GetAllClientsByUserTypeIdAndCountryId', {
      UserTypeId: userTypeId,
      CountryId: countryId,
    }).subscribe((res: any) => {
      this.ClientsList = [];
      if (res.data.length > 0) {
        res.data.map((item: any) => {
          this.ClientsList.push({
            code: item.userId,
            name: item.username,
          });
        });
      }
    });
  }
  onSubmit() {
    const payload = {
      ...this.form.value,
    };
    const selectedClients = this.form.get('userId')?.value || [];
    const allClientIds = this.ClientsList.map((c) => c.code);

    const isAllSelected =
      selectedClients.length === allClientIds.length &&
      selectedClients.every((id: any) => allClientIds.includes(id));

    if (isAllSelected) {
      payload.userId = []; // Send empty array instead of all IDs
    }
    this.API_forAddItem(payload);
  }

  API_forAddItem(payload: any) {
    this.ApiService.post(global_API_create, payload, {
      showAlert: true,
      message: `Add ${this.pageName()} Successfuly`,
    }).subscribe((res) => {
      if (res) {
        this.form.reset();
      }
    });
  }
}
