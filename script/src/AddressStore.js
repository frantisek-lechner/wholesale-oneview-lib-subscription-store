"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressStore = void 0;
const SubscriptionStore_js_1 = require("./SubscriptionStore.js");
const MAIN_SIM_ADDRESS_IDENTIFIER = 'main';
class AddressStore {
    constructor(addresses) {
        Object.defineProperty(this, "_addresses", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._addresses = addresses;
    }
    static create() {
        return new AddressStore(new Map());
    }
    static populate(products, mainSimCardAddress) {
        const addresses = new Map();
        if (mainSimCardAddress) {
            addresses.set(MAIN_SIM_ADDRESS_IDENTIFIER, { ...mainSimCardAddress, identifier: MAIN_SIM_ADDRESS_IDENTIFIER });
        }
        for (const { card } of products) {
            if ((0, SubscriptionStore_js_1.isNewCard)(card)) {
                addresses.set(card.deliveryAddress.identifier, card.deliveryAddress);
            }
        }
        return new AddressStore(addresses);
    }
    set(identifier, address) {
        const updated = new Map(this._addresses);
        updated.set(identifier, { ...address, identifier });
        return this.clone(updated);
    }
    get(identifier) {
        return this._addresses.get(identifier);
    }
    getAll() {
        return Array.from(this._addresses.values());
    }
    clone(addresses) {
        return new AddressStore(addresses);
    }
}
exports.AddressStore = AddressStore;
