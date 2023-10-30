import {Address} from "../typings/Address.js";
import {Product} from "../typings/Product.js";
import {isNewCard} from "./SubscriptionStore.js";

const MAIN_SIM_ADDRESS_IDENTIFIER = 'main'

export class AddressStore {
    private readonly _addresses: Map<string, Address>

    private constructor(addresses: Map<string, Address>) {
        this._addresses = addresses;
    }

    static create(): AddressStore {
        return new AddressStore(new Map())
    }

    static populate(products: Product[], mainSimCardAddress?: Address): AddressStore {
        const addresses = new Map<string, Address>()

        if (mainSimCardAddress) {
            addresses.set(MAIN_SIM_ADDRESS_IDENTIFIER, {...mainSimCardAddress, identifier: MAIN_SIM_ADDRESS_IDENTIFIER})
        }
        for (const {card} of products) {
            if (isNewCard(card)) {
                addresses.set(card.deliveryAddress.identifier, card.deliveryAddress)
            }
        }

        return new AddressStore(addresses)
    }


    set(identifier: string, address: Address): AddressStore {
        const updated: Map<string, Address> = new Map(this._addresses)
        updated.set(identifier, {...address, identifier})
        return this.clone(updated)
    }

    get(identifier: string): Address | undefined {
        return this._addresses.get(identifier)
    }

    getAll(): Address[] {
        return Array.from(this._addresses.values())
    }

    private clone(addresses: Map<string, Address>): AddressStore {
        return new AddressStore(addresses)
    }
}