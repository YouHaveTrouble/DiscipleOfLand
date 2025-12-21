<template>
  <article
    class="node"
    :class="{active: gatheringNode.isActive(eorzeaTime)}"
  >
    <div class="location-info">
      <div
        v-if="!gatheringNode.isActive(eorzeaTime)"
      >
        <div class="timer">
          {{
            prettyTimer(secondsToNextActiveTime)
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
              prettyTimer(secondsToNextInactiveTime)
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
          <span class="zone-name">{{ zones[gatheringNode.location.zone]?.name?.en }}</span>
          <span class="aetheryte-name">{{ gatheringNode.nearestAetheryte.name.en }}</span>
          <span class="coords">{{
            gatheringNode.nearestAetheryte.position.x.toFixed(1)
          }}, {{ gatheringNode.nearestAetheryte.position.y.toFixed(1) }}</span>
        </div>
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
  data() {
    return {
      secondsToNextInactiveTime: 0 as number,
      secondsToNextActiveTime: 0 as number,
    };
  },
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
  watch: {
    eorzeaTime: {
      handler() {
        this.calculateTimers()
      }
    }
  },
  methods: {
    prettyTimer(seconds: number): string {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    },
    calculateTimers() {
      this.secondsToNextInactiveTime = this.gatheringNode.getSecondsToNextInactiveTime(this.eorzeaTime);
      this.secondsToNextActiveTime = this.gatheringNode.getSecondsToNextActiveTime(this.eorzeaTime);
    }
  },
  mounted() {
    this.calculateTimers();
  }
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
  content-visibility: auto;

  .location-info {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
  }

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
    justify-content: flex-start;
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
      line-height: 1;

      .zone-name {
        font-size: 0.75rem;
      }
      .aetheryte-name {
        font-size: 1.1rem;
      }
      .coords {
        padding-top: 0.15rem;
      }
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
