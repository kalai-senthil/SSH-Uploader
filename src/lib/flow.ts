import type { NodeTypes } from "@xyflow/svelte";
import Delay from "../components/flows/delay.svelte";
import Command from "../components/flows/command.svelte";
import Ip from "../components/flows/ip.svelte";
import Args from "../components/flows/args.svelte";
import Execute from "../components/flows/execute.svelte";

export const nodeTypes : NodeTypes = {
    "delay":Delay,
    "command":Command,
    "ip":Ip,
    "args":Args,
    "execute":Execute,
}