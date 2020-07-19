

export namespace InventoryConstants{
    export const enum Item {
        Mask,
        Gloves
    }
    export const UK_MASK_COST = 65;
    export const UK_MASK_STOCK = 100;
    export const UK_GLOVE_COST = 100;
    export const UK_GLOVE_STOCK = 100;
    export const UK_PASSPORT_REGEX = new RegExp('B[0-9]{3}[A-Z]{2}[A-Z0-9]{7}');

    export const GERMAN_MASK_COST = 100;
    export const GERMAN_MASK_STOCK = 100;
    export const GERMAN_GLOVE_COST = 150;
    export const GERMAN_GLOVE_STOCK = 50;
    export const GERMAN_PASSPORT_REGEX = new RegExp('B[0-9]{3}[A-Z]{2}[A-Z0-9]{7}');
}



