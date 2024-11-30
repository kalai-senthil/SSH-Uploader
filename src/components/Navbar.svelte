<script lang="ts">
  import House from "lucide-svelte/icons/house";
  import Monitor from "lucide-svelte/icons/monitor";
  import FlowIcon from "lucide-svelte/icons/tangent";
  import Terminal from "lucide-svelte/icons/square-terminal";
  import Network from "lucide-svelte/icons/network";
  import Folder from "lucide-svelte/icons/folder-open";
  import Password from "lucide-svelte/icons/key-round";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import type { _Object, NavLink } from "$lib/typings";
  const items: _Object<NavLink[]> = {
    Utils: [
      {
        url: "/",
        icon: House,
        name: "Home",
      },
      {
        url: "/flows",
        icon: Network,
        name: "Flows",
      },
      {
        url: "/flow",
        icon: FlowIcon,
        name: "Flow Builder",
      },
    ],
    Management: [
      {
        url: "/ips",
        icon: Monitor,
        name: "Machines",
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
      {
        url: "/passwords",
        icon: Password,
        name: "Passwords",
      },
    ],
  };
  import { page } from "$app/stores";
  import { cn } from "$lib/utils";
  import { clearCanvas } from "$lib/store";
  const navKeys = $derived(Object.keys(items));
</script>

<Sidebar.Root collapsible="icon">
  <Sidebar.Content>
    {#each navKeys as navKey (navKey)}
      <Sidebar.Group>
        <Sidebar.GroupLabel>{navKey}</Sidebar.GroupLabel>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            {#each items[navKey] as menuItem (menuItem.url)}
              <Sidebar.MenuItem class="text-xl">
                <Sidebar.MenuButton
              
                  class={cn(
                    "transition-all",
                    $page.url.pathname === menuItem.url
                      ? "bg-violet-500 font-semibold"
                      : ""
                  )}
                >
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
    {/each}
  </Sidebar.Content>
</Sidebar.Root>
