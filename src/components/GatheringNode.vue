<template>
  <article
    class="node"
    :class="{active: gatheringNode.isActive(eorzeaTime)}"
  >
    <div
      v-if="!gatheringNode.isActive(eorzeaTime)"
    >
      <div class="timer">
        {{
          prettyTimer(gatheringNode.getSecondsToNextActiveTime(eorzeaTime))
        }}
      </div>
    </div>
    <div
      v-else
    >
      <div class="timer">
        Active
        <div class="countdown">
          {{
            prettyTimer(gatheringNode.getSecondsToNextInactiveTime(eorzeaTime))
          }}
        </div>
      </div>
    </div>
    <div class="job">
      <div class="icon">
        <img
          :alt="gatheringNode.job"
          :src="`https://xivapi.com/cj/1/${gatheringNode.job}.png`"
          :title="gatheringNode.job"
          draggable="false"
        >
      </div>
    </div>
    <div class="aetheryte">
      <span class="icon">
        <img
          src="https://xivapi.com/img-misc/mappy/aetheryte.png"
          alt="Aetheryte icon"
          draggable="false"
        >
      </span>
      <div class="info">
        <span>{{ zones[gatheringNode.nearestAetheryte.position.zone]?.name?.en }}</span>
        <span>{{ gatheringNode.nearestAetheryte.name.en }}</span>
        <span>{{
          gatheringNode.nearestAetheryte.position.x.toFixed(1)
        }}, {{ gatheringNode.nearestAetheryte.position.y.toFixed(1) }}</span>
      </div>
    </div>
    <div class="items">
      <span
        v-for="item in gatheringNode.items"
        :key="item.name"
      >
        {{ item.name }} (lv. {{ item.level }})
      </span>
    </div>
  </article>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import EorzeaTime from "@/util/EorzeaTime";
import Node from "@/entities/Node";
import Zone from "@/entities/Zone";

export default defineComponent({
  name: "GatheringNode",
  props: {
    gatheringNode: {
      type: Object as PropType<Node>,
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
  methods: {
    prettyTimer(seconds: number): string {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
  },
});
</script>

<style scoped lang="scss">

@keyframes pulsing {
  0% {
    background-color: rgba(255, 255, 255, 0.05);
  }
  50% {
    background-color: rgba(255, 255, 255, 0.075);
  }
  100% {
    background-color: rgba(255, 255, 255, 0.05);
  }
}

.node {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
  min-height: 6rem;
  border: 1px solid #fff;
  padding: 0.5rem;
  border-radius: 0.25rem;

  &.active {
    animation: infinite pulsing 6s;
  }

  .timer {
    min-width: 7rem;
    font-size: 2rem;
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .job {
    display: flex;
    justify-content: center;
    align-items: center;

    .icon {
      width: 3rem;
      height: 3rem;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .aetheryte {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0.25rem;
    font-size: 1.5rem;
    border-radius: 0.75rem;
    padding: 0.35rem 1rem;
    background-color: rgba(0, 0, 0, 0.2);

    .icon {
      width: 3rem;

      img {
        width: 100%;
        height: 100%;
        object-fit: fill;
      }
    }

    .info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: start;
      gap: 0.1rem;
    }
  }

  .items {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    gap: 0.1rem;
  }
}
</style>
