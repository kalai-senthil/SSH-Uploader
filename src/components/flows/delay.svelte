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
  import * as Select from "$lib/components/ui/select";
  import Clock from "lucide-svelte/icons/clock";
  import NodeWrapper from "./NodeWrapper.svelte";
  import { fly, slide } from "svelte/transition";
  import { FlowType } from "$lib/typings";
  import { flowEditing } from "$lib/store";
  const nodeData = useNodesData(id);

  const units = ["ms", "s", "m", "h", "d"];

  $: unit = ($nodeData?.data?.unit as string) ?? "ms";
  $: time = ($nodeData?.data?.time as number) ?? 100;
  $: isRunMode = $flowEditing.type === FlowType.RUN;
</script>

<NodeWrapper nodeId={id}>
  <div class="flex items-center my-2 justify-start gap-1">
    <Clock class="size-4" />
    <Label>Delay</Label>
  </div>
  {#if isRunMode}
    <section in:fly={{ y: 10 }}>
      <Label class="font-bold">{time}{unit}</Label>
    </section>
  {:else}
    <div class="flex">
      <Input
        disabled={isRunMode}
        value={time}
        type="number"
        onchange={(val) =>
          updateNodeData(id, { time: val.currentTarget.value })}
      />
      <Select.Root
        disabled={isRunMode}
        onValueChange={(val) => updateNodeData(id, { unit: val })}
        value={unit}
        type="single"
      >
        <Select.Trigger class="w-[180px]">
          {unit}
        </Select.Trigger>
        <Select.Content>
          {#each units as unit}
            <Select.Item value={unit}>{unit}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </div>
  {/if}
</NodeWrapper>
