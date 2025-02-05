import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeliveredOrdersComponent } from './admin-delivered-orders.component';

describe('AdminDeliveredOrdersComponent', () => {
  let component: AdminDeliveredOrdersComponent;
  let fixture: ComponentFixture<AdminDeliveredOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDeliveredOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDeliveredOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
