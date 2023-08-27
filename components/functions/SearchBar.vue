<script setup lang="ts">
const searchQuery = ref("");

const emit = defineEmits(["search-change"]);

watch(searchQuery, (newValue) => {
  emit("search-change", newValue);
});
</script>

<template>
  <div class="pb-4">
    <div class="relative text-gray-400">
      <div class="absolute flex inset-y-0 items-center left-0 pl-3 pointer-events-none">
        <IconCSS name="tabler:search" size="20" class="h-5 text-gray-500 w-5" />
      </div>

      <input
        type="text"
        class="bg-gray-700 focus:border-blue-300 focus:outline-none focus:ring px-10 py-2 text-gray-300 w-full"
        placeholder="Search for a function..."
        v-model="searchQuery"
      />
    </div>
  </div>
</template>
