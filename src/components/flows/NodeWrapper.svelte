<script lang="ts">
  import { copyNode, deleteNode, flowEditing, nodesSelected } from "$lib/store";
  import { cn } from "$lib/utils";
  import { Handle, Position, useSvelteFlow } from "@xyflow/svelte";
  import { fly } from "svelte/transition";
  import Delete from "lucide-svelte/icons/trash-2";
  import Copy from "lucide-svelte/icons/copy";
  import Button from "$lib/components/ui/button/button.svelte";
  import { FlowType } from "$lib/typings";
  const { children, nodeId, leftHandle = true, rightHandle = true } = $props();
  const selected = $derived($nodesSelected === nodeId);
  const { deleteElements } = useSvelteFlow();
  const isRunMode = $derived($flowEditing.type === FlowType.RUN);
</script>

<section class={cn("w-96", isRunMode && "opacity-90")}>
  <div
    class={cn(
      "flex justify-end w-full relative gap-2",
      isRunMode && "invisible"
    )}
  >
    <Button
      class={cn("slide [--animation-delay:50ms]", selected && "active")}
      onclick={() => copyNode(nodeId)}
      size="icon"
      variant="secondary"
    >
      <Copy />
    </Button>
    <Button
      class={cn("slide", selected && "active")}
      onclick={async () => await deleteElements({ nodes: [nodeId] })}
      size="icon"
      variant="destructive"
    >
      <Delete />
    </Button>
  </div>
  <section
    class={cn(
      "relative bg-sidebar rounded-lg transition-all  border",
      selected && "border-violet-400"
    )}
  >
    {#if leftHandle}
      <Handle type="target" position={Position.Left} />
    {/if}
    <section
      transition:fly={{ delay: 500, opacity: 0, y: 20 }}
      class="p-4 rounded-md"
    >
      {@render children?.()}
    </section>
    {#if rightHandle}
      <Handle type="source" position={Position.Right} />
    {/if}
  </section>
</section>
