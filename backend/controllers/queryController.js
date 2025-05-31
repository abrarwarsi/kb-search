import { getEmbedding } from '../services/embeddingService.js';
import { searchFullText } from '../services/fullTextSearch.js';
import { searchVector } from '../services/vectorSearch.js';
import { mergeHybridResults } from '../services/hybridSearch.js';
import { db } from '../storage/db.js';

/**
 * POST /query
 * Returns top-K hybrid ranked results for a query.
 */
export async function queryKnowledgebase(req, res) {
  const { query } = req.body;
  if (!query || !query.trim()) {
    return res.status(400).json({ error: 'Query is required.' });
  }

  try {
    const queryVector = await getEmbedding(query);

    const fullTextResults = searchFullText(query, 10); // [{ id, score }]
    const vectorResults = searchVector(queryVector, db.documents, 10); // [{ id, score }]

    const hybridResults = mergeHybridResults(
      fullTextResults,
      vectorResults,
      0.5, // text weight
      0.5, // vector weight
      5    // top-K
    );

    const documents = hybridResults.map(({ id, finalScore }) => {
      const doc = db.documents.find((d) => d.id === id);
      return {
        id: doc.id,
        content: doc.content,
        score: finalScore,
      };
    });

    res.status(200).json({ results: documents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
