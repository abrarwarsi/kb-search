# 🧠 Knowledge Base Search with Hybrid Retrieval

A backend system that supports document ingestion and hybrid search combining full-text and semantic similarity. Designed as the retrieval layer of a Retrieval-Augmented Generation (RAG) system.

---

## 📌 Features

- **POST /knowledgebase** – Add a document (with auto-generated ID) to the in-memory knowledge base
- **POST /query** – Query the knowledge base using hybrid search (BM25 + embedding-based vector search)
- Hybrid score merging using **weighted average** of normalized scores
- **In-memory and JSON-based persistence**
- Uses a local Python-based embedding model from `sentence-transformers` (no external API keys required)

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/kb-search.git
cd kb-search
```

---

### 2. Install Node.js Dependencies

Ensure you have Node.js (v16+) and npm installed.

```bash
npm install
```

---

### 3. Set Up Python Environment for Embeddings

#### a. Create a virtual environment

```bash
cd embeddings
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### b. Install Python dependencies

```bash
pip install -r ../requirements.txt
```

Your `requirements.txt` should contain:

```
sentence-transformers
```

---

### 4. Start the Server

```bash
cd backend
node server.js
```

The server will run on `http://localhost:3000`

---

## 📤 API Endpoints

### `POST /knowledgebase`

Ingest a document.

**Request:**

```json
{
  "content": "The mitochondria is the powerhouse of the cell."
}
```

**Response:**

```json
{
  "message": "Document added successfully.",
  "id": "9f0c8d66-52b1-4bde-88e2-d2013e14a77e"
}
```

> The `id` is auto-generated (UUID) and persisted in `data/knowledgebase.json`.

---

### `POST /query`

Query for relevant documents.

**Request:**

```json
{
  "query": "cell energy generation"
}
```

**Response:**

```json
{
  "results": [
    {
      "id": "9f0c8d66-52b1-4bde-88e2-d2013e14a77e",
      "content": "The mitochondria is the powerhouse of the cell.",
      "score": 0.84
    }
  ]
}
```

---

## 🧠 Scoring & Ranking Strategy

This project uses **hybrid retrieval** to combine:

- **BM25 full-text search** (via [`wink-bm25-text-search`](https://www.npmjs.com/package/wink-bm25-text-search))
- **Cosine similarity search** on document embeddings (via `sentence-transformers` in Python)

### Steps:

1. **Query Embedding**: The input query is passed to the Python embedding model to generate a vector representation.
2. **BM25 Search**: The query is matched against indexed documents using BM25 to get ranked scores.
3. **Vector Search**: Each document’s vector is compared to the query vector using cosine similarity.
4. **Normalization**: BM25 and cosine similarity scores are normalized to the [0, 1] range.
5. **Hybrid Merge**: A weighted average is used:

```
finalScore = (textScore * 0.5) + (vectorScore * 0.5)
```

6. **Top-K Return**: Top 5 results are returned, ranked by `finalScore`.

---

## 📂 Project Structure

```
kb-search/
├── backend/
│   ├── controllers/        # API logic
│   ├── services/           # Full-text, vector, hybrid search
│   ├── storage/            # In-memory + persistent JSON store
│   ├── utils/              # Text normalization
│   └── routes/, app.js, server.js
├── embeddings/
│   └── embed.py            # Python embedding script
├── data/
│   └── knowledgebase.json  # Persisted documents
├── requirements.txt        # Python dependencies
├── package.json
└── README.md
```

---

## 🤝 Assumptions

- Each document is uniquely identified by an auto-generated UUID.
- The embedding model is run locally via Python, assuming `sentence-transformers` is installed.
- Persistence is handled via a JSON file (`data/knowledgebase.json`), but not backed by a full database.
- Full-text indexing is finalized after each document insert for simplicity (can be optimized).

---

## 💡 Future Improvements

- Support for `DELETE /knowledgebase/:id`
- Snippet/highlight extraction in query results
- Filter support (e.g., by category/tags)
- Use FAISS or HNSWlib for optimized vector search
- Store and serve embeddings from disk for scalability

---

## 📧 Contact

For questions or suggestions, feel free to reach out or open an issue.
