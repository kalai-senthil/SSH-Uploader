import { type NodeTypes } from "@xyflow/svelte";
import Delay from "../components/flows/delay.svelte";
import Command from "../components/flows/command.svelte";
import Ip from "../components/flows/ip.svelte";
import Args from "../components/flows/args.svelte";
import Execute from "../components/flows/execute.svelte";
import TriggerIndicator from "../components/flows/TriggerIndicator.svelte";
import { flowRunning, updateRunningFlow } from "./store";
import { NodeType, type _Object, type EDGE, type NODE } from "./typings";
import { getFlow } from "./db";
import { tick } from "svelte";

export const nodeTypes: NodeTypes = {
  delay: Delay,
  command: Command,
  ip: Ip,
  args: Args,
  execute: Execute,
  start: TriggerIndicator,
  end: TriggerIndicator,
};

export function getNode(nodes: NODE[], nodeId: string) {
  return nodes.find((node) => node.id === nodeId);
}

function wantToStop() {
  let timeout = false;
  flowRunning.subscribe((val) => {
    timeout = val.running === false;
  })();
  return timeout;
}
function getTimeOut() {
  let timeout = -1;
  flowRunning.subscribe((val) => {
    timeout = val.timeout;
  })();
  return timeout;
}
export async function stopFlow() {
  clearInterval(getTimeOut());
  updateRunningFlow({}, true);
}
export async function triggerFlow(id: string) {
  const { nodes, edges } = await getFlow(id);
  const startNodeId = "start";
  let edge = edges.find((edge) => edge.source === startNodeId)!;
  updateRunningFlow({ runningNode: startNodeId, running: true });
  const nodesData: _Object<any> = {};
  nodes.map((node) => {
    nodesData[node.id] = node.data;
  });
  console.log(nodesData);

  let nodeToRun: NODE | undefined = undefined;
  await tick();
  const interval = setInterval(async () => {
    if (wantToStop() || !edge) {
      stopFlow();
      return;
    }
    nodeToRun = getNode(nodes, edge.target);
    if (!nodeToRun) {
      stopFlow();
      return;
    }
    updateRunningFlow({ runningNode: nodeToRun.id });
    switch (nodeToRun.type) {
      case NodeType.START:
      case NodeType.END:
        break;
      case NodeType.DELAY:
        await performDelay(nodeToRun.data as any);
        break;
      case NodeType.EXECUTE:
        const ip = nodesData[edge.source];
        console.log(ip);
        break;
      // await
      default:
        break;
    }

    edge = edges.find((ed) => ed.source === nodeToRun!.id)!;
  }, 500);
  updateRunningFlow({ timeout: interval });
}

export async function performDelay({ time, unit }: { time: number; unit: string }) {
  // ["ms", "s", "m", "h"]
  
  switch (unit) {
    case "ms":
      return new Promise((resolve) => setTimeout(resolve, time));
    case "s":
      return new Promise((resolve) => setTimeout(resolve, time * 1000));
    case "m":
      return new Promise((resolve) => setTimeout(resolve, time * 60 * 1000));
    case "h":
      return new Promise((resolve) =>
        setTimeout(resolve, time * 60 * 60 * 1000)
      );
    default:
      break;
  }
}
