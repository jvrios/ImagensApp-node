const express = require('express');
const axios = require('axios');

const app = express();
const cors = require('cors'); // Importe o pacote 'cors'
const port = 3000;
const database = require('./database'); // Importar operações CRUD do banco de dados

// Configurar o middleware para processar JSON
app.use(express.json());
app.use(cors());
// Rota para adicionar uma imagem aos favoritos
app.post('/api/favorites', (req, res) => {
  const { giphyId } = req.body;
  database.addFavorite(giphyId, (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erro ao favoritar imagem');
    } else {
      res.status(200).send('Imagem favoritada com sucesso');
    }
  });
});

app.get('/api/favorites', (req, res) => {
    database.getAllFavorites((err, favorites) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Erro ao buscar imagens favoritadas');
      } else {
        res.status(200).json(favorites);
      }
    });
  });
  
// Mais rotas para CRUD de imagens favoritadas
app.delete('/api/favorites/:id', (req, res) => {
    const { id } = req.params;
    database.deleteFavorite(id, (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Erro ao remover imagem favoritada');
      } else {
        res.status(200).send('Imagem removida dos favoritos com sucesso');
      }
    });
  });

  app.get('/api/images/search', async (req, res) => {
    const { query } = req.query;
    try {
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
      console.error(error);
      res.status(500).send('Erro ao buscar imagens');
    }
  });
    

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
