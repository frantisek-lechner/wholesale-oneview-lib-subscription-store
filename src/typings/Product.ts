import {AssignedProduct} from "./AssignedProduct.js";
import {Parameter} from "./Parameter.js";
import {AddOnProductFamily} from "./AddOnProduct.js";
import {DATA_CARD_ADD_ON_PRODUCT_NAME, TWIN_CARD_ADD_ON_PRODUCT_NAME} from "../src/consts.js";

export type ExtraCardType = undefined | typeof DATA_CARD_ADD_ON_PRODUCT_NAME | typeof TWIN_CARD_ADD_ON_PRODUCT_NAME

export interface Product extends Omit<AssignedProduct, "parameters"> {
    parameters: Parameter[]
    selected: boolean
    disabled: boolean
    family: AddOnProductFamily
    productId: number
    extraCardType: ExtraCardType
}