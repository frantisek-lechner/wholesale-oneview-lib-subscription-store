"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSimCard = exports.isNewCard = exports.SubscriptionStore = void 0;
const resolveAssignedProductIdentifier_js_1 = require("./common/resolveAssignedProductIdentifier.js");
const consts_js_1 = require("./consts.js");
const resolveAddOnProductIdentifier_js_1 = require("./common/resolveAddOnProductIdentifier.js");
const resolveExtraCardAddOnProductIdByProductName_js_1 = require("./resolveExtraCardAddOnProductIdByProductName.js");
class SubscriptionStore {
    constructor(mainCard, subscriptionProduct, addOnProducts, assignedProducts, originalSubscriptionProduct, originalAddOnProducts, originalAssignedProducts) {
        Object.defineProperty(this, "dataCardAddOnProductId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dataCardAddOnProductIdentifier", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "twinCardAddOnProductId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "twinCardAddOnProductIdentifier", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_originalSubscriptionProduct", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_originalAddOnProducts", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_originalAssignedProducts", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_subscriptionProduct", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_addOnProducts", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_assignedProducts", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_mainCard", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_excludedProductIds", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // should be addOnProductId or productIdentifier or assignedProductIdentifier?
        Object.defineProperty(this, "_requiredProductIds", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // should be addOnProductId or productIdentifier or assignedProductIdentifier?
        Object.defineProperty(this, "_products", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_productCombinations", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_assignedProductsWithoutAddOnProduct", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.dataCardAddOnProductId = (0, resolveExtraCardAddOnProductIdByProductName_js_1.resolveExtraCardAddOnProductIdByProductName)(Array.from(addOnProducts.values()), consts_js_1.DATA_CARD_ADD_ON_PRODUCT_NAME);
        this.dataCardAddOnProductIdentifier = this.dataCardAddOnProductId === undefined
            ? undefined
            : (0, resolveAddOnProductIdentifier_js_1.resolveAddOnProductIdentifier)(this.dataCardAddOnProductId, undefined);
        this.twinCardAddOnProductId = (0, resolveExtraCardAddOnProductIdByProductName_js_1.resolveExtraCardAddOnProductIdByProductName)(Array.from(addOnProducts.values()), consts_js_1.TWIN_CARD_ADD_ON_PRODUCT_NAME);
        this.twinCardAddOnProductIdentifier = this.twinCardAddOnProductId === undefined
            ? undefined
            : (0, resolveAddOnProductIdentifier_js_1.resolveAddOnProductIdentifier)(this.twinCardAddOnProductId, undefined);
        this._mainCard = mainCard;
        this._originalSubscriptionProduct = originalSubscriptionProduct;
        this._originalAddOnProducts = originalAddOnProducts;
        this._originalAssignedProducts = originalAssignedProducts;
        this._subscriptionProduct = subscriptionProduct;
        this._addOnProducts = addOnProducts;
        this._assignedProducts = this.assignAutomaticallyAddedProducts(assignedProducts, subscriptionProduct.automaticallySelected);
        this._assignedProductsWithoutAddOnProduct = new Set(this.findAssignedProductsWithoutAddOnProduct().map(it => it.identifier));
        this._excludedProductIds = this.resolveExcludedProducts();
        this._requiredProductIds = this.resolveRequiredProducts();
        this._products = this.resolveProducts();
        this._productCombinations = this.resolveProductCombinations();
    }
    static createNew(msisdn, subscriptionProduct, addOnProducts) {
        const addOnProductsMap = new Map();
        for (const addOnProduct of addOnProducts) {
            addOnProductsMap.set(addOnProduct.identifier, addOnProduct);
        }
        const assignedProductsMap = new Map();
        const mainCard = {
            msisdn,
            deliveryAddress: { ...SubscriptionStore.emptyAddress(), identifier: consts_js_1.MAIN_SIM_ADDRESS_IDENTIFIER },
            actionType: 'REGISTER_EXISTING_SIMCARD',
            iccid: '',
            eid: '',
            handlingInstructionId: null,
            simCardTypeId: null
        };
        return new SubscriptionStore(mainCard, subscriptionProduct, addOnProductsMap, assignedProductsMap, undefined, undefined, undefined);
    }
    static createFrom(mainCard, subscriptionProduct, addOnProducts, assignedProducts) {
        const addOnProductsMap = new Map();
        for (const addOnProduct of addOnProducts) {
            addOnProductsMap.set(addOnProduct.identifier, addOnProduct);
        }
        const assignedProductsMap = new Map();
        for (const assignedProduct of assignedProducts) {
            assignedProductsMap.set(assignedProduct.identifier, assignedProduct);
        }
        return new SubscriptionStore(mainCard, subscriptionProduct, addOnProductsMap, assignedProductsMap, subscriptionProduct, addOnProductsMap, assignedProductsMap);
    }
    static emptyAddress() {
        const emptyAddress = {
            identifier: '',
            firstName: '',
            lastName: '',
            postalCode: '',
            postalPlace: '',
            streetAddress: '',
            careOf: '',
            postalBox: ''
        };
        return { ...emptyAddress };
    }
    clone(assignedProducts) {
        return new SubscriptionStore(this._mainCard, this._subscriptionProduct, this._addOnProducts, assignedProducts, this._originalSubscriptionProduct, this._originalAddOnProducts, this._originalAssignedProducts);
    }
    cloneWithMainNewCard(mainNewCard) {
        return new SubscriptionStore(mainNewCard, this._subscriptionProduct, this._addOnProducts, this._assignedProducts, this._originalSubscriptionProduct, this._originalAddOnProducts, this._originalAssignedProducts);
    }
    reset() {
        return this._originalSubscriptionProduct && isSimCard(this._mainCard)
            ? SubscriptionStore.createFrom(this._mainCard, this._originalSubscriptionProduct, Array.from(this._originalAddOnProducts.values()), Array.from(this._originalAssignedProducts.values()))
            : SubscriptionStore.createNew(this._mainCard.msisdn, this._subscriptionProduct, Array.from(this._addOnProducts.values()));
    }
    subscriptionProduct() {
        return this._subscriptionProduct;
    }
    changeSubscriptionProduct(subscriptionProduct, addOnProducts) {
        if (subscriptionProduct.id === this._subscriptionProduct.id) {
            return this;
        }
        const updatedAssignedProducts = new Map(this._assignedProducts);
        const addOnProductsMap = new Map();
        addOnProducts.forEach(addOnProduct => addOnProductsMap.set(addOnProduct.identifier, addOnProduct));
        //unassign automatically selected
        this._subscriptionProduct.automaticallySelected.forEach(productId => {
            const requiredProductIds = this.getAllRequiredProductIds(productId);
            const allRequiredProductIds = [productId, ...requiredProductIds];
            const isRequiredByOthers = Array.from(updatedAssignedProducts.values()).some(assignedProduct => {
                const addOnProduct = this._addOnProducts.get(assignedProduct.addOnProductIdentifier);
                if (addOnProduct === undefined || allRequiredProductIds.includes(addOnProduct.productId)) {
                    return false;
                }
                return addOnProduct.requires.some(it => allRequiredProductIds.includes(it));
            });
            if (!isRequiredByOthers) {
                Array.from(updatedAssignedProducts.values()).forEach(assignedProduct => {
                    const addOnProduct = this._addOnProducts.get(assignedProduct.identifier);
                    if (addOnProduct && allRequiredProductIds.includes(addOnProduct.productId)) {
                        updatedAssignedProducts.delete(assignedProduct.identifier);
                    }
                });
            }
        });
        //unassign unsupported
        Array.from(updatedAssignedProducts.values())
            .filter(assignedProduct => addOnProductsMap.has(assignedProduct.addOnProductIdentifier) === false)
            .forEach(assignedProduct => updatedAssignedProducts.delete(assignedProduct.identifier));
        //assign new automatically selected is done in the constructor
        return new SubscriptionStore(this._mainCard, subscriptionProduct, addOnProductsMap, updatedAssignedProducts, this._originalSubscriptionProduct, this._originalAddOnProducts, this._originalAssignedProducts);
    }
    products() {
        return this._products;
    }
    productCombinations() {
        return this._productCombinations;
    }
    assignProduct(productIdentifier) {
        const product = this.products().find(it => it.identifier === productIdentifier);
        const addOnProduct = this._addOnProducts.get(product?.addOnProductIdentifier ?? '');
        if (!product || !addOnProduct) {
            return this;
        }
        const updatedAssignedProducts = new Map(this._assignedProducts);
        const { parentIdentifier, addOnProductIdentifier, inventoryId, parentInventoryId, name, parameters, msisdn, card } = product;
        const assignedProduct = {
            identifier: productIdentifier,
            parentIdentifier,
            addOnProductIdentifier,
            inventoryId,
            parentInventoryId,
            name,
            parameters,
            msisdn,
            card
        };
        //add all required
        updatedAssignedProducts.set(assignedProduct.identifier, assignedProduct);
        const requiredAddOnProductsToAddIds = this.getAllRequiredProductIds(addOnProduct.productId);
        for (const assignedProduct of this.assignProducts(requiredAddOnProductsToAddIds).values()) {
            updatedAssignedProducts.set(assignedProduct.identifier, assignedProduct);
        }
        //remove all excluded
        const productToExcludeIds = new Set(addOnProduct.excludes);
        requiredAddOnProductsToAddIds.forEach(productId => this.gedExcludedAddOnProducts(productId).forEach(it => productToExcludeIds.add(it)));
        productToExcludeIds.forEach(productId => {
            const addOnProductIdentifier = this.findFirstAddOnProductById(productId)?.identifier;
            const toRemove = Array.from(updatedAssignedProducts.values()).filter(it => it.addOnProductIdentifier === addOnProductIdentifier);
            toRemove.forEach(assignedProduct => updatedAssignedProducts.delete(assignedProduct.identifier));
        });
        return this.clone(updatedAssignedProducts);
    }
    assignNewCard(addOnProductIdentifier, newCard) {
        const addOnProduct = this._addOnProducts.get(addOnProductIdentifier);
        const extraSimCardAddOnProductIdentifiers = this.extraSimCardAddOnProductIdentifiers();
        if (addOnProduct === undefined || !extraSimCardAddOnProductIdentifiers.includes(addOnProductIdentifier)) {
            return this;
        }
        const deliveryAddress = newCard.deliveryAddress.identifier === ''
            ? { ...newCard.deliveryAddress, identifier: this.resolveAddressIdentifier(newCard.deliveryAddress) }
            : newCard.deliveryAddress;
        const updatedNewCard = { ...newCard, deliveryAddress };
        const identifier = `${new Date().getTime()}`;
        const assignedCardProduct = {
            identifier,
            parentIdentifier: undefined,
            addOnProductIdentifier,
            name: addOnProduct.name,
            inventoryId: undefined,
            parentInventoryId: undefined,
            parameters: [...addOnProduct.parameters],
            card: updatedNewCard,
            msisdn: newCard.msisdn
        };
        const updatedAssignedProducts = new Map(this._assignedProducts);
        //updated new card products which are using same address
        for (const assignedProduct of updatedAssignedProducts.values()) {
            if (isNewCard(assignedProduct.card) && assignedProduct.card.deliveryAddress.identifier === deliveryAddress.identifier) {
                const assignedProductWithAddressUpdate = {
                    ...assignedProduct, card: {
                        ...assignedProduct.card, deliveryAddress
                    }
                };
                updatedAssignedProducts.set(assignedProduct.identifier, assignedProductWithAddressUpdate);
            }
        }
        updatedAssignedProducts.set(assignedCardProduct.identifier, assignedCardProduct);
        const mainCardChange = (isNewCard(this._mainCard) && this._mainCard.deliveryAddress.identifier === deliveryAddress.identifier)
            ? { ...this._mainCard, deliveryAddress }
            : undefined;
        return mainCardChange
            ? this.clone(updatedAssignedProducts).setMainCard(mainCardChange)
            : this.clone(updatedAssignedProducts);
    }
    unassignProduct(productIdentifier) {
        if (this._assignedProducts.has(productIdentifier)) {
            const updatedMap = new Map(this._assignedProducts);
            updatedMap.delete(productIdentifier);
            const childrenAssignedProducts = Array.from(updatedMap.values()).filter(assignedProduct => assignedProduct.parentIdentifier === productIdentifier);
            childrenAssignedProducts.forEach(it => updatedMap.delete(it.identifier));
            return this.clone(updatedMap);
        }
        else {
            console.log('Product to unassign not found', productIdentifier);
        }
        return this;
    }
    setProductParameter(productIdentifier, parameterId, value) {
        const assignedProduct = this._assignedProducts.get(productIdentifier);
        if (assignedProduct === undefined) {
            return this;
        }
        const parameterToUpdate = assignedProduct.parameters.find(it => it.id === parameterId);
        if (parameterToUpdate === undefined) {
            return this;
        }
        const updatedParameter = { ...parameterToUpdate, value };
        const updatedParameters = [...assignedProduct.parameters.filter(it => it.id !== parameterId), updatedParameter];
        const updatedAssignedProduct = { ...assignedProduct, parameters: updatedParameters };
        const updatedAssignedProducts = new Map(this._assignedProducts);
        updatedAssignedProducts.set(updatedAssignedProduct.identifier, updatedAssignedProduct);
        return this.clone(updatedAssignedProducts);
    }
    diff() {
        const productsToAdd = [];
        const productsToRemove = [];
        const productsToChange = [];
        const subscriptionProductToChange = this._originalSubscriptionProduct?.id !== this._subscriptionProduct.id
            ? this._subscriptionProduct
            : undefined;
        // to add
        Array.from(this._assignedProducts.values())
            .filter(assignedProduct => assignedProduct.inventoryId === undefined) //only new
            .forEach(assignedProduct => {
            const addOnProduct = this._addOnProducts.get(assignedProduct.addOnProductIdentifier);
            const { identifier, name } = assignedProduct;
            const diffProduct = {
                identifier,
                productId: addOnProduct.productId,
                inventoryId: undefined,
                msisdn: assignedProduct.msisdn,
                name,
                parametersToChange: this.resolveParameters(addOnProduct.parameters, assignedProduct.parameters),
            };
            productsToAdd.push(diffProduct);
        });
        //to remove
        if (this._originalAssignedProducts !== undefined) {
            Array.from(this._originalAssignedProducts.values())
                .filter(originalAssignedProduct => this._assignedProducts.has(originalAssignedProduct.identifier) === false)
                .forEach(originalAssignedProduct => {
                const { identifier, inventoryId, name, } = originalAssignedProduct;
                const originalAddOnProduct = this._originalAddOnProducts.get(originalAssignedProduct.addOnProductIdentifier);
                const diffProduct = {
                    identifier,
                    productId: originalAddOnProduct?.productId ?? -1,
                    inventoryId,
                    name,
                    msisdn: originalAssignedProduct.msisdn,
                    parametersToChange: [], //Parameters are irrelevant in this case
                };
                productsToRemove.push(diffProduct);
            });
        }
        //to change
        if (this._originalAssignedProducts !== undefined) {
            Array.from(this._originalAssignedProducts.values())
                .filter(originalAssignedProduct => !this._assignedProductsWithoutAddOnProduct.has(originalAssignedProduct.identifier))
                .filter(originalAssignedProduct => this._assignedProducts.has(originalAssignedProduct.identifier))
                .forEach(originalAssignedProduct => {
                const assignedProduct = this._assignedProducts.get(originalAssignedProduct.identifier);
                const parametersDiff = this.diffParameters(assignedProduct.parameters, originalAssignedProduct.parameters);
                const mergedParameters = [
                    ...(this._addOnProducts.get(assignedProduct.addOnProductIdentifier)?.parameters ?? []),
                    ...(this._originalAddOnProducts?.get(assignedProduct.addOnProductIdentifier)?.parameters ?? []),
                ];
                const parametersToChange = [
                    ...parametersDiff.toAdd,
                    ...parametersDiff.toRemove.map(it => ({ ...it, value: '' })),
                    ...parametersDiff.toChange
                ].map(it => ({
                    ...it,
                    name: mergedParameters.find(p => p.id === it.id)?.name ?? '',
                    required: mergedParameters.find(p => p.id === it.id)?.required ?? false
                }));
                const { identifier, inventoryId, name } = assignedProduct;
                const addOnProduct = this._addOnProducts.get(assignedProduct.addOnProductIdentifier);
                const diffProduct = {
                    identifier,
                    productId: addOnProduct.productId,
                    inventoryId,
                    name,
                    msisdn: assignedProduct.msisdn,
                    parametersToChange,
                };
                if (parametersToChange.length > 0) {
                    productsToChange.push(diffProduct);
                }
            });
        }
        return {
            hasChanges: productsToAdd.length + productsToRemove.length + productsToChange.length > 0 || subscriptionProductToChange !== undefined,
            productsToAdd,
            productsToRemove,
            productsToChange,
            subscriptionProductToChange
        };
    }
    assignmentErrors() {
        const assignedProducts = Array.from(this._assignedProducts.values());
        const products = this.products();
        const allRequiredProductIds = new Set();
        this._subscriptionProduct.automaticallySelected.forEach(productId => allRequiredProductIds.add(productId));
        //collect all used addOnProducts ids
        const usedAddOnProducts = new Set(assignedProducts
            .map(assignedProduct => this._addOnProducts.get(assignedProduct.addOnProductIdentifier))
            .filter(it => it !== undefined));
        const usedAddOnProductsIds = new Set(Array.from(usedAddOnProducts.values()).map(addOnProduct => addOnProduct.productId));
        for (const addOnProductId of usedAddOnProductsIds.values()) {
            this.getAllRequiredProductIds(addOnProductId).forEach(productId => allRequiredProductIds.add(productId));
        }
        const missingRequiredProducts = [];
        for (const requiredProductId of allRequiredProductIds.values()) {
            if (!usedAddOnProductsIds.has(requiredProductId)) {
                const addOnProduct = this.findFirstAddOnProductById(requiredProductId);
                if (addOnProduct) {
                    const missingProduct = products.find(product => product.addOnProductIdentifier === addOnProduct.identifier);
                    if (missingProduct) {
                        missingRequiredProducts.push(missingProduct);
                    }
                }
            }
        }
        //excluded
        const excludedProductIds = new Set();
        for (const usedAddOnProduct of usedAddOnProducts.values()) {
            usedAddOnProduct.excludes.forEach(productId => excludedProductIds.add(productId));
        }
        const assignedExcludedProducts = [];
        Array.from(usedAddOnProducts.values())
            .filter(usedAddOnProduct => excludedProductIds.has(usedAddOnProduct.productId))
            .forEach(usedAddOnProduct => products.filter(product => product.addOnProductIdentifier === usedAddOnProduct.identifier)
            .forEach(product => assignedExcludedProducts.push(product)));
        //optionally required
        const uncompletedProductCombinations = this._productCombinations.filter(it => it.isCompleted === false);
        //missing required parameters
        const productsWithMissingRequiredParameters = products
            .filter(product => product.selected)
            .filter(product => product.parameters.some(parameter => parameter.required && parameter.value === ''));
        const assignedProductsWithoutAddOnProduct = Array.from(this._assignedProductsWithoutAddOnProduct.values())
            .filter(it => this._assignedProducts.has(it))
            .map(it => this._assignedProducts.get(it))
            .filter(it => it !== undefined);
        return {
            isValid: missingRequiredProducts.length + assignedExcludedProducts.length + uncompletedProductCombinations.length + productsWithMissingRequiredParameters.length === 0,
            missingRequiredProducts,
            assignedExcludedProducts,
            uncompletedProductCombinations,
            productsWithMissingRequiredParameters,
            assignedProductsWithoutAddOnProduct
        };
    }
    cardsMeta() {
        const allowedDataCards = this.dataCardAddOnProductId !== undefined;
        const allowedTwinCards = this.twinCardAddOnProductId !== undefined;
        const twinCardsCount = allowedTwinCards
            ? Array.from(this._assignedProducts.values()).filter(it => it.addOnProductIdentifier === this.twinCardAddOnProductIdentifier).length
            : 0;
        const dataCardsCount = allowedDataCards
            ? Array.from(this._assignedProducts.values()).filter(it => it.addOnProductIdentifier === this.dataCardAddOnProductIdentifier).length
            : 0;
        const cardsCount = twinCardsCount + dataCardsCount;
        const canAddDataCard = allowedDataCards && cardsCount < 9;
        const canAddTwinCard = allowedTwinCards && twinCardsCount < 3 && cardsCount < 9;
        return {
            allowedDataCards,
            allowedTwinCards,
            canAddDataCard,
            canAddTwinCard,
            dataCardAddOnProductIdentifier: this.dataCardAddOnProductIdentifier,
            twinCardAddOnProductIdentifier: this.twinCardAddOnProductIdentifier
        };
    }
    mainCard() {
        return this._mainCard;
    }
    setMainCard(newMainCard) {
        const deliveryAddress = newMainCard.deliveryAddress;
        const newCardProductsWithSameDeliveryAddress = Array.from(this._assignedProducts.values())
            .filter(assignedProduct => isNewCard(assignedProduct.card) && assignedProduct.card.deliveryAddress.identifier === deliveryAddress.identifier);
        const updatedAssignedProducts = new Map(this._assignedProducts);
        newCardProductsWithSameDeliveryAddress.forEach(assignedProduct => {
            const updatedCard = { ...assignedProduct.card, deliveryAddress };
            const update = { ...assignedProduct, card: updatedCard };
            updatedAssignedProducts.set(assignedProduct.identifier, update);
        });
        return newCardProductsWithSameDeliveryAddress.length > 0
            ? this.clone(updatedAssignedProducts).cloneWithMainNewCard(newMainCard)
            : this.cloneWithMainNewCard(newMainCard);
    }
    addresses() {
        const addresses = new Map();
        if (isNewCard(this._mainCard)) {
            addresses.set(consts_js_1.MAIN_SIM_ADDRESS_IDENTIFIER, this._mainCard.deliveryAddress);
        }
        for (const { card } of this.products()) {
            if (isNewCard(card)) {
                addresses.set(card.deliveryAddress.identifier, card.deliveryAddress);
            }
        }
        return Array.from(addresses.values());
    }
    resolveExcludedProducts() {
        const excludedProductIds = new Set();
        //collect all assigned products
        for (const assignedProduct of this._assignedProducts.values()) {
            this._addOnProducts.get(assignedProduct.addOnProductIdentifier)?.excludes.forEach(productId => excludedProductIds.add(productId));
        }
        return excludedProductIds;
    }
    resolveRequiredProducts() {
        const requiredProductIds = new Set();
        //collect all products required by subscription product
        this._subscriptionProduct.automaticallySelected.forEach(productId => requiredProductIds.add(productId));
        //collect all assigned products
        for (const assignedProduct of this._assignedProducts.values()) {
            this._addOnProducts.get(assignedProduct.addOnProductIdentifier)?.requires.forEach(productId => {
                requiredProductIds.add(productId);
                this.getAllRequiredProductIds(productId)
                    .forEach(requiredProductId => requiredProductIds.add(requiredProductId));
            });
        }
        return requiredProductIds;
    }
    getAllRequiredProductIds(addOnProductId, skipProductIds = []) {
        const requiredProductIds = new Set();
        const addOnProduct = this.findFirstAddOnProductById(addOnProductId);
        if (!addOnProduct) {
            return [];
        }
        //it should be optimized to avoid check same dependencies for siblings
        for (const requiredProductId of addOnProduct.requires.filter(it => !skipProductIds.includes(it))) {
            requiredProductIds.add(requiredProductId);
            this.getAllRequiredProductIds(requiredProductId, [...skipProductIds, addOnProductId])
                .forEach(it => requiredProductIds.add(it));
        }
        return Array.from(requiredProductIds);
    }
    gedExcludedAddOnProducts(productId) {
        const excludedProductIds = new Set();
        const allRequiredProductIds = this.getAllRequiredProductIds(productId);
        for (const productId of allRequiredProductIds) {
            const addOnProduct = this.findFirstAddOnProductById(productId);
            if (!addOnProduct) {
                continue;
            }
            addOnProduct.excludes.forEach(it => excludedProductIds.add(it));
        }
        return Array.from(excludedProductIds);
    }
    findFirstAddOnProductById(productId) {
        return Array.from(this._addOnProducts.values()).find(addOnProduct => addOnProduct.productId === productId);
    }
    /**
     * @desc: it modifies the _assignedProducts instance variable!!!, premise: only main products could be added automatically, not children
     * @private
     */
    assignAutomaticallyAddedProducts(assignedProducts, productIdsToAdd) {
        const requiredProductIds = new Set();
        for (const productId of productIdsToAdd) {
            requiredProductIds.add(productId);
            this.getAllRequiredProductIds(productId).forEach(requiredProductId => requiredProductIds.add(requiredProductId));
        }
        const updatedAssignedProducts = new Map(assignedProducts);
        for (const assignedProduct of this.assignProducts(Array.from(requiredProductIds.values())).values()) {
            updatedAssignedProducts.set(assignedProduct.identifier, assignedProduct);
        }
        return updatedAssignedProducts;
    }
    assignProducts(productIds) {
        const assignedProducts = new Map();
        for (const productId of productIds) {
            const addOnProduct = this.findFirstAddOnProductById(productId);
            if (!addOnProduct) {
                console.warn('Product not found:', productId);
                continue;
            }
            //@todo: use function parameter for assignedProducts instead of side effect
            const assignedProduct = Array.from(this._assignedProducts?.values() ?? []).find(assignedProduct => assignedProduct.addOnProductIdentifier === addOnProduct.identifier);
            if (assignedProduct) {
                continue;
            }
            //try to find an originally assigned product
            const originallyAssignedProduct = Array.from(this._originalAssignedProducts?.values() ?? []).find(assignedProduct => assignedProduct.addOnProductIdentifier === addOnProduct.identifier);
            const identifier = originallyAssignedProduct?.identifier ?? (0, resolveAssignedProductIdentifier_js_1.resolveAssignedProductIdentifier)(addOnProduct.identifier, undefined, undefined);
            const assignedProductToAdd = {
                identifier,
                parentIdentifier: originallyAssignedProduct?.parentIdentifier ?? undefined,
                addOnProductIdentifier: addOnProduct.identifier,
                inventoryId: originallyAssignedProduct?.inventoryId ?? undefined,
                parentInventoryId: originallyAssignedProduct?.parentInventoryId ?? undefined,
                name: addOnProduct.name,
                parameters: [...addOnProduct.parameters],
                msisdn: undefined,
                card: undefined
            };
            assignedProducts.set(assignedProductToAdd.identifier, assignedProductToAdd);
        }
        return assignedProducts;
    }
    resolveParameters(addOnProductParameters, assignedParameters) {
        const parameters = new Map();
        //add assigned parameters
        assignedParameters.forEach(assignedParameter => {
            const addOnProductParameter = addOnProductParameters.find(it => it.id === assignedParameter.id);
            if (addOnProductParameter) {
                parameters.set(addOnProductParameter.id, { ...addOnProductParameter, value: assignedParameter.value });
            }
            else {
                parameters.set(assignedParameter.id, {
                    ...assignedParameter,
                    name: `? (${assignedParameter.id})`,
                    required: false
                });
            }
        });
        //add unassigned parameters
        addOnProductParameters.filter(it => !parameters.has(it.id)).forEach(addOnProductParameter => parameters.set(addOnProductParameter.id, addOnProductParameter));
        return Array.from(parameters.values());
    }
    resolveProducts() {
        const products = [];
        const assignedProducts = Array.from(this._assignedProducts.values());
        const addOnProducts = Array.from(this._addOnProducts.values());
        const originalAssignedProducts = Array.from(this._originalAssignedProducts?.values() ?? []);
        //for all assigned products
        for (const assignedProduct of assignedProducts) {
            const addOnProduct = this._addOnProducts.get(assignedProduct.addOnProductIdentifier);
            if (!addOnProduct) {
                console.log('Missing an addon product', assignedProduct.addOnProductIdentifier);
                continue;
            }
            const parameters = assignedProduct.parameters.map(it => {
                const addOnProductParameter = addOnProduct.parameters.find(parameter => parameter.id === it.id);
                return {
                    ...it,
                    name: addOnProductParameter?.name ?? `? (${it.id})`,
                    required: addOnProductParameter?.required ?? false
                };
            });
            const product = {
                ...assignedProduct,
                parameters,
                family: addOnProduct.family,
                productId: addOnProduct.productId,
                selected: true,
                disabled: this._excludedProductIds.has(addOnProduct.productId) || this._requiredProductIds.has(addOnProduct.productId),
                extraCardType: this.resolveExtraCardType(assignedProduct.addOnProductIdentifier)
            };
            products.push(product);
        }
        //for top level (not children) unassigned products, not cards
        const unassignedAddOnProducts = addOnProducts
            .filter(addOnProduct => !assignedProducts.some(assignedProduct => assignedProduct.addOnProductIdentifier === addOnProduct.identifier))
            .filter(addOnProduct => !this.extraSimCardAddOnProductIdentifiers().includes(addOnProduct.identifier));
        const topLevelUnassignedAddOnProducts = unassignedAddOnProducts.filter(addOnProduct => addOnProduct.parentIdentifier === undefined);
        for (const addOnProduct of topLevelUnassignedAddOnProducts) {
            const originalAssignedProduct = originalAssignedProducts.find(originalAssignedProduct => originalAssignedProduct.addOnProductIdentifier === addOnProduct.identifier);
            const identifier = originalAssignedProduct?.identifier ?? (0, resolveAssignedProductIdentifier_js_1.resolveAssignedProductIdentifier)(addOnProduct.identifier, originalAssignedProduct?.inventoryId, originalAssignedProduct?.parentInventoryId);
            const product = {
                identifier,
                addOnProductIdentifier: addOnProduct.identifier,
                productId: addOnProduct.productId,
                name: addOnProduct.name,
                family: addOnProduct.family,
                parameters: [...addOnProduct.parameters],
                inventoryId: originalAssignedProduct?.inventoryId,
                parentInventoryId: originalAssignedProduct?.parentInventoryId,
                parentIdentifier: originalAssignedProduct?.parentIdentifier,
                msisdn: originalAssignedProduct?.msisdn,
                selected: false,
                disabled: this._excludedProductIds.has(addOnProduct.productId),
                card: undefined,
                extraCardType: undefined
            };
            products.push(product);
        }
        //for children unassigned products
        const childrenAddOnProducts = addOnProducts.filter(addOnProduct => addOnProduct.parentIdentifier !== undefined);
        for (const childAddOnProduct of childrenAddOnProducts) {
            const parentAddOnProduct = this._addOnProducts.get(childAddOnProduct.parentIdentifier ?? '');
            const parentAssignedProducts = assignedProducts.filter(assignedProduct => assignedProduct.addOnProductIdentifier === parentAddOnProduct.identifier && assignedProduct.inventoryId !== undefined);
            for (const parentAssignedProduct of parentAssignedProducts) {
                const alreadyAssigned = assignedProducts.some(assignedProduct => assignedProduct.parentIdentifier === parentAssignedProduct.identifier && assignedProduct.addOnProductIdentifier === childAddOnProduct.identifier);
                if (alreadyAssigned) {
                    continue;
                }
                const identifier = (0, resolveAssignedProductIdentifier_js_1.resolveAssignedProductIdentifier)(childAddOnProduct.identifier, undefined, parentAssignedProduct.inventoryId);
                const childProduct = {
                    identifier,
                    inventoryId: undefined,
                    parentInventoryId: parentAssignedProduct.inventoryId,
                    parentIdentifier: parentAssignedProduct.identifier,
                    addOnProductIdentifier: childAddOnProduct.identifier,
                    productId: childAddOnProduct.productId,
                    name: childAddOnProduct.name,
                    family: childAddOnProduct.family,
                    parameters: [...childAddOnProduct.parameters],
                    msisdn: undefined,
                    card: undefined,
                    selected: false,
                    disabled: this._excludedProductIds.has(childAddOnProduct.productId),
                    extraCardType: undefined
                };
                products.push(childProduct);
            }
        }
        return products;
    }
    resolveProductCombinations() {
        const productCombinations = [];
        for (const selection of this._subscriptionProduct.optionallySelected) {
            const numberOfRequiredProducts = selection.numberToSelect;
            const products = selection.products
                .map(productId => this._products.find(product => product.productId === productId))
                .filter(it => it !== undefined);
            const numberOfSelected = products.filter(product => product.selected).length;
            const isCompleted = numberOfSelected >= numberOfRequiredProducts;
            const familyNames = Array.from(new Set(products.map(product => product.family.name)));
            const sameFamily = familyNames.length === 1;
            const productCombination = {
                numberOfRequiredProducts,
                products,
                isCompleted,
                sameFamily,
                familyNames
            };
            productCombinations.push(productCombination);
        }
        return productCombinations;
    }
    findAssignedProductsWithoutAddOnProduct() {
        return Array.from(this._assignedProducts.values()).filter(assignedProduct => !this._addOnProducts.has(assignedProduct.addOnProductIdentifier));
    }
    diffParameters(assigned, original) {
        const toAdd = assigned.filter(it => original.some(p => p.id === it.id) === false);
        const toRemove = original.filter(it => assigned.some(p => p.id === it.id) === false);
        const toChange = assigned.filter(it => {
            const oIt = original.find(p => p.id === it.id);
            return oIt && it.value !== oIt.value;
        });
        return {
            toAdd,
            toRemove,
            toChange
        };
    }
    resolveAddressIdentifier(address) {
        const base = `${address.firstName.trim()} ${address.lastName.trim()}`.trim();
        const baseLength = base.length;
        const max = this.addresses()
            .filter(it => it.identifier.startsWith(base))
            .reduce((accumulator, ad) => {
            const x = Number.parseInt(ad.identifier.substring(baseLength + 1));
            return (x > accumulator) ? x : accumulator;
        }, 0);
        return `${base} ${max + 1}`;
    }
    extraSimCardAddOnProductIdentifiers() {
        return [this.dataCardAddOnProductIdentifier, this.twinCardAddOnProductIdentifier].filter(it => it !== undefined);
    }
    resolveExtraCardType(addOnProductIdentifier) {
        if (addOnProductIdentifier === this.dataCardAddOnProductIdentifier) {
            return consts_js_1.DATA_CARD_ADD_ON_PRODUCT_NAME;
        }
        if (addOnProductIdentifier === this.twinCardAddOnProductIdentifier) {
            return consts_js_1.TWIN_CARD_ADD_ON_PRODUCT_NAME;
        }
        return undefined;
    }
}
exports.SubscriptionStore = SubscriptionStore;
function isNewCard(value) {
    const card = value;
    return card && card.actionType !== undefined && card.deliveryAddress !== undefined;
}
exports.isNewCard = isNewCard;
function isSimCard(value) {
    const card = value;
    return card && card.msisdn !== undefined && card.barringStatus !== undefined;
}
exports.isSimCard = isSimCard;
