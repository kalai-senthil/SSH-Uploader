<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
  import { addUser } from "$lib/db";
  import { createEventDispatcher } from "svelte";

  import Label from "$lib/components/ui/label/label.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  let formData = $state({ name: "" });
  const dispatcher = createEventDispatcher();
  function closeDialog() {
    dispatcher("closeDialog");
  }
</script>

<form
  onsubmit={(e) => {
    e.preventDefault();
    addUser(formData.name);
    closeDialog();
  }}
  method="POST"
  class="flex flex-col gap-2"
>
  <Label>Name</Label>
  <Input placeholder="personal" bind:value={formData.name} />
  <Button
    onclick={(e) => {
      addUser(formData.name);
      closeDialog();
    }}
    class="w-full">Save</Button
  >
</form>
