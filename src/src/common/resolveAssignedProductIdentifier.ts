export function resolveAssignedProductIdentifier(addOnProductIdentifier: string, inventoryId: string | undefined, parentInventoryId: string | undefined): string {
    return `${addOnProductIdentifier}#${inventoryId ?? ''}#${parentInventoryId ?? ''}`
}