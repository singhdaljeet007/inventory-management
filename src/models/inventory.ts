import { InventoryConstants } from "../constants/inventory.constants";


export class Inventory {

    itemType:InventoryConstants.Item;
    itemCount:number;
    itemPrice:number;

    constructor(itemType:InventoryConstants.Item,itemCount:number,itemPrice:number){
        this.itemType=itemType;
        this.itemCount=itemCount;
        this.itemPrice=itemPrice;
    }

    getItemCount() {
		return this.itemCount;
	}

	getItemPrice() {
		return this.itemPrice;
	}

	getItemType() {
		return this.itemType;
	}

	setItemCount(itemCount:number) {
		this.itemCount = itemCount;
	}

	setItemPrice(itemPrice:number) {
		this.itemPrice = itemPrice;
	}

	setItemType(itemType: InventoryConstants.Item) {
		this.itemType = itemType;
	}

}