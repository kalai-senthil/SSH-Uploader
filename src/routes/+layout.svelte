<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { initCommands, initFlows, initIPS, initPasswords, initPaths, initUsers } from "$lib/store";
  import Navbar from "../components/Navbar.svelte";
  import "../css/main.css";
  import '@xyflow/svelte/dist/style.css';
  initCommands();
  initIPS();
  initPaths();
  initPasswords();
  initFlows();
  initUsers();
</script>

<Sidebar.Provider>
  <Navbar />
  <main class="w-full">
    <Sidebar.Trigger class="fixed z-20" />
    <slot />
  </main>
</Sidebar.Provider>
