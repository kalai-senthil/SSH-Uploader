<script lang="ts" generics="Data">
    import Actions from "./ActionsTrigger.svelte";
    import * as Dialog from "$lib/components/ui/dialog/index";
    import { utilsEditing } from "$lib/store";
    import type { WithChildren } from "bits-ui";
    import { Utils, type ActionsTriggerPropsWithCallOut } from "$lib/typings";
    let {children,callout,...props}:WithChildren<ActionsTriggerPropsWithCallOut<Data>> = $props();
</script>

<Dialog.Root
    onOpenChange={(e) => {
        $utilsEditing.openEditDialog = e
    }}
    controlledOpen
    open={$utilsEditing.openEditDialog}
>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Edit {$utilsEditing.type} </Dialog.Title>
        </Dialog.Header>
        <form class="flex flex-col gap-2">
            {@render children?.()}
            
            <Actions   {...props}  >
                {@render callout?.()}
            </Actions> 
        </form>
    </Dialog.Content>
</Dialog.Root>

