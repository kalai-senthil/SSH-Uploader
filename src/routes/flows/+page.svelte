<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index";
  import AddIP from "../../components/AddIP.svelte";
  import AddIcon from "lucide-svelte/icons/badge-plus";
  import PageTitle from "../../components/PageTitle.svelte";
  import IpList from "../../components/IPList.svelte";
  import AddCommand from "../../components/AddCommand.svelte";
  import CommandsList from "../../components/CommandsList.svelte";
  import PathsList from "../../components/PathsList.svelte";
  import AddPath from "../../components/AddPath.svelte";
  import FlowList from "../../components/FlowList.svelte";
  let addPathDialogOpen = $state(false);
</script>

<section class="p-4">
  <section class="flex my-4 justify-between items-center">
    <PageTitle title="Flows" />
    <Button variant="outline"
      ><AddIcon />
      <a href="/flow">Create Flow</a>
    </Button>
  </section>
  <FlowList />
</section>
