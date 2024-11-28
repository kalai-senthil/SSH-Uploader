<script lang="ts">
  import PageTitle from "../components/PageTitle.svelte";
  import Upload from "../components/Upload.svelte";
</script>

<section class="p-4">
  <PageTitle title="SSH Uploader" classNames="text-5xl" />
  <section class="grid mt-4 grid-cols-12">
    <Upload />
  </section>
</section>
