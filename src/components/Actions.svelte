<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import DeleteActions from "./DeleteActions.svelte";
    import Edit from "lucide-svelte/icons/pencil";
    let { performDelete,performEdit, ...props } = $props();
    
</script>

<section>
    <Button onclick={performEdit} variant="secondary" size="icon"><Edit /> </Button>
    <DeleteActions {...props} perform={performDelete} />
</section>
