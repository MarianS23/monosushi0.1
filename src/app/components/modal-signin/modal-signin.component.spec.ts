import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSigninComponent } from './modal-signin.component';

describe('ModalSigninComponent', () => {
  let component: ModalSigninComponent;
  let fixture: ComponentFixture<ModalSigninComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSigninComponent]
    });
    fixture = TestBed.createComponent(ModalSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
