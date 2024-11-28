<script lang="ts">
  import House from "lucide-svelte/icons/house";
  import EthernetPort from "lucide-svelte/icons/ethernet-port";
  import Terminal from "lucide-svelte/icons/square-terminal";
  import Folder from "lucide-svelte/icons/folder-open";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import type { NavLink } from "$lib/typings";
  const items: NavLink[] = [
    {
      url: "/",
      icon: House,
      name: "Home",
    },
    {
      url: "/ips",
      icon: EthernetPort,
      name: "IPs",
    },
    {
      url: "/commands",
      icon: Terminal,
      name: "Commands",
    },
    {
      url: "/paths",
      icon: Folder,
      name: "Paths",
    },
  ];
</script>

<Sidebar.Root collapsible="icon">
  <!-- <Sidebar.Header>
    <Sidebar.Menu>
      <Sidebar.MenuItem class="w-[--bits-dropdown-menu-anchor-width]"
        >SSH</Sidebar.MenuItem
      >
    </Sidebar.Menu>
  </Sidebar.Header> -->
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Utils</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each items as menuItem (menuItem.name)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                {#snippet child({ props })}
                  <a href={menuItem.url} {...props}>
                    <menuItem.icon />
                    <span>{menuItem.name}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>
</Sidebar.Root>
