import { Component, inject } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { InputTextComponent } from '../../../components/input-text/input-text.component';
import { EditorComponent } from '../../../components/editor/editor.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToasterService } from '../../../services/toaster.service';
import { Validations } from '../../../validations';
import { TranslatePipe } from '@ngx-translate/core';
import { TitleCasePipe } from '@angular/common';
import { SelectComponent } from '../../../components/select/select.component';
import { CountryService } from '../../../services/country.service';
import { LanguageService } from '../../../services/language.service';

interface ISocialMedia {
  whatsAppNumber:string,
  instagramLink:string,
  snapChatLink : string;
  tikTokLink:string,
  faceBookLink:string,
  youTubeLink:string,
  countryId:number,
  xLink:string,
  arBasicInstructions:string,
  enBasicInstructions:string,
  settingId:number,
}
@Component({
  selector: 'app-social-media-update',
  standalone: true,
  imports: [InputTextComponent,TranslatePipe,TitleCasePipe,EditorComponent,ReactiveFormsModule,SelectComponent],
  templateUrl: './social-media-update.component.html',
  styleUrl: './social-media-update.component.scss'
})
export class SocialMediaUpdateComponent {
  data:ISocialMedia={
    whatsAppNumber:'',
    instagramLink:'',
    tikTokLink:'',
    faceBookLink:'',
    youTubeLink:'',
    snapChatLink:'',
    countryId:0,
    xLink:'',
    arBasicInstructions:'',
    enBasicInstructions:'',
    settingId:0,
  }
  showConfirmMessage:boolean=false
    countries: any[] = [];
      languageService = inject(LanguageService);
      selectedLang: any;
  form:FormGroup=new FormGroup({
    whatsAppNumber:new FormControl('',{
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ],
    }),
    instagramLink:new FormControl('',{
      validators: [
        Validators.required,
      ],
    }),
    tikTokLink:new FormControl('',{
      validators: [
        Validators.required,
      ],
    }),
    faceBookLink:new FormControl('',{
      validators: [
        Validators.required,
      ],
    }),
    youTubeLink:new FormControl('',{
      validators: [
        Validators.required,
      ],
    }),
     xLink:new FormControl('',{
      validators: [
        Validators.required,
      ],
    }),
    snapChatLink:new FormControl('',{
      validators: [
        Validators.required,
      ],
    }),
    arBasicInstructions:new FormControl('',{

    }),
    enBasicInstructions:new FormControl('',{

    }),
    settingId:new FormControl(''),
    countryId: new FormControl(null, Validators.required),
  })
  private apiService =inject(ApiService)
  private toaster =inject(ToasterService)
    countryService = inject(CountryService);

  selectedCountryId: number = 1; // Default to Saudi Arabia

  ngOnInit(){
    this.selectedLang = this.languageService.translationService.currentLang;
    this.getCountries();
    this.getAll(this.selectedCountryId);
  }

  getAll(countryId: number){
    this.apiService.get(`Settings/GetAll/${countryId}`).subscribe((res:any)=>{
        console.log('API Response for getAll:', res);
        console.log('Patching countryId:', countryId);
        this.form.patchValue({
          ...res.data,
          countryId: countryId // Ensure countryId is maintained in the form
        })
    })
  }

  onSubmit() {
    const payload = {
      ...this.form.value,
      countryId: this.selectedCountryId // Ensure countryId is included in payload
    }
    this.updateSocialMedia(payload)
  }

  updateSocialMedia(payload:any){
    this.apiService.put('settings/update',payload).subscribe((res:any)=>{
      console.log("SocialMediaUpdateComponent  this.apiService.put  res:", res)
      if(res.message)
        this.toaster.successToaster('Social Media Updated Successfully')
    })
  }

    getCountries() {
    this.countryService.getCountries().subscribe((res: any) => {
        if (res) {
     res.data.map((country:any)=>{
         this.countries.push({
          name:this.selectedLang=='en'?country.enName :country.arName,
          code:country.countryId
         })
     })
    }
    })
  }

  onCountryChange(countryId: number) {
    this.selectedCountryId = countryId;
    this.getAll(this.selectedCountryId);
  }


}
