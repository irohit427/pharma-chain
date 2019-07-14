'use strict';
/**
 * Write your transction processor functions here
 */
const NS = 'org.example.pharma'


/**
 * A drug has been produced by the manufacturer
 * @param {org.example.pharma.DrugItemProduction} drug
 * @transaction
 */
async function registerDrugProduction(drug) {
    let factory = getFactory();
    
    let assetRegistry = await getAssetRegistry(NS+'.Drug');
  	
  	let manufacturerRegistry = await getParticipantRegistry(NS+'.Manufacturer');
	
  	let manufacturer = await manufacturerRegistry.get(drug.manufacturer.getIdentifier());
  
    let drugAsset = factory.newResource(NS, 'Drug', drug.serialNumber);
  	drugAsset.drugName = drug.drugName;
  	drugAsset.drugDesc = drug.drugDesc;
    drugAsset.productHash = sha256(drug.serialNumber+drug.drugName+drug.manufacturer.actorId);
    drugAsset.mfd = drug.mfd;
    drugAsset.exp = drug.exp;
    drugAsset.price = drug.price;
    drugAsset.status = "INITIAL";
  	drugAsset.manufacturer = factory.newRelationship(NS, 'Manufacturer', drug.manufacturer.getIdentifier());
    drugAsset.owner = factory.newRelationship(NS, 'Manufacturer', drug.manufacturer.getIdentifier());
    drugAsset.previousOwners = [];

    await assetRegistry.add(drugAsset);
}


/**
 * A drug has been produced by the manufacturer
 * @param {org.example.pharma.CreateShipment} shipment
 * @transaction
 */
async function CreateShipment (shipment) {
  
  let buyerID = shipment.buyer.getIdentifier();
  let buyerType = shipment.buyer.type;
  
    if(buyerType == "MANUFACTURER")
    {
      throw new Error('Cannot transfer drug to manufacturer');
    }
    //Check if buyer exists
    if(buyerType == "DISTRIBUTOR")
    {    
        let distributorRegistry = await getParticipantRegistry(NS+'.Distributor');
        let distributor = await distributorRegistry.get(buyerID);
    }

    //Check if buyer exists
    if(buyerType == "WHOLESALER")
    {    
        let wholesalerRegistry = await getParticipantRegistry(NS+'.Wholesaler');
        let wholesaler = await wholesalerRegistry.get(buyerID);
    }

    //Check if buyer exists
    if(buyerType == "PHARMACIST")
    {    
        let pharmacistRegistry = await getParticipantRegistry(NS+'.Pharmacist');
        let pharmacist = await pharmacistRegistry.get(buyerID);
    }
    let drugs = shipment.drugs;
    let drugRegistry = await getAssetRegistry(NS+'.Drug');
    async function update(i){
      let drug = drugs[i];
      if((drug.status == "INITIAL" && drug.owner.type == "MANUFACTURER") || ((drug.owner.type == "DISTRIBUTOR" ||drug.owner.type == "WHOLESALER" || drug.owner.type == "RETAILER")))
      {
        drug.status = "INITIATED";
        await drugRegistry.update(drug);
        ++i;
        if(i < drugs.length)
        await update(i);
      }
      else
      {
        throw new Error('Shipment cannot be created');
      }
      
    }

    await update(0);

    let factory = getFactory();
      
    let shipmentRegistry = await getAssetRegistry(NS+'.Shipment');
    
    let shipmentAsset = factory.newResource(NS, 'Shipment', shipment.shipmentID);
    shipmentAsset.buyer = shipment.buyer;
    shipmentAsset.seller = shipment.seller;
    shipmentAsset.drugs = shipment.drugs;
    shipmentAsset.status = "CREATED";
    await shipmentRegistry.add(shipmentAsset);
}


/**
 * Verification of Shipment
 * @param {org.example.pharma.VerifyShipment} shipment
 * @transaction
 */
async function VerifyShipment (shipment) {
  let drugs = shipment.shipment.drugs;
  let sellerID = shipment.shipment.seller.getIdentifier(); 
  let drugRegistry = await getAssetRegistry(NS+'.Drug');
  async function verify(i)
  {
    if(drugs[i].status == "INITIATED")
    {
      let drugID = drugs[i].getIdentifier();
      let drug = await drugRegistry.get(drugID);
      let ownerID = drug.owner.getIdentifier();
      if(ownerID !== sellerID)
        throw new Error('Seller is not the owner of the drug');
      else
      {
        drugs[i].status = "VERIFIED";
        await drugRegistry.update(drugs[i]);
        ++i;
        if(i < drugs.length)
          await verify(i);
      }
    }
    else
    {
      drugs[i].status = "COUNTERFEIT";
      await drugRegistry.update(drugs[i]);
      throw new Error("Counterfeit Drug Found");
    }
    
  }
  /*if(getCurrentParticipant().getIdentifier() !== shipment.shipment.buyer.getIdentifier())
  {
    throw new Error('Transction can only be submitted by the authorized buyer of the drug');
  }
  else
  {
    await verify();
  }*/
  await verify(0);
  let shipmentRegistry = await getAssetRegistry(NS+'.Shipment');
  shipment.shipment.status = "VERIFIED";
  await shipmentRegistry.update(shipment.shipment);

}

