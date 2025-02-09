import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { SingleComponent } from './components/single/single.component';
import { NewproductComponent } from './components/newproduct/newproduct.component';
import { UserComponent } from './components/user/user.component';
import { AdminComponent } from './components/admin/admin.component';
import { CartComponent } from './components/user/cart/cart.component';
import { MyreviewsComponent } from './components/user/myreviews/myreviews.component';
import { OrdersComponent } from './components/user/orders/orders.component';
import { ProductsComponent } from './components/user/products/products.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { SinglereviewComponent } from './components/user/singlereview/singlereview.component';
import { AProfileComponent } from './components/admin/a-profile/a-profile.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { DeletedProductsComponent } from './components/admin/deleted-products/deleted-products.component';
import { DeletedUsersComponent } from './components/admin/deleted-users/deleted-users.component';
import { ExistingProductsComponent } from './components/admin/existing-products/existing-products.component';
import { OnOffersComponent } from './components/admin/on-offers/on-offers.component';
import { UserOrdersComponent } from './components/admin/user-orders/user-orders.component';
import { UsersComponent } from './components/admin/users/users.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { PageloaderComponent } from './components/pageloader/pageloader.component';
import { VerifymailComponent } from './components/verifymail/verifymail.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ChangepasswordComponent } from './components/changepassword/changepassword.component';
import { CategoryComponent } from './components/category/category.component';
import { CreateReviewComponent } from './components/create-review/create-review.component';
import { CreatePqtComponent } from './components/create-pqt/create-pqt.component';
import { UserProgressesComponent } from './components/user/user-progresses/user-progresses.component';
import { UserMessagesComponent } from './components/user/user-messages/user-messages.component';
import { UserWishlistsComponent } from './components/user/user-wishlists/user-wishlists.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AdminProductsComponent } from './components/admin/admin-products/admin-products.component';
import { ActivatedProductsComponent } from './components/admin/activated-products/activated-products.component';
import { OnOfferProductsComponent } from './components/admin/on-offer-products/on-offer-products.component';
import { OnFlushProductsComponent } from './components/admin/on-flush-products/on-flush-products.component';
import { AdminReviewsComponent } from './components/admin/admin-reviews/admin-reviews.component';
import { AdminProgressesComponent } from './components/admin/admin-progresses/admin-progresses.component';
import { AdminCompletedProgressesComponent } from './components/admin/admin-completed-progresses/admin-completed-progresses.component';
import { AdminMessagesComponent } from './components/admin/admin-messages/admin-messages.component';
import { AdminDeliveredOrdersComponent } from './components/admin/admin-delivered-orders/admin-delivered-orders.component';
import { AdminCustomOrdersComponent } from './components/admin/admin-custom-orders/admin-custom-orders.component';
import { AdminCategoriesComponent } from './components/admin/admin-categories/admin-categories.component';
import { AdminAllUsersComponent } from './components/admin/admin-all-users/admin-all-users.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'home', pathMatch: 'full', redirectTo: '' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'single-product', component: SingleComponent },
  { path: 'page-loader', component: PageloaderComponent },
  { path: 'verify-email', component: VerifymailComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'category', component: CategoryComponent }, //to be removed
  { path: 'create-review', component: CreateReviewComponent }, //to be removed
  { path: 'create-pqt', component: CreatePqtComponent }, //to be removed
  { path: 'auth-change-password', component: ChangepasswordComponent},
  { path: 'new-product', component: NewproductComponent }, //to be removed
  { path: 'user', component: UserComponent , children: [
    { path: 'cart', component: CartComponent },
    { path: 'my-reviews', component: MyreviewsComponent },
    { path: 'orders', component: OrdersComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'my-profile', component: ProfileComponent },
    { path: 'my-progresses', component: UserProgressesComponent },
    { path: 'my-messages', component: UserMessagesComponent },
    { path: 'my-wishlist', component: UserWishlistsComponent },
    { path: 'create-review', component: SinglereviewComponent }
  ]
  },
  { path: 'admin', component: AdminComponent, children: [
    { path: 'a-profile', component: AProfileComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'products', component: AdminProductsComponent, children: [
      { path: 'activated-products', component: ActivatedProductsComponent },
      { path: 'on-offer-products', component: OnOfferProductsComponent },
      { path: 'on-flush-products', component: OnFlushProductsComponent },
      { path: 'created-products', component: ExistingProductsComponent }
    ]
    },
    { path: 'user-reviews', component: AdminReviewsComponent },
    { path: 'user-progresses', component: AdminProgressesComponent, children: [
      { path: 'all-progresses', component: DeletedProductsComponent },
      { path: 'user-completed-progresses', component: AdminCompletedProgressesComponent },
    ]
    },
    { path: 'admin-messages', component: AdminMessagesComponent },
    { path: 'user-orders', component: UserOrdersComponent, children: [
      { path: 'normal-orders', component: OnOffersComponent },
      { path: 'delivered-orders', component: AdminDeliveredOrdersComponent },
      { path: 'user-custom-orders', component: AdminCustomOrdersComponent },
      { path: 'user-delivered-orders', component: AdminDeliveredOrdersComponent }
    ]
    },
    { path: 'user-categories', component: AdminCategoriesComponent },
    {
      path: 'users', component: UsersComponent, children: [
        { path: 'all-users', component: AdminAllUsersComponent},
        { path: 'deleted-users', component: DeletedUsersComponent },
      ]
    },
  ]
  },
  {path: '**', component: NotfoundComponent}
];
