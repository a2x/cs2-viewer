import { defineStore } from "pinia";

export const useDataStore = defineStore("DataStore", {
  state: () => ({
    functions: null,
    interfaces: null,
    schemas: null,
  }),

  actions: {
    async fetchJsonData() {
      const fetchJson = async (path) => {
        const response = await fetch(path);

        const lastUpdatedTime = response.headers.get('Last-Modified');

        const data = await response.json();

        return { data, lastUpdatedTime };
      };

      if (this.functions === null) {
        this.functions = await fetchJson("/cs2-viewer/functions.json");
      }

      if (this.interfaces === null) {
        this.interfaces = await fetchJson("/cs2-viewer/interfaces.json");
      }

      if (this.schemas === null) {
        this.schemas = await fetchJson("/cs2-viewer/schemas.json");
      }
    },
  },
});
