import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCallbackComponent } from './modal-callback.component';

describe('ModalCallbackComponent', () => {
  let component: ModalCallbackComponent;
  let fixture: ComponentFixture<ModalCallbackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalCallbackComponent]
    });
    fixture = TestBed.createComponent(ModalCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
