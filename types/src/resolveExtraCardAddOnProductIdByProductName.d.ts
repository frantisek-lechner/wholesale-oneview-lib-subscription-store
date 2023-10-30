import { AddOnProduct } from "../typings/AddOnProduct.js";
import { DATA_CARD_ADD_ON_PRODUCT_NAME, TWIN_CARD_ADD_ON_PRODUCT_NAME } from "./consts.js";
export declare function resolveExtraCardAddOnProductIdByProductName(addOnProducts: AddOnProduct[], productName: typeof TWIN_CARD_ADD_ON_PRODUCT_NAME | typeof DATA_CARD_ADD_ON_PRODUCT_NAME): number | undefined;
