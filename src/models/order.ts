import { Store } from "./store";
import { Inventory } from "./inventory";
import { InventoryConstants } from "../constants/inventory.constants";
import * as _ from "lodash"



export class Order {
    store:Store;
    passport:string;
    inventory:Inventory[];
    nationality:string="";
    items = new Map<InventoryConstants.Item,Inventory>();

    constructor(store:Store,passport:string,inventory:Inventory[]){
        this.store=store;
        this.passport=passport;
        this.inventory=inventory;
        this.setNationality();
        this.setItems(inventory);
    }

	getItems() {
		return this.items.keys();
	}

	getNationality() {
		return this.nationality;
	}

	getPassport() {
		return this.passport;
	}

	getStore() {
		return this.store;
	}

	setItems(inventoryList:Inventory[]) {
        inventoryList.forEach(obj=>{
            this.items.set(obj.itemType,obj);
        })
	}

    getItemCount(itemType:InventoryConstants.Item) {
		return this.items.get(itemType)?.itemCount;
	}

	getItemPrice(itemType:InventoryConstants.Item) {
		return this.items.get(itemType)?.itemPrice;
    }
    
    setNationality(){
        if (!_.isEmpty(this.passport)) {
			if (this.passport.match(InventoryConstants.UK_PASSPORT_REGEX)) {
				this.nationality = "UK";
			} else if (this.passport.match(InventoryConstants.GERMAN_PASSPORT_REGEX)) {
				this.nationality = "GERMAN";
			}
		}
    }

	setPassport(passport:string) {
		this.passport = passport;
	}

	setStore(store:Store) {
		this.store = store;
	}

}