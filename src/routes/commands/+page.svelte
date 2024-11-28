<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index";
  import AddIP from "../../components/AddIP.svelte";
  import AddIcon from "lucide-svelte/icons/badge-plus";
  import PageTitle from "../../components/PageTitle.svelte";
  import IpList from "../../components/IPList.svelte";
  import AddCommand from "../../components/AddCommand.svelte";
  import CommandsList from "../../components/CommandsList.svelte";
  let addCommandDialogOpen = $state(false);
</script>

<section class="p-4">
  <section class="flex my-4 justify-between items-center">
    <PageTitle title="Commands" />
    <Dialog.Root
      onOpenChange={(e) => (addCommandDialogOpen = e)}
      open={addCommandDialogOpen}
    >
      <Dialog.Trigger
        ><Button variant="outline"><AddIcon /> Add Commands</Button
        ></Dialog.Trigger
      >
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Add New Command</Dialog.Title>

          <AddCommand on:closeDialog={(e) => (addCommandDialogOpen = false)} />
        </Dialog.Header>
      </Dialog.Content>
    </Dialog.Root>
  </section>
  <CommandsList />
</section>
