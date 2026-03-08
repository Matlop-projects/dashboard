import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CountryService } from '../../services/country.service';
import { LanguageService } from '../../services/language.service';
import { IBreadcrumb } from '../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../components/breadcrump/breadcrump.component';
import { SelectComponent } from '../../components/select/select.component';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { CheckBoxComponent } from '../../components/check-box/check-box.component';
import { ButtonModule } from 'primeng/button';
import { NgIf, TitleCasePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { EAction, EType, IcolHeader, ITableAction, TableComponent } from '../../components/table/table.component';
import { TableSmallScreenComponent, ETableShow, IcolHeaderSmallTable } from '../../components/table-small-screen/table-small-screen.component';
import { FormsModule } from '@angular/forms';
import { DrawerComponent } from '../../components/drawer/drawer.component';

const API_GET_ALL = 'ServiceCityAvailability/GetAll';
const API_SET = 'ServiceCityAvailability/SetAvailability';
const WHOLE_COUNTRY_CODE = 0;
const ALL_SERVICES_CODE = 0;

@Component({
  selector: 'app-service-city-availability',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    TranslatePipe,
    TitleCasePipe,
    SelectComponent,
    InputTextComponent,
    CheckBoxComponent,
    ButtonModule,
    NgIf,
    BreadcrumpComponent,
    TableComponent,
    TableSmallScreenComponent,
    DrawerComponent
  ],
  templateUrl: './service-city-availability.component.html',
  styleUrl: './service-city-availability.component.scss'
})
export class ServiceCityAvailabilityComponent {
  private apiService = inject(ApiService);
  private countryService = inject(CountryService);
  languageService = inject(LanguageService);
  pageName = signal<string>('serviceCityAvailability.pageName');

  countriesList: { name: string; code: number }[] = [];
  citiesList: { name: string; code: number }[] = [];
  servicesList: { name: string; code: number }[] = [];
  dataList: any[] = [];
  selectedLang: string = 'ar';

  bredCrumb: IBreadcrumb = { crumbs: [] };
  columns: IcolHeader[] = [];
  columnsSmallTable: IcolHeaderSmallTable[] = [];

  tableActions: ITableAction[] = [
    { name: EAction.edit, apiName_or_route: '', autoCall: false },
    { name: EAction.delete, apiName_or_route: 'ServiceCityAvailability/Delete?id', autoCall: true }
  ];

  editDrawerVisible = false;
  editRecord: any = null;
  editForm = new FormGroup({
    unavailableMessageAr: new FormControl(''),
    unavailableMessageEn: new FormControl('')
  });

  form = new FormGroup({
    countryId: new FormControl<number | null>(null, Validators.required),
    cityId: new FormControl<number | null>(null),
    serviceId: new FormControl<number | null>(null),
    isOrdersAvailable: new FormControl(true),
    unavailableMessageAr: new FormControl(''),
    unavailableMessageEn: new FormControl('')
  });

