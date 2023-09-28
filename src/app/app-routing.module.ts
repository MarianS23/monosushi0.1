import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { ProductComponent } from './pages/product/product.component';
import { ProductInfoComponent } from './components/product-info/product-info.component';
import { DiscountComponent } from './pages/discount/discount.component';
import { DiscountInfoComponent } from './components/discount-info/discount-info.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { AuthorizationComponent } from './pages/authorization/authorization.component';
import { CabinetComponent } from './pages/cabinet/cabinet.component';
import { DeliveryAndPaymentComponent } from './pages/delivery-and-payment/delivery-and-payment.component';
import { HomeComponent } from './pages/home/home.component';
import { ModalBasketComponent } from './components/modal-basket/modal-basket.component';
import { ModalSigninComponent } from './components/modal-signin/modal-signin.component';

import { AdminComponent } from './admin/admin.component';
import { AdminDiscountComponent } from './admin/admin-discount/admin-discount.component';
import { AdminCategoryComponent } from './admin/admin-category/admin-category.component';
import { AdminDeliveryComponent } from './admin/admin-delivery/admin-delivery.component';
import { AdminProductComponent } from './admin/admin-product/admin-product.component';
import { ProductService } from './shared/services/product/product.service';
import { authorizationGuard } from './shared/guards/authorization.guard';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutUsComponent },
  { path: 'authorization', component: AuthorizationComponent },
  { path: 'cabinet', component: CabinetComponent },
  { path: 'delivery', component: DeliveryAndPaymentComponent },
  { path: 'discount', component: DiscountComponent },
  { path: 'discount/:id', component: DiscountInfoComponent },
  { path: 'product/:category', component: ProductComponent },
  { path: 'product/:category/:id', component: ProductInfoComponent },
  { path: 'basket', component: ModalBasketComponent },
  { path: 'signin', component: ModalSigninComponent },
  { path: 'authComp', component: AuthorizationComponent },
  {
    path: 'admin', component: AdminComponent, canActivate: [authorizationGuard], children: [
      { path: 'admin-category', component: AdminCategoryComponent },
      { path: 'admin-discount', component: AdminDiscountComponent },
      { path: 'admin-delivery', component: AdminDeliveryComponent },
      { path: 'admin-product', component: AdminProductComponent },
      { path: '', pathMatch: 'full', redirectTo: 'admin-category' }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
