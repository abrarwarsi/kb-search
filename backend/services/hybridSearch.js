function normalizeScores(results) {
    if (results.length === 0) return results;
  
    const scores = results.map(r => r.score);
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    const range = max - min || 1; // avoid divide-by-zero
  
    return results.map(r => ({
      id: r.id,
      score: (r.score - min) / range
    }));
}


/**
 * Combines full-text and vector search scores using weighted average.
 * @param {Array} fullTextResults - [{ id, score }]
 * @param {Array} vectorResults - [{ id, score }]
 * @param {number} weightText - Weight for text score
 * @param {number} weightVector - Weight for vector score
 * @param {number} topK
 * @returns {Array} Merged results sorted by hybrid score
 */
export function mergeHybridResults(
    fullTextResults,
    vectorResults,
    weightText = 0.5,
    weightVector = 0.5,
    topK = 5
  ) {

    const normText = normalizeScores(fullTextResults);
    const normVector = normalizeScores(vectorResults);

    const scoreMap = new Map();
  
    for (const { id, score } of normText) {
      scoreMap.set(id, { id, text: score, vector: 0 });
    }
  
    for (const { id, score } of normVector) {
      if (!scoreMap.has(id)) {
        scoreMap.set(id, { id, text: 0, vector: score });
      } else {
        scoreMap.get(id).vector = score;
      }
    }
  
    const merged = Array.from(scoreMap.values()).map((entry) => ({
      id: entry.id,
      finalScore: entry.text * weightText + entry.vector * weightVector,
    }));
  
    return merged
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, topK);
  }
  