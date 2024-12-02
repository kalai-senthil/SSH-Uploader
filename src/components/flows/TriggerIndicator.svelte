<script lang="ts">
  import {
    Handle,
    Position,
    useNodesData,
    useSvelteFlow,
    type NodeProps,
  } from "@xyflow/svelte";
  type $$Props = NodeProps;
  export let id: $$Props["id"];
  //   import Terminal from "lucide-svelte/icons/square-terminal";
  import Terminal from "lucide-svelte/icons/nut";

  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import NodeWrapper from "./NodeWrapper.svelte";
  import SelectWithSearch from "../SelectWithSearch.svelte";
  import { commands, flowEditing, ips } from "$lib/store";
  import { FlowType, NodeType } from "$lib/typings";
  import SlideWrapper from "../animation/SlideWrapper.svelte";
  const { updateNodeData } = useSvelteFlow();
  const data = useNodesData(id);
  $: label = $data?.data.label ?? "";
  $: isStartNode = label === NodeType.START
  $: isEndNode = label === NodeType.END
  $: props = {
    displayNodeOptions: false,
    nodeId: id,
    leftHandle: isEndNode,
    rightHandle: isStartNode,
  };
</script>

<NodeWrapper {...props}>
    {#if isStartNode}

        {:else}
    {/if}
  <Terminal class="size-4" />
  <Label>
    {label}
  </Label>
</NodeWrapper>
