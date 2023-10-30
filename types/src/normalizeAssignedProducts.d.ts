import { ApiSubscription, ApiSubscriptionAddOnProduct } from "../typings/api.js";
import { AssignedProduct } from "../typings/AssignedProduct.js";
import { ApiSubscriptionOrder } from '../typings/api.js';
/**
 * Limits: assigned product is skipped if the parent product is not assigned
   @todo: !!!It needs to be redesigned, do not remove the orders with status 'REMOVE_CANCEL', if there is more then one order then show a warning, try to keep the business logic out of the frontend
 *
 * @param apiSubscription
 * @param extraCardResolver
 */
export declare function normalizeAssignedProducts(apiSubscription: ApiSubscription, extraCardResolver: (addOnProduct: ApiSubscriptionAddOnProduct) => boolean): AssignedProduct[];
export declare function apiSubscriptionOrderComparator(a: ApiSubscriptionOrder, b: ApiSubscriptionOrder): number;
