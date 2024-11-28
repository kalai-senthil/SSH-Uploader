

export enum Utils {
    IP = "IP",
    COMMAND="Command",
    PATH = "Path"
}
export type UtilsEditing = {
    data?:any,
    type?:Utils,
    openEditDialog:boolean
}

export interface  ActionsTriggerProps<T> {
    perform: any;
    data: T;
    title?:String;
    description?:String;
}
export interface ActionsTriggerPropsWithCallOut<T> extends ActionsTriggerProps<T>{
    callout?:any
}
export type NavLink = {
    url: string;
    icon: any;
    name: string;
}

export type IP = {
    ID: string;
    NAME: string;
    IP: string;
};
export type COMMAND = {
    ID: string;
    NAME: string;
    COMMAND: string;
};
export type PATH = {
    ID: string;
    NAME: string;
    PATH: string;
};