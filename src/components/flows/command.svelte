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
  import Terminal from "lucide-svelte/icons/square-terminal";

  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import NodeWrapper from "./NodeWrapper.svelte";
  import SelectWithSearch from "../SelectWithSearch.svelte";
  import { commands, flowEditing, ips } from "$lib/store";
  import { FlowType } from "$lib/typings";
  import SlideWrapper from "../animation/SlideWrapper.svelte";
  const { updateNodeData } = useSvelteFlow();
  const data = useNodesData(id);
  let value = "";
  $: value = ($data?.data.command as string) ?? "";
  $: commandsData = Object.values($commands);
  $: updateNodeData(id, { command: value });
  $: isRunMode = $flowEditing.type === FlowType.RUN;
</script>

<NodeWrapper nodeId={id}>
  <div class="flex items-center my-2 justify-start gap-1">
    <Terminal class="size-4" />
    <Label>Command</Label>
  </div>
  {#if !isRunMode}
    <SlideWrapper>
      <SelectWithSearch
        bind:disabled={isRunMode}
        type="single"
        bind:selectedValue={value}
        searchLabel="Select Command"
        data={commandsData.map((command) => ({
          label: command.NAME,
          value: command.ID,
        }))}
      />
    </SlideWrapper>
  {/if}
  <Label class="text-sm font-bold">{$commands[value].COMMAND}</Label>
</NodeWrapper>
