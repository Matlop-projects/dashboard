import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsConditionsTableComponent } from './terms-conditions-table.component';

describe('TermsConditionsTableComponent', () => {
  let component: TermsConditionsTableComponent;
  let fixture: ComponentFixture<TermsConditionsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsConditionsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsConditionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
