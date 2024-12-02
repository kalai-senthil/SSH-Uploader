<script lang="ts">
  import UploadIcon from "lucide-svelte/icons/upload";
  import BadgePlus from "lucide-svelte/icons/badge-plus";
  import Download from "lucide-svelte/icons/download";
  import PageTitle from "./PageTitle.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import { open } from "@tauri-apps/plugin-dialog";
  import * as Select from "$lib/components/ui/select";
  import { ips, passwords, paths, users } from "$lib/store";
  import Label from "$lib/components/ui/label/label.svelte";
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
  import { Button } from "$lib/components/ui/button";
  import SelectWithSearch from "./SelectWithSearch.svelte";
  import { invoke } from "@tauri-apps/api/core";
  import { path } from "@tauri-apps/api";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import { addIP, addPassword } from "$lib/db";
  async function selectFileDialog() {
    const file = await open({
      multiple: false,
      directory: true,
    });
    if (file) {
      uploadData.customLocalPath = file;
    }
  }
  let ipstoUpload = $state("");
  let pathsToUpload = $state<string>("");
  $effect(() => {
    if (showCustomInputPath) {
      pathsToUpload = "custom";
    }
  });
  let showCustomInputPath = $derived(pathsToUpload.includes("custom"));
  let selectRemotePathDialogOpen = $state(false);
  let selectLocalPathDialogOpen = $state(false);
  let uploadData = $state({
    fileName: "",
    isFileNameSameAsUploadOne: false,
    localDir: "",
    remoteFilePath: "",
    user: "",
    customPath: "",
    customLocalPath: "",
  });
  let showCustomLocalInputPath = $derived(
    uploadData?.localDir?.includes("custom") ?? false
  );
  import * as HoverCard from "$lib/components/ui/hover-card";
  import { fade } from "svelte/transition";
  import { tick } from "svelte";
  const ipsData = $derived(Object.values($ips));
  const usersData = $derived(Object.values($users));
  const pathsData = $derived(Object.values($paths));
  $effect(() => {
    (async () => {
      if (!uploadData.isFileNameSameAsUploadOne) return;
      uploadData.fileName = await path.basename(
        showCustomInputPath ? uploadData.customPath : pathsToUpload
      );
    })();
  });
  function clear() {
    uploadData = {
      fileName: "",
      isFileNameSameAsUploadOne: false,
      localDir: "",
      remoteFilePath: "",
      user: "",
      customPath: "",
      customLocalPath: "",
    };
    ipstoUpload = "";
    pathsToUpload = "";
  }
</script>

<section class="col-span-3">
  <PageTitle title="Download" delay={100} classNames="text-md" />
  <section class="border flex flex-col gap-2 rounded-md p-2">
    <SelectWithSearch
      type="single"
      bind:selectedValue={uploadData.user}
      searchLabel="Search User"
      data={usersData.map((user) => ({ label: user.NAME, value: user.ID }))}
    />
    <SelectWithSearch
      type="single"
      description={$ips[ipstoUpload]?.IP ?? ""}
      bind:selectedValue={ipstoUpload}
      searchLabel="Select IP"
      data={ipsData.map((ip) => ({
        value: ip.ID,
        label: ip.NAME,
        description: ip.IP,
      }))}
    />

    <Select.Root
      open={selectRemotePathDialogOpen && !showCustomInputPath}
      onOpenChange={(e) => (selectRemotePathDialogOpen = e)}
      bind:value={pathsToUpload}
      type="single"
    >
      <Select.Trigger
        >{pathsToUpload ? pathsToUpload : "Choose Path"}</Select.Trigger
      >
      <Select.Content>
        {#each pathsData as path (path.ID)}
          <Select.Item
            onclick={() => {
              if (showCustomInputPath) {
                pathsToUpload = path.PATH;
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
        <Input
          bind:value={uploadData.customPath}
          placeholder="Give custom path"
        />
      {/if}
    </Select.Root>
    <Label>Download Directory</Label>
    <Select.Root
      open={selectLocalPathDialogOpen && !showCustomLocalInputPath}
      onOpenChange={(e) => (selectLocalPathDialogOpen = e)}
      bind:value={uploadData.localDir}
      type="single"
    >
      <Select.Trigger
        >{uploadData.localDir
          ? uploadData.localDir
          : "Choose Path"}</Select.Trigger
      >
      <Select.Content>
        {#each pathsData as path (path.ID)}
          <Select.Item
            onclick={() => {
              if (showCustomLocalInputPath) {
                uploadData.localDir = path.PATH;
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
      {#if showCustomLocalInputPath}
        <div class="flex border rounded-md">
          <Input
            bind:value={uploadData.customLocalPath}
            class="grow border-none"
            placeholder="~/Desktop"
          />
          {#if uploadData.customLocalPath}
            <Button
              onclick={() => (uploadData.customLocalPath = "")}
              variant="destructive"
              class="rounded-s-none">Clear</Button
            >
          {:else}
            <Button
              onclick={selectFileDialog}
              variant="outline"
              class="rounded-s-none">Choose</Button
            >
          {/if}
        </div>
      {/if}
    </Select.Root>
    <Label>Filename</Label>
    <div class="flex">
      <Input
        disabled={uploadData.isFileNameSameAsUploadOne}
        placeholder="Name"
        bind:value={uploadData.fileName}
      />
      <Button
        onclick={async () => {
          uploadData.isFileNameSameAsUploadOne =
            !uploadData.isFileNameSameAsUploadOne;
          if (uploadData.isFileNameSameAsUploadOne) {
            uploadData.fileName = await path.basename(
              showCustomLocalInputPath ? uploadData.customPath : pathsToUpload!
            );
          } else {
            uploadData.fileName = "";
          }
        }}
        variant="ghost"
      >
        <Checkbox
          onclick={(e) => e.preventDefault()}
          bind:checked={uploadData.isFileNameSameAsUploadOne}
        />
        Same as file name
      </Button>
    </div>
    <div class="flex items-center gap-1">
      <Button
        onclick={async () => {
          const res = await invoke("download", {
            localDir: showCustomLocalInputPath
              ? uploadData.customLocalPath
              : uploadData.localDir,
            localFileName: uploadData.fileName,
            remoteUser: uploadData.user,
            remotePath: showCustomInputPath
              ? uploadData.customPath
              : pathsToUpload,
            port: 22,
            remoteHost: {
              ip: $ips[ipstoUpload].IP,
              password: $ips[ipstoUpload].PASSWORD,
            },
          });
          console.log(res);
          clear();
        }}
        class="w-full bg-violet-500 grow"
        variant="secondary"><Download /> Download</Button
      >
      <Button onclick={clear} variant="outline">Clear</Button>
    </div>
  </section>
</section>
