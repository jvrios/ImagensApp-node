<template>
  <div>


    <div class="container">
      <div class="conteudo">
        <search-bar @search-results="handleSearchResults"></search-bar>
        <div class="search-results" v-if="searchResults.length > 0">
          <h3>Resultados da busca:</h3>
          <div class="search-result">
            <div v-for="image in searchResults" :key="image.id">
              <img :src="image.url" :alt="image.id" class="search-result-image" @click="showPopup(image)">
            </div>
          </div>
        </div>
      </div>
      <div class="fz">
        <h2>Seus Favoritos:</h2>
        <div class="favorite">
          <div v-if="favorites.length === 0">Nenhuma imagem favoritada</div>
          <div v-for="image in favorites" :key="image.giphy_id">
            <img :src="image.url" :alt="image.giphy_id" class="favorite-image" @click="showPopup(image)">
          </div>
        </div>
      </div>
    </div>
    <PopupImage v-if="popupTriggers.clickTrigger" :image="popupImage" @close="togglePopup('clickTrigger')"
      @toggle-favorite="toggleFavorite" :is-favorited="isFavorited(popupImage.id || popupImage.giphy_id)"
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
  setup() {
    const popupTriggers = ref({ clickTrigger: false });
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
        this.togglePopup('clickTrigger');
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
body {
  font-family: Avenir, Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: rgb(18, 18, 18);

  .container {
    display: flex;
    flex-direction: row;
  }

  .conteudo {
    flex: .8;
    padding: 20px;
  }

  .fz {
    flex: .2;
  }

  h2 {
    color: white;
    display: flex;
    justify-content: flex-end;
  }

  h3 {
    color: #bebebe;
  }

  .search-result {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 15px;
  }

  .search-result img {
    border-radius: 15px;
    height: 100%;
    width: 100%;
    cursor: pointer;
    transition: transform 0.3s ease;
  }

  .search-result img:hover {
    transform: scale(1.1);
  }

  .favorite {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-right: auto;
    margin-bottom: auto;
  }

  .favorite img {
    border-radius: 15px;
    max-width: 100%;
    max-height: 100%;

    cursor: pointer;
    transition: transform 0.3s ease;
  }

  .favorite img:hover {
    transform: scale(1.1);
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