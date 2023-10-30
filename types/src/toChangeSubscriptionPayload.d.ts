import { SubscriptionStore } from "./SubscriptionStore.js";
import { ApiChangeSubscriptionPayload } from "../typings/api.js";
export declare function toChangeSubscriptionPayload(msisdn: string, subscriptionStore: SubscriptionStore, dataCardAddOnProductId: number | undefined, twinCardAddOnProductId: number | undefined): ApiChangeSubscriptionPayload;
