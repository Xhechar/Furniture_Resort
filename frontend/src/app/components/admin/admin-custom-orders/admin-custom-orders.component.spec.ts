import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCustomOrdersComponent } from './admin-custom-orders.component';

describe('AdminCustomOrdersComponent', () => {
  let component: AdminCustomOrdersComponent;
  let fixture: ComponentFixture<AdminCustomOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCustomOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCustomOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
