<script lang="ts">
  import UploadIcon from "lucide-svelte/icons/upload";
  import BadgePlus from "lucide-svelte/icons/badge-plus";
  import PageTitle from "./PageTitle.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import { open } from "@tauri-apps/plugin-dialog";
  import * as Select from "$lib/components/ui/select";
  import { ips, paths } from "$lib/store";
  import Label from "$lib/components/ui/label/label.svelte";
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
  import { Button } from "$lib/components/ui/button";
  import SelectWithSearch from "./SelectWithSearch.svelte";
  let uploadDirectory = $state(false);
  async function selectFileDialog() {
    const file = await open({
      multiple: false,
      directory: uploadDirectory,
    });
    uploadData.filePath = file;
  }
  let ipstoUpload = $state<string[]>([]);
  let pathsToUpload = $state<string[]>([]);
  let showCustomInputIP = $derived(ipstoUpload.includes("custom"));
  $effect(() => {
    if (showCustomInputIP) {
      ipstoUpload = ["custom"];
    }
    if (showCustomInputPath) {
      pathsToUpload = ["custom"];
    }
  });
  let showCustomInputPath = $derived(pathsToUpload.includes("custom"));
  let selectIPDialogOpen = $state(false);
  let selectPathDialogOpen = $state(false);
  let uploadData = $state({
    fileName: "",
    isFileNameSameAsUploadOne: false,
    filePath: undefined as null | string | undefined,
  });
  let fileSelected = $derived(uploadData.filePath !== undefined);
</script>

<section class="col-span-3">
  <PageTitle title="Upload File" delay={100} classNames="text-md" />
  <section class="border flex flex-col gap-2 rounded-md p-2">
    <div class="flex items-center gap-2 justify-between">
      <Label class="grow">Choose File/Directory</Label>
      <Checkbox disabled={fileSelected} bind:checked={uploadDirectory} />
      <Label>Include Directories</Label>
    </div>
    <div class="flex border rounded-md">
      <Input
        bind:value={uploadData.filePath}
        readonly
        class="grow border-none"
        placeholder="~/Desktop/file.txt"
      />
      {#if fileSelected}
        <Button
          onclick={() => (uploadData.filePath = undefined)}
          variant="destructive"
          class="rounded-s-none">Clear</Button
        >
      {:else}
        <Button
          onclick={selectFileDialog}
          variant="outline"
          class="rounded-s-none">Select</Button
        >
      {/if}
    </div>
    <Label>User</Label>
    <SelectWithSearch
      searchLabel="Search User"
      data={[
        { label: "sas", value: "sas" },
        { label: "serfas", value: "srgas" },
      ]}
    />
    <Select.Root
      open={selectIPDialogOpen && !showCustomInputIP}
      onOpenChange={(e) => (selectIPDialogOpen = e)}
      bind:value={ipstoUpload}
      type="multiple"
    >
      <Select.Trigger
        >{ipstoUpload.length
          ? ipstoUpload.join(",")
          : "Select IP"}</Select.Trigger
      >
      <Select.Content>
        {#each $ips as ip (ip.ID)}
          <Select.Item
            onclick={() => {
              if (showCustomInputIP) {
                ipstoUpload.splice(ipstoUpload.indexOf("custom"), 1);
              }
            }}
            value={ip.IP}>{ip.IP}</Select.Item
          >
        {/each}
        <Select.Item value="custom"
          ><BadgePlus class="size-4 -ml-6" />
          <span class="ml-2">Custom</span></Select.Item
        >
      </Select.Content>
      {#if showCustomInputIP}
        <Input placeholder="Give IP" />
      {/if}
    </Select.Root>
    <Select.Root
      open={selectPathDialogOpen && !showCustomInputPath}
      onOpenChange={(e) => (selectPathDialogOpen = e)}
      bind:value={pathsToUpload}
      type="multiple"
    >
      <Select.Trigger
        >{pathsToUpload.length
          ? pathsToUpload.join(",")
          : "Select Path"}</Select.Trigger
      >
      <Select.Content>
        {#each $paths as path (path.ID)}
          <Select.Item
            onclick={() => {
              if (showCustomInputPath) {
                pathsToUpload.splice(pathsToUpload.indexOf("custom"), 1);
              }
            }}
            value={path.PATH}>{path.PATH}</Select.Item
          >
        {/each}
        <Select.Item value="custom"
          ><BadgePlus class="size-4 -ml-6" />
          <span class="ml-2">Custom</span></Select.Item
        >
      </Select.Content>
      {#if showCustomInputPath}
        <Input placeholder="Give custom path" />
      {/if}
    </Select.Root>
    <Label>File Name</Label>
    <div class="flex">
      <Input
        disabled={uploadData.isFileNameSameAsUploadOne}
        placeholder="File Name"
      />
      <Button
        onclick={() =>
          (uploadData.isFileNameSameAsUploadOne =
            !uploadData.isFileNameSameAsUploadOne)}
        variant="ghost"
      >
        <Checkbox
          onclick={(e) => e.preventDefault()}
          bind:checked={uploadData.isFileNameSameAsUploadOne}
        />
        Same as file name
      </Button>
    </div>
    <Button class="w-full" variant="secondary"><UploadIcon /> Upload</Button>
  </section>
</section>
