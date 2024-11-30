<script>
  import Button from "$lib/components/ui/button/button.svelte";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import {
    addNode,
    clearCanvas,
    editFlow,
    flowEditing,
    saveFlow,
  } from "$lib/store";
  import * as Popover from "$lib/components/ui/popover";
  import Save from "lucide-svelte/icons/save";
  import Clear from "lucide-svelte/icons/square-x";
  import PlayMode from "lucide-svelte/icons/square-play";
  import Plus from "lucide-svelte/icons/plus";
  import { useNodes, useEdges } from "@xyflow/svelte";
  const nodes = useNodes();
  const edges = useEdges();
  import { v4 as uuid } from "uuid";
  import { editFlow as editFlowDB } from "$lib/db";
  import { FlowType } from "$lib/typings";
  import Play from "lucide-svelte/icons/play";
  import Pencil from "lucide-svelte/icons/pencil";
  import { fly } from "svelte/transition";
</script>

<section class="fixed z-20 bottom-10 flex justify-center items-center w-panel">
  <section
    in:fly={{ y: 20 }}
    class="max-w-fit px-4 py-2 gap-4 items-center justify-between flex bg-accent border shadow-sm rounded-full overflow-hidden"
  >
    {#if $flowEditing.type !== FlowType.RUN}
      <Button
        onclick={() => {
          if ($flowEditing.type === FlowType.EDIT) {
            editFlowDB({
              ...$flowEditing,
              edges: $edges,
              // @ts-ignore
              nodes: $nodes,
            });
            return;
          }
          saveFlow({
            ID: uuid(),
            NAME: $flowEditing.NAME,
            edges: $edges,
            // @ts-ignore
            nodes: $nodes,
          });
        }}
        class="bg-violet-500 rounded-full border border-input hover:bg-violet-500/90 text-white"
        ><Save /> Save</Button
      >

      <Button
        onclick={() => {
          flowEditing.update((vals) => ({ ...vals, type: FlowType.RUN }));
        }}
        size="icon"
        variant="default"
        class="hover:ring-2 bg-sidebar text-white hover:text-sidebar hover:bg-white"
        ><PlayMode /></Button
      >
      <Popover.Root>
        <Popover.Trigger>
          <Button
            size="icon"
            variant="secondary"
            class="hover:ring-2 bg-sidebar"><Plus /></Button
          >
        </Popover.Trigger>
        <Popover.Content class="p-0">
          <Button
            onclick={() => {
              addNode({ type: "delay", data: { unit: "ms", time: 100 } });
            }}
            class="w-full rounded-none justify-start"
            variant="ghost">Delay</Button
          >
          <Button
            onclick={() => {
              addNode({ type: "command", data: {} });
            }}
            class="w-full rounded-none justify-start"
            variant="ghost"
          >
            Command</Button
          >
          <Button
            onclick={() => {
              addNode({ type: "ip", data: { ips: [] } });
            }}
            class="w-full rounded-none justify-start"
            variant="ghost">IP</Button
          >

          <Button
            onclick={() => {
              addNode({ type: "args", data: { args: "" } });
            }}
            class="w-full rounded-none justify-start"
            variant="ghost">Args</Button
          >

          <Button
            onclick={() => {
              addNode({ type: "execute", data: {} });
            }}
            class="w-full rounded-none justify-start"
            variant="ghost">Execute</Button
          >
        </Popover.Content>
      </Popover.Root>
    {:else}
      <Button
        onclick={() => {
          
        }}
        class="bg-violet-500 rounded-full border border-input hover:bg-violet-500/90 text-white"
        ><Play /> Run</Button
      >
      <Button
        onclick={() => {
          flowEditing.update((val) => ({ ...val, type: FlowType.EDIT }));
        }}
        size="icon"
        variant="secondary"
        class="hover:ring-2 bg-sidebar"><Pencil /></Button
      >
    {/if}
    <Button
      onclick={clearCanvas}
      size="icon"
      variant="destructive"
      class="hover:ring-2"><Clear /></Button
    >
  </section>
</section>
