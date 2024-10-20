import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglereviewComponent } from './singlereview.component';

describe('SinglereviewComponent', () => {
  let component: SinglereviewComponent;
  let fixture: ComponentFixture<SinglereviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinglereviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglereviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
