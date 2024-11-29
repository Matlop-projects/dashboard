import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsConditionsDetailsComponent } from './terms-conditions-details.component';

describe('TermsConditionsDetailsComponent', () => {
  let component: TermsConditionsDetailsComponent;
  let fixture: ComponentFixture<TermsConditionsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsConditionsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsConditionsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
