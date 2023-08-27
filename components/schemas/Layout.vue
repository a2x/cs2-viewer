<script setup lang="ts">
const props = defineProps({
  schemas: Object,
});

const searchQuery = ref("");

const onSearchChange = (newValue) => {
  searchQuery.value = newValue;
};
</script>

<template>
  <SchemasSearchBar @search-change="onSearchChange" />

  <div class="bg-gray-800 p-4">
    <div v-if="props.schemas">
      <SchemasTreeView
        :data="props.schemas.data"
        :lastUpdatedTime="props.schemas.lastUpdatedTime"
        :searchQuery="searchQuery"
      />
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>
