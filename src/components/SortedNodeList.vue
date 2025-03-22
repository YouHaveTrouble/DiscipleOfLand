<template>
  <div class="node-list">
    <GatheringNode
      v-for="node in displayNodes"
      :key="`${node.location.x}-${node.location.y}-${node.location.zone}`"
      :gathering-node="node as Node"
      :eorzea-time="eorzeaTime"
      :zones="zones"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import EorzeaTime from "../util/EorzeaTime";
import Node from "@/entities/Node";
import GatheringNode from "@/components/GatheringNode.vue";
import Zone from "@/entities/Zone";
import Filters from "@/util/Filters";

export default defineComponent(
  {
    name: "SortedNodeList",
    components: {GatheringNode},
    props: {
      nodes: {
        type: Array as PropType<Node[]>,
        required: true
      },
      eorzeaTime: {
        type: Object as PropType<EorzeaTime>,
        required: true
      },
      zones: {
        type: Object as PropType<{ [key: string]: Zone }>,
        required: true
      },
    },
    watch: {
      nodes: {
        handler(newNodes: Node[]) {
          this.filterNodes(newNodes);
        },
        deep: true
      },
      displayNodes: {
        handler() {
          this.sortListByTime();
        }
      },
      eorzeaTime: {
        handler(newValue, oldValue) {
          if (oldValue === undefined) return;
          if (newValue?.getMinutes() === oldValue?.getMinutes()) return;
          this.sortListByTime();
        }
      }
    },
    data: () => ({
      displayNodes: [] as Node[],
    }),
    methods: {
      sortListByTime() {
        this.displayNodes.sort((a, b): number => {
          const aSeconds = a.getSecondsToNextActiveTime(this.eorzeaTime);
          const bSeconds = b.getSecondsToNextActiveTime(this.eorzeaTime);
          if (aSeconds === bSeconds) return 1;
          return aSeconds - bSeconds;
        });
      },
      filterNodes(nodes: Node[] = []) {
        let filters: Filters | null = null;
        let filtersString = window.localStorage.getItem("filters");
        if (filtersString === null) {
          window.localStorage.setItem("filters", new Filters().serialize());
          filtersString = window.localStorage.getItem("filters");
        }
        if (filtersString === null) {
          console.error("Failed to get filters from local storage!");
          return;
        }
        const parsedFilters = JSON.parse(filtersString);
        filters = new Filters(parsedFilters);

        this.displayNodes = nodes.filter((node) => {
          let shouldDisplay = false;

          if (filters) {
            if (!filters.jobs.has(node.job)) return false;
            if (!filters.nodeTypes.has(node.nodeType)) return false;
          }

          for (const item of node.items) {
            if (filters && item.level >= filters.minLevel && item.level <= filters.maxLevel) {
              shouldDisplay = true;
              break;
            }
          }

          return shouldDisplay;
        });
      },
    },
    mounted() {
      this.filterNodes(this.nodes);
    },
  }
);
</script>

<style scoped lang="scss">
.node-list {
  display: flex;
  flex-direction: column;
  gap: 0.33rem;
  padding-block: 0.5rem;
  padding-inline: 0.25rem;
}
</style>