/**
 * A drug has been produced by the manufacturer
 * @param {org.example.pharma.ShipmentTransfer} shipment
 * @transaction
 */
async function ShipmentTransfer(shipment) {
  
  let ship = shipment.shipment;
  if(ship.status == "VERIFIED")
  {
    let actorID = ship.buyer.getIdentifier();
    let actorType = ship.buyer.type;

    /*let assetRegistry = await getAssetRegistry(NS+'.Drug');
    let asset = await assetRegistry.get(drugTransfer.drug.getIdentifier());
    drugTransfer.drug.previousOwners.push(drugTransfer.drug.owner);
    drugTransfer.drug.owner = drugTransfer.newOwner;
    await assetRegistry.update(drugTransfer.drug);*/
    
    let drugs = ship.drugs;
    let drugRegistry = await getAssetRegistry(NS+'.Drug');
    async function transfer(i)
    {
      let drug = drugs[i];
      drug.previousOwners.push(drug.owner);
      drug.owner = ship.buyer;
      drug.status = "INITIAL";
      await drugRegistry.update(drug);
      ++i;
      if(i < drugs.length)
        await transfer(i);
    }
    await transfer(0);
  }
  else
  {
    throw new Error('Shipment has not been verified');
  }
  
}

/**
 * A drug has been produced by the manufacturer
 * @param {org.example.pharma.DrugTransfer} drug
 * @transaction
 */
async function DrugTransfer(drug) {
  let d = drug.drug;
  if(d.status != "COMPLETED")
  {
    let drugRegistry = await getAssetRegistry(NS+'.Drug');
    let asset = await assetRegistry.get(d.getIdentifier());
    d.previousOwners.push(d.owner);
    d.owner = d.newOwner;
    d.status = "COMPLETED";
    await assetRegistry.update(d);
  }
  else
  {
    throw new Error('Drug cannot be transferred');
  }
}


/*
 SHA256 Implementation
 */

var sha256 = function(ascii) {
	var mathPow = Math.pow;
	var maxWord = mathPow(2, 32);
	var lengthProperty = 'length'
	var i, j; // Used as a counter across the whole file
	var result = ''

	var words = [];
	var asciiBitLength = ascii[lengthProperty]*8;
	
	//* caching results is optional - remove/add slash from front of this line to toggle
	// Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
	// (we actually calculate the first 64, but extra values are just ignored)
	var hash = sha256.h = sha256.h || [];
	// Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
	var k = sha256.k = sha256.k || [];
	var primeCounter = k[lengthProperty];
	/*/
	var hash = [], k = [];
	var primeCounter = 0;
	//*/

	var isComposite = {};
	for (var candidate = 2; primeCounter < 64; candidate++) {
		if (!isComposite[candidate]) {
			for (i = 0; i < 313; i += candidate) {
				isComposite[i] = candidate;
			}
			hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
			k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
		}
	}
	
	ascii += '\x80' // Append Ƈ' bit (plus zero padding)
	while (ascii[lengthProperty]%64 - 56) ascii += '\x00' // More zero padding
	for (i = 0; i < ascii[lengthProperty]; i++) {
		j = ascii.charCodeAt(i);
		if (j>>8) return; // ASCII check: only accept characters in range 0-255
		words[i>>2] |= j << ((3 - i)%4)*8;
	}
	words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
	words[words[lengthProperty]] = (asciiBitLength)
	
	// process each chunk
	for (j = 0; j < words[lengthProperty];) {
		var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
		var oldHash = hash;
		// This is now the undefinedworking hash", often labelled as variables a...g
		// (we have to truncate as well, otherwise extra entries at the end accumulate
		hash = hash.slice(0, 8);
		
		for (i = 0; i < 64; i++) {
			var i2 = i + j;
			// Expand the message into 64 words
			// Used below if 
			var w15 = w[i - 15], w2 = w[i - 2];

			// Iterate
			var a = hash[0], e = hash[4];
			var temp1 = hash[7]
				+ (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
				+ ((e&hash[5])^((~e)&hash[6])) // ch
				+ k[i]
				// Expand the message schedule if needed
				+ (w[i] = (i < 16) ? w[i] : (
						w[i - 16]
						+ (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
						+ w[i - 7]
						+ (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
					)|0
				);
			// This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
			var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
				+ ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])); // maj
			
			hash = [(temp1 + temp2)|0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
			hash[4] = (hash[4] + temp1)|0;
		}
		
		for (i = 0; i < 8; i++) {
			hash[i] = (hash[i] + oldHash[i])|0;
		}
	}
	
	for (i = 0; i < 8; i++) {
		for (j = 3; j + 1; j--) {
			var b = (hash[i]>>(j*8))&255;
			result += ((b < 16) ? 0 : '') + b.toString(16);
		}
	}
	return result;
};

function rightRotate(value, amount) {
    return (value>>>amount) | (value<<(32 - amount));
};