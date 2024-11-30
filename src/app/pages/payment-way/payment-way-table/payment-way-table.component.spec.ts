import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentWayTableComponent } from './payment-way-table.component';

describe('PaymentWayTableComponent', () => {
  let component: PaymentWayTableComponent;
  let fixture: ComponentFixture<PaymentWayTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentWayTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentWayTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
