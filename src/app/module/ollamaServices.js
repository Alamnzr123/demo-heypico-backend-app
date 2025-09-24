import axios from 'axios';

export async function askOllama(prompt, { stream = false } = {}) {
  const ollamaUrl = process.env.OLLAMA_URL ?? 'http://127.0.0.1:11434';
  const ollamaModel = process.env.OLLAMA_MODEL ?? 'llama3:8b';

  const { data } = await axios.post(`${ollamaUrl}/api/generate`, {
    model: ollamaModel,
    prompt,
    stream
  });
  return data?.response?.toString() || '';
}