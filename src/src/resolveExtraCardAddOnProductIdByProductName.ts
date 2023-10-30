import {AddOnProduct} from "../typings/AddOnProduct.js";
import {DATA_CARD_ADD_ON_PRODUCT_NAME, SIM_CARDS_ADD_ON_FAMILY_GROUP, TWIN_CARD_ADD_ON_PRODUCT_NAME} from "./consts.js";

export function resolveExtraCardAddOnProductIdByProductName(addOnProducts: AddOnProduct[], productName: typeof TWIN_CARD_ADD_ON_PRODUCT_NAME | typeof DATA_CARD_ADD_ON_PRODUCT_NAME): number | undefined {
    const extraCardsAddOnProducts = addOnProducts.filter(addOnProduct => addOnProduct.family.group === SIM_CARDS_ADD_ON_FAMILY_GROUP)
    const mainExtraCardsAddOnProducts = extraCardsAddOnProducts.filter(addOnProduct => addOnProduct.parentIdentifier === undefined)
    const extraCard = mainExtraCardsAddOnProducts.find(addOnProduct => addOnProduct.name.toLowerCase() === productName.toLowerCase())
    return extraCard === undefined
        ? undefined
        : extraCard.productId
}