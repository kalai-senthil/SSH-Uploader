<script>
    import { passwords } from "$lib/store";
    import SelectWithSearch from "./SelectWithSearch.svelte";
    let { value = $bindable(),searchLabel ="Search"} = $props();
    let passwordsKeys = Object.keys($passwords);
</script>

<SelectWithSearch
    type="single"
    searchLabel={searchLabel}
    bind:selectedValue={value}
    data={passwordsKeys.map((_pass) => {
        const pass = $passwords[_pass];
        return { value: pass.ID, label: pass.NAME,description:pass.PASSWORD };
    })}
/>
