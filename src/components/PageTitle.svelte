<script lang="ts">
  import { cn } from "$lib/utils";
  import { fly, slide } from "svelte/transition";

  export let title: string;
  export let classNames: string = "";
  export let delay: number = 0;
</script>

<h3
  in:fly={{ y: 20, opacity: 0, delay }}
  class={cn("grow font-bold text-3xl mb-2", classNames)}
>
  {title}
</h3>
