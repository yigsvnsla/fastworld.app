import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffLineModalComponent } from './off-line-modal.component';

describe('OffLineModalComponent', () => {
  let component: OffLineModalComponent;
  let fixture: ComponentFixture<OffLineModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffLineModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffLineModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
