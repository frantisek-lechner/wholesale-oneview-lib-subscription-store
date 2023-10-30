export function resolveAddOnProductIdentifier(productId: number, parentProductId: number | undefined): string {
    return `${productId}#${parentProductId ?? ''}`
}