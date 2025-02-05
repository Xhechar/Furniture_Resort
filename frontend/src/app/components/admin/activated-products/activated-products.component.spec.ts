import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedProductsComponent } from './activated-products.component';

describe('ActivatedProductsComponent', () => {
  let component: ActivatedProductsComponent;
  let fixture: ComponentFixture<ActivatedProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivatedProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivatedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
