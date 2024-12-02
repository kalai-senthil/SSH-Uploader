<script>
  import Button from "$lib/components/ui/button/button.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import {
    addNode,
    contextMenuDetails,
    flowEditing,
    updateContextMenu,
  } from "$lib/store";
  import { FlowType, NodeType } from "$lib/typings";
  import { flyAndScale } from "$lib/utils";
  import { fly } from "svelte/transition";
  const position = $derived($contextMenuDetails.position);
  const isRunMode = $derived($flowEditing.type === FlowType.RUN);
</script>

{#if $contextMenuDetails.show && !isRunMode}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <section
    tabindex={1}
    role="button"
    onclick={() => {
      updateContextMenu({ show: false });
    }}
    in:fly={{ y: 20, opacity: 0, duration: 300 }}
    out:fly={{ y: -10 }}
    class="fixed flex flex-col space-y-1 overflow-hidden justify-start items-start w-[200px] z-[100] bg-background shadow rounded-md border border-input"
    style="top: {position.top}px; left: {position.left}px;"
  >
    <Label class="p-2 text-sm text-muted-foreground">Add</Label>
    <Button
      onclick={() => {
        addNode({ type:NodeType.DELAY, data: { unit: "ms", time: 100 } });
      }}
      class="w-full rounded-none justify-start"
      variant="ghost">Delay</Button
    >
    <Button
      onclick={() => {
        addNode({ type:NodeType.COMMAND, data: {} });
      }}
      class="w-full rounded-none justify-start"
      variant="ghost">Command</Button
    >
    <Button
      onclick={() => {
        addNode({ type:NodeType.IP, data: { ips: [] } });
      }}
      class="w-full rounded-none justify-start"
      variant="ghost">IP</Button
    >
    <Button
      onclick={() => {
        addNode({ type:NodeType.ARGS, data: { args: "" } });
      }}
      class="w-full rounded-none justify-start"
      variant="ghost">Args</Button
    >

    <Button
      onclick={() => {
        addNode({ type: NodeType.EXECUTE, data: {} });
      }}
      class="w-full rounded-none justify-start"
      variant="ghost">Execute</Button
    >
  </section>
{/if}
