<template>
    <div>
      <input type="text" v-model="searchQuery" placeholder="Digite sua busca">
      <button @click="search">Buscar</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        searchQuery: ''
      };
    },
    methods: {
  async search() {
    console.log('Clicou no botão de busca');
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
  