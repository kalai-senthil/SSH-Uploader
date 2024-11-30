<script lang="ts">
  import { nodes, edges, updateContextMenu, nodesSelected, flowEditing } from "$lib/store";
  import { nodeTypes } from "$lib/flow";
  import { SvelteFlow, Background, Controls } from "@xyflow/svelte";
  import ContextMenu from "../../components/flows/ContextMenu.svelte";
  import Panel from "../../components/flows/Panel.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import { FlowType } from "$lib/typings";

  let width: number = $state(0);
  let height: number = $state(0);
  function calculateMenuPos(clientX: number, clientY: number) {
    return {
      top: clientY,
      left: clientX + 10,
    };
  }

  function handlePaneClick() {
    nodesSelected.set(undefined);
    updateContextMenu({ show: false });
  }
  const isRunMode = $derived($flowEditing.type === FlowType.RUN)
  
</script>

<section class="h-screen relative" bind:clientWidth={width} bind:clientHeight={height}>
  <ContextMenu />
  <Input placeholder="Flow Name" readonly={isRunMode} class="absolute z-10 rounded-sm bg-sidebar ring-1 top-10 max-w-60 left-2" bind:value={$flowEditing.NAME} />
  <SvelteFlow
    on:nodemouseenter={({ detail }) => {
      if (detail && detail.node.id) {
        nodesSelected.set(detail.node.id);
      }
    }}
    on:nodemouseleave={handlePaneClick}
    on:nodedragstart={({ detail }) => {
      if (detail && detail.targetNode?.id) {
        nodesSelected.set(detail?.targetNode.id);
      }
    }}
    on:nodeclick={({ detail }) => {
      nodesSelected.set(detail.node.id);
    }}
    on:paneclick={handlePaneClick}
    on:panecontextmenu={(d) => {
      d.preventDefault();
      d.detail.event.preventDefault();
      const { left, top } = calculateMenuPos(
        d.detail.event.clientX,
        d.detail.event.clientY
      );
      // handleContextMenu();
      updateContextMenu({ show: true, position: { left, top } });
    }}
    {nodes}
    {nodeTypes}
    colorMode="dark"
    {edges}
  >
    <Background bgColor="#18181b" />
    <Controls />
    <Panel />
  </SvelteFlow>
</section>
