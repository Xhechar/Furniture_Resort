import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWishlistsComponent } from './user-wishlists.component';

describe('UserWishlistsComponent', () => {
  let component: UserWishlistsComponent;
  let fixture: ComponentFixture<UserWishlistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserWishlistsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserWishlistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
