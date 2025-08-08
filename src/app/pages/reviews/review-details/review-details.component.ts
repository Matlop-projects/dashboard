import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-review-details',
  standalone: true,
  imports: [],
  templateUrl: './review-details.component.html',
  styleUrl: './review-details.component.scss'
})
export class ReviewDetailsComponent {
  route=inject(ActivatedRoute)
  params:any=this.route.snapshot.params;
  apiservice=inject(ApiService)
  ngOnInit(){
this.getDetails()
  }

  getDetails(){
      this.apiservice.get('ServiceReview/GetServiceReviewByUserIdDashboard',{orderId:this.params.orderId,userId:this.params.userId}).subscribe()
  }
}
