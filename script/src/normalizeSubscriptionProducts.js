"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSubscriptionProducts = void 0;
function normalizeSubscriptionProducts(families) {
    const subscriptionProducts = [];
    for (const family of families) {
        for (const apiSubscriptionProduct of family.subscriptionProducts) {
            const subscriptionProduct = normalizeApiSubscriptionProduct(apiSubscriptionProduct, family.name);
            subscriptionProducts.push(subscriptionProduct);
        }
    }
    return subscriptionProducts;
}
exports.normalizeSubscriptionProducts = normalizeSubscriptionProducts;
function normalizeApiSubscriptionProduct(apiSubscriptionProduct, familyName) {
    const { subscriptionProductId, name, dependencies, subscriptionType } = apiSubscriptionProduct;
    const automaticallySelected = dependencies.automaticallyAdded.map(it => it.productId);
    const optionallySelected = dependencies.options.map(option => ({
        numberToSelect: option.numberOfProductsToSelect,
        products: option.products.map(product => product.productId)
    }));
    return {
        id: subscriptionProductId,
        name,
        type: subscriptionType,
        isFwa: subscriptionType === 'FMBB',
        familyName,
        automaticallySelected,
        optionallySelected
    };
}
