import fs from 'fs';
import { join } from 'path';

const DATA_PATH = join(process.cwd(), 'data', 'knowledgebase.json');

// Initial in-memory store
export const db = {
  documents: [],
};

/**
 * Load documents from disk into memory.
 */
export function loadDatabase() {
  if (fs.existsSync(DATA_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
      db.documents = Array.isArray(data) ? data : [];
      console.log(`Loaded ${db.documents.length} documents from disk.`);
    } catch (err) {
      console.error('Failed to load knowledgebase.json:', err.message);
    }
  }
}

/**
 * Save current in-memory documents to disk.
 */
export function saveDatabase() {
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(db.documents, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write knowledgebase.json:', err.message);
  }
}
