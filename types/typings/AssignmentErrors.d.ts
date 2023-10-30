import { Product } from "./Product.js";
import { ProductCombination } from "./ProductCombination.js";
import { AssignedProduct } from "./AssignedProduct.js";
export interface AssignmentErrors {
    isValid: boolean;
    missingRequiredProducts: Product[];
    assignedExcludedProducts: Product[];
    productsWithMissingRequiredParameters: Product[];
    uncompletedProductCombinations: ProductCombination[];
    assignedProductsWithoutAddOnProduct: AssignedProduct[];
}
