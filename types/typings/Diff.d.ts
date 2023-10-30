import { Parameter } from "./Parameter.js";
import { SubscriptionProduct } from "./SubscriptionProduct.js";
export interface Diff {
    readonly hasChanges: boolean;
    readonly productsToAdd: DiffProduct[];
    readonly productsToRemove: DiffProduct[];
    readonly productsToChange: DiffProduct[];
    readonly subscriptionProductToChange: SubscriptionProduct | undefined;
}
export interface DiffProduct {
    identifier: string;
    productId: number;
    inventoryId: string | undefined;
    name: string;
    msisdn: string | undefined;
    parametersToChange: Parameter[];
}
