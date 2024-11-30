<script lang="ts">
  import { editFlow, flowEditing, flows, runFlow } from "$lib/store";
  import Copy from "lucide-svelte/icons/copy";
  import Play from "lucide-svelte/icons/play";
  import { goto } from "$app/navigation";
  import Button from "$lib/components/ui/button/button.svelte";

  import { copyFlow, deleteFlow } from "$lib/db";
  import Actions from "./Actions.svelte";
  import { fly } from "svelte/transition";
  let flowsData = $derived(Object.values($flows));
</script>

<section class="grid gap-4 grid-cols-12">
  {#each flowsData as flow,idx (flow.ID)}
    <section
    in:fly={{y:50,duration:300,opacity:0,delay:Math.min(idx*20,300)}}
    out:fly={{y:-10,duration:300,opacity:0}}
      class="border flex flex-col gap-2 col-span-12 md:col-span-6 lg:col-span-3 p-3 rounded-md"
    >
      <h3 class="text-xl font-bold">{flow.NAME}</h3>
      <section class="flex gap-1 items-center justify-start">
        <Button onclick={()=>{
          runFlow(flow)
          goto("flow")
        }} variant="default" class="grow bg-violet-500 text-white hover:bg-violet-500/80"><Play /> Run</Button>
        <Button
          onclick={() => copyFlow(flow.ID)}
          variant="secondary"
          size="icon"><Copy /></Button
        >
        <Actions
          performDelete={() => deleteFlow(flow.ID)}
          performEdit={() => {
            editFlow(flow);
            goto("flow");
          }}
        />
      </section>
    </section>
  {/each}
</section>
