<script lang="ts">
  import { commands, initCommands, resetUtilsEditing, utilsEditing } from "$lib/store";
  import { Utils, type COMMAND } from "$lib/typings";
  import type { ColumnDef } from "@tanstack/table-core";
  import Copy from "lucide-svelte/icons/copy";
  import Delete from "lucide-svelte/icons/trash-2";
  import { onMount, tick } from "svelte";
  import IpDataTable from "./DataTable.svelte";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { renderComponent, renderSnippet } from "$lib/components/ui/data-table";
  import Button from "$lib/components/ui/button/button.svelte";
  import DataTableCheckbox from "$lib/components/ui/data-table/data-table-checkbox.svelte";
  export const columns: ColumnDef<COMMAND>[] = [
    // {
    //   id: "select",
    //   header: ({ table }) =>
    //     renderComponent(DataTableCheckbox, {
    //       checked: table.getIsAllPageRowsSelected(),
    //       indeterminate:
    //         table.getIsSomePageRowsSelected() &&
    //         !table.getIsAllPageRowsSelected(),
    //       onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
    //       "aria-label": "Select all",
    //     }),
    //   cell: ({ row }) =>
    //     renderComponent(DataTableCheckbox, {
    //       checked: row.getIsSelected(),
    //       onCheckedChange: (value) => row.toggleSelected(!!value),
    //       "aria-label": "Select row",
    //     }),
    // },
    {
      accessorKey: "ID",
      header: "#",
      enableGlobalFilter: true,
      enableColumnFilter: true,
      cell(props) {
        return renderSnippet(listNo, props.row.index + 1);
      },
    },
    {
      accessorKey: "NAME",
      header: "Name",
      enableGlobalFilter: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: "COMMAND",
      header: "Command",
      enableColumnFilter: true,

      enableGlobalFilter: true,

      cell({ row }) {
        return renderSnippet(commandCopy, row.original.COMMAND);
      },
    },
    {
      header: "Actions",
      cell({ row }) {
        return renderComponent(Actions, {
          data: row.original,
          performDelete: () => {
            deleteCommand(row.original.ID);
          },
          performEdit: () => {
            utilsEditing.update((val)=>({...val,type:Utils.COMMAND,data:row.original,openEditDialog:true}))
          },
        });
      },
    },
    
  ];
  import { deleteCommand, editCommand } from "$lib/db";
    import Actions from "./Actions.svelte";
    import EditActions from "./EditActions.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
</script>

{#snippet listNo(no: number)}
  <span>{no}</span>
{/snippet}

{#snippet commandCopy(command: string)}
  <Button
    onclick={() => {
      navigator.clipboard.writeText(command);
    }}
    variant="link">{command} <Copy /></Button
  >
{/snippet}

{#snippet callout()}
  <Button class="w-full">Update Command</Button>
{/snippet}
<EditActions
  description="Whenever you needed you can edit again!!"
  perform={() => {
    editCommand($utilsEditing.data);
    tick().then(resetUtilsEditing)
  }}
  data={$utilsEditing.data}
  {callout}
>
  {#if $utilsEditing.data}
    <Label>Name</Label>
    <Input placeholder="Name" bind:value={$utilsEditing.data.NAME} />
    <Label>Command</Label>
    <Input placeholder="Command" bind:value={$utilsEditing.data.COMMAND} />
  {/if}
</EditActions>
<IpDataTable data={$commands} {columns} />
