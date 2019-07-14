import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.example.pharma{
   export enum ActorType {
      MANUFACTURER,
      DISTRIBUTOR,
      WHOLESALER,
      PHARMACIST,
      RECIPIENT,
   }
   export enum ShipmentStatus {
      CREATED,
      IN_TRANSIT,
      VERIFIED,
   }
   export enum DrugStatus {
      INITIAL,
      INITIATED,
      VERIFIED,
      COUNTERFEIT,
      COMPLETED,
   }
   export class Drug extends Asset {
      serialNumber: string;
      drugName: string;
      drugDesc: string;
      productHash: string;
      mfd: Date;
      status: DrugStatus;
      exp: Date;
      price: number;
      manufacturer: Manufacturer;
      owner: Actor;
      previousOwners: Actor[];
   }
   export class Shipment extends Asset {
      shipmentID: string;
      status: ShipmentStatus;
      drugs: Drug[];
      buyer: Actor;
      seller: Actor;
   }
   export abstract class Actor extends Participant {
      actorID: string;
      orgName: string;
      email: string;
      type: ActorType;
   }
   export class Manufacturer extends Actor {
   }
   export class Distributor extends Actor {
   }
   export class Wholesaler extends Actor {
   }
   export class Pharmacist extends Actor {
   }
   export class Recipient extends Actor {
   }
   export class DrugItemProduction extends Transaction {
      drugName: string;
      drugDesc: string;
      serialNumber: string;
      mfd: Date;
      exp: Date;
      price: number;
      manufacturer: Manufacturer;
   }
   export class ShipmentTransfer extends Transaction {
      shipment: Shipment;
   }
   export class CreateShipment extends Transaction {
      shipmentID: string;
      drugs: Drug[];
      buyer: Actor;
      seller: Actor;
   }
   export class VerifyShipment extends Transaction {
      shipment: Shipment;
   }
   export class DrugTransfer extends Transaction {
      drug: Drug;
      newOwner: Actor;
   }
// }
