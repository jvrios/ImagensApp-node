<template>
  <div>
    <header>
      <h1>ImagensApp</h1>
    </header>
    <search-bar @search-results="handleSearchResults"></search-bar>

    <div class="search-results" v-if="searchResults.length > 0">
      <h2>Resultados da busca:</h2>
      <div v-for="image in searchResults" :key="image.id" class="search-result">
        <img :src="image.url" :alt="image.id" class="search-result-image" @click="showPopup(image)">
      </div>
    </div>

    <div>
      <h2>Seus Favoritos:</h2>
      <div v-if="favorites.length === 0">Nenhuma imagem favoritada</div>
      <div v-for="image in favorites" :key="image.giphy_id" class="favorite">
        <img :src="image.url" :alt="image.giphy_id" class="favorite-image" @click="showPopup(image)">
      </div>
    </div>

    <PopupImage 
      v-if="popupTriggers.clickTrigger" 
      :image="popupImage" 
      @close="togglePopup('clickTrigger')"
      @toggle-favorite="toggleFavorite"
      :is-favorited="isFavorited(popupImage.id || popupImage.giphy_id)"
      :is-processing="isProcessing">
    </PopupImage>
    <div class="success-popup" v-if="showSuccessPopup">
    Operação concluída com sucesso
    </div>

  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import PopupImage from './components/PopupImage.vue';
import SearchBar from './components/SearchBar.vue';

export default {
  components: {
    SearchBar,
    PopupImage
  },
  setup () {
    const popupTriggers = ref({clickTrigger: false});
    const popupImage = ref(null);

    const togglePopup = (trigger, image = null) => {
      popupTriggers.value[trigger] = !popupTriggers.value[trigger];
      if (image) {
        popupImage.value = image;
      }
    }

    return {
      popupImage,
      popupTriggers,
      togglePopup
    }
  },
  data() {
    return {
      searchResults: [],
      favorites: [],
      isProcessing: false,
      showSuccessPopup: false
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
        await axios.delete(`http://localhost:3000/api/favorites/${image.id || image.giphy_id}`);
        this.favorites = this.favorites.filter(fav => fav.giphy_id !== (image.id || image.giphy_id));
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
      this.togglePopup('clickTrigger'); // Close the popup after processing
      this.showSuccessPopup = true;
      setTimeout(() => {
          this.showSuccessPopup = false;
        }, 3000);
    }
  },
    isFavorited(id) {
      const idString = id.toString();
      return this.favorites.some(fav => fav.id == idString || fav.giphy_id == idString);
    },
    showPopup(image) {
      this.togglePopup('clickTrigger', image);
    }
  },
  mounted() {
    this.fetchFavorites();
  }
};
</script>



<style lang="scss">
  body{
  font-family: Avenir, Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: rgb(18, 18, 18);
  h2{color: white;}
  h1{
    text-align: center;
    color: #bebebe;
    margin-top: 30px;
  }
  .search-results {
    margin-top: 20px;
  }

  .search-result {
    display: inline-block;
    margin-right: auto;
    margin-bottom: auto;
  }

  .search-result img {
    width: auto;
    height: auto;
    cursor: pointer;
  }

  .favorite {
    display: inline-block;
    margin-right: auto;
    margin-bottom: auto;
  }

  .favorite img {
    width: auto;
    height: auto;
    cursor: pointer;
  }
  .success-popup {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: green;
  color: white;
  padding: 10px;
  border-radius: 5px;
}

}
</style>