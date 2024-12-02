<script lang="ts">
  import CommandExecute from "../components/CommandExecute.svelte";
  import Download from "../components/Download.svelte";
  import PageTitle from "../components/PageTitle.svelte";
  import Upload from "../components/Upload.svelte";
</script>

<section class="p-4">
  <PageTitle title="SSH Utils" classNames="text-5xl" />
  <section class="grid mt-4 gap-4 grid-cols-12">
    <Upload />
    <CommandExecute />
    <Download />
  </section>
</section>
