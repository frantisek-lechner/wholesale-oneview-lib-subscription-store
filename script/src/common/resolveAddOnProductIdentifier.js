"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAddOnProductIdentifier = void 0;
function resolveAddOnProductIdentifier(productId, parentProductId) {
    return `${productId}#${parentProductId ?? ''}`;
}
exports.resolveAddOnProductIdentifier = resolveAddOnProductIdentifier;
