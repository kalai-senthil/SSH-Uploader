<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { addCommand, addIP } from "$lib/db";
  import { addCommandFormSchema } from "$lib/schema";
  import { createEventDispatcher } from "svelte";

  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";

  const form = superForm(
    {},
    {
      validators: zodClient(addCommandFormSchema),
    },
  );

  const { form: formData, enhance } = form;
  const dispatcher = createEventDispatcher();
  function closeDialog() {
    dispatcher("closeDialog");
  }
</script>

<form
  method="POST"
  on:submit={(e) => {
    e.preventDefault();
    if ($formData.name && $formData.command) {
      addCommand($formData.name, $formData.command);
      closeDialog();
    }
  }}
>
  <Form.Field {form} name="name">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Name</Form.Label>
        <Input {...props} placeholder="Run App" bind:value={$formData.name} />
      {/snippet}
    </Form.Control>
    <Form.Description>Name associated with Command</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="command">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Command</Form.Label>
        <Input
          {...props}
          placeholder="ps auxw"
          bind:value={$formData.command}
        />
      {/snippet}
    </Form.Control>
    <Form.Description>Command to execute</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button class="w-full">Save</Form.Button>
</form>
