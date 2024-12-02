<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import * as Dialog from "$lib/components/ui/dialog";
  import {
    addNode,
    clearCanvas,
    editFlow,
    flowEditing,
    flowRunning,
    ips,
    runFlow,
    saveFlow,
    updateRunningFlow,
  } from "$lib/store";
  import * as Popover from "$lib/components/ui/popover";
  import Save from "lucide-svelte/icons/save";
  import Clear from "lucide-svelte/icons/square-x";
  import PlayMode from "lucide-svelte/icons/play";
  import Stop from "lucide-svelte/icons/circle-stop";
  import Plus from "lucide-svelte/icons/plus";
  import {
    useNodes,
    useEdges,
    useHandleConnections,
    useConnection,
    useSvelteFlow,
  } from "@xyflow/svelte";
  const nodes = useNodes();
  const edges = useEdges();
  import { v4 as uuid } from "uuid";
  import { editFlow as editFlowDB, getCommand, getFlow } from "$lib/db";
  import { FlowType, NodeType, type _Object, type NODE } from "$lib/typings";
  import Play from "lucide-svelte/icons/play";
  import Pencil from "lucide-svelte/icons/pencil";
  import { fly } from "svelte/transition";
  import { getNode, performDelay, stopFlow } from "$lib/flow";
  import { tick } from "svelte";
  import { invoke } from "@tauri-apps/api/core";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  const wantToStop = $derived($flowRunning.running === false);
  const { getHandleConnections, updateNodeData } = useSvelteFlow();
  const flowResults = $state([]);
  async function triggerFlow(id: string) {
    const results: string[] = [];
    const { nodes, edges } = await getFlow(id);
    const startNodeId = "start";
    let edge = edges.find((edge) => edge.source === startNodeId)!;
    updateRunningFlow({ runningNode: startNodeId, running: true });
    const nodesData: _Object<any> = {};
    nodes.map((node) => {
      nodesData[node.id] = node.data;
    });
    let nodeToRun: NODE | undefined = undefined;

    await tick();
    while (!wantToStop || nodeToRun) {
      if (wantToStop || !edge) {
        stopFlow();
        break;
      }
      nodeToRun = getNode(nodes, edge.target);
      if (!nodeToRun) {
        stopFlow();
        break;
      }
      updateRunningFlow({ runningNode: nodeToRun.id });
      let connections = [];
      switch (nodeToRun.type) {
        case NodeType.START:
        case NodeType.END:
          break;
        case NodeType.DELAY:
          await performDelay(nodeToRun.data as any);
          break;
        case NodeType.COMMAND:
          connections = getHandleConnections({
            type: "target",
            nodeId: nodeToRun.id,
          });

          if (connections.length >= 1) {
            nodesData[connections[0].target] = {
              ...nodesData[connections[0].target],
              ...nodesData[connections[0].source],
            };
          }
          break;
        case NodeType.EXECUTE:
          connections = getHandleConnections({
            type: "target",
            nodeId: nodeToRun.id,
          });
          if (connections.length === 2) {
            let nodeData1 = nodesData[connections[0].source];
            let nodeData2 = nodesData[connections[1].source];
            if (!nodeData1.ips) {
              const temp = { ...nodeData1 };
              nodeData1 = { ...nodeData2 };
              nodeData2 = { ...temp };
            }
            const command = await getCommand(nodeData1.command);

            const ipsData = nodeData1.ips.map((ip: string) => ({
              ip: $ips[ip].IP,
              password: $ips[ip].PASSWORD,
            }));
            const res = await invoke("execute_command", {
              remoteHosts: ipsData,
              port: 22,
              remoteUser: "sas",
              command: command.COMMAND,
              args: nodeData2.args,
            });
            if (typeof res === "string") {
              results.push(res as string);
            } else {
              results.push(...(res as string[]));
            }
          }
          break;
        default:
          break;
      }
      edge = edges.find((ed) => ed.source === nodeToRun!.id)!;
    }
    updateRunningFlow({ results });
  }
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
              addNode({
                type: NodeType.DELAY,
                data: { unit: "ms", time: 100 },
              });
            }}
            class="w-full rounded-none justify-start"
            variant="ghost">Delay</Button
          >
          <Button
            onclick={() => {
              addNode({ type: NodeType.COMMAND, data: {} });
            }}
            class="w-full rounded-none justify-start"
            variant="ghost"
          >
            Command</Button
          >
          <Button
            onclick={() => {
              addNode({ type: NodeType.IP, data: { ips: [] } });
            }}
            class="w-full rounded-none justify-start"
            variant="ghost">IP</Button
          >

          <Button
            onclick={() => {
              addNode({ type: NodeType.ARGS, data: { args: "" } });
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
        </Popover.Content>
      </Popover.Root>
    {:else if $flowRunning.running}
      <Button
        onclick={stopFlow}
        size="icon"
        variant="default"
        class="hover:ring-2 bg-sidebar text-white hover:text-sidebar hover:bg-white"
        ><Stop /></Button
      >
    {:else}
      <Button
        onclick={() => {
          triggerFlow($flowEditing.ID);
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
      <Button
        onclick={clearCanvas}
        size="icon"
        variant="destructive"
        class="hover:ring-2"><Clear /></Button
      >
    {/if}
    {#if $flowRunning.results.length}
      <Dialog.Root open={true}>
        <Dialog.Trigger>Results</Dialog.Trigger>
        <Dialog.Content class="flex flex-col">
          {#each $flowRunning.results as result}
            <Dialog.Header
              class="flex mt-2"
            >
              <Dialog.Title>{result.command}</Dialog.Title>
              <Textarea class="h-40" value={result.result} readonly >{result.result}</Textarea>
            </Dialog.Header>
            <Separator />
          {/each}
        </Dialog.Content>
      </Dialog.Root>
    {/if}
  </section>
</section>
