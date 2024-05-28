const sqlite3 = require('sqlite3').verbose();

// Função para abrir o banco de dados
function openDatabase() {
  return new sqlite3.Database('database.db');
}

// Definir operação para adicionar uma imagem aos favoritos
exports.addFavorite = async (giphyId) => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    console.log(`Adicionando à tabela de favoritos: ${giphyId}`);
    
    // Verificar se a imagem já está nos favoritos
    db.get('SELECT * FROM favorites WHERE giphy_id = ?', [giphyId], (err, row) => {
      if (err) {
        db.close();
        reject(err);
      } else if (row) {
        db.close();
        console.log(`A imagem ${giphyId} já está nos favoritos.`);
        resolve(); // Imagem já está nos favoritos, então não fazemos nada
      } else {
        // A imagem não está nos favoritos, então podemos adicioná-la
        db.run('INSERT INTO favorites (giphy_id) VALUES (?)', [giphyId], (err) => {
          db.close();
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  });
};

// Definir operação para buscar todas as imagens favoritadas
exports.getAllFavorites = async () => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    db.all('SELECT * FROM favorites', (err, rows) => {
      db.close();
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Definir operação para remover uma imagem dos favoritos usando o id
exports.deleteFavorite = async (id) => {
  const db = openDatabase();
  console.log(`Removendo da tabela de favoritos com id: ${id}`);
  await db.run('DELETE FROM favorites WHERE id = ?', [id]);
  db.close();
};



