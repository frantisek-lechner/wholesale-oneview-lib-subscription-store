import { SubscriptionProduct } from '../typings/SubscriptionProduct.js';
import { AddOnProduct } from '../typings/AddOnProduct.js';
import { AssignedProduct, NewCard } from '../typings/AssignedProduct.js';
import { Product } from '../typings/Product.js';
import { CardsMeta, SubscriptionStoreInterface } from '../typings/SubscriptionStoreInterface.js';
import { Diff } from '../typings/Diff.js';
import { AssignmentErrors } from '../typings/AssignmentErrors.js';
import { ProductCombination } from '../typings/ProductCombination.js';
import { SimCard } from '../typings/SimCard.js';
import { Address } from '../typings/Address.js';
export declare class SubscriptionStore implements SubscriptionStoreInterface {
    readonly dataCardAddOnProductId: number | undefined;
    readonly dataCardAddOnProductIdentifier: string | undefined;
    readonly twinCardAddOnProductId: number | undefined;
    readonly twinCardAddOnProductIdentifier: string | undefined;
    private readonly _originalSubscriptionProduct?;
    private readonly _originalAddOnProducts?;
    private readonly _originalAssignedProducts?;
    private readonly _subscriptionProduct;
    private readonly _addOnProducts;
    private readonly _assignedProducts;
    private readonly _mainCard;
    private readonly _excludedProductIds;
    private readonly _requiredProductIds;
    private readonly _products;
    private readonly _productCombinations;
    private readonly _assignedProductsWithoutAddOnProduct;
    private constructor();
    static createNew(msisdn: string, subscriptionProduct: SubscriptionProduct, addOnProducts: AddOnProduct[]): SubscriptionStore;
    static createFrom(mainCard: SimCard, subscriptionProduct: SubscriptionProduct, addOnProducts: AddOnProduct[], assignedProducts: AssignedProduct[]): SubscriptionStore;
    static emptyAddress(): Address;
    private clone;
    private cloneWithMainNewCard;
    reset(): SubscriptionStore;
    subscriptionProduct(): SubscriptionProduct;
    changeSubscriptionProduct(subscriptionProduct: SubscriptionProduct, addOnProducts: AddOnProduct[]): SubscriptionStore;
    products(): Product[];
    productCombinations(): ProductCombination[];
    assignProduct(productIdentifier: string): SubscriptionStore;
    assignNewCard(addOnProductIdentifier: string, newCard: NewCard): SubscriptionStore;
    unassignProduct(productIdentifier: string): SubscriptionStore;
    setProductParameter(productIdentifier: string, parameterId: number, value: string): SubscriptionStore;
    diff(): Diff;
    assignmentErrors(): AssignmentErrors;
    cardsMeta(): CardsMeta;
    mainCard(): SimCard | NewCard;
    setMainCard(newMainCard: NewCard): SubscriptionStore;
    addresses(): Address[];
    private resolveExcludedProducts;
    private resolveRequiredProducts;
    private getAllRequiredProductIds;
    private gedExcludedAddOnProducts;
    private findFirstAddOnProductById;
    /**
     * @desc: it modifies the _assignedProducts instance variable!!!, premise: only main products could be added automatically, not children
     * @private
     */
    private assignAutomaticallyAddedProducts;
    private assignProducts;
    private resolveParameters;
    private resolveProducts;
    private resolveProductCombinations;
    private findAssignedProductsWithoutAddOnProduct;
    private diffParameters;
    private resolveAddressIdentifier;
    private extraSimCardAddOnProductIdentifiers;
    private resolveExtraCardType;
}
export declare function isNewCard(value: unknown): value is NewCard;
export declare function isSimCard(value: unknown): value is SimCard;
