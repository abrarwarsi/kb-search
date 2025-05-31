import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/index.js';
import { loadDatabase } from './storage/db.js';

const app = express();
app.use(bodyParser.json());
app.use('/api/v1', routes);

// Load persisted knowledgebase
loadDatabase();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});