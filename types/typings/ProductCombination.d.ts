import { Product } from "./Product.js";
export interface ProductCombination {
    isCompleted: boolean;
    sameFamily: boolean;
    familyNames: string[];
    numberOfRequiredProducts: number;
    products: Product[];
}
