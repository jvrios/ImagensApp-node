<template>
  <div>
    <search-bar @search-results="handleSearchResults"></search-bar>
    <div v-if="searchResults.length > 0">
      <h2>Resultados da busca:</h2>
      <div v-for="image in searchResults" :key="image.id">
        <img :src="image.url" :alt="image.id">
        <button @click="toggleFavorite(image)" :disabled="isProcessing">
          {{ isFavorited(image.id) ? 'Desfavoritar' : 'Favoritar' }}
        </button>
      </div>
    </div>
    <div>
      <h2>Favoritos:</h2>
      <div v-if="favorites.length === 0">Nenhuma imagem favoritada</div>
      <div v-for="image in favorites" :key="image.giphy_id">
        <img :src="image.url" :alt="image.giphy_id">
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
    console.log('Buscando favoritos...');
    const response = await axios.get('http://localhost:3000/api/favorites');
    console.log('Dados dos favoritos:', response.data);
    this.favorites = response.data.map(fav => ({
      ...fav,
      url: `https://media.giphy.com/media/${fav.giphy_id}/giphy.gif`
    }));
    console.log('Favoritos carregados:', this.favorites);
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error);
  }
},
    async toggleFavorite(image) {
  try {
    this.isProcessing = true;
    const favorited = this.isFavorited(image.id || image.giphy_id);
    console.log('Imagem favoritada?', favorited);
    console.log('ID da imagem:', image.id || image.giphy_id);
    if (favorited) {
      console.log(`Desfavoritando imagem: ${image.id || image.giphy_id}`);
        console.log('cheguei aqui')
        await axios.delete(`http://localhost:3000/api/favorites/${image.id}`);
        console.log('Imagem desfavoritada removida da lista:', this.favorites);
      
    } else {
      console.log(`Favoritando imagem: ${image.id || image.giphy_id}`);
      const response = await axios.post('http://localhost:3000/api/favorites', { giphyId: image.id || image.giphy_id });
      
      // Adicionando a imagem favoritada apenas se a solicitação for bem-sucedida
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
    // Atualizar a lista de favoritos após adicionar/remover um favorito
    this.fetchFavorites();
  }
},
isFavorited(id) {
    const idString = id.toString(); // Convertendo o ID para string
    console.log('ID da imagem:', idString);
    console.log('Favoritos:', this.favorites);
    return this.favorites.some(fav => fav.id == idString); // Usando == na comparação
}
  },
  mounted() {
    this.fetchFavorites();
  }
};
</script>
