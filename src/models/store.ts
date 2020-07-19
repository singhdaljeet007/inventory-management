import { Inventory } from "./inventory";
import { InventoryConstants } from "../constants/inventory.constants";
import { OrderService } from "../services/order.service";


export class Store {
    storeLocation: string;
    inventory = new Map<InventoryConstants.Item, Inventory>();

    constructor(location: string, inventoryList: Inventory[]) {
        this.storeLocation = location;
    }

    static getStores() {
        return {
            "UK": {
                "Mask": {
                    "stock": InventoryConstants.UK_MASK_STOCK,
                    "cost": InventoryConstants.UK_MASK_COST
                },
                "Gloves": {
                    "stock": InventoryConstants.GERMAN_GLOVE_STOCK,
                    "cost": InventoryConstants.GERMAN_GLOVE_COST
                }
            },
            "GERMAN": {
                "Mask": {
                    "stock": InventoryConstants.GERMAN_MASK_STOCK,
                    "cost": InventoryConstants.GERMAN_MASK_COST
                },
                "Gloves": {
                    "stock": InventoryConstants.GERMAN_GLOVE_STOCK,
                    "cost": InventoryConstants.GERMAN_GLOVE_COST
                }
            }
        }
    }

    getItemCount(itemType: InventoryConstants.Item) {
        return this.inventory.get(itemType)?.itemCount;
    }

    getItemPrice(itemType: InventoryConstants.Item) {
        return this.inventory.get(itemType)?.itemPrice;
    }

    getStoreLocation() {
        return this.storeLocation;
    }

}