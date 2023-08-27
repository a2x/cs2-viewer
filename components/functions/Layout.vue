<script setup lang="ts">
const props = defineProps({
  functions: Object,
});

const searchQuery = ref("");

const onSearchChange = (newValue) => {
  searchQuery.value = newValue;
};
</script>

<template>
  <FunctionsSearchBar @search-change="onSearchChange" />

  <div class="bg-gray-800 p-4">
    <div v-if="props.functions">
      <FunctionsTreeView
        :data="props.functions.data"
        :lastUpdatedTime="props.functions.lastUpdatedTime"
        :searchQuery="searchQuery"
      />
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>
