import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelReasonTableComponent } from './cancel-reason-table.component';

describe('CancelReasonTableComponent', () => {
  let component: CancelReasonTableComponent;
  let fixture: ComponentFixture<CancelReasonTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelReasonTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelReasonTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
