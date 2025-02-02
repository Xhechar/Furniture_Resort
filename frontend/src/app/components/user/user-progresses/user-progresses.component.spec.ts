import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProgressesComponent } from './user-progresses.component';

describe('UserProgressesComponent', () => {
  let component: UserProgressesComponent;
  let fixture: ComponentFixture<UserProgressesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProgressesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProgressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
