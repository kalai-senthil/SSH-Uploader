<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { addIP } from "$lib/db";
  import { addIPFormSchema, type AddIPFormSchema } from "$lib/schema";
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
      validators: zodClient(addIPFormSchema),
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
    addIP($formData.name, $formData.ip);
    closeDialog();
  }}
>
  <Form.Field {form} name="name">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Name</Form.Label>
        <Input
          {...props}
          placeholder="Personal PC"
          bind:value={$formData.name}
        />
      {/snippet}
    </Form.Control>
    <Form.Description>Name associated with IP</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="ip">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>IP</Form.Label>
        <Input {...props} placeholder="127.0.0.1" bind:value={$formData.ip} />
      {/snippet}
    </Form.Control>
    <Form.Description>IP Address xxx.xxx.xx.xx</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button class="w-full">Save</Form.Button>
</form>
