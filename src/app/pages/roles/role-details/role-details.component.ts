import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Checkbox } from 'primeng/checkbox';



const global_PageName='Role';
const global_API_deialis=global_PageName+'/GetTermsAndConditions';
const global_API_create=global_PageName+'/CreateTermsAndConditions';
const global_API_update=global_PageName+'/UpdateTermsAndConditions';
const global_routeUrl ='/settings/roles'
@Component({
  selector: 'app-role-details',
  standalone: true,
  imports: [ReactiveFormsModule, ToggleSwitchModule , Checkbox, FormsModule,TitleCasePipe, ButtonModule, NgIf, DialogComponent, InputTextComponent, EditorComponent, RouterModule, BreadcrumpComponent, UploadFileComponent],
  templateUrl: './role-details.component.html',
  styleUrl: './role-details.component.scss'
})
export class RoleDetailsComponent {

  pageName =signal<string>('Role');
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  private confirm = inject(ConfirmMsgService)
  form = new FormGroup({
    enName: new FormControl('', {
      validators: [
        Validators.required,
        Validations.englishCharsValidator('faqs.validation_english_title'),
      ],
    }),
    arName: new FormControl('', {
      validators: [
        Validators.required,
        Validations.arabicCharsValidator('isArabic')
      ]
    }),
    termId:new FormControl(this.getID|0,Validators.required),
    userType: new FormControl(1),
  })

  bredCrumb: IBreadcrumb = {
    crumbs: [
      {
        label: 'Home',
        routerLink: '/dashboard',
      },
      {
        label: this.pageName(),
      },
    ]
  }
  checkToggle: boolean = true;

  get getID() {
    return this.route.snapshot.params['id']
  }

  ngOnInit() {
    this.pageName.set('Role')
    if (this.tyepMode() !== 'Add')
      this.API_getItemDetails()
  }

  tyepMode() {
    const url = this.router.url;
    let result='Add'
    if (url.includes('edit')) result='Edit'
    else result= 'Add'

    this.bredCrumb.crumbs[1].label = result+' '+this.pageName();
    return result
  }

  API_getItemDetails() {
    this.ApiService.get(`${global_API_deialis}/${this.getID}`).subscribe((res: any) => {
      if (res)
        this.form.patchValue(res.data)
    })
  }

  onSubmit() {
    const payload = {
      ...this.form.value,
    }
    if (this.tyepMode() == 'Add')
      this.API_forAddItem(payload)
    else
      this.API_forEditItem(payload)
  }

  navigateToPageTable(){
    this.router.navigateByUrl(global_routeUrl)
  }

  cancel() {
    const hasValue = this.confirm.formHasValue(this.form)
    if (hasValue && this.tyepMode()=='Edit')
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
