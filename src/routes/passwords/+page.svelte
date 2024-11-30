<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index";
  import AddIP from "../../components/AddIP.svelte";
  import AddIcon from "lucide-svelte/icons/badge-plus";
  import PageTitle from "../../components/PageTitle.svelte";
  import IpList from "../../components/IPList.svelte";
  import AddCommand from "../../components/AddCommand.svelte";
  import CommandsList from "../../components/CommandsList.svelte";
  import PathsList from "../../components/PathsList.svelte";
  import AddPath from "../../components/AddPath.svelte";
    import PasswordList from "../../components/PasswordList.svelte";
    import AddPassword from "../../components/AddPassword.svelte";
  let addPasswordDialogOpen = $state(false);
</script>

<section class="p-4">
  <section class="flex my-4 justify-between items-center">
    <PageTitle title="Passwords" />
    <Dialog.Root
      controlledOpen
      onOpenChange={(e) => (addPasswordDialogOpen = e)}
      open={addPasswordDialogOpen}
    >
      <Dialog.Trigger
        ><Button variant="outline"><AddIcon /> Add Passwords</Button
        ></Dialog.Trigger
      >
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Add Password</Dialog.Title>

          <AddPassword on:closeDialog={() => (addPasswordDialogOpen = false)} />
        </Dialog.Header>
      </Dialog.Content>
    </Dialog.Root>
  </section>
  <PasswordList />
</section>