  ngOnInit() {
    this.selectedLang = this.languageService.translationService.currentLang;
    this.loadCountries();
    this.loadServices();
    this.loadData();
    this.getBreadCrumb();
    this.displayTableCols();

    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.loadCountries();
      this.loadServices();
      this.loadData();
      this.getBreadCrumb();
      this.displayTableCols();
    });
  }

  loadCountries() {
    this.countryService.getCountries().subscribe((res: any) => {
      if (res?.data) {
        this.countriesList = res.data.map((item: any) => ({
          name: this.selectedLang === 'ar' ? item.arName : item.enName,
          code: item.countryId
        }));
      }
    });
  }

  // city - commented: نشتغل على مستوى الدولة دلوقتي، لو رجعنا للمدينة نرجعها
  // onCountryChange(countryId: number | null) {
  //   this.citiesList = [];
  //   this.form.patchValue({ cityId: null });
  //   if (countryId && countryId > 0) {
  //     this.apiService.get(`city/getByCountryId/${countryId}`).subscribe((res: any) => {
  //       if (res?.data) {
  //         const wholeCountryOption = { name: this.selectedLang === 'ar' ? 'الدولة كلها' : 'Whole country', code: WHOLE_COUNTRY_CODE };
  //         const cityOptions = res.data.map((item: any) => ({ name: this.selectedLang === 'ar' ? item.arName : item.enName, code: item.cityId }));
  //         this.citiesList = [wholeCountryOption, ...cityOptions];
  //       }
  //     });
  //   }
  // }
  onCountryChange(_countryId: number | null) {
    // لا حاجة لتحميل المدن - نشتغل على مستوى الدولة فقط
  }

  loadServices() {
    const allServicesOption = {
      name: this.selectedLang === 'ar' ? 'كل الخدمات' : 'All services',
      code: ALL_SERVICES_CODE
    };
    this.apiService.get('Service/GetAll').subscribe((res: any) => {
      if (res?.data) {
        const serviceOptions = res.data.map((item: any) => ({
          name: this.selectedLang === 'ar' ? item.nameAr : item.nameEn,
          code: item.serviceId
        }));
        this.servicesList = [allServicesOption, ...serviceOptions];
      } else {
        this.servicesList = [allServicesOption];
      }
    });
  }

  loadData() {
    this.apiService.get(API_GET_ALL).subscribe((res: any) => {
      if (res?.data) {
        const wholeCountryLabel = this.selectedLang === 'ar' ? 'الدولة كلها' : 'Whole country';
        this.dataList = res.data.map((r: any) => ({
          ...r,
          cityNameAr: r.isWholeCountry ? wholeCountryLabel : (r.cityNameAr ?? ''),
          cityNameEn: r.isWholeCountry ? 'Whole country' : (r.cityNameEn ?? ''),
          scopeKey: `${r.countryId}-${r.cityId ?? 'country'}-${r.serviceId ?? 'all'}`
        }));
      }
    });
  }

  displayTableCols() {
    const serviceNameKey = this.selectedLang === 'ar' ? 'serviceNameAr' : 'serviceNameEn';
    const cityNameKey = this.selectedLang === 'ar' ? 'cityNameAr' : 'cityNameEn';
    const countryNameKey = this.selectedLang === 'ar' ? 'countryNameAr' : 'countryNameEn';

    this.columns = [
      { keyName: 'serviceCityAvailabilityId', header: this.languageService.translate('Id'), type: EType.id, show: true },
      { keyName: countryNameKey, header: this.languageService.translate('serviceCityAvailability.country'), type: EType.text, show: true },
      // city - commented: نشتغل على مستوى الدولة دلوقتي، لو رجعنا للمدينة نرجعها
      // { keyName: cityNameKey, header: this.languageService.translate('serviceCityAvailability.city'), type: EType.text, show: true },
      { keyName: serviceNameKey, header: this.languageService.translate('serviceCityAvailability.service'), type: EType.text, show: true },
      {
        keyName: 'isOrdersAvailable',
        header: this.languageService.translate('serviceCityAvailability.ordersAvailable'),
        type: EType.toggle,
        toggleOptions: { apiName: '', autoCall: false },
        show: true
      },
      { keyName: '', header: this.languageService.translate('Action'), type: EType.actions, actions: this.tableActions, show: true }
    ];

    this.columnsSmallTable = [
      { keyName: 'serviceCityAvailabilityId', header: 'Id', type: EType.id },
      { keyName: countryNameKey, header: this.languageService.translate('serviceCityAvailability.country'), type: EType.text, showAs: ETableShow.header },
      // city - commented: نشتغل على مستوى الدولة دلوقتي، لو رجعنا للمدينة نرجعها
      // { keyName: cityNameKey, header: this.languageService.translate('serviceCityAvailability.city'), type: EType.text, showAs: ETableShow.content },
      { keyName: serviceNameKey, header: this.languageService.translate('serviceCityAvailability.service'), type: EType.text, showAs: ETableShow.content },
      { keyName: 'isOrdersAvailable', header: this.languageService.translate('serviceCityAvailability.ordersAvailable'), type: EType.status, showAs: ETableShow.content }
    ];
  }

  getBreadCrumb() {
    this.bredCrumb = {
      crumbs: [
        { label: this.languageService.translate('Home'), routerLink: '/dashboard' },
        { label: this.languageService.translate(this.pageName()), routerLink: '/settings/service_city_availability' }
      ]
    };
  }

  onSubmit() {
    if (!this.form.valid || !this.form.value.countryId) return;

    const countryId = this.form.value.countryId;
    // cityId دائماً null - نشتغل على مستوى الدولة فقط
    const serviceIdVal = this.form.value.serviceId;

    const payload = {
      countryId,
      cityId: null, // city - commented: كان cityIdVal === WHOLE_COUNTRY_CODE || !cityIdVal ? null : cityIdVal
      serviceId: serviceIdVal === ALL_SERVICES_CODE || !serviceIdVal ? null : serviceIdVal,
      isOrdersAvailable: this.form.value.isOrdersAvailable ?? true,
      unavailableMessageAr: this.form.value.unavailableMessageAr || null,
      unavailableMessageEn: this.form.value.unavailableMessageEn || null
    };

    this.apiService.post(API_SET, payload, { showAlert: true, message: this.languageService.translate('serviceCityAvailability.saved') }).subscribe(() => {
      this.form.reset({
        countryId: null,
        cityId: null,
        serviceId: null,
        isOrdersAvailable: true,
        unavailableMessageAr: '',
        unavailableMessageEn: ''
      });
      this.citiesList = [];
      this.loadData();
    });
  }

  onFormReset() {
    this.form.reset({
      countryId: null,
      cityId: null,
      serviceId: null,
      isOrdersAvailable: true,
      unavailableMessageAr: '',
      unavailableMessageEn: ''
    });
    this.citiesList = [];
  }

  scrollToForm() {
    document.getElementById('addFormSection')?.scrollIntoView({ behavior: 'smooth' });
  }

  onToggleChange(event: { status: boolean; record: any }) {
    const { status, record } = event;
    const payload = {
      countryId: record.countryId,
      cityId: record.isWholeCountry ? null : (record.cityId ?? null),
      serviceId: record.isAllServices ? null : (record.serviceId ?? null),
      isOrdersAvailable: status,
      unavailableMessageAr: record.unavailableMessageAr || null,
      unavailableMessageEn: record.unavailableMessageEn || null
    };
    this.apiService.post(API_SET, payload, { showAlert: true, message: this.languageService.translate('serviceCityAvailability.saved') }).subscribe(() => {
      this.loadData();
    });
  }

  onActionCliked(event: { action: ITableAction; record: any }) {
    if (event.action.name === EAction.edit) {
      this.editRecord = event.record;
      this.editForm.patchValue({
        unavailableMessageAr: event.record.unavailableMessageAr || '',
        unavailableMessageEn: event.record.unavailableMessageEn || ''
      });
      this.editDrawerVisible = true;
    }
  }

  closeEditDrawer() {
    this.editDrawerVisible = false;
    this.editRecord = null;
    this.editForm.reset({ unavailableMessageAr: '', unavailableMessageEn: '' });
  }

  onSaveEdit() {
    if (!this.editRecord) return;
    const payload = {
      countryId: this.editRecord.countryId,
      cityId: this.editRecord.isWholeCountry ? null : (this.editRecord.cityId ?? null),
      serviceId: this.editRecord.isAllServices ? null : (this.editRecord.serviceId ?? null),
      isOrdersAvailable: this.editRecord.isOrdersAvailable ?? true,
      unavailableMessageAr: this.editForm.value.unavailableMessageAr || null,
      unavailableMessageEn: this.editForm.value.unavailableMessageEn || null
    };
    this.apiService.post(API_SET, payload, { showAlert: true, message: this.languageService.translate('serviceCityAvailability.saved') }).subscribe(() => {
      this.closeEditDrawer();
      this.loadData();
    });
  }
}
