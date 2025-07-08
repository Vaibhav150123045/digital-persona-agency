const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2";
const HF_API_TOKEN = ""; // Store securely in .env

export async function getBertSimilarity(text1: string, text2: string): Promise<number> {
  const res = await fetch(HUGGINGFACE_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: {
        source_sentence: text1,
        sentences: [text2],
      },
    }),
  });

  const data = await res.json();

  if (Array.isArray(data)) {
    return data[0] as number;
  }

  console.error("HuggingFace error:", data);
  return 0;
}