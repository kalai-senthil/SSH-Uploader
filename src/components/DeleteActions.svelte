<script lang="ts">
    import Actions from "./ActionsTrigger.svelte";
    import Delete from "lucide-svelte/icons/trash-2";
    import Button from "$lib/components/ui/button/button.svelte";
    let props = $props()
</script>

<Actions {...props} >
    <Button variant="destructive" size="icon">
        <Delete />
      </Button>
</Actions>
