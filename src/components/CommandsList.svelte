<script lang="ts">
  import { commands, initCommands } from "$lib/store";
  import type { COMMAND } from "$lib/typings";
  import type { ColumnDef } from "@tanstack/table-core";
  import Copy from "lucide-svelte/icons/copy";
  import Delete from "lucide-svelte/icons/trash-2";
  import { onMount } from "svelte";
  import IpDataTable from "./DataTable.svelte";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { renderSnippet } from "$lib/components/ui/data-table";
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
        return renderSnippet(deleteCommandSnippet, row.original);
      },
    },
  ];
  import { deleteCommand } from "$lib/db";
</script>

{#snippet listNo(no: number)}
  <span>{no}</span>
{/snippet}
{#snippet deleteCommandSnippet(ip: COMMAND)}
  <AlertDialog.Root>
    <AlertDialog.Trigger
      ><Button variant="destructive" size="icon">
        <Delete />
      </Button></AlertDialog.Trigger
    >
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
        <AlertDialog.Description>
          This action cannot be undone.
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
        <AlertDialog.Action
          onclick={() => {
            deleteCommand(ip.ID);
          }}>Continue</AlertDialog.Action
        >
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
{/snippet}
{#snippet commandCopy(command: string)}
  <Button
    onclick={() => {
      navigator.clipboard.writeText(command);
    }}
    variant="link">{command} <Copy /></Button
  >
{/snippet}

<IpDataTable data={$commands} {columns} />
