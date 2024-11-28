<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { initCommands, initIPS, initPaths } from "$lib/store";
  import "../app.css";
  import Navbar from "../components/Navbar.svelte";
  import "../css/main.css";
  initCommands();
  initIPS();
  initPaths();
</script>

<Sidebar.Provider>
  <Navbar />
  <main class="w-full">
    <Sidebar.Trigger />
    <slot />
  </main>
</Sidebar.Provider>
