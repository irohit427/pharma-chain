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

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DrugService } from './Drug.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-drug',
  templateUrl: './Drug.component.html',
  styleUrls: ['./Drug.component.css'],
  providers: [DrugService]
})
export class DrugComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  serialNumber = new FormControl('', Validators.required);
  drugName = new FormControl('', Validators.required);
  drugDesc = new FormControl('', Validators.required);
  productHash = new FormControl('', Validators.required);
  mfd = new FormControl('', Validators.required);
  status = new FormControl('', Validators.required);
  exp = new FormControl('', Validators.required);
  price = new FormControl('', Validators.required);
  manufacturer = new FormControl('', Validators.required);
  owner = new FormControl('', Validators.required);
  previousOwners = new FormControl('', Validators.required);

  constructor(public serviceDrug: DrugService, fb: FormBuilder) {
    this.myForm = fb.group({
      serialNumber: this.serialNumber,
      drugName: this.drugName,
      drugDesc: this.drugDesc,
      productHash: this.productHash,
      mfd: this.mfd,
      status: this.status,
      exp: this.exp,
      price: this.price,
      manufacturer: this.manufacturer,
      owner: this.owner,
      previousOwners: this.previousOwners
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceDrug.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.example.pharma.Drug',
      'serialNumber': this.serialNumber.value,
      'drugName': this.drugName.value,
      'drugDesc': this.drugDesc.value,
      'productHash': this.productHash.value,
      'mfd': this.mfd.value,
      'status': this.status.value,
      'exp': this.exp.value,
      'price': this.price.value,
      'manufacturer': this.manufacturer.value,
      'owner': this.owner.value,
      'previousOwners': this.previousOwners.value
    };

    this.myForm.setValue({
      'serialNumber': null,
      'drugName': null,
      'drugDesc': null,
      'productHash': null,
      'mfd': null,
      'status': null,
      'exp': null,
      'price': null,
      'manufacturer': null,
      'owner': null,
      'previousOwners': null
    });

    return this.serviceDrug.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'serialNumber': null,
        'drugName': null,
        'drugDesc': null,
        'productHash': null,
        'mfd': null,
        'status': null,
        'exp': null,
        'price': null,
        'manufacturer': null,
        'owner': null,
        'previousOwners': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.example.pharma.Drug',
      'drugName': this.drugName.value,
      'drugDesc': this.drugDesc.value,
      'productHash': this.productHash.value,
      'mfd': this.mfd.value,
      'status': this.status.value,
      'exp': this.exp.value,
      'price': this.price.value,
      'manufacturer': this.manufacturer.value,
      'owner': this.owner.value,
      'previousOwners': this.previousOwners.value
    };

    return this.serviceDrug.updateAsset(form.get('serialNumber').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceDrug.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceDrug.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'serialNumber': null,
        'drugName': null,
        'drugDesc': null,
        'productHash': null,
        'mfd': null,
        'status': null,
        'exp': null,
        'price': null,
        'manufacturer': null,
        'owner': null,
        'previousOwners': null
      };

      if (result.serialNumber) {
        formObject.serialNumber = result.serialNumber;
      } else {
        formObject.serialNumber = null;
      }

      if (result.drugName) {
        formObject.drugName = result.drugName;
      } else {
        formObject.drugName = null;
      }

      if (result.drugDesc) {
        formObject.drugDesc = result.drugDesc;
      } else {
        formObject.drugDesc = null;
      }

      if (result.productHash) {
        formObject.productHash = result.productHash;
      } else {
        formObject.productHash = null;
      }

      if (result.mfd) {
        formObject.mfd = result.mfd;
      } else {
        formObject.mfd = null;
      }

      if (result.status) {
        formObject.status = result.status;
      } else {
        formObject.status = null;
      }

      if (result.exp) {
        formObject.exp = result.exp;
      } else {
        formObject.exp = null;
      }

      if (result.price) {
        formObject.price = result.price;
      } else {
        formObject.price = null;
      }

      if (result.manufacturer) {
        formObject.manufacturer = result.manufacturer;
      } else {
        formObject.manufacturer = null;
      }

      if (result.owner) {
        formObject.owner = result.owner;
      } else {
        formObject.owner = null;
      }

      if (result.previousOwners) {
        formObject.previousOwners = result.previousOwners;
      } else {
        formObject.previousOwners = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'serialNumber': null,
      'drugName': null,
      'drugDesc': null,
      'productHash': null,
      'mfd': null,
      'status': null,
      'exp': null,
      'price': null,
      'manufacturer': null,
      'owner': null,
      'previousOwners': null
      });
  }

}
