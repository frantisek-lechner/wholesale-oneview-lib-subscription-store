export interface SubscriptionProduct {
    id: number;
    name: string;
    type: string;
    isFwa: boolean;
    familyName: string;
    automaticallySelected: number[];
    optionallySelected: OptionalSelection[];
}
export interface OptionalSelection {
    numberToSelect: number;
    products: number[];
}
