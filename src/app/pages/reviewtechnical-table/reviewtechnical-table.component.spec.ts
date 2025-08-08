import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewtechnicalTableComponent } from './reviewtechnical-table.component';

describe('ReviewtechnicalTableComponent', () => {
  let component: ReviewtechnicalTableComponent;
  let fixture: ComponentFixture<ReviewtechnicalTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewtechnicalTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewtechnicalTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
