import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnFlushProductsComponent } from './on-flush-products.component';

describe('OnFlushProductsComponent', () => {
  let component: OnFlushProductsComponent;
  let fixture: ComponentFixture<OnFlushProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnFlushProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnFlushProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
