import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FagsDetailsComponent } from './fags-details.component';

describe('FagsDetailsComponent', () => {
  let component: FagsDetailsComponent;
  let fixture: ComponentFixture<FagsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FagsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FagsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
