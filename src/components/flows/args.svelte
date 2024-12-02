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
  const { updateNodeData } = useSvelteFlow();
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Braces from "lucide-svelte/icons/braces";
  import NodeWrapper from "./NodeWrapper.svelte";
  import { fly, slide } from "svelte/transition";
  import { FlowType } from "$lib/typings";
  import { flowEditing } from "$lib/store";
  const nodeData = useNodesData(id);
  $: args = ($nodeData?.data?.args as string) ?? "";
  $: isRunMode = $flowEditing.type === FlowType.RUN;
</script>

<NodeWrapper className="w-fit" leftHandle={false} nodeId={id}>
  <div class="flex items-center my-2 justify-start gap-1">
    <Braces class="size-4" />
    <Label>Args</Label>
  </div>
  {#if !isRunMode}
    <section transition:slide class="w-full">
      <Input
        placeholder="Provide args"
        disabled={isRunMode}
        value={args}
        oninput={(val) => {
          updateNodeData(id, { args: val.currentTarget.value });
        }}
      />
    </section>
  {/if}
  <Label class="text-sm font-bold">{args}</Label>
</NodeWrapper>
