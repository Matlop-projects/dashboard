import { Component, inject, OnInit } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';

import { TranslatePipe } from '@ngx-translate/core';

import { TitleCasePipe } from '@angular/common';



import { ApiService } from '../../services/api.service';

import { LanguageService } from '../../services/language.service';

import { BreadcrumpComponent } from '../../components/breadcrump/breadcrump.component';

import { IBreadcrumb } from '../../components/breadcrump/cerqel-breadcrumb.interface';

import { InputTextComponent } from '../../components/input-text/input-text.component';

import { CheckBoxComponent } from '../../components/check-box/check-box.component';



const API_GET = 'SmsSendingPolicy';

const API_PUT = 'SmsSendingPolicy';



@Component({

  selector: 'app-sms-sending-policy',

  standalone: true,

  imports: [

    ReactiveFormsModule,

    ButtonModule,

    TranslatePipe,

    TitleCasePipe,

    BreadcrumpComponent,

    InputTextComponent,

    CheckBoxComponent,

  ],

  templateUrl: './sms-sending-policy.component.html',

  styleUrl: './sms-sending-policy.component.scss',

})

export class SmsSendingPolicyComponent implements OnInit {

  private api = inject(ApiService);

  languageService = inject(LanguageService);



  loading = false;

  saving = false;



  bredCrumb: IBreadcrumb = { crumbs: [] };



  private readonly successCode = 0;



  form = new FormGroup({

    smsSendingEnabled: new FormControl(true),

    maxSmsGloballyPerDay: new FormControl(100, [

      Validators.required,

      Validators.min(0),

    ]),

  });



  ngOnInit(): void {

    this.buildBreadCrumb();

    this.load();



    this.languageService.translationService.onLangChange.subscribe(() => {

      this.buildBreadCrumb();

    });

  }



  buildBreadCrumb(): void {

    const t = this.languageService.translate.bind(this.languageService);

    this.bredCrumb = {

      crumbs: [

        { label: t('Home'), routerLink: '/dashboard' },

        { label: t('smsSendingPolicy.crumb'), routerLink: '/settings/sms_sending_policy' },

      ],

    };

  }



  /** PrimeNG ToggleSwitch treats only `true === trueValue` as on; numeric `1` looks "off". */
  private coerceSmsFlag(v: unknown): boolean {
    if (v === true || v === 1) return true;
    if (v === false || v === 0) return false;
    if (typeof v === 'string') {
      const s = v.trim().toLowerCase();
      if (s === '1' || s === 'true') return true;
      if (s === '0' || s === 'false') return false;
    }
    return Boolean(v);
  }

  load(): void {

    this.loading = true;

    this.api.get(API_GET).subscribe({

      next: (res: any) => {

        this.loading = false;

        if (res?.code !== this.successCode || !res?.data) return;

        const d = res.data;

        const smsEnabled = d.smsSendingEnabled ?? d.SmsSendingEnabled;

        const dailyCap = d.maxSmsGloballyPerDay ?? d.MaxSmsGloballyPerDay;

        this.form.patchValue({
          smsSendingEnabled: this.coerceSmsFlag(smsEnabled),
          maxSmsGloballyPerDay: Number(dailyCap ?? 0),
        });

      },

      error: () => {

        this.loading = false;

      },

    });

  }



  save(): void {

    if (this.form.invalid || this.saving) {

      this.form.markAllAsTouched();

      return;

    }



    const v = this.form.getRawValue();

    const payload = {

      smsSendingEnabled: v.smsSendingEnabled,

      maxSmsGloballyPerDay: Number(v.maxSmsGloballyPerDay),

    };



    this.saving = true;

    this.api.put(API_PUT, payload).subscribe({

      next: (res: any) => {

        this.saving = false;

        if (res?.code === this.successCode) {

          this.load();

        }

      },

      error: () => {

        this.saving = false;

      },

    });

  }

}

