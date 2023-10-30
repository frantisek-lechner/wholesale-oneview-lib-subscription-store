import { Product } from "./Product.js";
import { Diff } from "./Diff.js";
import { SubscriptionStore } from "../src/SubscriptionStore.js";
import { AssignmentErrors } from "./AssignmentErrors.js";
import { SubscriptionProduct } from "./SubscriptionProduct.js";
import { AddOnProduct } from "./AddOnProduct.js";
import { NewCard } from "./AssignedProduct.js";
import { ProductCombination } from "./ProductCombination.js";
import { SimCard } from "./SimCard.js";
import { Address } from "./Address.js";
export interface SubscriptionStoreInterface {
    readonly dataCardAddOnProductId: number | undefined;
    readonly dataCardAddOnProductIdentifier: string | undefined;
    readonly twinCardAddOnProductId: number | undefined;
    readonly twinCardAddOnProductIdentifier: string | undefined;
    reset: () => SubscriptionStore;
    productCombinations: () => ProductCombination[];
    subscriptionProduct: () => SubscriptionProduct;
    changeSubscriptionProduct: (subscriptionProduct: SubscriptionProduct, addOnProducts: AddOnProduct[]) => SubscriptionStore;
    products: () => Product[];
    assignProduct: (productIdentifier: string) => SubscriptionStore;
    assignNewCard: (addOnProductIdentifier: string, newCard: NewCard) => SubscriptionStore;
    unassignProduct: (productIdentifier: string) => SubscriptionStore;
    setProductParameter: (productIdentifier: string, parameterId: number, value: string) => SubscriptionStore;
    mainCard: () => SimCard | NewCard;
    setMainCard: (newCard: NewCard) => SubscriptionStore;
    cardsMeta: () => CardsMeta;
    diff: () => Diff;
    assignmentErrors: () => AssignmentErrors;
    addresses: () => Address[];
}
export interface CardsMeta {
    allowedDataCards: boolean;
    allowedTwinCards: boolean;
    canAddDataCard: boolean;
    canAddTwinCard: boolean;
    dataCardAddOnProductIdentifier: undefined | string;
    twinCardAddOnProductIdentifier: undefined | string;
}
