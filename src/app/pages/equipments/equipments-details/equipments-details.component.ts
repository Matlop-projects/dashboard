import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf, TitleCasePipe } from '@angular/common';
import { Validations } from '../../../validations';
import { InputTextComponent } from '../../../components/input-text/input-text.component';
import { EditorComponent } from '../../../components/editor/editor.component';
import { BreadcrumpComponent } from "../../../components/breadcrump/breadcrump.component";
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { ConfirmMsgService } from '../../../services/confirm-msg.service';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { UploadFileComponent } from "../../../components/upload-file/upload-file.component";
import { DatePickerComponent } from '../../../components/date-picker/date-picker.component';
import { CheckBoxComponent } from '../../../components/check-box/check-box.component';
import { packageHourVistList, PackageTypeList } from '../../../conts';
import { SelectComponent } from '../../../components/select/select.component';
import { LanguageService } from '../../../services/language.service';
import { parseISO } from 'date-fns';
import { TranslatePipe } from '@ngx-translate/core';
import { IEditImage } from '../../../components/edit-mode-image/editImage.interface';
import { EditModeImageComponent } from '../../../components/edit-mode-image/edit-mode-image.component';



const global_PageName = 'equipments.pageName';
const global_API_details = 'equipment' + '/GetById';
const global_API_create = 'equipment' + '/create';
const global_API_update = 'equipment' + '/update';

const global_routeUrl = 'equipments'

@Component({
  selector: 'app-equipments-details',
  standalone: true,
  imports: [ReactiveFormsModule,EditModeImageComponent, TranslatePipe, TitleCasePipe, ButtonModule, SelectComponent, CheckBoxComponent, NgIf, DialogComponent, DatePickerComponent, InputTextComponent, EditorComponent, RouterModule, BreadcrumpComponent, UploadFileComponent],
  templateUrl: './equipments-details.component.html',
  styleUrl: './equipments-details.component.scss'
})
export class EquipmentsDetailsComponent {
 pageName = signal<string>(global_PageName);
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  private confirm = inject(ConfirmMsgService)
  packageList: any[] = []
 editMode:boolean = false;
  visitHoursList: any = packageHourVistList

  form = new FormGroup({
    enName: new FormControl('', {
      validators: [
        Validators.required,
        Validations.englishCharsValidator()
      ],
    }),
    arName: new FormControl<any>('', {
      validators: [
        Validators.required,
        Validations.arabicCharsValidator()
      ]
    }),

 
    equipmentId: new FormControl(this.getID | 0),
    image: new FormControl('', {
      validators: [Validators.required]
    }),
  
    packageId: new FormControl('',{
      validators: [Validators.required]

    }),

  })

  bredCrumb: IBreadcrumb = {
    crumbs: [
    ]
  }

  selectedLang: any;
  languageService = inject(LanguageService);
  get getID() {
    return this.route.snapshot.params['id']
  }
    editImageProps: IEditImage = {
      props: {
        visible: true,
        imgSrc: ''
      },
      onEditBtn: (e?: Event) => {
        this.editImageProps.props.visible = false;
        this.editMode = false;
      }
    };
  get isRequiredError(): boolean {
    const control = this.form.get('image');
    return control?.touched && control?.hasError('required') || false;
  }
  ngOnInit() {
    this.getBreadCrumb();
    this.getAllPackage()
    this.pageName.set(global_PageName)
    if (this.tyepMode() !== 'Add') {
      this.API_getItemDetails()
    }

    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      if (this.tyepMode() !== 'Add') {
        this.API_getItemDetails()
      }     
       this.getBreadCrumb()
       this.getAllPackage()

    })
  }
  tyepMode() {
    const url = this.router.url;
    let result = 'Add'
    if (url.includes('edit')) result = 'Edit'
    else if (url.includes('view')) result = 'View'
    else result = 'Add'
    return result
  }

  getBreadCrumb() {
    this.bredCrumb = {
      crumbs: [
        {
          label: this.languageService.translate('Home'),
          routerLink: '/dashboard',
        },
        {
          label: this.languageService.translate(this.pageName()+ '_'+this.tyepMode()+'_crumb'),
        },
      ]
    }
  }
  getAllPackage(){
    this.ApiService.get('package/GetAllPackage').subscribe((res: any) => {
      if (res.data) {
        this.packageList = res.data.map((item: any) => ({
          name: this.selectedLang == 'ar' ? item.nameAr : item.nameEn,
          code: item.packageId,
        }));
      }
    });
  }

 


  API_getItemDetails() {
    if (this.getID) {
      this.ApiService.get(`${global_API_details}/${this.getID}`).subscribe((res: any) => {
        if (res) {
         this.form.patchValue(res.data);
          this.editImageProps.props.imgSrc = res.data.image;
            this.editMode = true;
        }
      });
    }
  }


  onSubmit() {
    const payload = {
      ...this.form.value,
    }
    if (this.tyepMode() === 'Add')
      this.API_forAddItem(payload)
    else
      this.API_forEditItem(payload)

   
  }

  navigateToPageTable() {
    this.router.navigateByUrl(global_routeUrl)
  }

  cancel() {
    const hasValue = this.confirm.formHasValue(this.form)
    if (hasValue && this.tyepMode() == 'Edit')
      this.showConfirmMessage = !this.showConfirmMessage
    else
      this.navigateToPageTable()

  }

  onConfirmMessage() {
    this.navigateToPageTable()

  }


  API_forAddItem(payload: any) {
    this.ApiService.post(global_API_create, payload, { showAlert: true, message: `Add ${this.pageName()} Successfuly` }).subscribe(res => {
      if (res)
        this.navigateToPageTable()
    })
  }

  API_forEditItem(payload: any) {
    this.ApiService.put(global_API_update, payload, { showAlert: true, message: `update ${this.pageName()} Successfuly` }).subscribe(res => {
      if (res)
        this.navigateToPageTable()
    })
  }


}

