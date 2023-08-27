<script setup lang="ts">
const props = defineProps({
  interfaces: Object,
});
</script>

<template>
  <div class="bg-gray-800 p-4">
    <div v-if="props.interfaces">
      <InterfacesTreeView
        :data="props.interfaces.data"
        :lastUpdatedTime="props.interfaces.lastUpdatedTime"
      />
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>
