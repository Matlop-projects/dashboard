import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentComponent } from './attachment.component';

describe('AttachmentComponent', () => {
  let component: AttachmentComponent;
  let fixture: ComponentFixture<AttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
