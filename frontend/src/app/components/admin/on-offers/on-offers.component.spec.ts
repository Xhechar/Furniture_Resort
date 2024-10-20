import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnOffersComponent } from './on-offers.component';

describe('OnOffersComponent', () => {
  let component: OnOffersComponent;
  let fixture: ComponentFixture<OnOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnOffersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
