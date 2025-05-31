import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Calls the Python embedding script with given text and returns the embedding.
 * @param {string} text - Text input to embed.
 * @returns {Promise<number[]>} - Resolves with embedding vector.
 */
export async function getEmbedding(text) {
  return new Promise((resolve, reject) => {
    const scriptPath = join(__dirname, '../../embeddings/embed.py');
    const py = spawn('python', [scriptPath]);

    let output = '';
    let errorOutput = '';

    py.stdout.on('data', (data) => {
      output += data.toString();
    });

    py.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    py.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Python script failed:\n${errorOutput}`));
      }

      try {
        const result = JSON.parse(output);
        if (result.embedding) {
          resolve(result.embedding);
        } else {
          reject(new Error('No embedding found in Python output.'));
        }
      } catch (err) {
        reject(new Error(`Failed to parse Python output: ${err.message}`));
      }
    });

    py.stdin.write(JSON.stringify({ text }));
    py.stdin.end();
  });
}
