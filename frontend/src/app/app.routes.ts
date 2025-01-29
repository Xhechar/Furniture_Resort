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

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'home', pathMatch: 'full', redirectTo: '' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'single-product', component: SingleComponent },
  { path: 'page-loader', component: PageloaderComponent },
  { path: 'verify-email', component: VerifymailComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'auth-change-password', component: ChangepasswordComponent},
  { path: 'new-product', component: NewproductComponent },
  { path: 'user', component: UserComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'user/cart', component: CartComponent },
  { path: 'user/my-reviews', component: MyreviewsComponent },
  { path: 'user/orders', component: OrdersComponent },
  { path: 'user/products', component: ProductsComponent },
  { path: 'user/profile', component: ProfileComponent },
  { path: 'user/create-review', component: SinglereviewComponent },
  { path: 'admin/a-profile', component: AProfileComponent },
  { path: 'admin/dashboard', component: DashboardComponent },
  { path: 'admin/deleted-products', component: DeletedProductsComponent },
  { path: 'admin/deleted-users', component: DeletedUsersComponent },
  { path: 'admin/existing-products', component: ExistingProductsComponent },
  { path: 'admin/on-offers', component: OnOffersComponent }, 
  { path: 'admin/user-orders', component: UserOrdersComponent },
  { path: 'admin/users', component: UsersComponent },
  {path: '**', component: NotfoundComponent}
];
