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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Drug', component: DrugComponent },
  { path: 'Shipment', component: ShipmentComponent },
  { path: 'Manufacturer', component: ManufacturerComponent },
  { path: 'Distributor', component: DistributorComponent },
  { path: 'Wholesaler', component: WholesalerComponent },
  { path: 'Pharmacist', component: PharmacistComponent },
  { path: 'Recipient', component: RecipientComponent },
  { path: 'DrugItemProduction', component: DrugItemProductionComponent },
  { path: 'ShipmentTransfer', component: ShipmentTransferComponent },
  { path: 'CreateShipment', component: CreateShipmentComponent },
  { path: 'VerifyShipment', component: VerifyShipmentComponent },
  { path: 'DrugTransfer', component: DrugTransferComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }
