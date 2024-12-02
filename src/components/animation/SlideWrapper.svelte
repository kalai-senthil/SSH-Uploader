<script>
  import { sineIn } from "svelte/easing";
  import { slide } from "svelte/transition";
</script>

<section transition:slide={{ duration: 300, easing: sineIn }}>
  <slot />
</section>
