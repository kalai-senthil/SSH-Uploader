<script lang="ts">
  import { useNodesData, useSvelteFlow, type NodeProps } from "@xyflow/svelte";
  type $$Props = NodeProps;
  export let id: $$Props["id"];
  import Monitor from "lucide-svelte/icons/monitor";

  import Label from "$lib/components/ui/label/label.svelte";
  import NodeWrapper from "./NodeWrapper.svelte";
  import SelectWithSearch from "../SelectWithSearch.svelte";
  import { ips } from "$lib/store";
  import { flowEditing } from "$lib/store";

  import Button from "$lib/components/ui/button/button.svelte";
  import { FlowType } from "$lib/typings";
  import { fly, slide } from "svelte/transition";
  import SlideWrapper from "../animation/SlideWrapper.svelte";
  const { updateNodeData } = useSvelteFlow();
  const data = useNodesData(id);
  $: ipsData = Object.values($ips);
  $: value = [...(($data?.data.ips as string[]) ?? [])];
  $: updateNodeData(id, { ips: value });
  $: isRunMode = $flowEditing.type === FlowType.RUN;
</script>

<NodeWrapper nodeId={id}>
  <div class="flex items-center my-2 justify-start gap-1">
    <Monitor class="size-4" />
    <Label>IP</Label>
  </div>
  {#if !isRunMode}
    <SlideWrapper>
      <SelectWithSearch
        bind:disabled={isRunMode}
        type="multiple"
        bind:selectedValue={value}
        searchLabel="Select IPs"
        data={ipsData.map((ip) => ({
          label: ip.NAME,
          value: ip.ID,
        }))}
      />
    </SlideWrapper>
  {/if}
  <section
    in:fly={{ y: 10 }}
    class="flex w-full mt-1 gap-1 flex-wrap items-center justify-start"
  >
    {#each value as ip}
      <Button
        onclick={() => {
          if(!isRunMode){
            value.splice(value.indexOf(ip), 1);
            value = value;
          }
        }}
        variant="link"
        class="after:content-[','] last:after:content-[''] after:-ml-2 text-sm m-0 p-0 font-bold"
      >
        <Label>{$ips[ip].IP}</Label>
      </Button>
    {/each}
  </section>
</NodeWrapper>
