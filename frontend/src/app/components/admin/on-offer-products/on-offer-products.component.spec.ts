import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnOfferProductsComponent } from './on-offer-products.component';

describe('OnOfferProductsComponent', () => {
  let component: OnOfferProductsComponent;
  let fixture: ComponentFixture<OnOfferProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnOfferProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnOfferProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
