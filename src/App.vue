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
    <footer>
      <p>v{{ version }}</p>
      <p><a href="https://github.com/YouHaveTrouble/DiscipleOfLand/blob/master/CONTRIBUTING.MD">Need YOUR help to input node, item and zone data!</a></p>
    </footer>
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
import {version} from "../package.json";

export default defineComponent({
  name: 'App',
  components: {GithubLogo, FiltersMenu, SortedNodeList},
  data: () => ({
    version: version,
    eorzeaTime: new EorzeaTime() as EorzeaTime,
    nodes: [] as Node[],
    items: {} as { [key: string]: Item },
    zones: {} as { [key: string]: Zone },
    filtersActive: false,
    filters: new Filters(),
  }),
  methods: {
    findNearestAetheryte(zoneName: string, x: number, y: number): Aetheryte | null {
      let result = null;
      let distance = Number.MAX_SAFE_INTEGER;
      const zone = this.zones[zoneName]
      if (!zone) return null;
      for (const aetheryte of zone.aetherytes) {
        const a = aetheryte.position.x - x;
        const b = aetheryte.position.y - y;
        const distanceToAetheryte = Math.hypot(a, b);
        if (distanceToAetheryte < distance) {
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
      if (job === null) {
        console.debug(`Failed to parse job: ${nodeData.job}`);
        continue;
      }
      const nodeType = nodeTypeFromString(nodeData.type);
      if (nodeType === null) {
        console.debug(`Failed to parse node type: ${nodeData.type}`);
        continue;
      }

      const items = [] as Item[];
      for (const itemId of nodeData.items) {
        const item = this.items[itemId];
        if (item === undefined) {
          console.debug(`Failed to find item with id: ${itemId}`);
          continue;
        }
        items.push(item);
      }

      const times = [] as TimeRange[];
      for (const timeRangeEntry of nodeData.times) {
        const timeSplit = timeRangeEntry.split("-");
        if (timeSplit.length !== 2) {
          console.debug(`Failed to parse time range: ${timeRangeEntry}`);
          continue;
        }
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
      if (nearestAetheryte === null) {
        console.debug(`Failed to find nearest aetheryte for node: ${JSON.stringify(nodeData)}`);
        continue;
      }

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
footer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem 0.25rem;
  gap: 0.5rem;
  p {
    margin: 0;
  }
}
</style>
