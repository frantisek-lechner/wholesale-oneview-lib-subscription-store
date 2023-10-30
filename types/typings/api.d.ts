import { Address } from "./Address.js";
export interface ApiSubscriptionProductFamily {
    name: string;
    subscriptionProducts: ApiSubscriptionProduct[];
}
export interface ApiSubscriptionProduct {
    subscriptionProductId: number;
    name: string;
    dependencies: ApiSubscriptionProductDependency;
    subscriptionType: string;
}
export interface ApiSubscriptionProductDependency {
    automaticallyAdded: ApiAddOnProductLink[];
    options: ApiSubscriptionProductDependencyOption[];
}
export interface ApiSubscriptionProductDependencyOption {
    numberOfProductsToSelect: number;
    products: ApiAddOnProductLink[];
}
export interface ApiAddOnProductLink {
    productId: number;
    productName: string;
}
export interface ApiAddOnProductSimple extends ApiAddOnProductLink {
    parameters: ApiAddOnProductParameter[];
}
export interface ApiAddOnProduct extends ApiAddOnProductSimple {
    dependencies: AddOnProductDependency;
    childAddOnProducts: ApiAddOnProduct[];
}
export interface AddOnProductDependency {
    excludes: ApiAddOnProductLink[];
    requires: ApiAddOnProductLink[];
}
export interface ApiAddOnProductParameter {
    parameterId: number;
    name: string;
    required: boolean;
}
export interface ApiSubscriptionProductAddOnProducts {
    families: ApiSubscriptionProductAddOnProductsFamily[];
}
export interface ApiSubscriptionProductAddOnProductsFamily {
    name: string;
    familyGroupType: 'EXTRA_SIM_CARDS' | 'UNKNOWN';
    addOnProducts: ApiAddOnProduct[];
}
export interface ApiSubscription {
    simCards: {
        main: ApiSimCard;
        twin: ApiSimCard[];
        data: ApiSimCard[];
    };
    addOnProducts: ApiSubscriptionAddOnProduct[];
}
export interface MobileDeviceInformation {
    vendor: string;
    model: string;
    imei: string;
}
export interface SimDetails {
    iccId: string;
    imsi: string;
    network: '3G' | '4G';
    esimDetails?: {
        status?: string;
        isEsim: boolean;
    };
}
export interface BarringStatus {
    barred: boolean;
    status: 'OPEN' | 'ADDING' | 'BARRED' | 'REMOVING';
}
export interface ApiSimCard {
    inventoryProductId: string;
    msisdn: string;
    mobileDeviceInformation?: MobileDeviceInformation;
    simDetails: SimDetails;
    barringStatus: BarringStatus;
}
export interface ApiSubscriptionAddOnProduct extends ApiAddOnProductLink {
    orders: ApiSubscriptionOrder[];
}
export interface ApiSubscriptionOrder {
    inventoryProductId: string;
    parentInventoryProductId?: string;
    status: 'NO_CHANGE' | 'NEW_OPEN' | 'CHANGE_ALTER' | 'REMOVE_CANCEL';
    originalFromDate: string;
    validFrom: string;
    validTo?: string;
    parameters?: ApiOrderParameter[];
}
export interface ApiOrderParameter {
    parameterId: number;
    parameterValue: string;
}
export interface ApiChangeSubscriptionPayload {
    orderType: 'CHANGE_SUBSCRIPTION';
    msisdn: string;
    newSubscriptionProductId?: number;
    simCardProducts: ApiNewSimCardProduct[];
    addOnProducts: ApiAssignedProductToAdd[];
    simCardProductsToRemove: ApiAssignedProductToRemove[];
    addOnProductsToRemove: ApiAssignedProductToRemove[];
    addOnProductsToChange: ApiAssignedProductToChange[];
}
export interface ApiNewSimCardProduct {
    productId: number;
    msisdn: string;
    simCard: ApiRegisterSimCard | ApiOrderSimCard | ApiRegisterESimProfile | ApiOrderESimProfile;
}
export interface ApiRegisterSimCard {
    actionType: 'REGISTER_EXISTING_SIMCARD';
    iccid: string;
}
export interface ApiOrderSimCard {
    actionType: 'ORDER_NEW_SIMCARD';
    simCardTypeId: number;
    handlingInstructionId: number;
    deliveryAddress: Address;
}
export interface ApiRegisterESimProfile {
    actionType: 'REGISTER_EXISTING_ESIM_PROFILE';
    iccid: string;
    eid?: string;
}
export interface ApiOrderESimProfile {
    actionType: 'ORDER_NEW_ESIM_PROFILE';
    eid?: string;
}
export interface ApiAssignedProductToAdd {
    productId: number;
    parentInventoryProductId?: number;
    parameters: ApiProductParameter[];
}
export interface ApiAssignedProductToRemove {
    inventoryProductId: string;
}
export interface ApiAssignedProductToChange {
    inventoryProductId: string;
    parameters: ApiProductParameter[];
}
export interface ApiProductParameter {
    parameterId: number;
    value: string;
}
