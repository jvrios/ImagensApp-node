<template>
  <div>
    <!-- Componente da barra de pesquisa -->
    <search-bar @search-results="handleSearchResults"></search-bar>

    <!-- Resultados da pesquisa -->
    <div class="search-results" v-if="searchResults.length > 0">
      <h2>Resultados da busca:</h2>
      <div v-for="image in searchResults" :key="image.id" class="search-result">
        <img :src="image.url" :alt="image.id" class="search-result-image">
        <button @click="toggleFavorite(image)" :disabled="isProcessing">
          {{ isFavorited(image.id) ? 'Desfavoritar ❤' : 'Favoritar 🤍' }}
        </button>
      </div>
    </div>

    <!-- Seção de imagens favoritas -->
    <div>
      <h2>Favoritos:</h2>
      <div v-if="favorites.length === 0">Nenhuma imagem favoritada</div>
      <div v-for="image in favorites" :key="image.giphy_id" class="favorite">
        <img :src="image.url" :alt="image.giphy_id" class="favorite-image">
        <button @click="toggleFavorite(image)" :disabled="isProcessing">Desfavoritar</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import SearchBar from './components/SearchBar.vue';

export default {
  components: {
    SearchBar
  },
  data() {
    return {
      searchResults: [],
      favorites: [],
      isProcessing: false
    };
  },
  methods: {
    handleSearchResults(results) {
      this.searchResults = results;
    },
    async fetchFavorites() {
      try {
        const response = await axios.get('http://localhost:3000/api/favorites');
        this.favorites = response.data.map(fav => ({
          ...fav,
          url: `https://media.giphy.com/media/${fav.giphy_id}/giphy.gif`
        }));
      } catch (error) {
        console.error('Erro ao buscar favoritos:', error);
      }
    },
    async toggleFavorite(image) {
      try {
        this.isProcessing = true;
        const favorited = this.isFavorited(image.id || image.giphy_id);
        if (favorited) {
          await axios.delete(`http://localhost:3000/api/favorites/${image.id}`);
        } else {
          const response = await axios.post('http://localhost:3000/api/favorites', { giphyId: image.id || image.giphy_id });
          if (response.status === 200) {
            this.favorites.push({
              giphy_id: image.id || image.giphy_id,
              url: image.url
            });
          }
        }
      } catch (error) {
        console.error('Erro ao favoritar/desfavoritar imagem:', error.message);
      } finally {
        this.isProcessing = false;
        this.fetchFavorites();
      }
    },
    isFavorited(id) {
      const idString = id.toString();
      return this.favorites.some(fav => fav.id == idString);
    }
  },
  mounted() {
    this.fetchFavorites();
  }
};
</script>

<style>
  .search-results {
    margin-top: 20px;
  }

  .search-result {
    display: inline-block;
    margin-right: 150px;
    margin-bottom: 150px;
  }

  .search-result img {
    width: 300px;
    height: 300px;
    cursor: pointer;
  }

  .favorite {
    display: inline-block;
    margin-right: 150px;
    margin-bottom: 150px;
  }

  .favorite img {
    width: 300px;
    height: 300px;
    cursor: pointer;
  }
</style>
