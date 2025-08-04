import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalsTransactionComponent } from './withdrawals-transaction.component';

describe('WithdrawalsTransactionComponent', () => {
  let component: WithdrawalsTransactionComponent;
  let fixture: ComponentFixture<WithdrawalsTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawalsTransactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawalsTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
