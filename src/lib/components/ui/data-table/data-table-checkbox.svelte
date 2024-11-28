<script lang="ts">
  import type { ComponentProps } from "svelte";
  import Checkbox from "../checkbox/checkbox.svelte";

  let {
    checked = false,
    controlledChecked = true,
    ...restProps
  }: ComponentProps<typeof Checkbox> = $props();
</script>

<Checkbox {checked} {controlledChecked} {...restProps} />
