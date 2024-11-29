import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractTypeDetailsComponent } from './contract-type-details.component';

describe('ContractTypeDetailsComponent', () => {
  let component: ContractTypeDetailsComponent;
  let fixture: ComponentFixture<ContractTypeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractTypeDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractTypeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
