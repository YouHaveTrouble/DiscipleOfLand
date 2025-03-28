<template>
  <section>
    <details open>
      <summary>Level of items</summary>
      <section>
        <label>
          <span>Minimum level</span>
          <input
            type="number"
            placeholder="1"
            :min="1"
            :max="filters.maxLevel"
            v-model="filters.minLevel"
            @focusout="(e: FocusEvent) => {
              const target = e.target as HTMLInputElement;
              const numberValue = parseInt(target.value);
              if (filters.maxLevel && numberValue > filters.maxLevel) {
                filters.maxLevel = filters.minLevel;
              }
            }"
          >
        </label>
        <label>
          <span>Maximum level</span>
          <input
            type="number"
            placeholder="100"
            :min="filters.minLevel"
            :max="100"
            v-model="filters.maxLevel"
            @focusout="(e: FocusEvent) => {
              const target = e.target as HTMLInputElement;
              const numberValue = parseInt(target.value);
              if (filters.minLevel && numberValue < filters.minLevel) {
                filters.minLevel = filters.maxLevel;
              }
            }"
          >
        </label>
      </section>
    </details>
    <details open>
      <summary>Jobs</summary>
      <section>
        <label class="horizontal">
          <span>Botanist</span>
          <input
            type="checkbox"
            :checked="filters.jobs.has(Job.BOTANIST)"
            @change="(e: Event) => {
              const target = e.target as HTMLInputElement;
              if (target.checked) {
                filters.jobs.add(Job.BOTANIST);
              } else {
                filters.jobs.delete(Job.BOTANIST);
              }
            }"
          >
        </label>
        <label class="horizontal">
          <span>Miner</span>
          <input
            type="checkbox"
            :checked="filters.jobs.has(Job.MINER)"
            @change="(e: Event) => {
              const target = e.target as HTMLInputElement;
              if (target.checked) {
                filters.jobs.add(Job.MINER);
              } else {
                filters.jobs.delete(Job.MINER);
              }
            }"
          >
        </label>
      </section>
    </details>
    <details open>
      <summary>Node type</summary>
      <section>
        <label class="horizontal">
          <span>Unspoiled</span>
          <input
            type="checkbox"
            :checked="filters.nodeTypes.has(NodeType.UNSPOILED)"
            @change="(e: Event) => {
              const target = e.target as HTMLInputElement;
              if (target.checked) {
                filters.nodeTypes.add(NodeType.UNSPOILED);
              } else {
                filters.nodeTypes.delete(NodeType.UNSPOILED);
              }
            }"
          >
        </label>
        <label class="horizontal">
          <span>Legendary</span>
          <input
            type="checkbox"
            :checked="filters.nodeTypes.has(NodeType.LEGENDARY)"
            @change="(e: Event) => {
              const target = e.target as HTMLInputElement;
              if (target.checked) {
                filters.nodeTypes.add(NodeType.LEGENDARY);
              } else {
                filters.nodeTypes.delete(NodeType.LEGENDARY);
              }
            }"
          >
        </label>
      </section>
    </details>
  </section>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Filters from "@/util/Filters";
import {Job} from "@/enums/Job";
import {NodeType} from "@/enums/NodeType";

export default defineComponent({
  name: "FiltersMenu",
  computed: {
    NodeType() {
      return NodeType
    },
    Job() {
      return Job
    }
  },
  emits: ['update:filters'],
  data: () => ({
    filters: new Filters(),
  }),
  watch: {
    filters: {
      handler(newFilters) {
        window.localStorage.setItem("filters", newFilters.serialize());
      },
      deep: true,
    },
    minLevel(newValue: string) {
      const numberValue = parseInt(newValue);
      return isNaN(numberValue) ? 1 : numberValue;
    },
    maxLevel(newValue: string) {
      const numberValue = parseInt(newValue);
      return isNaN(numberValue) ? 100 : numberValue;
    },
  },
  mounted() {
    const savedFilters = window.localStorage.getItem("filters");
    if (!savedFilters) return;
    const parsedFilters = JSON.parse(savedFilters);
    this.filters = new Filters(parsedFilters);


  },
});
</script>

<style scoped lang="scss">
section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-block: 1rem;
  padding-inline: 0.25rem;

  details {
    background-color: #1f1f1f;
    display: flex;
    flex-direction: column;
    border-radius: 0.25rem;
    padding: 1rem;
    gap: 0.5rem;
    position: relative;

    &:before {
      position: absolute;
      right: 1rem;
      top: 1rem;
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      justify-content: center;
      align-content: center;
      content: "▶";
      pointer-events: none;
      rotate: 90deg;
      transition: rotate 0.25s;
    }

    &[open] {
      &:before {
        rotate: 270deg;
      }
    }

    summary {
      cursor: pointer;
      color: white;
      border: none;
      border-radius: 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.25rem;
    }

    section {
      display: flex;
      flex-direction: row;
      gap: 2rem;
      flex-wrap: wrap;

      label {
        display: flex;
        gap: 0.5rem;
        flex-direction: column;

        &.horizontal {
          flex-direction: row;
          gap: 0.2rem;
        }

        input[type="number"] {
          padding: 0.5rem;
          border: 1px solid #fff;
          background-color: transparent;
          color: white;
          border-radius: 0.25rem;
          width: 5rem;
          text-align: start;
        }
      }
    }
  }
}
</style>
