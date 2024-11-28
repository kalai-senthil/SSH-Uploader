<script lang="ts" generics="Data">
    import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
    import type { ActionsTriggerProps } from "$lib/typings";
    import type { WithChildren } from "bits-ui";
    import { tick } from "svelte";
    let trigger = $state<HTMLButtonElement>(null!);
    let {
        perform,
        title = "Are you absolutely sure?",
        description = "This action cannot be undone.",
        children,
    }: WithChildren<ActionsTriggerProps<Data>> = $props();
</script>

<AlertDialog.Root>
    <AlertDialog.Trigger >
        {@render children?.()}
    </AlertDialog.Trigger>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>{title}</AlertDialog.Title>
            <AlertDialog.Description>
                {description}
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Cancel bind:ref={trigger}>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action
                onclick={() => {
                    tick().then(() => {
                        trigger.click();
                    });
                    perform()
                }}>Continue</AlertDialog.Action
            >
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
