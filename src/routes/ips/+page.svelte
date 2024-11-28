<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index";
  import AddIP from "../../components/AddIP.svelte";
  import AddIcon from "lucide-svelte/icons/badge-plus";
  import PageTitle from "../../components/PageTitle.svelte";
  import IpList from "../../components/IPList.svelte";
  let addIPDialogOpen = $state(false);
</script>

<section class="p-4">
  <section class="flex my-4 justify-between items-center">
    <PageTitle title="IP Address" />
    <Dialog.Root
    controlledOpen
      onOpenChange={(e) => (addIPDialogOpen = e)}
      open={addIPDialogOpen}
    >
      <Dialog.Trigger
        ><Button variant="outline"><AddIcon /> Add IP</Button></Dialog.Trigger
      >
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Add New IP address</Dialog.Title>

          <AddIP on:closeDialog={(e) => (addIPDialogOpen = false)} />
        </Dialog.Header>
      </Dialog.Content>
    </Dialog.Root>
  </section>
  <IpList />
</section>
