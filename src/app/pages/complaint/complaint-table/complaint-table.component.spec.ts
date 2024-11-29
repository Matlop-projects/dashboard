import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintTableComponent } from './complaint-table.component';

describe('ComplaintTableComponent', () => {
  let component: ComplaintTableComponent;
  let fixture: ComponentFixture<ComplaintTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplaintTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
