import {NgModule} from '@angular/core';

import {AdminRoutingModule} from './admin-routing-module';
import {ProductsComponent} from './catalogs/products/products.component';
import {ProductsAddComponent} from './catalogs/products/products-add/products-add.component';
import {ProductsEditComponent} from './catalogs/products/products-edit/products-edit.component';
import {AdminLayoutComponent} from './admin-layout/admin-layout.component';
import {ProductCategoriesComponent} from './catalogs/product-categories/product-categories.component';
import {
  ProductCategoryUpsertComponent
} from './catalogs/product-categories/product-category-upsert/product-category-upsert.component';
import {AdminOrdersComponent} from './orders/admin-orders.component';
import {OrderEditComponent} from './orders/order-edit/order-edit.component';
import {AdminSettingsComponent} from './admin-settings/admin-settings.component';
import {SharedModule} from '../shared/shared-module';
import { OrderDetailsDialogComponent } from './orders/admin-orders-details-dialog/order-details-dialog.component';
import { ChangeStatusDialogComponent } from './orders/change-status-dialog/change-status-dialog.component';
import { PosiljkeComponent } from './posiljke/posiljke.component';
import { PosiljkaAddComponent } from './posiljke/posiljka-add/posiljka-add.component';
import { PosiljkaEditComponent } from './posiljke/posiljka-edit/posiljka-edit.component';
import { FaktureComponent } from './catalogs/fakture/fakture.component';
import { FakturaAddComponent } from './catalogs/fakture/faktura-add/faktura-add.component';
import { DostavljaciComponent } from './catalogs/dostavljaci/dostavljaci.component';
import { UplateComponent } from './uplate/uplate.component';
import { UplataAddComponent } from './uplate/uplata-add/uplata-add.component';


@NgModule({
  declarations: [
    ProductsComponent,
    ProductsAddComponent,
    ProductsEditComponent,
    AdminLayoutComponent,
    ProductCategoriesComponent,
    ProductCategoryUpsertComponent,
    AdminOrdersComponent,
    OrderEditComponent,
    AdminSettingsComponent,
    OrderDetailsDialogComponent,
    ChangeStatusDialogComponent,
    DostavljaciComponent,
    PosiljkeComponent,
    PosiljkaAddComponent,
    PosiljkaEditComponent,
    FaktureComponent,
    FakturaAddComponent,
    UplateComponent,
    UplataAddComponent,
  ],
  imports: [
    AdminRoutingModule,
    SharedModule,
  ]
})
export class AdminModule { }
