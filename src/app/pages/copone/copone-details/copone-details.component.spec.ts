import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoponeDetailsComponent } from './copone-details.component';

describe('CoponeDetailsComponent', () => {
  let component: CoponeDetailsComponent;
  let fixture: ComponentFixture<CoponeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoponeDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoponeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
