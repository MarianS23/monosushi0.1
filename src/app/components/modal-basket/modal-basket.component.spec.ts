import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBasketComponent } from './modal-basket.component';

describe('ModalBasketComponent', () => {
  let component: ModalBasketComponent;
  let fixture: ComponentFixture<ModalBasketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalBasketComponent]
    });
    fixture = TestBed.createComponent(ModalBasketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
