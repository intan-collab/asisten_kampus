import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Ganti di satu tempat ini kalau model tidak tersedia (error 404)
const GEMINI_MODEL = 'gemini-3.5-flash-lite';

// ====== KUSTOMISASI CHATBOT (ubah sesuai use case-mu) ======
const SYSTEM_INSTRUCTION = `
Kamu adalah "Asisten Kampus" untuk mahasiswa STMIK Catur Sakti Kendari.
Gaya bahasa: Indonesia santai tapi sopan, singkat, dan jelas.
Topik yang dijawab: KRS, jadwal kuliah, cuti akademik, surat keterangan, dan kehidupan kampus.
Batasan: jika pertanyaan di luar urusan kampus, tolak dengan sopan dan arahkan kembali ke topik kampus.
Kamu tidak punya data resmi kampus seperti tanggal, biaya, atau aturan spesifik. Jangan mengarang.
Untuk hal seperti itu, katakan kamu tidak tahu dan sarankan menghubungi bagian akademik atau membuka SIAKAD (siakad.catursakti.ac.id).
Kamu boleh menjelaskan langkah umum dan istilah akademik (misalnya apa itu KRS).
Tulis jawaban sebagai teks biasa. Jangan pakai tanda bintang, tanda pagar, atau format markdown lainnya.
`;

const TEMPERATURE = 0.3; // rendah = lebih konsisten dan faktual (rentang 0.0 - 2.0)
// ===========================================================

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // menyajikan tampilan dari folder public/

// POST /api/chat
// Body: { "conversation": [ { "role": "user" | "model", "text": "..." } ] }
app.post('/api/chat', async (req, res) => {
  const { conversation } = req.body;

  if (!Array.isArray(conversation) || conversation.length === 0) {
    return res.status(400).json({ message: 'conversation harus berupa array dan tidak boleh kosong.' });
  }

  try {
    // Ubah format pesan ke format Gemini: { role, parts: [{ text }] }
    const contents = conversation.map(({ role, text }) => ({
      role: role === 'model' ? 'model' : 'user',
      parts: [{ text }],
    }));

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        temperature: TEMPERATURE,
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ready on http://localhost:${PORT}`));