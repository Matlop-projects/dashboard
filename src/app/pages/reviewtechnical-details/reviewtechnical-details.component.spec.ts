import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewtechnicalDetailsComponent } from './reviewtechnical-details.component';

describe('ReviewtechnicalDetailsComponent', () => {
  let component: ReviewtechnicalDetailsComponent;
  let fixture: ComponentFixture<ReviewtechnicalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewtechnicalDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewtechnicalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
