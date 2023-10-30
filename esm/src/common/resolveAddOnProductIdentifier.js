export function resolveAddOnProductIdentifier(productId, parentProductId) {
    return `${productId}#${parentProductId ?? ''}`;
}
