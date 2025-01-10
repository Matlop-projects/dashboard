import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { EditorComponent } from '../../components/editor/editor.component';
import { BreadcrumpComponent } from "../../components/breadcrump/breadcrump.component";
import { IBreadcrumb } from '../../components/breadcrump/cerqel-breadcrumb.interface';
import { TranslatePipe } from '@ngx-translate/core';
import { userType } from '../../conts';
import { SelectComponent } from '../../components/select/select.component';
import { IEditImage } from '../../components/edit-mode-image/editImage.interface';
import { TextareaModule } from 'primeng/textarea';

const global_PageName = 'Add Notification';
const global_API_create =  'Notification/send';

@Component({
  selector: 'app-add-notifications',
  standalone: true,
 imports: [ReactiveFormsModule,TextareaModule ,TranslatePipe,SelectComponent, ButtonModule, NgIf, InputTextComponent, EditorComponent, RouterModule, BreadcrumpComponent],
  templateUrl: './add-notifications.component.html',
  styleUrl: './add-notifications.component.scss'
})
export class AddNotificationsComponent {

 pageName = signal<string>(global_PageName);
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  userTypeList = userType
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
  editMode: boolean = false;

  minEndDate:Date =new Date()
  form = new FormGroup({
    notificationId: new FormControl<any>(0),
    userId: new FormControl<any>(0),
    title: new FormControl('', {
      validators: [
        Validators.required
      ],
    }),
    userType: new FormControl<any>('', {
      validators: [
        Validators.required,
      ]
    }),
    body: new FormControl<any>('', {
      validators: [
        Validators.required,
      ]
    })
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

  get getID() {
    return this.route.snapshot.params['id']
  }

  get isRequiredError(): boolean {
    const control = this.form.get('image');
    return control?.touched && control?.hasError('required') || false;
  }

  ngOnInit() {
    this.pageName.set(global_PageName)
  }

  onSubmit() {
    const payload = {
      ...this.form.value
    }
      this.API_forAddItem(payload);
  }

  API_forAddItem(payload: any) {
    this.ApiService.post(global_API_create, payload, { showAlert: true, message: `Add ${this.pageName()} Successfuly` }).subscribe(res => {
    })
  }

}


