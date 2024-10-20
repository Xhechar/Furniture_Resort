import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingProductsComponent } from './existing-products.component';

describe('ExistingProductsComponent', () => {
  let component: ExistingProductsComponent;
  let fixture: ComponentFixture<ExistingProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExistingProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExistingProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
