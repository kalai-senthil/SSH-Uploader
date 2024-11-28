<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { initCommands, initIPS } from "$lib/store";
  import "../app.css";
  import Navbar from "../components/Navbar.svelte";
  import "../css/main.css";
  initCommands();
  initIPS();
</script>

<Sidebar.Provider>
  <Navbar />
  <main class="w-full">
    <Sidebar.Trigger />
    <slot />
  </main>
</Sidebar.Provider>
