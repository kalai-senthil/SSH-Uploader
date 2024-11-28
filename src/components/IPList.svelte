<script lang="ts">
  import { initIPS, ips } from "$lib/store";
  import type { IP } from "$lib/typings";
  import type { ColumnDef } from "@tanstack/table-core";
  import Copy from "lucide-svelte/icons/copy";
  import Delete from "lucide-svelte/icons/trash-2";
  import { onMount } from "svelte";
  import IpDataTable from "./DataTable.svelte";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import {
    renderComponent,
    renderSnippet,
  } from "$lib/components/ui/data-table";
  import Button from "$lib/components/ui/button/button.svelte";
  import DataTableCheckbox from "$lib/components/ui/data-table/data-table-checkbox.svelte";
  export const columns: ColumnDef<IP>[] = [
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
      accessorKey: "IP",
      header: "IP Address",
      enableColumnFilter: true,

      enableGlobalFilter: true,

      cell({ row }) {
        return renderSnippet(ipAddressCopy, row.original.IP);
      },
    },
    {
      header: "Actions",
      cell({ row }) {
        return renderSnippet(deleteIPSnippet, row.original);
      },
    },
  ];
  import { deleteIP } from "$lib/db";
</script>

{#snippet listNo(no: number)}
  <span>{no}</span>
{/snippet}
{#snippet deleteIPSnippet(ip: IP)}
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
            deleteIP(ip.ID);
          }}>Continue</AlertDialog.Action
        >
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
{/snippet}
{#snippet ipAddressCopy(ip: string)}
  <Button
    onclick={() => {
      navigator.clipboard.writeText(ip);
    }}
    variant="link">{ip} <Copy /></Button
  >
{/snippet}

<IpDataTable data={$ips} {columns} />
