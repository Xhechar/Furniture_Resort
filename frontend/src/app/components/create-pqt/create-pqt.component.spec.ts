import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePqtComponent } from './create-pqt.component';

describe('CreatePqtComponent', () => {
  let component: CreatePqtComponent;
  let fixture: ComponentFixture<CreatePqtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePqtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePqtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
