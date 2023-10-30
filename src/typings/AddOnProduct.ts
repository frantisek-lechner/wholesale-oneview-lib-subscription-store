import {Parameter} from './Parameter.js'

export interface AddOnProductFamily {
    name: string
    group: string,
    orderIndex: number
}

export interface AddOnProduct {
    identifier: string //identifier = productId#parentId
    parentIdentifier: string | undefined
    productId: number
    name: string
    parameters: Parameter[]
    requires: number[]
    excludes: number[]
    family: AddOnProductFamily
}
