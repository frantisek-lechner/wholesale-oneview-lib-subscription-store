"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAssignedProductIdentifier = void 0;
function resolveAssignedProductIdentifier(addOnProductIdentifier, inventoryId, parentInventoryId) {
    return `${addOnProductIdentifier}#${inventoryId ?? ''}#${parentInventoryId ?? ''}`;
}
exports.resolveAssignedProductIdentifier = resolveAssignedProductIdentifier;
