import { isNewCard } from "./SubscriptionStore.js";
export function toChangeSubscriptionPayload(msisdn, subscriptionStore, dataCardAddOnProductId, twinCardAddOnProductId) {
    const diff = subscriptionStore.diff();
    const products = subscriptionStore.products();
    const productsToAdd = diff.productsToAdd.map(diffProduct => products.find(p => p.identifier === diffProduct.identifier));
    const toInt = (value) => value ? Number.parseInt(value) : undefined;
    const newSubscriptionProduct = diff.subscriptionProductToChange !== undefined
        ? { newSubscriptionProductId: diff.subscriptionProductToChange.id }
        : {};
    const simCardProducts = productsToAdd
        .filter(p => isNewCard(p?.card) && p.msisdn !== undefined && p.inventoryId === undefined)
        .map(p => ({
        productId: p.productId,
        msisdn: p.msisdn,
        simCard: resolveNewCard(p.card)
    }));
    const addOnProducts = productsToAdd
        .filter(p => p.msisdn === undefined)
        .map(p => ({
        productId: p.productId,
        parentInventoryProductId: toInt(p.parentInventoryId),
        parameters: diff.productsToAdd.find(dp => dp.identifier === p.identifier).parametersToChange.map(parameter => ({
            parameterId: parameter.id,
            value: parameter.value
        }))
    }));
    const extraSimCardAddOnProductIds = [dataCardAddOnProductId, twinCardAddOnProductId].filter(it => it !== undefined);
    const addOnProductsToRemove = diff.productsToRemove
        .filter(p => extraSimCardAddOnProductIds.includes(p.productId) === false)
        .map(p => ({ inventoryProductId: p.inventoryId }));
    const simCardProductsToRemove = diff.productsToRemove
        .filter(p => extraSimCardAddOnProductIds.includes(p.productId))
        .map(p => ({ inventoryProductId: p.inventoryId }));
    const addOnProductsToChange = diff.productsToChange.map(p => ({
        inventoryProductId: p.inventoryId,
        parameters: p.parametersToChange.map(parameter => ({
            parameterId: parameter.id,
            value: parameter.value
        }))
    }));
    const payload = {
        orderType: 'CHANGE_SUBSCRIPTION',
        msisdn,
        simCardProducts,
        addOnProducts,
        addOnProductsToRemove,
        simCardProductsToRemove,
        addOnProductsToChange,
        ...newSubscriptionProduct,
    };
    return payload;
}
function resolveNewCard(newCard) {
    if (newCard.actionType === 'REGISTER_EXISTING_SIMCARD') {
        return {
            actionType: 'REGISTER_EXISTING_SIMCARD',
            iccid: newCard.iccid
        };
    }
    else if (newCard.actionType === 'ORDER_NEW_SIMCARD') {
        return {
            actionType: 'ORDER_NEW_SIMCARD',
            simCardTypeId: newCard.simCardTypeId === null ? 0 : newCard.simCardTypeId,
            handlingInstructionId: newCard.handlingInstructionId === null ? 0 : newCard.handlingInstructionId,
            deliveryAddress: newCard.deliveryAddress
        };
    }
    else if (newCard.actionType === 'REGISTER_EXISTING_ESIM_PROFILE') {
        return {
            actionType: 'REGISTER_EXISTING_ESIM_PROFILE',
            iccid: newCard.iccid,
            eid: newCard.eid
        };
    }
    else {
        return {
            actionType: 'ORDER_NEW_ESIM_PROFILE',
            eid: newCard.eid
        };
    }
}
