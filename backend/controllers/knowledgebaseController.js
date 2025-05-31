import { v4 as uuidv4 } from 'uuid';
import { getEmbedding } from '../services/embeddingService.js';
import { addToFullTextIndex, finalizeFullTextIndex } from '../services/fullTextSearch.js';
import { db, saveDatabase } from '../storage/db.js';

/**
 * POST /knowledgebase
 * Adds a document with ID and content to the store.
 */
export async function addToKnowledgebase(req, res) {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: '"content" is required.' });
  }

  try {
    const id = uuidv4();
    const embedding = await getEmbedding(content);

    // Save to in-memory DB
    db.documents.push({ id, content, embedding });
    saveDatabase();

    // Index in full-text
    addToFullTextIndex({ id, content });

    // finalize full-text index on each add (for now)
    finalizeFullTextIndex();

    res.status(200).json({ message: 'Document added successfully.', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
