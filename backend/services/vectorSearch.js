import cosine from 'cosine-similarity';

/**
 * Searches vector DB with cosine similarity.
 * @param {Array} queryVector - Query embedding
 * @param {Array} docs - [{ id, embedding }]
 * @param {number} limit
 * @returns {Array} Ranked results with score
 */
export function searchVector(queryVector, docs, limit = 5) {
  const scored = docs.map((doc) => ({
    id: doc.id,
    score: cosine(queryVector, doc.embedding),
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
