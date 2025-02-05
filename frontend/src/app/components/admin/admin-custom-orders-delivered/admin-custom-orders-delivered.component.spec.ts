import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCustomOrdersDeliveredComponent } from './admin-custom-orders-delivered.component';

describe('AdminCustomOrdersDeliveredComponent', () => {
  let component: AdminCustomOrdersDeliveredComponent;
  let fixture: ComponentFixture<AdminCustomOrdersDeliveredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCustomOrdersDeliveredComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCustomOrdersDeliveredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
