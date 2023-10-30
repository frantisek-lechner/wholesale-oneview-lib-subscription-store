"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiSubscriptionOrderComparator = exports.normalizeAssignedProducts = void 0;
const resolveAssignedProductIdentifier_js_1 = require("./common/resolveAssignedProductIdentifier.js");
const resolveAddOnProductIdentifier_js_1 = require("./common/resolveAddOnProductIdentifier.js");
/**
 * Limits: assigned product is skipped if the parent product is not assigned
   @todo: !!!It needs to be redesigned, do not remove the orders with status 'REMOVE_CANCEL', if there is more then one order then show a warning, try to keep the business logic out of the frontend
 *
 * @param apiSubscription
 * @param extraCardResolver
 */
function normalizeAssignedProducts(apiSubscription, extraCardResolver) {
    const simCards = new Map(); //<inventoryId, SimCard>
    apiSubscription.simCards.data.forEach(it => simCards.set(it.inventoryProductId, it));
    apiSubscription.simCards.twin.forEach(it => simCards.set(it.inventoryProductId, it));
    const simpleAssignedProducts = [];
    for (const apiSubscriptionAddOnProduct of apiSubscription.addOnProducts) {
        const productId = apiSubscriptionAddOnProduct.productId;
        const name = apiSubscriptionAddOnProduct.productName;
        const isExtraCardAddOnProduct = extraCardResolver(apiSubscriptionAddOnProduct);
        const sortedOrdersByValidTo = apiSubscriptionAddOnProduct.orders
            .filter(order => order.status !== 'REMOVE_CANCEL')
            .sort(apiSubscriptionOrderComparator);
        if (sortedOrdersByValidTo.length === 0) {
            console.warn(`The ${apiSubscription.simCards.main.msisdn} subscription includes the ${apiSubscriptionAddOnProduct.productName} product without orders!`);
            continue;
        }
        const orders = isExtraCardAddOnProduct
            ? sortedOrdersByValidTo
            : [sortedOrdersByValidTo.pop()]; //get the last order for not-card orders
        for (const order of orders) {
            const inventoryId = order.inventoryProductId;
            const parentInventoryId = order?.parentInventoryProductId;
            const parameters = (order?.parameters ?? []).map(parameter => ({
                id: parameter.parameterId,
                value: parameter.parameterValue
            }));
            const simpleAssignedProduct = {
                inventoryId,
                parentInventoryId,
                productId,
                name,
                parameters,
                card: undefined
            };
            simpleAssignedProducts.push(simpleAssignedProduct);
        }
    }
    const topLevelProducts = simpleAssignedProducts.filter(it => it.parentInventoryId === undefined);
    const assignedProducts = [];
    for (const simpleAssignedProduct of topLevelProducts) {
        const options = {
            parentProductId: undefined,
            parentIdentifier: undefined,
            simpleAssignedProducts,
            simCards
        };
        normalizeAssignedProduct(simpleAssignedProduct, options).forEach(it => assignedProducts.push(it));
    }
    return assignedProducts;
}
exports.normalizeAssignedProducts = normalizeAssignedProducts;
function normalizeAssignedProduct(simpleAssignedProduct, options) {
    const assignedProducts = [];
    const { productId, inventoryId, parentInventoryId, name, parameters } = simpleAssignedProduct;
    const { parentProductId, parentIdentifier } = options;
    const addOnProductIdentifier = (0, resolveAddOnProductIdentifier_js_1.resolveAddOnProductIdentifier)(productId, parentProductId);
    const identifier = (0, resolveAssignedProductIdentifier_js_1.resolveAssignedProductIdentifier)(addOnProductIdentifier, inventoryId, parentInventoryId);
    const simCard = options.simCards.get(inventoryId ?? '');
    const assignedProduct = {
        identifier,
        parentIdentifier,
        addOnProductIdentifier,
        inventoryId,
        parentInventoryId,
        name,
        msisdn: simCard?.msisdn,
        card: simCard,
        parameters
    };
    assignedProducts.push(assignedProduct);
    //children
    const children = options.simpleAssignedProducts.filter(it => it.parentInventoryId === inventoryId);
    for (const child of children) {
        normalizeAssignedProduct(child, {
            ...options,
            parentIdentifier: identifier,
            parentProductId: simpleAssignedProduct.productId
        }).forEach(it => assignedProducts.push(it));
    }
    return assignedProducts;
}
function apiSubscriptionOrderComparator(a, b) {
    const validToA = a.validTo !== undefined ? Number.parseInt(a.validTo.replace(/\D/g, '')) : Number.MAX_SAFE_INTEGER;
    const validToB = b.validTo !== undefined ? Number.parseInt(b.validTo.replace(/\D/g, '')) : Number.MAX_SAFE_INTEGER;
    const validToIsSame = validToA === validToB;
    if (!validToIsSame) {
        return validToA - validToB;
    }
    const validFromA = Number.parseInt(a.validFrom.replace(/\D/g, ''));
    const validFromB = Number.parseInt(b.validFrom.replace(/\D/g, ''));
    return validFromA - validFromB;
}
exports.apiSubscriptionOrderComparator = apiSubscriptionOrderComparator;
