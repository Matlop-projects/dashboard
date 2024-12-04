import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { Validations, isChar } from '../../../validations';
import { InputTextComponent } from '../../../components/input-text/input-text.component';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { ConfirmMsgService } from '../../../services/confirm-msg.service';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { CheckBoxComponent } from '../../../components/check-box/check-box.component';
import { UploadFileComponent } from '../../../components/upload-file/upload-file.component';
import { IEditImage } from '../../../components/edit-mode-image/editImage.interface';
import { EditModeImageComponent } from '../../../components/edit-mode-image/edit-mode-image.component';
@Component({
  selector: 'app-countries-details',
  standalone: true,
  imports: [
    BreadcrumpComponent,
    ReactiveFormsModule,
    ButtonModule,
    NgIf,
    InputTextComponent,
    DialogComponent,
    CheckBoxComponent,
    UploadFileComponent,
    EditModeImageComponent
  ],
  templateUrl: './countries-details.component.html',
  styleUrl: './countries-details.component.scss'
})
export class CountriesDetailsComponent implements OnInit {
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  private confirm = inject(ConfirmMsgService)
  editAttachmentMode: boolean = false;


  form = new FormGroup({
    enName: new FormControl('', {
      validators: [
        Validators.required,
        Validations.onlyEnglishValidators(),
      ],
    }),
    arName: new FormControl('', {
      validators: [
        Validators.required,
        Validations.onlyArabicValidators()
      ]
    }),
    currency: new FormControl('', {
      validators: [
        Validators.required,
        Validations.onlyCharacterValidator()
      ]
    }),
    nationality: new FormControl('', {
      validators: [
        Validators.required,
        Validations.onlyCharacterValidator()
      ]
    }),
    phoneLength: new FormControl('', {
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ]
    }),
    phoneCode: new FormControl('', {
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ]
    }),
    shortName: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    content: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    status: new FormControl(false),
    img: new FormControl(null, {
      validators: [
        Validators.required,
      ]
    }),
    timeZone: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),

  })

  bredCrumb: IBreadcrumb = {
    crumbs: [
      {
        label: 'Home',
        routerLink: '/dashboard',
      },
      {
        label: 'Add Country',
      },
    ]
  }

  get countryID() {
    return this.route.snapshot.params['id']
  }

  get isRequiredError(): boolean {
    const control = this.form.get('img');
    return control?.touched && control?.hasError('required') || false;
  }

  ngOnInit() {
    console.log(this.router.url)
    if (this.tyepMode() !== 'add')
      this.getCountryDetails()
  }

  tyepMode() {
    const url = this.router.url;
    if (url.includes('edit'))
      return 'edit'
    else if (url.includes('view'))
      return 'view'
    else return 'add'

  }

  editImageProps: IEditImage = {
    props: {
      visible: true,
      imgSrc: ''
    },
    onEditBtn: (e?: Event) => {
      this.editImageProps.props.visible = false;
      this.editAttachmentMode = false;
    }
  };
  getCountryDetails() {
    this.ApiService.get(`Country/GetCountry/${this.countryID}`).subscribe((res: any) => {
      if (res)
        this.form.patchValue(res.data)
    })
  }

  onSubmit() {
    console.log('ff', this.form.value)
    const payload = {
      ...this.form.value,
      countryId: this.countryID,
    }
    if (this.tyepMode() === 'add')
      this.addCountry(payload)
    else
      this.editCountry(payload)

  }

  addCountry(payload: any) {
    this.ApiService.post('Country/CreateCountry', payload, { showAlert: true, message: 'Add country Successfuly' }).subscribe(res => {
      if (res)
        this.router.navigateByUrl('country')
    })
  }
  editCountry(payload: any) {
    this.ApiService.put('Country/UpdateCountry', payload, { showAlert: true, message: 'update country Successfuly' }).subscribe(res => {
      if (res)
        this.router.navigateByUrl('country')
    })
  }


  cancel() {
    const confirmed = this.confirm.formHasValue(this.form)
    if (confirmed)
      this.showConfirmMessage = !this.showConfirmMessage
    else
      this.router.navigateByUrl('/country')
  }
  onConfirmMessage() {
    this.router.navigateByUrl('/country')
  }
}
