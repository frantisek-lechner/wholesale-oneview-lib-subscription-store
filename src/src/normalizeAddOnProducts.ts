import {AddOnProduct, AddOnProductFamily} from "../typings/AddOnProduct.js";
import {ApiAddOnProduct, ApiSubscriptionProductAddOnProductsFamily} from "../typings/api.js";
import {resolveAddOnProductIdentifier} from './common/resolveAddOnProductIdentifier.js'


export function normalizeAddOnProducts(families: ApiSubscriptionProductAddOnProductsFamily[]): AddOnProduct[] {
    const addOnProducts: AddOnProduct[] = []


    for (const [index, apiFamily] of families.entries()) {
        const family: AddOnProductFamily = {
            name: apiFamily.name,
            group: apiFamily.familyGroupType,
            orderIndex: index
        }

        for (const apiAddOnProduct of apiFamily.addOnProducts) {
            normalizeApiAddOnProduct(apiAddOnProduct, family, undefined, undefined).forEach(it => addOnProducts.push(it))
        }
    }

    return addOnProducts
}

function normalizeApiAddOnProduct(apiAddOnProduct: ApiAddOnProduct, family: AddOnProductFamily, parentIdentifier: string | undefined, parentProductId: number | undefined): AddOnProduct[] {
    const addOnProducts: AddOnProduct[] = []
    const {productId, productName, dependencies, childAddOnProducts} = apiAddOnProduct

    const identifier = resolveAddOnProductIdentifier(productId, parentProductId)

    const addOnProduct: AddOnProduct = {
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
    }

    addOnProducts.push(addOnProduct)
    childAddOnProducts.reduce((acc: AddOnProduct[], it) => {
        normalizeApiAddOnProduct(it, family, identifier, addOnProduct.productId).forEach(p => acc.push(p))
        return acc
    }, []).forEach(it => addOnProducts.push(it))

    return addOnProducts
}