import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { ProductsComponent } from './catalogs/products/products.component';
import { ProductsAddComponent } from './catalogs/products/products-add/products-add.component';
import { ProductsEditComponent } from './catalogs/products/products-edit/products-edit.component';
import { ProductCategoriesComponent } from './catalogs/product-categories/product-categories.component';
import {AdminOrdersComponent} from './orders/admin-orders.component';
import {OrderEditComponent} from './orders/order-edit/order-edit.component';
import {AdminSettingsComponent} from './admin-settings/admin-settings.component';
import { PosiljkeComponent } from './posiljke/posiljke.component';
import { PosiljkaAddComponent } from './posiljke/posiljka-add/posiljka-add.component';
import { PosiljkaEditComponent } from './posiljke/posiljka-edit/posiljka-edit.component';
import { FaktureComponent } from './catalogs/fakture/fakture.component';
import { FakturaAddComponent } from './catalogs/fakture/faktura-add/faktura-add.component';
import { UplateComponent } from './uplate/uplate.component';
import { UplataAddComponent } from './uplate/uplata-add/uplata-add.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      // PRODUCTS
      {
        path: 'products',
        component: ProductsComponent,
      },
      {
        path: 'products/add',
        component: ProductsAddComponent,
      },
      {
        path: 'products/:id/edit',
        component: ProductsEditComponent,
      },

      // PRODUCT CATEGORIES
      {
        path: 'product-categories',
        component: ProductCategoriesComponent,
      },

      // ORDERS
      {
        path: 'orders',
        component: AdminOrdersComponent,
      },
      {
        path: 'orders/:id/edit',
        component: OrderEditComponent,
      },

      // SETTINGS
      {
        path: 'settings',
        component: AdminSettingsComponent,
      },

      // POŠILJKE
      {
        path: 'posiljke',
        component: PosiljkeComponent,
      },
      {
        path: 'posiljke/add',
        component: PosiljkaAddComponent,
      },
      {
        path: 'posiljke/:id/edit',
        component: PosiljkaEditComponent,
      },

      // FAKTURE
      {
        path: 'fakture',
        component: FaktureComponent,
      },
      {
        path: 'fakture/add',
        component: FakturaAddComponent,
      },

      // UPLATE
      {
        path: 'uplate',
        component: UplateComponent,
      },
      {
        path: 'uplate/add',
        component: UplataAddComponent,
      },

      // default admin route → /admin/products
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
