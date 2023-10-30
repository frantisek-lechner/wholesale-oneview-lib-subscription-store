import {ParameterBase} from './Parameter.js'
import {Address} from "./Address.js";
import {SimCard} from "./SimCard.js";

export interface AssignedProduct {
    identifier: string
    parentIdentifier: string | undefined
    addOnProductIdentifier: string
    inventoryId: string | undefined
    parentInventoryId: string | undefined
    name: string
    parameters: ParameterBase[]
    msisdn: string | undefined
    card: SimCard | NewCard |  undefined
}

export interface NewCard {
    msisdn: string
    actionType: 'REGISTER_EXISTING_SIMCARD' | 'ORDER_NEW_SIMCARD' | 'REGISTER_EXISTING_ESIM_PROFILE' | 'ORDER_NEW_ESIM_PROFILE'
    iccid: string
    simCardTypeId: number | null
    handlingInstructionId: number | null
    deliveryAddress: Address
    eid: string
}
