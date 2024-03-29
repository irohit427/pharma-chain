/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { DataService } from './data.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { DrugComponent } from './Drug/Drug.component';
import { ShipmentComponent } from './Shipment/Shipment.component';

import { ManufacturerComponent } from './Manufacturer/Manufacturer.component';
import { DistributorComponent } from './Distributor/Distributor.component';
import { WholesalerComponent } from './Wholesaler/Wholesaler.component';
import { PharmacistComponent } from './Pharmacist/Pharmacist.component';
import { RecipientComponent } from './Recipient/Recipient.component';

import { DrugItemProductionComponent } from './DrugItemProduction/DrugItemProduction.component';
import { ShipmentTransferComponent } from './ShipmentTransfer/ShipmentTransfer.component';
import { CreateShipmentComponent } from './CreateShipment/CreateShipment.component';
import { VerifyShipmentComponent } from './VerifyShipment/VerifyShipment.component';
import { DrugTransferComponent } from './DrugTransfer/DrugTransfer.component';

  @NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DrugComponent,
    ShipmentComponent,
    ManufacturerComponent,
    DistributorComponent,
    WholesalerComponent,
    PharmacistComponent,
    RecipientComponent,
    DrugItemProductionComponent,
    ShipmentTransferComponent,
    CreateShipmentComponent,
    VerifyShipmentComponent,
    DrugTransferComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
