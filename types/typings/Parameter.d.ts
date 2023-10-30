export interface ParameterBase {
    id: number;
    value: string;
}
export interface Parameter extends ParameterBase {
    name: string;
    required: boolean;
}
