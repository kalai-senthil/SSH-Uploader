<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { Textarea } from "$lib/components/ui/textarea";
  import { type Result } from "$lib/store";
  const { results, clear }: { results: Result[]; clear: any } = $props();
</script>

<Dialog.Root>
  {#if results.length}
    <Dialog.Trigger><Button variant="secondary">Results</Button></Dialog.Trigger
    >
  {/if}
  <Dialog.Content class="flex flex-col">
    <Dialog.Title>Results</Dialog.Title>

    {#each results as result}
      <Dialog.Header class="flex mt-2">
        <Dialog.Title class="text-sm  w-full">{result.command}</Dialog.Title>
        <Textarea class="max-h-40" value={result.result} readonly
          >{result.result}</Textarea
        >
      </Dialog.Header>
      <Separator />
    {/each}
    <Dialog.Close  onclick={clear}>
      <Button class="w-full" variant="destructive">Clear</Button>
    </Dialog.Close>
  </Dialog.Content>
</Dialog.Root>
