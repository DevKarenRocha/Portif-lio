const express = require('express');
const { Low, JSONFile } = require('lowdb');

// Configurações do banco de dados
const db = new Low(new JSONFile('db.json')); // Corrigido para usar Lowdb 3.x corretamente

// Inicializa o banco de dados
async function initializeDB() {
  await db.read(); // Lê os dados do arquivo
  if (!db.data) {
    db.data = { count: 0 }; // Se não existir dados, inicializa o contador
    await db.write(); // Grava os dados no arquivo
  }
}

initializeDB(); // Chama a função para inicializar o banco

// Inicia o servidor
const app = express();
const port = 3000;

// Middleware para servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static('public'));

// Rota para obter o contador de acessos
app.get('/api/contador', (req, res) => {
  res.json({ count: db.data.count });
});

// Rota para incrementar o contador
app.get('/api/incrementar', async (req, res) => {
  db.data.count += 1;  // Incrementa o contador
  await db.write();    // Grava a atualização no arquivo JSON
  res.json({ count: db.data.count });  // Retorna o novo valor
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
