import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProgressesComponent } from './admin-progresses.component';

describe('AdminProgressesComponent', () => {
  let component: AdminProgressesComponent;
  let fixture: ComponentFixture<AdminProgressesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProgressesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProgressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
