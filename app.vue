<script setup lang="ts">
import { useDataStore } from "~/store/dataStore";

const tabs = [{ label: "Functions" }, { label: "Interfaces" }, { label: "Schemas" }];

const activeTab = ref(0);

const onUpdateActiveTab = (tabIndex) => {
  activeTab.value = tabIndex;
};

const store = useDataStore();

onMounted(async () => {
  await store.fetchJsonData();
});

const functions = computed(() => store.functions);
const interfaces = computed(() => store.interfaces);
const schemas = computed(() => store.schemas);
</script>

<template>
  <div class="bg-gray-900 flex flex-col items-center min-h-screen pt-8 text-slate-200">
    <div class="max-w-3xl w-full">
      <h1 class="font-semibold pb-4 pt-6 text-2xl">CS2 Viewer</h1>

      <Tabs :tabs="tabs" :activeTab="activeTab" @tab-clicked="onUpdateActiveTab" />

      <div v-if="activeTab === 0">
        <FunctionsLayout :functions="functions" />
      </div>
      <div v-else-if="activeTab === 1">
        <InterfacesLayout :interfaces="interfaces" />
      </div>
      <div v-else-if="activeTab === 2">
        <SchemasLayout :schemas="schemas" />
      </div>
    </div>

    <a
      href="https://github.com/a2x/cs2-viewer"
      target="_blank"
      rel="noopener noreferrer"
      class="fixed bottom-4 right-4"
    >
      <IconCSS name="grommet-icons:github" size="40px" />
    </a>
  </div>
</template>
