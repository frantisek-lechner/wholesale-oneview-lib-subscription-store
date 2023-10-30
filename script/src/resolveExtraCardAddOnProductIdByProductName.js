"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveExtraCardAddOnProductIdByProductName = void 0;
const consts_js_1 = require("./consts.js");
function resolveExtraCardAddOnProductIdByProductName(addOnProducts, productName) {
    const extraCardsAddOnProducts = addOnProducts.filter(addOnProduct => addOnProduct.family.group === consts_js_1.SIM_CARDS_ADD_ON_FAMILY_GROUP);
    const mainExtraCardsAddOnProducts = extraCardsAddOnProducts.filter(addOnProduct => addOnProduct.parentIdentifier === undefined);
    const extraCard = mainExtraCardsAddOnProducts.find(addOnProduct => addOnProduct.name.toLowerCase() === productName.toLowerCase());
    return extraCard === undefined
        ? undefined
        : extraCard.productId;
}
exports.resolveExtraCardAddOnProductIdByProductName = resolveExtraCardAddOnProductIdByProductName;
