const sqlite3 = require('sqlite3').verbose();

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database('database.db');

// Criar tabela para armazenar imagens favoritadas
db.run(`CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  giphy_id TEXT UNIQUE
)`);

// Definir operação para adicionar uma imagem aos favoritos
exports.addFavorite = (giphyId, callback) => {
  db.run('INSERT INTO favorites (giphy_id) VALUES (?)', [giphyId], callback);
};

// Definir operação para buscar todas as imagens favoritadas
exports.getAllFavorites = (callback) => {
  db.all('SELECT * FROM favorites', callback);
};

// Definir operação para remover uma imagem dos favoritos
exports.deleteFavorite = (id, callback) => {
  db.run('DELETE FROM favorites WHERE id = ?', [id], callback);
};

// Fechar conexão com o banco de dados ao encerrar o servidor
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Conexão com o banco de dados fechada');
    process.exit();
  });
});
