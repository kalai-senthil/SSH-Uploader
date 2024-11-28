<script lang="ts">
  import { paths, resetUtilsEditing, utilsEditing } from "$lib/store";
  import { Utils, type PATH } from "$lib/typings";
  import type { ColumnDef } from "@tanstack/table-core";
  import Copy from "lucide-svelte/icons/copy";
  import Delete from "lucide-svelte/icons/trash-2";
  import { onMount, tick } from "svelte";
  import IpDataTable from "./DataTable.svelte";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { renderComponent, renderSnippet } from "$lib/components/ui/data-table";
  import Button from "$lib/components/ui/button/button.svelte";
  import DataTableCheckbox from "$lib/components/ui/data-table/data-table-checkbox.svelte";
  export const columns: ColumnDef<PATH>[] = [
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
      accessorKey: "PATH",
      header: "Path",
      enableColumnFilter: true,

      enableGlobalFilter: true,

      cell({ row }) {
        return renderSnippet(commandCopy, row.original.PATH);
      },
    },
    {
      header: "Actions",
      cell({ row }) {
        return renderComponent(Actions, {
          data: row.original,
          performDelete: () => {
            deletePath(row.original.ID);
          },
          performEdit: () => {
            utilsEditing.update((val) => ({
              ...val,
              type: Utils.PATH,
              data: row.original,
              openEditDialog: true,
            }));
          },
        });
      },
    },
  ];
  import { deletePath, editPath } from "$lib/db";
    import Actions from "./Actions.svelte";
    import EditActions from "./EditActions.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
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
  <Button class="w-full">Update Path</Button>
{/snippet}
<EditActions
  description="Whenever you needed you can edit again!!"
  perform={() => {
    editPath($utilsEditing.data);
    tick().then(resetUtilsEditing)
  }}
  data={$utilsEditing.data}
  {callout}
>
  {#if $utilsEditing.data}
    <Label>Name</Label>
    <Input placeholder="Name" bind:value={$utilsEditing.data.NAME} />
    <Label>Path</Label>
    <Input placeholder="Path" bind:value={$utilsEditing.data.PATH} />
  {/if}
</EditActions>
<IpDataTable data={$paths} {columns} />
