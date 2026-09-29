# ReadQuest 📖🦉

Platform web untuk anak **SD kelas 6** berlatih bahasa Inggris lewat **membaca** dan **menonton video**, dengan fokus pada **kosa kata** dan **comprehension** (memahami teks dan menjawab pertanyaan). Dilengkapi sistem reward yang seru supaya anak konsisten belajar setiap hari.

Tanpa akun, tanpa server, dan tanpa build. **Semua data tersimpan di perangkat** (localStorage browser).

## Cara menjalankan

Video YouTube tidak bisa diputar dari `file://`, jadi buka lewat server lokal sederhana:

```bash
cd comprehension
python3 -m http.server 8000
# buka http://localhost:8000
```

Atau publikasikan gratis dengan **GitHub Pages** (Settings → Pages → Deploy from branch → root). Setelah dibuka sekali, aplikasi juga bisa di-*install* ke layar utama HP/tablet (PWA). Bacaan dan permainan kata tetap bisa dipakai saat offline. Video dan kamus online tetap butuh internet.

Browser yang disarankan: **Chrome/Edge** (mendukung suara text-to-speech dan pengenalan suara untuk latihan bicara).

**Suara:** pelafalan kata memakai **rekaman suara manusia asli** (Wiktionary, lewat dictionaryapi.dev) jika tersedia dan ada internet. Kalimat dibacakan oleh suara paling alami yang ada di perangkat (misalnya suara *Natural* di Microsoft Edge, suara *Google* di Chrome, atau suara *Enhanced* di iPhone/Mac). Suara dan kecepatannya bisa diganti dan dites di menu Parent → Settings.

## Fitur

### 📚 Membaca (gaya Eigo + ReadTheory)
Setiap bacaan terdiri dari beberapa aktivitas yang saling terhubung (mirip 7 aktivitas per pelajaran di Eigo):

1. **Words**: kartu kosa kata (flip card) dengan suara dan arti Bahasa Indonesia
2. **Read**: teks dengan kata penting yang disorot. **Ketuk kata apa saja** untuk melihat artinya. Tersedia *Read to me* dengan sorotan kata dan pilihan kecepatan.
3. **Quiz**: soal comprehension satu per satu dengan penjelasan setelah menjawab. Jenis soalnya: *Main Idea, Key Detail, Word Meaning, Inference, Sequence, Author's Purpose, Cause & Effect*.
4. **Match**: game mencocokkan kata dengan arti
5. **Speak**: mengucapkan kalimat dengan mikrofon, dan setiap kata diberi nilai (Web Speech API)
6. **Write**: menulis jawaban singkat dengan checklist (jumlah kata, memakai kosa kata baru, huruf kapital dan tanda baca)
7. **Done**: bintang, XP, dan info naik level

**Level adaptif (seperti ReadTheory):** 5 level (≈ kelas 4 sampai 8). Dua kali skor ≥80% pada percobaan pertama akan menaikkan level. Dua kali skor <50% akan menurunkan level. Mengulang bacaan tetap boleh, tetapi XP-nya setengah dan tidak memengaruhi level.

Tersedia **12 bacaan orisinal** (fiksi dan nonfiksi, banyak bertema Indonesia: Komodo, Borobudur, batik, Krakatau, orangutan, mangrove, terumbu karang, dll.) dengan total 70 soal.

### 🎬 Menonton video (gaya Edpuzzle)
- Video **berhenti otomatis** di waktu tertentu untuk memberi pertanyaan (pilihan ganda atau jawaban tertulis)
- **Tidak bisa loncat ke depan**: kontrol YouTube diganti tombol aplikasi di bawah video (play, mundur 10 detik, kecepatan, subtitle, layar penuh), dan timeline hanya bisa diklik untuk mengulang bagian yang sudah ditonton. Ada juga tombol *Watch that part again*. Area video tidak bisa diklik (link YouTube seperti *More videos* dan logo tidak bisa dibuka); klik di area video hanya memutar atau menjeda. Saat pertanyaan muncul, video ditutup sementara dengan layar "Answer the question below" supaya anak fokus ke soal. Video juga dijeda otomatis saat anak pindah tab.
- **Kosa kata muncul** saat kata itu diucapkan, lalu otomatis disimpan ke Word Garden
- Timeline menunjukkan posisi pertanyaan
- Video bawaan: National Geographic *Oceans 101*, TED-Ed (*tornadoes, sleep, cats, bilingual brain*), dan 2 episode **BBC Learning English – 6 Minute English**
- Mendukung YouTube dan link video langsung (.mp4/.webm)

