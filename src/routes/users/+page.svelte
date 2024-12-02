<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index";
  import AddIP from "../../components/AddIP.svelte";
  import AddIcon from "lucide-svelte/icons/badge-plus";
  import PageTitle from "../../components/PageTitle.svelte";
  import IpList from "../../components/IPList.svelte";
  import UsersList from "../../components/UsersList.svelte";
  import AddUser from "../../components/AddUser.svelte";
  let addUserDialogOpen = $state(false);
</script>

<section class="p-4">
  <section class="flex my-4 justify-between items-center">
    <PageTitle title="Users" />
    <Dialog.Root
    controlledOpen
      onOpenChange={(e) => (addUserDialogOpen = e)}
      open={addUserDialogOpen}
    >
      <Dialog.Trigger
        ><Button variant="outline"><AddIcon /> Add User</Button></Dialog.Trigger
      >
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Create User</Dialog.Title>

          <AddUser on:closeDialog={(e) => (addUserDialogOpen = false)} />
        </Dialog.Header>
      </Dialog.Content>
    </Dialog.Root>
  </section>
  <UsersList />
</section>
