"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExtraCardResolver = void 0;
const consts_js_1 = require("./consts.js");
const resolveExtraCardAddOnProductIdByProductName_js_1 = require("./resolveExtraCardAddOnProductIdByProductName.js");
function createExtraCardResolver(addOnProducts) {
    const dataCardAddOnProductId = (0, resolveExtraCardAddOnProductIdByProductName_js_1.resolveExtraCardAddOnProductIdByProductName)(addOnProducts, consts_js_1.DATA_CARD_ADD_ON_PRODUCT_NAME);
    const twinCardAddOnProductId = (0, resolveExtraCardAddOnProductIdByProductName_js_1.resolveExtraCardAddOnProductIdByProductName)(addOnProducts, consts_js_1.TWIN_CARD_ADD_ON_PRODUCT_NAME);
    const extraCardIds = [dataCardAddOnProductId, twinCardAddOnProductId].filter(it => it !== undefined);
    return (subscriptionAddOnProduct) => {
        return extraCardIds.includes(subscriptionAddOnProduct.productId);
    };
}
exports.createExtraCardResolver = createExtraCardResolver;
