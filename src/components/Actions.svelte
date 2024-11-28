<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import DeleteActions from "./DeleteActions.svelte";
    import Edit from "lucide-svelte/icons/pencil";
    let { performDelete,performEdit, ...props } = $props();
    
</script>

<section>
    <DeleteActions {...props} perform={performDelete} />
    <Button onclick={performEdit} variant="secondary"><Edit /> </Button>
</section>
