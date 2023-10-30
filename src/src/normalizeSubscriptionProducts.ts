import {ApiSubscriptionProduct, ApiSubscriptionProductFamily} from "../typings/api.js";
import {OptionalSelection, SubscriptionProduct} from "../typings/SubscriptionProduct.js";

export function normalizeSubscriptionProducts(families: ApiSubscriptionProductFamily[]): SubscriptionProduct[] {
    const subscriptionProducts: SubscriptionProduct[] = []

    for (const family of families) {
        for (const apiSubscriptionProduct of family.subscriptionProducts) {
            const subscriptionProduct = normalizeApiSubscriptionProduct(apiSubscriptionProduct, family.name)
            subscriptionProducts.push(subscriptionProduct)
        }
    }
    return subscriptionProducts
}

function normalizeApiSubscriptionProduct(apiSubscriptionProduct: ApiSubscriptionProduct, familyName: string): SubscriptionProduct {
    const {subscriptionProductId, name, dependencies, subscriptionType} = apiSubscriptionProduct
    const automaticallySelected = dependencies.automaticallyAdded.map(it => it.productId)
    const optionallySelected: OptionalSelection[] = dependencies.options.map(option => ({
        numberToSelect: option.numberOfProductsToSelect,
        products: option.products.map(product => product.productId)
    }))

    return {
        id: subscriptionProductId,
        name,
        type: subscriptionType,
        isFwa: subscriptionType === 'FMBB',
        familyName,
        automaticallySelected,
        optionallySelected
    }
}