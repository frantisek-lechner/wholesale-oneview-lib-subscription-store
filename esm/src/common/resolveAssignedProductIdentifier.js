export function resolveAssignedProductIdentifier(addOnProductIdentifier, inventoryId, parentInventoryId) {
    return `${addOnProductIdentifier}#${inventoryId ?? ''}#${parentInventoryId ?? ''}`;
}
