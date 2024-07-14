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
        immediate: true,
        handler() {
          this.displayNodes = this.nodes;
        }
      },
      displayNodes: {
        handler() {
          this.sortListByTime();
        }
      },
      eorzeaTime: {
        immediate: true,
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
    },
    async mounted() {
      this.displayNodes = this.nodes;
      this.sortListByTime();
    },
  }
);
</script>

<style scoped lang="scss">
.node-list {
  display: flex;
  flex-direction: column;
  gap: 0.33rem;

}
</style>