### 🌼 Word Garden (kosa kata)
- Kata dari bacaan, video, dan kata yang disimpan anak sendiri menjadi "tanaman" 🌰→🌱→🌿→🪴→🌳→🌸
- **Spaced repetition** (kotak Leitner): kata yang perlu diulang ditandai 💧 "perlu disiram"
- Game: **Water my words** (review), **Match Race**, **Spelling Bee** (dengar lalu ketik), **Fill the Gap**
- Kata di luar daftar dicari lewat kamus online gratis (dictionaryapi.dev). Anak juga bisa menulis arti sendiri.

### 🎮 Sistem reward
- ⭐ **XP** dan 9 **rank** (Word Sprout sampai Comprehension Master)
- 🔥 **Streak harian** dengan kalender minggu ini, plus 🧊 **Streak Shield** yang melindungi streak saat bolos 1 hari
- 🎯 **Target XP harian** (bisa diatur orang tua) dengan animasi perayaan
- 📜 **3 Daily Quest** yang berganti setiap hari. Jika semua selesai, anak bisa membuka 🎁 **peti harta** berisi hadiah acak.
- 🦉 **Lumo**, hewan peliharaan yang menetas dari telur dan berevolusi seiring XP. Lumo sedih kalau anak tidak belajar, dan bisa diberi makan.
- 🪙 **Koin** untuk membeli topi, kacamata, dan latar kamar Lumo di Shop
- 🏅 **17 badge**, confetti, dan efek suara

### 👪 Area orang tua/guru (dengan PIN)
- Laporan: level, streak, hari aktif, akurasi, **grafik kemampuan per jenis soal** beserta saran fokus latihan, heatmap 5 minggu, dan riwayat
- Membaca semua **tulisan dan jawaban terbuka** anak
- Pengaturan: target harian, level manual, kecepatan suara, arti Bahasa Indonesia on/off, hadiah Streak Shield
- **Lesson Builder**:
  - Membuat **bacaan sendiri** (teks, kosa kata, soal, kalimat bicara, tugas menulis)
  - Membuat **video interaktif sendiri**: tempel link YouTube (misalnya BBC Learning English), putar preview, lalu tekan **⏱ Now** untuk menaruh pertanyaan di detik itu
  - **Menyalin video bawaan** untuk mengubah waktu pertanyaan
- Multi-profil (beberapa anak di satu perangkat)
- **Backup/restore** file JSON, reset progres, ganti PIN

## Catatan penting
- **Waktu jeda video bawaan** dipasang dengan perkiraan yang aman, yaitu sedikit setelah topiknya dibahas. Pertanyaan yang kami tidak yakin waktunya diletakkan di akhir video. Jika perlu disesuaikan, gunakan *Copy a built-in video to edit* di Lesson Builder.
- Untuk video **BBC 6 Minute English**, pertanyaannya berupa jawaban tertulis (kuis pembuka dan jawabannya, 3 kata baru, dan ringkasan), yang kemudian diperiksa orang tua/guru.
- Data hanya ada di browser tersebut. Menghapus data situs atau memakai mode incognito akan menghapus progres, jadi **unduh backup secara berkala**. PIN orang tua hanya penghalang sederhana untuk anak, bukan pengaman.
- Kata yang dicari di kamus dikirim ke `api.dictionaryapi.dev`. Tidak ada data pribadi yang dikirim ke mana pun.

## Struktur

```
index.html            shell aplikasi
css/style.css         tampilan
js/store.js           penyimpanan localStorage (profil, backup, migrasi)
js/rewards.js         XP, streak, quest, peti, badge, pet, shop
js/srs.js             spaced repetition
js/ui.js              toast, modal, confetti, suara, text-to-speech
js/data/*.js          konten: bacaan, video, reward
js/views/*.js         halaman: home, reading, video, words, me (Lumo), parent, builder
sw.js                 cache offline (PWA)
```

Untuk menambah bacaan bawaan, tambahkan objek baru di `js/data/readings.js` dengan format yang sama. Untuk video, gunakan `js/data/videos.js` (`t` dalam detik, `-1` = setelah video selesai).
