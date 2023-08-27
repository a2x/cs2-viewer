<script setup lang="ts">
const props = defineProps({
  data: Object,
  lastUpdatedTime: String,
});

const copyStatus = ref({});
const showInterfaces = ref({});

const copyToClipboard = async (key, offset) => {
  try {
    await navigator.clipboard.writeText(offset);

    copyStatus.value[key] = "Copied!";

    setTimeout(() => {
      copyStatus.value[key] = null;
    }, 1000);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};

const toggleInterfaces = (node) => {
  showInterfaces.value[node] = !showInterfaces.value[node];
};
</script>

<template>
  <div class="bg-gray-800 p-1">
    <p class="pb-4 text-gray-400">
      Last updated: {{ props.lastUpdatedTime ? props.lastUpdatedTime : "Unknown" }}
    </p>

    <ul class="space-y-2">
      <li v-for="(interfaceVersions, moduleName) in props.data" :key="moduleName">
        <div
          class="bg-gray-700 cursor-pointer duration-300 hover:bg-gray-600 p-1 pl-2 transition"
          @click="toggleInterfaces(moduleName)"
        >
          <span class="text-gray-300">{{ moduleName }}</span>
        </div>

        <ul class="pl-4 pt-1 space-y-1" v-if="showInterfaces[moduleName]">
          <li
            v-for="(interfaceRva, interfaceVersion) in interfaceVersions"
            :key="interfaceVersion"
          >
            <div class="bg-gray-600 p-1 pl-2">
              <p class="text-gray-300">
                {{ interfaceVersion }} ->

                <a
                  href="#"
                  :class="{
                    'cursor-pointer duration-200 focus:outline-none hover:text-blue-500 text-blue-400 transition underline':
                      copyStatus[`${moduleName}_${interfaceVersion}`] !== 'Copied!',
                    'text-blue-400': true,
                  }"
                  @click.prevent="
                    copyToClipboard(`${moduleName}_${interfaceVersion}`, interfaceRva)
                  "
                >
                  {{ copyStatus[`${moduleName}_${interfaceVersion}`] || interfaceRva }}
                </a>
              </p>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
