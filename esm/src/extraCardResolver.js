import { DATA_CARD_ADD_ON_PRODUCT_NAME, TWIN_CARD_ADD_ON_PRODUCT_NAME } from "./consts.js";
import { resolveExtraCardAddOnProductIdByProductName } from "./resolveExtraCardAddOnProductIdByProductName.js";
export function createExtraCardResolver(addOnProducts) {
    const dataCardAddOnProductId = resolveExtraCardAddOnProductIdByProductName(addOnProducts, DATA_CARD_ADD_ON_PRODUCT_NAME);
    const twinCardAddOnProductId = resolveExtraCardAddOnProductIdByProductName(addOnProducts, TWIN_CARD_ADD_ON_PRODUCT_NAME);
    const extraCardIds = [dataCardAddOnProductId, twinCardAddOnProductId].filter(it => it !== undefined);
    return (subscriptionAddOnProduct) => {
        return extraCardIds.includes(subscriptionAddOnProduct.productId);
    };
}
