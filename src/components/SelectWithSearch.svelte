<script lang="ts">
  import Check from "lucide-svelte/icons/check";
  import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
  import { tick } from "svelte";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";
  type Data = {
    value: string;
    label: string;
  };
  type Props = {
    data: Data[];
    searchLabel?: string;
    selectedValue:any
  };
  let { data, searchLabel = "Search",selectedValue = $bindable()}: Props = $props();

  let open = $state(false);
  let value = $state("");
  let triggerRef = $state<HTMLButtonElement>(null!);

$effect(()=>{
  selectedValue = data.find((f) => f.value === value)?.label
})
  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger bind:ref={triggerRef}>
    {#snippet child({ props })}
      <Button
        variant="outline"
        class="justify-between"
        {...props}
        role="combobox"
        aria-expanded={open}
      >
        {selectedValue || searchLabel}
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="p-0">
    <Command.Root>
      <Command.Input placeholder={searchLabel} />
      <Command.List>
        <Command.Empty>Nothins found.</Command.Empty>
        <Command.Group>
          {#each data as row}
            <Command.Item
              value={row.value}
              onSelect={() => {
                value = row.value;
                closeAndFocusTrigger();
              }}
            >
              <Check
                class={cn(
                  "mr-2 size-4",
                  value !== row.value && "text-transparent",
                )}
              />
              {row.label}
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
