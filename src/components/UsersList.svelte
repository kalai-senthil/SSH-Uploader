<script lang="ts">
  import {
    initIPS,
    ips,
    resetUtilsEditing,
    users,
    utilsEditing,
  } from "$lib/store";
  import { Utils, type IP, type USER } from "$lib/typings";
  import type { ColumnDef } from "@tanstack/table-core";
  import Copy from "lucide-svelte/icons/copy";
  import Delete from "lucide-svelte/icons/trash-2";
  import { onMount, tick } from "svelte";
  import IpDataTable from "./DataTable.svelte";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import {
    renderComponent,
    renderSnippet,
  } from "$lib/components/ui/data-table";
  import Button from "$lib/components/ui/button/button.svelte";
  import DataTableCheckbox from "$lib/components/ui/data-table/data-table-checkbox.svelte";
  export const columns: ColumnDef<USER>[] = [
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
      header: "Actions",
      cell({ row }) {
        return renderComponent(Actions, {
          data: row.original,
          performDelete: () => {
            deleteUser(row.original.ID);
          },
          performEdit: () => {
            utilsEditing.update((val) => ({
              ...val,
              type: Utils.USER,
              data: row.original,
              openEditDialog: true,
            }));
          },
        });
      },
    },
  ];
  import { deleteIP, deleteUser, editIP, editUser } from "$lib/db";

  import Actions from "./Actions.svelte";
  import EditActions from "./EditActions.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import SelectPasswords from "./SelectPasswords.svelte";
  let usersData = $derived(Object.values($users));
</script>

{#snippet listNo(no: number)}
  <span>{no}</span>
{/snippet}
{#snippet ipAddressCopy(ip: string)}
  <Button
    onclick={() => {
      navigator.clipboard.writeText(ip);
    }}
    variant="link">{ip} <Copy /></Button
  >
{/snippet}

{#snippet callout()}
  <Button class="w-full">Update User</Button>
{/snippet}

<EditActions
  description="Whenever you needed you can edit again!!"
  perform={() => {
    editUser($utilsEditing.data);
    tick().then(resetUtilsEditing);
  }}
  data={$utilsEditing.data}
  {callout}
>
  {#if $utilsEditing.data}
    <Label>Name</Label>
    <Input placeholder="Name" bind:value={$utilsEditing.data.NAME} />
  {/if}
</EditActions>
<IpDataTable data={usersData} {columns} />
