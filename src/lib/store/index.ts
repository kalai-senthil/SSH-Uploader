import {
  getCommands,
  getDB,
  getFlows,
  getIPS,
  getPasswords,
  getPaths,
} from "$lib/db";
import { v4 as uuid } from "uuid";
import {
  FlowType,
  type _Object,
  type AddNodeParams,
  type COMMAND,
  type Commands,
  type EDGE,
  type FLOW,
  type Flow,
  type Flows,
  type IP,
  type IPs,
  type NODE,
  type PASSWORD,
  type Passwords,
  type PATH,
  type Paths,
  type UtilsEditing,
} from "$lib/typings";
import { Position, type Edge, type Node } from "@xyflow/svelte";
import { writable } from "svelte/store";

export const ips = writable<IPs>({});
export const commands = writable<Commands>({});
export const paths = writable<Paths>({});
export const passwords = writable<Passwords>({});
export const flows = writable<Flows>({});
export const utilsEditing = writable<UtilsEditing>({ openEditDialog: false });
export const contextMenuDetails = writable({
  show: false,
  position: { top: 0, left: 0 },
});
export const nodesSelected = writable<string | undefined>(undefined);

export function updateContextMenu(params: {}) {
  contextMenuDetails.update((val) => ({ ...val, ...params }));
}
export const flowEditing = writable<FLOW & {type:FlowType}>({ID:"",NAME:"",type:FlowType.DEFAULT});
export const nodes = writable<Node[]>([]);
export const edges = writable<Edge[]>([]);

export function clearCanvas() {
  nodes.set([]);
  edges.set([]);
  updateContextMenu({ show: false });
  flowEditing.set({type:FlowType.DEFAULT,ID:"",NAME:""})
}
export function resetUtilsEditing() {
  utilsEditing.set({ openEditDialog: false });
}

const nodeDefaultParams = {
  sourcePosition: Position.Left,
  targetPosition: Position.Right,
};

export function copyNode(id: string) {
  nodesSelected.set(undefined);
  nodes.update((nodes) => {
    const node = nodes.find((node) => node.id === id);
    if (node) {
      return [...nodes, { ...node, id: uuid(), position: { x: 0, y: 0 } }];
    }
    return nodes;
  });
}

export async function addNodes(flow: FLOW, nodes: NODE[]) {
  const db = await getDB();
  for (const node of nodes) {
    db.execute(
      "INSERT INTO NODES(id,FLOWID,type,data,targetPosition,sourcePosition,position) VALUES($1,$2,$3,$4,$5,$6,$7)",
      [
        node.id,
        flow.ID,
        node.type,
        JSON.stringify(node.data),
        node.targetPosition,
        node.sourcePosition,
        JSON.stringify(node.position),
      ]
    );
  }
  return nodes;
}

export async function addEdges(flow: FLOW, edges: EDGE[]) {
  const db = await getDB();
  for (const edge of edges) {
    db.execute(
      "INSERT INTO EDGES(id,FLOWID,source,target) VALUES($1,$2,$3,$4)",
      [edge.id, flow.ID, edge.source, edge.target]
    );
  }
  return edges;
}

export async function addFlow(flow: FLOW) {
  const db = await getDB();
  await db.execute("INSERT INTO FLOWS(ID,NAME) VALUES($1,$2)", [
    flow.ID,
    flow.NAME,
  ]);
  return flow;
}
export async function saveFlow(params: Flow,clear=true) {
  const flow = await addFlow({ ID: params.ID, NAME: params.NAME });
  const nodes = await addNodes(flow, params.nodes);
  const edges = await addEdges(flow, params.edges);
  flows.update((vals) => ({
    ...vals,
    [flow.ID]: { ...flow, nodes, edges },
  }));
  if(clear){
    clearCanvas();
  }
}
export function deleteNode(id: string) {
  nodes.update((nodes) => {
    nodes.splice(
      nodes.findIndex((node) => node.id === id),
      1
    );
    return [...nodes];
  });
}
export async function addNode(params: AddNodeParams) {
  nodes.update((nodes) => {
    nodes.push({
      ...params,
      ...nodeDefaultParams,
      id: uuid(),
      position: {
        x: 0,
        y: 0,
      },
    });
    return nodes;
  });
}

export async function initIPS() {
  const ipsList = await getIPS();
  const passes: IPs = {};
  ipsList.forEach((pass) => {
    passes[pass.ID] = pass;
  });
  ips.set(passes);
}

export async function initCommands() {
  const _commands = await getCommands();
  const passes: Commands = {};
  _commands.forEach((pass) => {
    passes[pass.ID] = pass;
  });
  commands.set(passes);
}

export async function initPaths() {
  const _paths = await getPaths();
  const passes: Paths = {};
  _paths.forEach((pass) => {
    passes[pass.ID] = pass;
  });
  paths.set(passes);
}
export async function initPasswords() {
  const _passwords = await getPasswords();
  const passes: Passwords = {};
  _passwords.forEach((pass) => {
    passes[pass.ID] = pass;
  });
  passwords.set(passes);
}
export async function initFlows() {
  const _flows = await getFlows();
  flows.set(_flows);
}

export async function editFlow(flow:FLOW) {
  flows.subscribe((vals)=>{
    flowEditing.set({...flow,type:FlowType.EDIT})    
    nodes.set(vals[flow.ID].nodes);
    edges.set(vals[flow.ID].edges);
  })()
}
export async function runFlow(flow:FLOW) {
  flows.subscribe((vals)=>{
    flowEditing.set({...flow,type:FlowType.RUN})    
    nodes.set(vals[flow.ID].nodes);
    edges.set(vals[flow.ID].edges);
  })()
}
