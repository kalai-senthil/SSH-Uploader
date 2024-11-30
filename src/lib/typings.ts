
import type { Position } from "@xyflow/svelte";


export enum FlowType {EDIT,RUN,DEFAULT}
export enum Utils {
  IP = "IP",
  COMMAND = "Command",
  PATH = "Path",
  PASSWORD = "Password",
}
export type UtilsEditing = {
  data?: any;
  type?: Utils;
  openEditDialog: boolean;
};

export type _Object<T> = {
  [key: string]: T;
};
export type FLOW={
  ID:string;
  NAME:string
}
export interface ActionsTriggerProps<T> {
  perform: any;
  data: T;
  title?: String;
  description?: String;
}
export interface NODE extends AddNodeParams {
  id: string;
  position: { x: number; y: number };
  sourcePosition?: Position ;
  targetPosition?: Position;
}

export type EDGE = {
  source: string;
  target: string;
  id: string;
};
export type Flow = {
  ID:string;
  NAME:string;
  edges: EDGE[];
  nodes: NODE[];
};
export type Flows = _Object<Flow>
export interface ActionsTriggerPropsWithCallOut<T>
  extends ActionsTriggerProps<T> {
  callout?: any;
}
export type NavLink = {
  url: string;
  icon: any;
  name: string;
};

export type IP = {
  ID: string;
  NAME: string;
  IP: string;
  PASSWORD: string;
};

export type NodeType = "delay" | "command" | "ip" | "args" | "execute";
export interface AddNodeParams {
  type: NodeType;
  data: _Object<any>;
}
export type PASSWORD = {
  ID: string;
  NAME: string;
  PASSWORD: string;
};
export type Passwords = _Object<PASSWORD>;
export type IPs = _Object<IP>;
export type Commands = _Object<COMMAND>;
export type Paths = _Object<PATH>;
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
