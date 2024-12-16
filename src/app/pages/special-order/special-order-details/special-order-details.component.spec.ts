import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialOrderDetailsComponent } from './special-order-details.component';

describe('SpecialOrderDetailsComponent', () => {
  let component: SpecialOrderDetailsComponent;
  let fixture: ComponentFixture<SpecialOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialOrderDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
