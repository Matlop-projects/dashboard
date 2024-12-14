import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialOrderTableComponent } from './special-order-table.component';

describe('SpecialOrderTableComponent', () => {
  let component: SpecialOrderTableComponent;
  let fixture: ComponentFixture<SpecialOrderTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialOrderTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialOrderTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
