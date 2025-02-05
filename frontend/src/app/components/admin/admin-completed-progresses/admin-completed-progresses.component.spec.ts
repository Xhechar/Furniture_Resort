import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCompletedProgressesComponent } from './admin-completed-progresses.component';

describe('AdminCompletedProgressesComponent', () => {
  let component: AdminCompletedProgressesComponent;
  let fixture: ComponentFixture<AdminCompletedProgressesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCompletedProgressesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCompletedProgressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
