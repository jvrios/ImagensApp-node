

<template>
    <div class="searchbar">
      <input type="text" v-model="searchQuery" placeholder="Digite sua busca" >
      <button @click="search" class="search-button"><i class="fas fa-search"></i></button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import '@fortawesome/fontawesome-free/css/all.css';
  export default {
    data() {
      return {
        searchQuery: ''
      };
    },
    methods: {
  async search() {
    console.log('Realizando busca com o seguinte query:', this.searchQuery);
    try {
      const response = await axios.get('http://localhost:3000/api/images/search', {
        params: {
          query: this.searchQuery
        }
      });
      console.log('Resposta da busca:', response);
      
      if (response && response.data) {
        console.log('Dados da resposta:', response.data);
        this.$emit('search-results', response.data);
      } else {
        console.error('Resposta da busca vazia ou em formato incorreto:', response);
      }
    } catch (error) {
      console.error('Erro ao buscar imagens:', error.response ? error.response.data : error.message);
    }
  }
}
  };
  </script>

  <style>
    *{box-sizing: border-box}
    .searchbar {
    display: flex;
    align-items: center;
    color: white;
    background-color: rgb(18, 18, 18);
    width: 100%;
    border-radius: 20px; 
    padding: 10px; 
    border: 1px solid #ccc; /* Add border for better visibility */
    position: relative;
    }
    input{
      flex: 1;
      background-color: transparent;
      border: none;
      color : white;
    }
  .search-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
  .search-button i {
    color: white; /* Adjust color as needed */
    font-size: 16px; /* Adjust size as needed */
  }

  </style>
  