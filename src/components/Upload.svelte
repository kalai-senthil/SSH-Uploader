<script lang="ts">
  import UploadIcon from "lucide-svelte/icons/upload";
  import BadgePlus from "lucide-svelte/icons/badge-plus";
  import Close from "lucide-svelte/icons/circle-x";
  import PageTitle from "./PageTitle.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import { open } from "@tauri-apps/plugin-dialog";
  import * as Select from "$lib/components/ui/select";
  import { ips, passwords, paths } from "$lib/store";
  import Label from "$lib/components/ui/label/label.svelte";
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import SelectWithSearch from "./SelectWithSearch.svelte";
  import { invoke } from "@tauri-apps/api/core";
  import { path } from "@tauri-apps/api";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import { cn } from "$lib/utils";
  import { ScrollArea } from "bits-ui";
  import { addIP, addPassword } from "$lib/db";
  let uploadDirectory = $state(false);
  async function selectFileDialog() {
    const file = await open({
      multiple: false,
      directory: uploadDirectory,
    });
    uploadData.filePath = file;
  }
  let ipstoUpload = $state<string[]>([]);
  let pathsToUpload = $state<string>("");
  let showCustomInputIP = $derived(ipstoUpload.includes("custom"));
  $effect(() => {
    if (showCustomInputIP) {
      ipstoUpload = ["custom"];
    }
    if (showCustomInputPath) {
      pathsToUpload = "custom";
    }
  });
  let showCustomInputPath = $derived(pathsToUpload.includes("custom"));
  let selectIPDialogOpen = $state(false);
  let selectPathDialogOpen = $state(false);
  let uploadData = $state({
    fileName: "",
    isFileNameSameAsUploadOne: false,
    filePath: undefined as null | string | undefined,
    remoteFilePath: "",
    user: "",
    customPath:""
  });
  import * as HoverCard from "$lib/components/ui/hover-card";
  import { fade } from "svelte/transition";
  import { tick } from "svelte";
  let textAreaElement = $state<string>("");
  let fileSelected = $derived(uploadData.filePath !== undefined);
  $effect(() => {
    // @ts-ignore
    if (ipstoUpload === "") {
      ipstoUpload = [];
    }
  });
  const ipsData = $derived(Object.values($ips));
  const ipsIds = $derived(Object.keys($ips));
  const pathsData = $derived(Object.values($paths));
  const pathsIds = $derived(Object.keys($paths));
  function clear() {
    uploadData = {
      fileName: "",
      isFileNameSameAsUploadOne: false,
      filePath: undefined as null | string | undefined,
      remoteFilePath: "",
      user: "",
      customPath:""
    };
    ipstoUpload = []
    pathsToUpload = ""
  }
</script>

<section class="col-span-4">
  <PageTitle title="Upload" delay={100} classNames="text-md" />
  <section class="border flex flex-col gap-2 rounded-md p-2">
    <div class="flex items-center gap-2 justify-between">
      <Label class="grow">Choose File/Directory</Label>
      <Checkbox disabled={fileSelected} bind:checked={uploadDirectory} />
      <Label>Include Directories</Label>
    </div>
    <div class="flex border rounded-md">
      <Input
        bind:value={uploadData.filePath}
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
    <SelectWithSearch
      type="single"
      bind:selectedValue={uploadData.user}
      searchLabel="Search User"
      data={[{ label: "sas", value: "sas" }]}
    />
    <SelectWithSearch
      type="multiple"
      bind:selectedValue={ipstoUpload}
      searchLabel="Select IPS"
      data={ipsData.map((ip) => ({
        value: ip.ID,
        label: ip.NAME,
        description: ip.IP,
      }))}
    />
    <section class="border rounded-md p-2 grid grid-cols-2 resize-y gap-1">
      {#each ipstoUpload as ip, idx (ip)}
        <Button
          onclick={() => {
            ipstoUpload.splice(idx, 1);
          }}
          variant="secondary"
          class="rounded-sm flex w-full justify-between items-center"
        >
          <HoverCard.Root>
            <HoverCard.Trigger class="underline"
              >{$ips[ip].NAME}</HoverCard.Trigger
            >
            <HoverCard.Content class="w-fit">
              <span in:fade>{$ips[ip].IP}</span>
            </HoverCard.Content>
          </HoverCard.Root>

          <Close />
        </Button>
      {/each}
      <Textarea
        bind:value={textAreaElement}
        oninput={async (val: any) => {
          if (val.data === " ") {
            if (!ipstoUpload.includes(textAreaElement)) {
              if (textAreaElement.split(",").length === 2) {
                const [ip, pass] = textAreaElement.split(",");
                const { success, data: password } = await addPassword(
                  pass,
                  pass,
                );
                const resp = await addIP(ip, ip, password!.id);
                if (resp.data) {
                  tick().then(() => {
                    ipstoUpload.push(resp.data.id);
                  });
                }
              }
            }
            textAreaElement = "";
          }
        }}
        class="inline-block min-h-0 ring-transparent border-none resize-none focus-visible:ring-transparent"
        placeholder="IP List"
      />
    </section>
    <!-- <Select.Root
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
    </Select.Root> -->
    <Select.Root
      open={selectPathDialogOpen && !showCustomInputPath}
      onOpenChange={(e) => (selectPathDialogOpen = e)}
      bind:value={pathsToUpload}
      type="single"
    >
      <Select.Trigger
        >{
           pathsToUpload?pathsToUpload
          : "Choose Path"}</Select.Trigger
      >
      <Select.Content>
        {#each pathsData as path (path.ID)}
          <Select.Item
            onclick={() => {
              if (showCustomInputPath) {
                pathsToUpload = path.PATH
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
        <Input bind:value={uploadData.customPath} placeholder="Give custom path" />
      {/if}
    </Select.Root>
    <Label>Name</Label>
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
            uploadData.fileName = await path.basename(uploadData.filePath!);
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
    <Button
      onclick={async () => {
        const res = await invoke("upload_file", {
          localFilePath: uploadData.filePath,
          remoteUser: uploadData.user,
          remotePath: showCustomInputPath? uploadData.customPath:pathsToUpload,
          port: 22,
          remoteHosts: ipstoUpload.map((ip) => ({
            ip: $ips[ip].IP,
            password: $ips[ip].PASSWORD,
          })),
          remoteFileName: uploadData.fileName,
        });
        console.log(res);
        
        clear();
      }}
      class="w-full"
      variant="secondary"><UploadIcon /> Upload</Button
    >
  </section>
</section>
