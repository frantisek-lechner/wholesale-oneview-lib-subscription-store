import { AddOnProduct } from "../typings/AddOnProduct.js";
import { ApiSubscriptionAddOnProduct } from "../typings/api.js";
export declare function createExtraCardResolver(addOnProducts: AddOnProduct[]): (addOnProduct: ApiSubscriptionAddOnProduct) => boolean;
