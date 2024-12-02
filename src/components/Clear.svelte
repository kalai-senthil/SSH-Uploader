<script>
  import Button from "$lib/components/ui/button/button.svelte";
  import ClearIcon from "lucide-svelte/icons/x";

  import { flyAndScale } from "$lib/utils";
  const { clear } = $props();
</script>

<section transition:flyAndScale>
  <Button
    onclick={clear}
    variant="destructive"
    size="icon"
    class="aspect-square"><ClearIcon /></Button
  >
</section>
