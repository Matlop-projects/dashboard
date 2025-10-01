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
import { SelectComponent } from '../../../components/select/select.component';
import { EditModeImageComponent } from '../../../components/edit-mode-image/edit-mode-image.component';
import { IEditImage } from '../../../components/edit-mode-image/editImage.interface';
import { environment } from '../../../../environments/environment';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';
import { OurClientService } from '../ourclient.service';

const global_PageName = 'ourclients.pageName';
const global_API_deialis = 'OurClients' + '/GetOurClient';
const global_API_create = 'OurClients' + '/CreateOurClient';
const global_API_update = 'OurClients' + '/UpdateOurClient';
const global_routeUrl = 'settings/ourclient'

@Component({
  selector: 'app-ourclient-details',
  standalone: true,
  imports: [ReactiveFormsModule,TranslatePipe, TitleCasePipe,EditModeImageComponent, ButtonModule, NgIf, DialogComponent,SelectComponent ,InputTextComponent, RouterModule, BreadcrumpComponent, UploadFileComponent],
  templateUrl: './ourclient-details.component.html',
  styleUrl: './ourclient-details.component.scss'
})
export class OurClientDetailsComponent {  

  private imageUrl = environment.baseImageUrl

  pageName = signal<string>(global_PageName);
  private ApiService = inject(ApiService)
  private ourClientService = inject(OurClientService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  editAttachmentMode: boolean = false;
  editAttachmentMode_ar: boolean = false;
  private confirm = inject(ConfirmMsgService)
  
  editImageProps: IEditImage = {
    props: {
      visible: true,
      imgSrc: ''
    },
    onEditBtn: (e?: Event) => {
      this.editAttachmentMode = true;
    }
  };
  editImageProps_ar: IEditImage = {
    props: {
      visible: true,
      imgSrc: ''
    },
    onEditBtn: (e?: Event) => {
      this.editAttachmentMode_ar = true;
    }
  };
  form = new FormGroup({
    enName: new FormControl('', {
      validators: [
        Validators.required,
        Validations.editorEnglishCharsValidator()
      ],
    }),
    arName: new FormControl <any>('', {
      validators: [
        Validators.required,
        Validations.editorArabicCharsValidator()
      ]
    }),
    imageEn: new FormControl<any>('', {
      validators: [

      ]
    }),
    imageAr: new FormControl<any>('', {
      validators: [

      ]
    }),
    clientId: new FormControl(this.getID | 0),
  })

  bredCrumb: IBreadcrumb = {
    crumbs: []
  }


  get getID() {
    return this.route.snapshot.params['id']
  }


  get isRequiredError(): boolean {
    const control = this.form.get('imageEn');
    return control?.touched && control?.hasError('required') || false;
  }

  get isRequiredError_ar(): boolean {
    const control = this.form.get('imageAr');
    return control?.touched && control?.hasError('required') || false;
  }
    selectedLang: any;
    languageService = inject(LanguageService);

  ngOnInit() {
    this.pageName.set(global_PageName)
    this.getBreadCrumb();
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getBreadCrumb();
    });
    if (this.tyepMode() !== 'Add')
      this.API_getItemDetails()
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
          label:  this.languageService.translate('Home'),
          routerLink: '/dashboard',
        },
        {
          label: this.languageService.translate(this.pageName()+ '_'+this.tyepMode()+'_crumb'),
        },
      ]
    }
  }

  API_getItemDetails() {
    this.ourClientService.getOurClient(this.getID).subscribe((res: any) => {
      if (res && res.data){
        this.form.patchValue(res.data)
        
        // Set image URLs - prepend base URL to the API paths
        if (res.data.imageEn) {
          this.editImageProps.props.imgSrc = `https://backend.matlop.com${res.data.imageEn}`;
          this.editAttachmentMode = true;
        }

        if (res.data.imageAr) {
          this.editImageProps_ar.props.imgSrc = `https://backend.matlop.com${res.data.imageAr}`;
          this.editAttachmentMode_ar = true;
        }
      }
    })
  }

  onSubmit() {
    const payload = {
      ...this.form.value
    }
    if (this.tyepMode() == 'Add')
      this.API_forAddItem(payload)
    else
      this.API_forEditItem(payload)
  }

  navigateToPageTable() {
    this.router.navigateByUrl('/settings/ourclient')
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
    this.ourClientService.createOurClient(payload).subscribe(res => {
      if (res)
        this.navigateToPageTable()
    })
  }

  API_forEditItem(payload: any) {
    this.ourClientService.updateOurClient(payload).subscribe(res => {
      if (res)
        this.navigateToPageTable()
    })
  }


}

