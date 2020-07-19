import {InventoryConstants} from '../constants/inventory.constants'
import * as _ from 'lodash'
import { Store } from '../models/store';
import { Order } from '../models/order';
import { Inventory } from '../models/inventory';


export class OrderService{
    static discountPercentage:number = 20;
    static transportCostPerLot:number = 400;
    static discountedCostPerLot = OrderService.transportCostPerLot - (OrderService.discountPercentage * OrderService.transportCostPerLot) / 100;
    static basicUnit = 10;

    nationality:string="";
    static stores = Store.getStores();

    static checkNationality(passportNo:string){
        if (!_.isEmpty(passportNo)) {
			if (passportNo.match(InventoryConstants.UK_PASSPORT_REGEX)) {
				return "UK";
			} else if (passportNo.match(InventoryConstants.GERMAN_PASSPORT_REGEX)) {
				return "GERMAN";
			}
		}
    }

    static calculateTransportCost(isDiscountApplicable:boolean, importItemCount:number) {
		let transportCost=0;
        transportCost = isDiscountApplicable ? ((importItemCount - 1) / this.basicUnit + 1)
                * this.discountedCostPerLot : ((importItemCount - 1) / this.basicUnit + 1)
                * this.transportCostPerLot;
		return transportCost;
    }

    static parseInput(inputStr:string) {
        let params = inputStr.split(":");
        let store = this.getStoreByStr(params[0]);
        let nationality = this.checkNationality(params[1]);
        let itemType1 = this.getItemTypeByStr(params[2]);
        let orderedUnits1 = parseInt(params[3]);
        let itemType2 = this.getItemTypeByStr(params[4]);
        let orderedUnits2 = parseInt(params[5]);

        // console.log("nationality:",nationality)

        //validateStock
        let importItem1Count = this.getItemImportCount(params[2],store,orderedUnits1);
        let importItem2Count = this.getItemImportCount(params[4],store,orderedUnits2);
        let transportCost1 = this.calculateTransportCost((store!=nationality),importItem1Count);
        let transportCost2 = this.calculateTransportCost((store!=nationality),importItem2Count);

        let foreignStoreItem1Stock = this.getStoreItemStock(params[2],this.swapStore(store));
        let foreignStoreItem2Stock = this.getStoreItemStock(params[4],this.swapStore(store));
        if(importItem1Count>foreignStoreItem1Stock || importItem2Count>foreignStoreItem2Stock){
            return "OUT_OF_STOCK:"+ InventoryConstants.UK_MASK_STOCK +":" +InventoryConstants.GERMAN_MASK_STOCK +":"+InventoryConstants.UK_GLOVE_STOCK+":"+InventoryConstants.GERMAN_GLOVE_STOCK;
        }

        let actualItem1Cost = 0;
        let actualItem2Cost = 0;
        let storeItem1StockLeft = 0;
        let foreignStoreItem1StockLeft = 0;
        let storeItem2StockLeft = 0;
        let foreignStoreItem2StockLeft = 0;
        if(importItem1Count==0){
            actualItem1Cost = this.getItemStoreCost(params[2],store,orderedUnits1,false);
            storeItem1StockLeft = this.getStoreItemStock(params[2],store) - orderedUnits1;
            foreignStoreItem1StockLeft = this.getStoreItemStock(params[2],this.swapStore(store));
        }else{
           let storeItemCost = this.getItemStoreCost(params[2],store,orderedUnits1,true);
           let foreignItemCost = this.getItemStoreCost(params[2],this.swapStore(store),importItem1Count,false);
           actualItem1Cost = storeItemCost + foreignItemCost;
           storeItem1StockLeft = 0;
           foreignStoreItem1StockLeft = this.getStoreItemStock(params[2],this.swapStore(store)) - importItem1Count;
        }

        if(importItem2Count==0){
            actualItem2Cost = this.getItemStoreCost(params[4],store,orderedUnits2,false);
            storeItem2StockLeft = this.getStoreItemStock(params[4],store) - orderedUnits2;
            foreignStoreItem2StockLeft = this.getStoreItemStock(params[4],this.swapStore(store));
        }else{
           let storeItemCost = this.getItemStoreCost(params[4],store,orderedUnits2,true);
           let foreignItemCost = this.getItemStoreCost(params[4],this.swapStore(store),importItem2Count,false);
           actualItem2Cost = storeItemCost + foreignItemCost;
           storeItem2StockLeft = 0;
           foreignStoreItem2StockLeft = this.getStoreItemStock(params[4],this.swapStore(store)) - importItem2Count;
        }
        let totalCost = actualItem1Cost + transportCost1 + actualItem2Cost + transportCost2;
        return totalCost+":"+ storeItem1StockLeft +":"+ foreignStoreItem1StockLeft +":"+ storeItem2StockLeft +":"+foreignStoreItem2StockLeft;
    }
    
    static swapStore(store:string){
        if(store=="UK"){
            return "GERMAN";
        }else{
            return "UK";
        }
    }
    static getStoreByStr(storeStr:string){
        return storeStr=="UK" ? "UK" : "GERMAN";
    }

    static getStoreItemStock(itemType:string,store:string){
        let stock = (store =="UK") ? ((itemType=="Mask") ? this.stores.UK.Mask.stock : this.stores.UK.Gloves.stock) : ((itemType=="Mask") ? this.stores.GERMAN.Mask.stock : this.stores.GERMAN.Gloves.stock);
        return stock;
    }
    static getItemStoreCost(itemType:any,store:any,orderedUnits:number,isImport:boolean){
        let stock = this.getStoreItemStock(itemType,store);
        let unitPrice = (store =="UK") ? ((itemType=="Mask") ? this.stores.UK.Mask.cost : this.stores.UK.Gloves.cost) : ((itemType=="Mask") ? this.stores.GERMAN.Mask.cost : this.stores.GERMAN.Gloves.cost);
        if(isImport){
            return stock * unitPrice;
        }else{
            return unitPrice * orderedUnits;
        }
    }

    static getItemImportCount(itemType:any,store:any,orderedUnits:number){
        let importCount = 0;
        let stock = (store =="UK") ? ((itemType=="Mask") ? this.stores.UK.Mask.stock : this.stores.UK.Gloves.stock) : ((itemType=="Mask") ? this.stores.GERMAN.Mask.stock : this.stores.GERMAN.Gloves.stock);
        if(orderedUnits > stock){
            importCount = orderedUnits - stock;
        }
        return importCount;
    }

    static getItemTypeByStr(itemStr:string){
        if(InventoryConstants.Item.Mask.toString()==itemStr){
            return InventoryConstants.Item.Mask;
        }else{
            return InventoryConstants.Item.Gloves;
        }
    }

}