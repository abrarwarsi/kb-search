import sys
import json
from sentence_transformers import SentenceTransformer

# Load the embedding model once at the start
model = SentenceTransformer("all-MiniLM-L6-v2")

def read_input():
    """Read JSON input from stdin."""
    try:
        return json.loads(sys.stdin.read())
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid input. Expected JSON with 'text' key."}))
        sys.exit(1)

def write_output(embedding):
    """Write the embedding list to stdout as JSON."""
    print(json.dumps({"embedding": embedding}))

def main():
    input_data = read_input()
    text = input_data.get("text", "")

    if not text.strip():
        print(json.dumps({"error": "Input text is empty."}))
        sys.exit(1)

    # Generate the embedding
    embedding = model.encode(text, convert_to_numpy=False).tolist()

    # Output the embedding
    write_output(embedding)

if __name__ == "__main__":
    main()
