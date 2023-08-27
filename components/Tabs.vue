<script setup lang="ts">
const props = defineProps({
  tabs: Array,
  activeTab: Number,
});
</script>

<template>
  <div class="flex pb-4 space-x-4">
    <div
      v-for="(tab, index) in props.tabs"
      :key="index"
      :class="[
        'cursor-pointer px-4 py-2',
        props.activeTab === index
          ? 'bg-gray-800 text-white'
          : 'hover:text-gray-300 bg-gray-700 text-gray-400',
      ]"
      @click="$emit('tab-clicked', index)"
    >
      {{ tab.label }}
    </div>
  </div>
</template>
