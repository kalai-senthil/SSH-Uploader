<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
  import { addIP } from "$lib/db";
  import { createEventDispatcher } from "svelte";

  import SelectWithSearch from "./SelectWithSearch.svelte";
  import { passwords } from "$lib/store";
  import Label from "$lib/components/ui/label/label.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { Description } from "$lib/components/ui/sheet";
    import SelectPasswords from "./SelectPasswords.svelte";

  let formData = $state({ name: "", password: "", ip: "" });
  const dispatcher = createEventDispatcher();
  function closeDialog() {
    dispatcher("closeDialog");
  }
  let passwordsKeys = Object.keys($passwords);
</script>

<form
  method="POST"
 
>
  <Label>Name</Label>
  <Input placeholder="Personal PC" bind:value={formData.name} />
  <Description>Name associated with IP</Description>
  <Label>IP</Label>
  <Input placeholder="127.0.0.1" bind:value={formData.ip} />
  <Description>IP Address xxx.xxx.xx.xx</Description>
  <Label>Password</Label>
  <SelectPasswords bind:value={formData.password} />
  <!-- <SelectWithSearch
    type="single"
    bind:selectedValue={formData.password}
    data={passwordsKeys.map((_pass) => {
      const pass = $passwords[_pass];
      return { value: pass.ID, label: `${pass.NAME} - ${pass.PASSWORD}` };
    })}
  /> -->
  <Description>Zax234!@#</Description>
  <Button 
  onclick={(e) => {
    addIP(formData.name, formData.ip,formData.password);
    closeDialog();
  }}
  class="w-full">Save</Button>
</form>
