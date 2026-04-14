require('dotenv').config();
const app = require('./app');
const { initPool } = require('./config/db');

const PORT = process.env.PORT || 3000;

(async () => {
  await initPool();
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
})();
