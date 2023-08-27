<script setup lang="ts">
const props = defineProps({
  data: Object,
  lastUpdatedTime: String,
  searchQuery: String,
});

const copyStatus = ref({});
const showFields = ref({});
const code = ref("");
const modalTitle = ref("");
const selectedLanguage = ref("cpp");
const showModalRef = ref(false);
const currentClassName = ref("");
const currentFields = ref({});

const filteredSchemas = computed(() => {
  const { searchQuery, data } = props;

  if (!searchQuery) {
    return data;
  }

  const showFieldsKeys = Object.keys(showFields.value);

  showFieldsKeys.forEach((key) => {
    showFields.value[key] = false;
  });

  const results = {};

  for (const [className, fields] of Object.entries(data)) {
    const filteredFields = {};

    for (const [fieldName, offset] of Object.entries(fields)) {
      if (fieldName.toLowerCase().includes(searchQuery.toLowerCase())) {
        filteredFields[fieldName] = offset;

        if (searchQuery.length >= 3) {
          showFields.value[className] = true;
        }
      }
    }

    if (Object.keys(filteredFields).length) {
      results[className] = filteredFields;
    }
  }

  return results;
});

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

const generateLanguageCode = () => {
  if (selectedLanguage.value === "cpp") {
    generateCppCode(currentClassName.value, currentFields.value);
  } else if (selectedLanguage.value === "csharp") {
    generateCSharpCode(currentClassName.value, currentFields.value);
  } else if (selectedLanguage.value === "rust") {
    generateRustCode(currentClassName.value, currentFields.value);
  }
};

const toggleFields = (node) => {
  showFields.value[node] = !showFields.value[node];
};

const handleGenerateCodeClick = (className) => {
  currentFields.value = props.data[className];
  currentClassName.value = className;

  generateLanguageCode();

  showModal(`Export Class: ${currentClassName.value}`);
};

const updateSelectedLanguage = (newValue) => {
  selectedLanguage.value = newValue;
};

const showModal = (title) => {
  showModalRef.value = true;

  modalTitle.value = title;
};

const closeModal = () => {
  showModalRef.value = false;
};

const downloadModal = () => {
  const blob = new Blob([code.value]);

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  const fileExtension =
    selectedLanguage.value === "cpp"
      ? "cpp"
      : selectedLanguage.value === "csharp"
        ? "cs"
        : "rs";

  const fileName = `class_${currentClassName.value}.${fileExtension}`;

  link.download = fileName;

  link.click();

  window.URL.revokeObjectURL(url);
};

const generateCppCode = (className, fields) => {
  code.value = `#pragma once\n\n`;
  code.value += `#include <cstddef>\n\n`;
  code.value += `namespace ${className} {\n`;

  for (const [fieldName, offset] of Object.entries(fields)) {
    code.value += `    constexpr std::ptrdiff_t ${fieldName} = ${offset};\n`;
  }

  code.value += "}";
};

const generateCSharpCode = (className, fields) => {
  code.value = `public static class ${className} {\n`;

  for (const [fieldName, offset] of Object.entries(fields)) {
    code.value += `    public static readonly ulong ${fieldName} = ${offset};\n`;
  }

  code.value += "}";
};

const generateRustCode = (className, fields) => {
  code.value = "#[allow(non_snake_case, non_upper_case_globals)]\n";
  code.value += `pub mod ${className} {\n`;

  for (const [fieldName, offset] of Object.entries(fields)) {
    code.value += `    pub const ${fieldName}: usize = ${offset};\n`;
  }

  code.value += "}";
};

watch(selectedLanguage, () => {
  generateLanguageCode();
});
</script>

<template>
  <div class="bg-gray-800 p-1">
    <p class="pb-4 text-gray-400">
      Last updated: {{ props.lastUpdatedTime ? props.lastUpdatedTime : "Unknown" }}
    </p>

    <div v-if="Object.keys(filteredSchemas).length">
      <ul class="space-y-2">
        <li v-for="(fields, className) in filteredSchemas" :key="className">
          <div
            class="bg-gray-700 cursor-pointer duration-300 flex hover:bg-gray-600 justify-between p-1 pl-2 pr-2 transition"
            @click="toggleFields(className)"
          >
            <span class="text-gray-300">{{ className }}</span>

            <div
              class="hover:text-blue-500 text-blue-400"
              @click.stop="handleGenerateCodeClick(className)"
            >
              <IconCSS name="octicon:file-code-16" size="22" />
            </div>
          </div>

          <ul class="pl-4 pt-1 space-y-1" v-if="showFields[className]">
            <li v-for="(offset, fieldName) in fields" :key="fieldName">
              <div class="bg-gray-600 p-1 pl-2">
                <p class="text-gray-300">
                  {{ fieldName }} ->

                  <a
                    href="#"
                    :class="{
                      'cursor-pointer duration-200 focus:outline-none hover:text-blue-500 text-blue-400 transition underline':
                        copyStatus[`${className}_${fieldName}`] !== 'Copied!',
                      'text-blue-400': true,
                    }"
                    @click.prevent="copyToClipboard(`${className}_${fieldName}`, offset)"
                  >
                    {{ copyStatus[`${className}_${fieldName}`] || offset }}
                  </a>
                </p>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div v-else>No results found.</div>

    <SchemasExportModal
      :code="code"
      :showModal="showModalRef"
      :title="modalTitle"
      :selectedLanguage="selectedLanguage"
      @closeModal="closeModal"
      @downloadModal="downloadModal"
      @updateSelectedLanguage="updateSelectedLanguage"
    />
  </div>
</template>
