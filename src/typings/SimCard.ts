import {BarringStatus, MobileDeviceInformation, SimDetails} from "./api.js";

export interface SimCard {
    msisdn: string
    simDetails: SimDetails
    barringStatus: BarringStatus
    mobileDeviceInformation?: MobileDeviceInformation
}