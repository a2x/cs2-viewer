<script setup lang="ts">
const props = defineProps({
  code: String,
  selectedLanguage: String,
  showModal: Boolean,
  title: String,
});

const emit = defineEmits(["closeModal", "downloadModal", "updateSelectedLanguage"]);

const selectedLanguageRef = ref(props.selectedLanguage);

watch(selectedLanguageRef, (newValue) => {
  emit("updateSelectedLanguage", newValue);
});

const closeModal = () => {
  emit("closeModal");
};

const downloadModal = () => {
  emit("downloadModal");
};
</script>

<template>
  <div v-if="showModal" class="relative z-10">
    <div class="bg-gray-900 bg-opacity-80 fixed inset-0 transition-opacity"></div>

    <div class="fixed inset-0 overflow-y-auto z-10">
      <div
        class="flex items-end justify-center min-h-full p-4 sm:items-center sm:p-0 text-center"
      >
        <div
          class="bg-gray-800 overflow-hidden relative rounded-lg shadow-xl sm:max-w-2xl sm:my-8 sm:w-full text-left text-slate-200 transform transition-all"
        >
          <div class="pb-4 pt-5 px-4 sm:p-6 sm:pb-4">
            <div class="mt-3 sm:ml-1 sm:mt-0 sm:text-left text-center">
              <h3 class="font-semibold text-base">
                {{ props.title }}
              </h3>

              <div class="mt-4">
                <CodeBlock
                  :code="props.code"
                  :lang="selectedLanguage"
                  theme="atom-one-dark"
                  highlightjs
                />

                <div class="mt-5">
                  <label for="languageRadio" class="mr-3">Select Language:</label>

                  <input
                    type="radio"
                    value="cpp"
                    v-model="selectedLanguageRef"
                    name="languageRadio"
                  />
                  C++

                  <input
                    type="radio"
                    value="rust"
                    v-model="selectedLanguageRef"
                    name="languageRadio"
                  />
                  Rust

                  <input
                    type="radio"
                    value="csharp"
                    v-model="selectedLanguageRef"
                    name="languageRadio"
                  />
                  C#
                </div>
              </div>
            </div>
          </div>

          <div
            class="font-semibold pb-6 px-4 py-2 shadow-sm sm:flex sm:flex-row-reverse sm:px-6 text-sm"
          >
            <button
              type="button"
              class="bg-blue-600 hover:bg-blue-700 inline-flex justify-center px-3 py-2 rounded-md sm:ml-3 sm:w-auto w-full"
              @click="downloadModal"
            >
              Download
            </button>

            <button
              type="button"
              class="bg-gray-600 hover:bg-gray-700 inline-flex justify-center mt-3 px-3 py-2 rounded-md shadow-sm sm:mt-0 sm:w-auto w-full"
              @click="closeModal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
