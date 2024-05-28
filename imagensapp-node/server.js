const express = require('express');
const axios = require('axios');
const cors = require('cors');
const database = require('./database');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Rota para adicionar uma imagem aos favoritos
app.post('/api/favorites', async (req, res) => {
  try {
    const { giphyId } = req.body;
    console.log(`Adicionando imagem aos favoritos: ${giphyId}`);
    await database.addFavorite(giphyId);
    res.status(200).send('Imagem favoritada com sucesso');
  } catch (error) {
    console.error('Erro ao favoritar imagem:', error.message);
    res.status(500).send('Erro ao favoritar imagem');
  }
});

// Rota para buscar todas as imagens favoritadas
app.get('/api/favorites', async (req, res) => {
  try {
    console.log('Buscando todas as imagens favoritadas');
    const favorites = await database.getAllFavorites();
    res.status(200).json(favorites);
  } catch (error) {
    console.error('Erro ao buscar imagens favoritadas:', error.message);
    res.status(500).send('Erro ao buscar imagens favoritadas');
  }
});

// Rota para remover uma imagem dos favoritos usando o id
app.delete('/api/favorites/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Removendo imagem dos favoritos com id: ${id}`);
  try {
    await database.deleteFavorite(id);
    res.status(200).send('Imagem removida dos favoritos com sucesso');
  } catch (error) {
    console.error('Erro ao remover imagem favoritada:', error.message);
    res.status(500).send('Erro ao remover imagem favoritada');
  }
});

// Rota para buscar imagens na API do Giphy
app.get('/api/images/search', async (req, res) => {
  try {
    const { query } = req.query;
    console.log(`Buscando imagens com query: ${query}`);
    const response = await axios.get('https://api.giphy.com/v1/gifs/search', {
      params: {
        q: query,
        limit: 20,
        api_key: '0j8PaMDFtQmKu6VupE3Fu423glu8QmTG',
      },
    });
    const images = response.data.data.map((image) => ({
      id: image.id,
      url: image.images.original.url,
    }));
    res.status(200).json(images);
  } catch (error) {
    console.error('Erro ao buscar imagens:', error.message);
    res.status(500).send('Erro ao buscar imagens');
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
