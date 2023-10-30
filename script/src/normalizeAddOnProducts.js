"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeAddOnProducts = void 0;
const resolveAddOnProductIdentifier_js_1 = require("./common/resolveAddOnProductIdentifier.js");
function normalizeAddOnProducts(families) {
    const addOnProducts = [];
    for (const [index, apiFamily] of families.entries()) {
        const family = {
            name: apiFamily.name,
            group: apiFamily.familyGroupType,
            orderIndex: index
        };
        for (const apiAddOnProduct of apiFamily.addOnProducts) {
            normalizeApiAddOnProduct(apiAddOnProduct, family, undefined, undefined).forEach(it => addOnProducts.push(it));
        }
    }
    return addOnProducts;
}
exports.normalizeAddOnProducts = normalizeAddOnProducts;
function normalizeApiAddOnProduct(apiAddOnProduct, family, parentIdentifier, parentProductId) {
    const addOnProducts = [];
    const { productId, productName, dependencies, childAddOnProducts } = apiAddOnProduct;
    const identifier = (0, resolveAddOnProductIdentifier_js_1.resolveAddOnProductIdentifier)(productId, parentProductId);
    const addOnProduct = {
        identifier,
        parentIdentifier,
        productId,
        name: productName,
        parameters: apiAddOnProduct.parameters.map(it => ({
            id: it.parameterId,
            name: it.name,
            value: '',
            required: it.required
        })),
        excludes: dependencies.excludes.map(it => it.productId),
        requires: dependencies.requires.map(it => it.productId),
        family
    };
    addOnProducts.push(addOnProduct);
    childAddOnProducts.reduce((acc, it) => {
        normalizeApiAddOnProduct(it, family, identifier, addOnProduct.productId).forEach(p => acc.push(p));
        return acc;
    }, []).forEach(it => addOnProducts.push(it));
    return addOnProducts;
}
