<script setup lang="ts">
const props = defineProps({
  data: Object,
  lastUpdatedTime: String,
  searchQuery: String,
});

const copyStatus = ref({});
const showClasses = ref({});

const filteredFunctions = computed(() => {
  const { searchQuery, data } = props;

  if (!searchQuery) {
    return data;
  }

  const results = {};

  for (const [moduleName, classes] of Object.entries(data)) {
    const filteredValues = {};

    for (const [className, { VTableRva, VTableSize, Functions }] of Object.entries(
      classes,
    )) {
      const filteredFunctions = {};

      for (const [functionKey, functionAttributes] of Object.entries(Functions)) {
        if (functionKey.toLowerCase().includes(searchQuery.toLowerCase())) {
          filteredFunctions[functionKey] = functionAttributes;

          showClasses.value[moduleName] = true;

          if (searchQuery.length >= 3) {
            showClasses.value[`${moduleName}_${className}`] = true;
          }
        }
      }

      if (Object.keys(filteredFunctions).length) {
        filteredValues[className] = {
          VTableRva,
          VTableSize,
          Functions: filteredFunctions,
        };
      }
    }

    if (Object.keys(filteredValues).length) {
      results[moduleName] = filteredValues;
    }
  }

  return results;
});

watch(
  () => props.searchQuery,
  (newQuery) => {
    if (!newQuery) {
      resetSubnodes();
    }
  },
);

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

const resetSubnodes = () => {
  nextTick(() => {
    const showClassesKeys = Object.keys(showClasses.value);

    showClassesKeys.forEach((key) => {
      showClasses.value[key] = false;
    });
  });
};

const toggleClasses = (node) => {
  showClasses.value[node] = !showClasses.value[node];
};
</script>

<template>
  <div class="bg-gray-800 p-1">
    <p class="pb-4 text-gray-400">
      Last updated: {{ props.lastUpdatedTime ? props.lastUpdatedTime : "Unknown" }}
    </p>

    <div v-if="Object.keys(filteredFunctions).length">
      <ul class="space-y-2">
        <li v-for="(classes, moduleName) in filteredFunctions" :key="moduleName">
          <div
            class="bg-gray-700 cursor-pointer duration-300 hover:bg-gray-600 p-1 pl-2 transition"
            @click="toggleClasses(moduleName)"
          >
            <span class="text-gray-300">{{ moduleName }}</span>
          </div>

          <ul class="pl-4 pt-1 space-y-1" v-if="showClasses[moduleName]">
            <li v-for="(classInfo, className) in classes" :key="className">
              <div
                class="bg-gray-700 cursor-pointer duration-300 hover:bg-gray-600 p-1 pl-2 transition"
                @click="toggleClasses(`${moduleName}_${className}`)"
              >
                <p class="text-gray-300">
                  <template v-if="classInfo.VTableRva && classInfo.VTableSize">
                    {{ className }} @

                    <a
                      href="#"
                      :class="{
                        'cursor-pointer duration-200 focus:outline-none hover:text-blue-500 text-blue-400 transition underline':
                          copyStatus[`${moduleName}_${className}`] !== 'Copied!',
                        'text-blue-400': true,
                      }"
                      @click.stop.prevent="
                        copyToClipboard(`${moduleName}_${className}`, classInfo.VTableRva)
                      "
                    >
                      {{
                        copyStatus[`${moduleName}_${className}`] || classInfo.VTableRva
                      }}
                    </a>

                    (VTable Size: {{ classInfo.VTableSize }})
                  </template>
                  <template v-else>
                    {{ className }}
                  </template>
                </p>
              </div>

              <ul
                class="pl-4 pt-1 space-y-1"
                v-if="showClasses[`${moduleName}_${className}`]"
              >
                <li
                  v-for="(functionInfo, functionName) in classInfo.Functions"
                  :key="functionName"
                >
                  <div class="bg-gray-600 p-1 pl-2">
                    <div v-if="functionInfo.VTableIndex">
                      <p class="text-gray-300">
                        {{ functionName }}[<span class="text-blue-400">{{
                          functionInfo.VTableIndex
                        }}</span>]
                      </p>
                    </div>
                    <div v-else-if="functionInfo.Signature">
                      <p class="text-gray-300">{{ functionName }}</p>

                      <a
                        href="#"
                        :class="{
                          'cursor-pointer duration-200 focus:outline-none hover:text-blue-500 text-blue-400 transition underline':
                            copyStatus[
                              `${moduleName}_${functionName}_${functionName}`
                            ] !== 'Copied!',
                          'text-blue-400': true,
                        }"
                        @click.stop.prevent="
                          copyToClipboard(
                            `${moduleName}_${functionName}_${functionName}`,
                            functionInfo.Signature,
                          )
                        "
                      >
                        {{
                          copyStatus[`${moduleName}_${functionName}_${functionName}`] ||
                          functionInfo.Signature
                        }}
                      </a>

                      <p
                        v-if="functionInfo.Signature.startsWith('E8')"
                        class="text-gray-400"
                      >
                        Relative Call
                      </p>
                    </div>
                    <div v-else>
                      <p class="text-gray-300">{{ functionName }}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div v-else>No results found.</div>
  </div>
</template>
