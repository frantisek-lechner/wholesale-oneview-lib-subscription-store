import { Address } from "../typings/Address.js";
import { Product } from "../typings/Product.js";
export declare class AddressStore {
    private readonly _addresses;
    private constructor();
    static create(): AddressStore;
    static populate(products: Product[], mainSimCardAddress?: Address): AddressStore;
    set(identifier: string, address: Address): AddressStore;
    get(identifier: string): Address | undefined;
    getAll(): Address[];
    private clone;
}
