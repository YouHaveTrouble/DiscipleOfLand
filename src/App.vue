<template>
  <div>
    <nav>
      <div class="current-eorzea-time">
        {{ eorzeaTime.getPrettyTime() }}
      </div>
      <div class="top-bar-menu">
        <a
          href="https://github.com/YouHaveTrouble/DiscipleOfLand"
          target="_blank"
        >
          <GithubLogo
            color="#fff"
            size="2rem"
          />
        </a>
        <button
          class="filters-button"
          :class="{ active: filtersActive}"
          @click="filtersActive = !filtersActive"
        >
          {{ filtersActive ? ' Close filters' : 'Open filters' }}
        </button>
      </div>
    </nav>
    <main>
      <SortedNodeList
        v-if="!filtersActive"
        :nodes="nodes as Node[]"
        :zones="zones"
        :eorzea-time="eorzeaTime"
      />
      <FiltersMenu
        v-if="filtersActive"
      />
    </main>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import EorzeaTime from "@/util/EorzeaTime";
import Node from "@/entities/Node";
import Aetheryte from "@/entities/Aetheryte";
import Item from "@/entities/Item";
import {jobFromString} from "@/enums/Job";
import {nodeTypeFromString} from "@/enums/NodeType";
import SortedNodeList from "@/components/SortedNodeList.vue";
import TimeRange from "@/entities/TimeRange";
import Zone from "@/entities/Zone";
import FiltersMenu from "@/components/FiltersMenu.vue";
import Filters from "@/util/Filters";
import GithubLogo from "@/components/icons/GithubLogo.vue";

export default defineComponent({
  name: 'App',
  components: {GithubLogo, FiltersMenu, SortedNodeList},
  data: () => ({
    eorzeaTime: new EorzeaTime() as EorzeaTime,
    nodes: [] as Node[],
    aetherytes: [] as Aetheryte[],
    items: {} as { [key: string]: Item },
    zones: {} as { [key: string]: Zone },
    filtersActive: false,
    filters: new Filters(),
  }),
  methods: {
    findNearestAetheryte(zone: string, x: number, y: number): Aetheryte | null {
      let result = null;
      let distance = Number.MAX_SAFE_INTEGER;
      for (const aetheryte of this.aetherytes) {
        if (aetheryte.position.zone !== zone) continue;
        const a = aetheryte.position.x - x;
        const b = aetheryte.position.y - y;
        const distanceToAetheryte = Math.hypot(a, b);
        if (distanceToAetheryte < distance) {
          `Aetheryte ${aetheryte.name.en}  (${distance}) is new nearest aetheryte`;
          distance = distanceToAetheryte;
          result = aetheryte;
        }
      }
      return result;
    }
  },
  async mounted() {
    this.eorzeaTime = new EorzeaTime();
    setInterval(() => {
      this.eorzeaTime = new EorzeaTime();
    }, 500);

    const aetheryteData: Response | null = await fetch("/data/aetherytes.json")
      .catch((): null => {
        return null;
      });
    if (aetheryteData === null) {
      console.error("Failed to fetch aetheryte data!")
      return;
    }

    const aetherytes = await aetheryteData.json();
    for (const aetheryteData of aetherytes) {
      this.aetherytes.push(new Aetheryte(aetheryteData));
    }

    const itemData: Response | null = await fetch("/data/items.json")
      .catch((): null => {
        return null;
      });
    if (itemData === null) {
      console.error("Failed to fetch item data!")
      return;
    }

    const items = await itemData.json();
    for (const itemId in items) {
      const itemData = items[itemId];
      this.items[itemId] = new Item(itemId, itemData);
    }

    const zoneData: Response | null = await fetch("/data/zones.json")
      .catch((): null => {
        return null;
      });
    if (zoneData === null) {
      console.error("Failed to fetch zone data!")
      return;
    }
    const zones = await zoneData.json();
    for (const zoneId in zones) {
      this.zones[zoneId] = new Zone(zones[zoneId]);
    }

    const nodeData = await fetch("/data/nodes.json")
      .catch(() => {
        return null;
      });
    if (nodeData === null) {
      console.error("Failed to fetch node data!")
      return;
    }

    const nodes = await nodeData.json();

    for (const nodeData of nodes) {

      const job = jobFromString(nodeData.job);
      if (job === null) continue;
      const nodeType = nodeTypeFromString(nodeData.type);
      if (nodeType === null) continue;

      const items = [] as Item[];
      for (const itemId of nodeData.items) {
        const item = this.items[itemId];
        if (item === undefined) continue;
        items.push(item);
      }

      const times = [] as TimeRange[];
      for (const timeRangeEntry of nodeData.times) {
        const timeSplit = timeRangeEntry.split("-");
        if (timeSplit.length !== 2) continue;
        const startTime = timeSplit[0].split(":");
        const endTime = timeSplit[1].split(":");
        times.push(new TimeRange(
          parseInt(startTime[0]),
          parseInt(startTime[1]),
          parseInt(endTime[0]),
          parseInt(endTime[1])
        ));
      }

      const nearestAetheryte = this.findNearestAetheryte(nodeData?.position?.zone, nodeData?.position?.x, nodeData.position?.y);
      if (nearestAetheryte === null) continue;

      this.nodes.push(new Node(
          job,
          nodeType,
          nodeData.position,
          times,
          items,
          nearestAetheryte
        )
      )
    }

  },
})
</script>
<style scoped lang="scss">
nav {
  background-color: #1f1f1f;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-inline: 1rem;

  .current-eorzea-time {
    font-size: 3rem;
  }

  .top-bar-menu {
    display: flex;
    gap: 1rem;
    flex-direction: row;
  }

  .filters-button {
    display: flex;
    padding: 0.5rem;
    border: 1px solid #fff;
    background-color: transparent;
    cursor: pointer;
    width: max-content;
    white-space: nowrap;

    &.active {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
