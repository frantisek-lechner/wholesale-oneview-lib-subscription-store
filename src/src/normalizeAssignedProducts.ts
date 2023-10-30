import {ApiSubscription, ApiSubscriptionAddOnProduct} from "../typings/api.js";
import {AssignedProduct} from "../typings/AssignedProduct.js";
import {resolveAssignedProductIdentifier} from "./common/resolveAssignedProductIdentifier.js";
import {resolveAddOnProductIdentifier} from "./common/resolveAddOnProductIdentifier.js";
import {SimCard} from "../typings/SimCard.js";
import {ApiSubscriptionOrder} from '../typings/api.js'

type InventoryID = string
type NotEmptyArray<T> = [T, ...T[]]

interface SimpleAssignedProduct extends Omit<AssignedProduct, "parameters" | "addOnProductIdentifier" | "identifier" | "parentIdentifier" | "newCard" | "msisdn"> {
    parameters: Array<{ id: number, value: string }>
    productId: number
}

interface NormalizeOptions {
    simpleAssignedProducts: SimpleAssignedProduct[]
    simCards: Map<InventoryID, SimCard>
    parentIdentifier: string | undefined
    parentProductId: number | undefined
}

/**
 * Limits: assigned product is skipped if the parent product is not assigned
   @todo: !!!It needs to be redesigned, do not remove the orders with status 'REMOVE_CANCEL', if there is more then one order then show a warning, try to keep the business logic out of the frontend
 *
 * @param apiSubscription
 * @param extraCardResolver
 */
export function normalizeAssignedProducts(apiSubscription: ApiSubscription, extraCardResolver: (addOnProduct: ApiSubscriptionAddOnProduct) => boolean): AssignedProduct[] {
    const simCards: Map<InventoryID, SimCard> = new Map() //<inventoryId, SimCard>
    apiSubscription.simCards.data.forEach(it => simCards.set(it.inventoryProductId, it))
    apiSubscription.simCards.twin.forEach(it => simCards.set(it.inventoryProductId, it))


    const simpleAssignedProducts: SimpleAssignedProduct[] = []

    for (const apiSubscriptionAddOnProduct of apiSubscription.addOnProducts) {
        const productId = apiSubscriptionAddOnProduct.productId
        const name = apiSubscriptionAddOnProduct.productName

        const isExtraCardAddOnProduct = extraCardResolver(apiSubscriptionAddOnProduct)

        const sortedOrdersByValidTo = apiSubscriptionAddOnProduct.orders
            .filter(order => order.status !== 'REMOVE_CANCEL')
            .sort(apiSubscriptionOrderComparator)

        if (sortedOrdersByValidTo.length === 0) {
            console.warn(`The ${apiSubscription.simCards.main.msisdn} subscription includes the ${apiSubscriptionAddOnProduct.productName} product without orders!`)
            continue
        }

        const orders = isExtraCardAddOnProduct
            ? sortedOrdersByValidTo
            : [sortedOrdersByValidTo.pop()] //get the last order for not-card orders

        for (const order of orders as NotEmptyArray<ApiSubscriptionOrder>) {
            const inventoryId = order.inventoryProductId
            const parentInventoryId = order?.parentInventoryProductId
            const parameters = (order?.parameters ?? []).map(parameter => ({
                id: parameter.parameterId,
                value: parameter.parameterValue
            }))

            const simpleAssignedProduct: SimpleAssignedProduct = {
                inventoryId,
                parentInventoryId,
                productId,
                name,
                parameters,
                card: undefined
            }
            simpleAssignedProducts.push(simpleAssignedProduct)
        }
    }

    const topLevelProducts: SimpleAssignedProduct[] = simpleAssignedProducts.filter(it => it.parentInventoryId === undefined)

    const assignedProducts: AssignedProduct[] = []
    for (const simpleAssignedProduct of topLevelProducts) {
        const options: NormalizeOptions = {
            parentProductId: undefined,
            parentIdentifier: undefined,
            simpleAssignedProducts,
            simCards
        }
        normalizeAssignedProduct(simpleAssignedProduct, options).forEach(it => assignedProducts.push(it))
    }

    return assignedProducts
}

function normalizeAssignedProduct(simpleAssignedProduct: SimpleAssignedProduct, options: NormalizeOptions): AssignedProduct[] {
    const assignedProducts: AssignedProduct[] = []
    const {productId, inventoryId, parentInventoryId, name, parameters} = simpleAssignedProduct
    const {parentProductId, parentIdentifier} = options
    const addOnProductIdentifier = resolveAddOnProductIdentifier(productId, parentProductId)
    const identifier = resolveAssignedProductIdentifier(addOnProductIdentifier, inventoryId, parentInventoryId)

    const simCard = options.simCards.get(inventoryId ?? '')

    const assignedProduct: AssignedProduct = {
        identifier,
        parentIdentifier,
        addOnProductIdentifier,
        inventoryId,
        parentInventoryId,
        name,
        msisdn: simCard?.msisdn,
        card: simCard,
        parameters
    }
    assignedProducts.push(assignedProduct)

    //children
    const children = options.simpleAssignedProducts.filter(it => it.parentInventoryId === inventoryId)
    for (const child of children) {
        normalizeAssignedProduct(child, {
            ...options,
            parentIdentifier: identifier,
            parentProductId: simpleAssignedProduct.productId
        }).forEach(it => assignedProducts.push(it))
    }

    return assignedProducts
}

export function apiSubscriptionOrderComparator(a: ApiSubscriptionOrder, b: ApiSubscriptionOrder): number {
    const validToA = a.validTo !== undefined ? Number.parseInt(a.validTo.replace(/\D/g, '')) : Number.MAX_SAFE_INTEGER
    const validToB = b.validTo !== undefined ? Number.parseInt(b.validTo.replace(/\D/g, '')) : Number.MAX_SAFE_INTEGER

    const validToIsSame = validToA === validToB

    if (!validToIsSame) {
        return validToA - validToB
    }

    const validFromA = Number.parseInt(a.validFrom.replace(/\D/g, ''))
    const validFromB = Number.parseInt(b.validFrom.replace(/\D/g, ''))

    return validFromA - validFromB
}
