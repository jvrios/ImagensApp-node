<template>
  <div>
    <search-bar @search-results="handleSearchResults"></search-bar>
    <div v-if="searchResults.length > 0">
      <h2>Resultados da busca:</h2>
      <div v-for="image in searchResults" :key="image.id">
        <img :src="image.url" :alt="image.id">
      </div>
    </div>
  </div>
</template>

<script>
import SearchBar from './components/SearchBar.vue';

export default {
  components: {
    SearchBar
  },
  data() {
    return {
      searchResults: []
    };
  },
  methods: {
  handleSearchResults(results) {
    console.log('Resultados da busca:', results);
    this.searchResults = results;
  }
}
};
</script>
