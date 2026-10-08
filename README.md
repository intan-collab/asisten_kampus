# Asisten Kampus STMIK Catur Sakti Kendari

Chatbot berbasis web yang membantu mahasiswa mencari informasi seputar KRS, jadwal kuliah, cuti akademik, surat keterangan, dan kehidupan kampus. Chatbot tampil sebagai jendela chat di dalam website bertema kampus, dan memakai Google Gemini sebagai model AI-nya.

Proyek ini dibuat untuk tugas akhir kursus **AI Productivity and AI API Integration for Developers** (Hacktiv8).

## Fitur

- Percakapan berkelanjutan: riwayat chat dikirim ke model sehingga bot mengingat konteks pertanyaan sebelumnya.
- Persona dan batasan topik lewat `systemInstruction`: gaya bahasa santai tapi sopan, hanya menjawab urusan kampus, dan menolak topik di luar itu.
- `temperature` rendah (0.3) agar jawaban konsisten dan tidak mengarang.
- Jika bot tidak punya informasinya, ia mengarahkan pengguna ke bagian akademik atau SIAKAD.
- Tampilan chat berupa widget di pojok kanan bawah website kampus.

## Teknologi

- Node.js dan Express
- `@google/genai` (Google Gemini API)
- `dotenv` untuk menyimpan API key
- `cors`
- HTML, CSS, dan JavaScript tanpa framework

## Cara menjalankan

1. Clone repositori ini lalu masuk ke foldernya:
   ```
   git clone https://github.com/intan-collab/asisten_kampus.git
   cd asisten_kampus
   ```
2. Pasang paket:
   ```
   npm install
   ```
3. Buat file `.env` (contohnya ada di `.env.example`), lalu isi dengan API key dari [Google AI Studio](https://aistudio.google.com/apikey):
   ```
   GEMINI_API_KEY=isi_api_key_kamu_di_sini
   ```
4. Jalankan server:
   ```
   node index.js
   ```
5. Buka `http://localhost:3000` di browser, lalu klik tombol **Tanya Asisten**.

## Struktur proyek

```
asisten_kampus
├── public
│   ├── index.html     # halaman website dan jendela chat
│   ├── style.css      # tampilan
│   └── script.js      # logika chat di sisi browser
├── screenshots        # tangkapan layar untuk README
├── .env.example       # contoh isi file .env
├── .gitignore
├── index.js           # server Express dan endpoint /api/chat
├── package.json
└── README.md
```

## Endpoint

### `POST /api/chat`

Request:

```json
{
  "conversation": [
    { "role": "user", "text": "Apa itu KRS?" }
  ]
}
```

`role` bernilai `user` untuk pesan pengguna dan `model` untuk balasan bot.

Response (200):

```json
{ "result": "KRS adalah Kartu Rencana Studi, ..." }
```

Jika `conversation` kosong atau bukan array, server mengembalikan status 400. Jika terjadi kesalahan saat memanggil Gemini, server mengembalikan status 500 beserta pesan error.

## Pengaturan chatbot

Di bagian atas `index.js`:

- `SYSTEM_INSTRUCTION`: peran, gaya bahasa, topik, dan batasan chatbot.
- `TEMPERATURE`: tingkat kreativitas jawaban.
- `GEMINI_MODEL`: nama model Gemini yang dipakai.

## Tangkapan layar

### Tampilan awal
![Tampilan awal](screenshots/tampilan-awal.png)

### Percakapan dengan chatbot
![Percakapan](screenshots/percakapan.png)

### Bot menolak topik di luar kampus
![Penolakan topik](screenshots/penolakan-topik.png)

## Catatan

- Chatbot tidak memiliki data resmi kampus seperti tanggal, biaya, atau aturan spesifik, sehingga untuk hal tersebut ia mengarahkan pengguna ke bagian akademik atau SIAKAD.
- Informasi dari chatbot hanya bantuan umum. Untuk urusan administrasi resmi, hubungi bagian akademik.
- Nama model dapat berubah atau tidak tersedia lagi. Jika muncul error 404 soal model, ganti nilai `GEMINI_MODEL` di `index.js`.
- Jangan unggah file `.env` ke GitHub. File tersebut sudah diabaikan lewat `.gitignore`.
