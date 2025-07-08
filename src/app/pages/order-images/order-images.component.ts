import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';
import { ToasterService } from '../../services/toaster.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-order-images',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './order-images.component.html',
  styleUrl: './order-images.component.scss'
})
export class OrderImagesComponent {
  uploadedImage: string | ArrayBuffer | null = null;
  typeParam: string | null = null;
  api = inject(ApiService);
  toaster =inject(ToasterService)

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.typeParam = params.get('type') || 'e';
      this.getImage();
    });
  }

  onImageSelected(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    this.uploadedImage = reader.result; // for image preview

    const fullBase64 = reader.result as string; // includes data:image/png;base64,...
    this.apiCallForUpload(fullBase64);
  };

  reader.readAsDataURL(file); // keeps the MIME type prefix
}


apiCallForUpload(base64WithPrefix: string): void {
  const link = this.typeParam === 'e'
    ? 'OrderDefaultImage/CreateEmercencyOrderDefaultImage'
    : 'OrderDefaultImage/CreateSpecialOrderDefaultImage';

  const imageObject = this.typeParam === 'e'
    ? { emergencyImage: base64WithPrefix }
    : { specialOrderImage: base64WithPrefix };

  this.api.post(link, imageObject).subscribe((res: any) => {
    this.toaster.successToaster(res.message)
    this.getImage();
  });
}


  getImage(): void {
    const link = this.typeParam === 'e'
      ? 'OrderDefaultImage/GetEmercencyOrderDefaultImage'
      : 'OrderDefaultImage/GetSepcialOrderDefaultImage';

    this.api.get(link).subscribe((res: any) => {
      this.uploadedImage =
        this.typeParam === 'e'
          ? environment.baseImageUrl + res.data.emergencyImage
          : environment.baseImageUrl + res.data.specialOrderImage;
    });
  }
}
