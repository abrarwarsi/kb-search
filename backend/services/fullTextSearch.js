import bm25 from 'wink-bm25-text-search';
import winkTokenizer from 'wink-tokenizer';

// Create a tokenizer instance
const tokenizer = winkTokenizer();

// Use tokenizer methods
const { tokenize } = tokenizer;

const engine = bm25();
engine.defineConfig({ fldWeights: { content: 1 } });
engine.definePrepTasks([
    tokenizer.its.tokenize,
    tokenizer.as.lowerCase,
    tokenizer.as.removeStopWords,
    tokenizer.as.stem,
]);

/**
 * Adds a document to the BM25 index.
 * @param {object} doc - { id, content }
 */
export function addToFullTextIndex(doc) {
  engine.addDoc(doc, doc.id);
}

/**
 * Finalizes the full-text index.
 */
export function finalizeFullTextIndex() {
  engine.consolidate();
}

/**
 * Searches the full-text index.
 * @param {string} query
 * @param {number} limit
 * @returns {Array} Ranked results with score
 */
export function searchFullText(query, limit = 5) {
  const results = engine.search(query);
  return results.slice(0, limit).map((r) => ({
    id: r[0],
    score: r[1],
  }));
}
