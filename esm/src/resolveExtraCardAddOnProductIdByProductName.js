import { SIM_CARDS_ADD_ON_FAMILY_GROUP } from "./consts.js";
export function resolveExtraCardAddOnProductIdByProductName(addOnProducts, productName) {
    const extraCardsAddOnProducts = addOnProducts.filter(addOnProduct => addOnProduct.family.group === SIM_CARDS_ADD_ON_FAMILY_GROUP);
    const mainExtraCardsAddOnProducts = extraCardsAddOnProducts.filter(addOnProduct => addOnProduct.parentIdentifier === undefined);
    const extraCard = mainExtraCardsAddOnProducts.find(addOnProduct => addOnProduct.name.toLowerCase() === productName.toLowerCase());
    return extraCard === undefined
        ? undefined
        : extraCard.productId;
}
