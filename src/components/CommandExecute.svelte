<script lang="ts">
  import Close from "lucide-svelte/icons/circle-x";
  import Execute from "lucide-svelte/icons/terminal";
  import PageTitle from "./PageTitle.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import { commands, ips, passwords, paths } from "$lib/store";
  import Label from "$lib/components/ui/label/label.svelte";
  import { Button } from "$lib/components/ui/button";
  import SelectWithSearch from "./SelectWithSearch.svelte";
  import { invoke } from "@tauri-apps/api/core";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import { addIP, addPassword } from "$lib/db";
  let ipstoUpload = $state<string[]>([]);
  let showCustomInputIP = $derived(ipstoUpload.includes("custom"));
  $effect(() => {
    if (showCustomInputIP) {
      ipstoUpload = ["custom"];
    }
  });
  let uploadData = $state({
    user: "",
    command: "",
    args: "",
  });
  import * as HoverCard from "$lib/components/ui/hover-card";
  import { fade } from "svelte/transition";
  import { tick } from "svelte";
  import Loading from "./Loading.svelte";
  let textAreaElement = $state<string>("");
  let loading = $state<boolean>(false);
  $effect(() => {
    // @ts-ignore
    if (ipstoUpload === "") {
      ipstoUpload = [];
    }
  });
  const ipsData = $derived(Object.values($ips));
  const commandsData = $derived(Object.values($commands));
  function clear() {
    uploadData.user = "";
    uploadData = {
      user: "",
      args: "",
      command: "",
    };
    ipstoUpload = [];
    loading = false;
  }
</script>

<section class="col-span-3">
  <PageTitle title="Execute" delay={100} classNames="text-md" />
  <section class="border flex flex-col gap-2 rounded-md p-2">
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
                const { data: password } = await addPassword(pass, pass);
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
    <SelectWithSearch
      type="single"
      bind:selectedValue={uploadData.command}
      searchLabel="Select Command"
      data={commandsData.map((command) => ({
        value: command.ID,
        label: command.NAME,
        description: command.COMMAND,
      }))}
    />
    <Input placeholder="Args" bind:value={uploadData.args} />
    {#if uploadData.command}
      <Label>{$commands[uploadData.command].COMMAND} {uploadData.args}</Label>
    {/if}
    <div class="flex items-center gap-1">
      <Button
        onclick={async () => {
          if (
            uploadData.command &&
            $commands[uploadData.command].COMMAND &&
            ipstoUpload.length > 0
          ) {
            loading = true;
            const res = await invoke("execute_command", {
              command: $commands[uploadData.command].COMMAND,
              remoteUser: uploadData.user,
              port: 22,
              remoteHosts: ipstoUpload.map((ip) => ({
                ip: $ips[ip].IP,
                password: $ips[ip].PASSWORD,
              })),
              args: uploadData.args,
            });
            clear();
            loading = false;
          }
        }}
        class="w-full bg-violet-500"
        variant="secondary"
      >
        {#if loading}
          <Loading />
        {/if}
        <Execute />
        Execute</Button
      >
      <Button onclick={clear} variant="outline">Clear</Button>
    </div>
  </section>
</section>
