<script lang="ts">
  import {
    Handle,
    Position,
    useHandleConnections,
    useNodesData,
    useSvelteFlow,
    type NodeProps,
  } from "@xyflow/svelte";
  type $$Props = NodeProps;
  export let id: $$Props["id"];
  const { updateNodeData } = useSvelteFlow();
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import * as Select from "$lib/components/ui/select";
  import Cpu from "lucide-svelte/icons/cpu";
  import NodeWrapper from "./NodeWrapper.svelte";
  import { slide } from "svelte/transition";
  import { FlowType } from "$lib/typings";
  import { commands } from "$lib/store";
  const connections = useHandleConnections({
    nodeId: id,
    type: "target",
  });
  $: nodesData = useNodesData(
    $connections.map((connection) => connection.source)
  );
  $: nodesDataFormatted = $nodesData
    .filter((node) => ["args", "command"].includes(node?.type as string))
    .sort((a, b) => (a.type === "command" ? -1 : 1));
  $: value = `${$commands[nodesDataFormatted[0].data.command as string]?.COMMAND} ${nodesDataFormatted[1].data.args}`
  $: updateNodeData(id,{command:value})
</script>

<NodeWrapper nodeId={id}>
  <div class="flex items-center my-2 justify-start gap-1">
    <Cpu class="size-4" />
    <Label>Execute</Label>
  </div>
  {#if nodesDataFormatted}
    <Label
      >{$commands[nodesDataFormatted[0].data.command as string]?.COMMAND}</Label
    >
    <Label>{nodesDataFormatted[1].data.args}</Label>
  {/if}
</NodeWrapper>
