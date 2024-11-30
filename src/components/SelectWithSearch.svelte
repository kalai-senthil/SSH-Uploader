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
    description?: string;
    className?: string;
  };
  type Props = {
    data: Data[];
    searchLabel?: string;
    selectedValue: any;
    disabled?: any;
    type: "single" | "multiple";
  };
  let {
    data,
    searchLabel = "Search",
    selectedValue = $bindable(),
    disabled = $bindable(),
    type = "single",
  }: Props = $props();

  let open = $state(false);
  let triggerRef = $state<HTMLButtonElement>(null!);
  let value = $state();
  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }
  $effect(() => {
    if (type === "multiple") return;
    if (selectedValue !== value && selectedValue === "") {
      value = "";
    }
  });
</script>

<Popover.Root bind:open>
  <Popover.Trigger {disabled} class="w-full" bind:ref={triggerRef}>
    {#snippet child({ props })}
      <Button
        variant="outline"
        {...props}
        class="justify-between w-full"
        role="combobox"
        aria-expanded={open}
      >
        <span>
          {type === "single" ? value || searchLabel : searchLabel}
        </span>
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="p-0">
    <Command.Root>
      <Command.Input placeholder={searchLabel} />
      <Command.List>
        <Command.Empty>Nothing found.</Command.Empty>
        <Command.Group>
          {#each data as row}
            <Command.Item
              value={row.value}
              onSelect={() => {
                const _value = row.value;
                if (type === "multiple") {
                  if (selectedValue.includes(_value)) {
                    selectedValue.splice(selectedValue.indexOf(_value), 1);
                  } else {
                    selectedValue.push(_value);
                  }
                  selectedValue = [...selectedValue];
                } else {
                  if (selectedValue === _value) {
                    value = "";
                    selectedValue = "";
                  } else {
                    value = row.label;
                    selectedValue = _value;
                  }
                }
                closeAndFocusTrigger();
              }}
            >
              <Check
                class={cn(
                  "mr-2 size-4",
                  !selectedValue.includes(row.value) && "text-transparent"
                )}
              />
              {row.label}
              <span class="font-black">
                {row.description ? `- ${row.description}` : ""}</span
              >
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
