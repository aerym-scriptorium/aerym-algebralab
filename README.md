# AlgebraLab (prototipe)

Flipbook interaktif Aljabar kelas VII dengan kanvas Polypad. Satu aktivitas: (2x + 3) + (x + 2).
Tanpa login, basis data, atau analitik. Jawaban siswa hanya disimpan di `localStorage` peramban.

Tampilan: dua halaman seperti buku terbuka (materi di kiri, kanvas di kanan) dengan efek balik halaman; panah kiri/kanan juga membalik halaman.

## Status pengujian
Integrasi Polypad **belum diuji** terhadap Polypad sungguhan (butuh API key dan akses ke polypad.amplify.com).
Kode mengikuti dokumentasi resmi, tetapi lakukan daftar uji di bawah sebelum menganggapnya berfungsi.

## Menjalankan
Modul ES tidak jalan lewat `file://`. Dari folder ini:

    python3 -m http.server 8000

lalu buka http://localhost:8000. Tanpa API key, materi, navigasi, dan kolom jawaban tetap berfungsi; panel kanvas menampilkan placeholder.

## Konfigurasi manual
1. Buat API key di https://polypad.amplify.com/api/documentation (formulir meminta nama, email, domain, dan deskripsi penggunaan; setujui syaratnya).
2. Isi `polypadApiKey` di `config.js`. Kunci ini akan tampak di URL skrip pada sisi klien, jadi bukan rahasia. Jangan commit kunci asli, dan buat kunci untuk domain tempat aplikasi dipasang.
3. Dokumentasi tidak menjelaskan apakah `localhost` diterima untuk pengujian lokal. Jika kanvas gagal dimuat, periksa pesan galat di panel dan tab Network (skrip `polypad.js`). Contoh dokumentasi memakai `apiKey=test`; belum diverifikasi untuk penggunaan nyata.
4. Syarat dari dokumentasi: tidak boleh men-cache/proxy respons API, meng-host `polypad.js` sendiri, atau menyembunyikan merek Polypad. Gratis di bawah 10 ribu permintaan per tahun; di atasnya perlu lisensi komersial.

## Daftar uji integrasi
- [ ] Skrip `polypad.js?lang=id&apiKey=...` berstatus 200 dan `window.Polypad` ada.
- [ ] Kanvas tampil dengan panel keping aljabar (opsi `sidebar: 'algebra'`).
- [ ] Menyeret keping x dan 1 ke kanvas memperbarui "Keping di kanvas" (event `change`).
- [ ] "Periksa keping" menampilkan umpan balik yang benar untuk 3 keping x + 5 keping 1.
- [ ] "Ulangi kanvas" mengosongkan kanvas; kanvas tetap utuh saat pindah halaman.
- [ ] Di layar sempit (<= 800px) materi di atas, kanvas di bawah, kanvas masih bisa digeser.
- [ ] Pastikan nilai `expr` keping di `serialize()` sesuai kunci `cek` (`x`, `1`); sesuaikan `activities.js` bila berbeda.

## Struktur
- `index.html`, `css/styles.css`: antarmuka.
- `js/activities.js`: data materi, petunjuk, pertanyaan, opsi kanvas awal, kunci pemeriksaan.
- `js/polypad-adapter.js`: satu-satunya kode yang memanggil API Polypad (`Polypad.create`, `on('change')`, `serialize`, `unSerialize`, `resize`).
- `js/main.js`: navigasi halaman, jawaban siswa, tombol.

Catatan dokumentasi: tanda tangan `Polypad.create` di bagian Methods tertulis hanya `(options)`, sedangkan contoh kode memakai `create(elemen, opsi)`. Prototipe mengikuti contoh; verifikasi saat pengujian.

## Memperluas menjadi flipbook beberapa unit
1. Tambahkan objek aktivitas baru di `AKTIVITAS` (`id`, `judul`, `halaman`, `polypad.initial`, `cek`).
2. Tambahkan daftar isi (pilihan unit) di `main.js` dan ganti konstanta `akt` menjadi variabel yang bisa berubah.
3. Saat berpindah unit: simpan `keadaan[id] = pad.simpan()`, lalu `pad.muat(keadaan[idBaru] || aktBaru.polypad.initial)`. Satu instance Polypad dipakai ulang.
4. Pisahkan kunci `localStorage` per aktivitas (sudah memakai `akt.id`).
5. Untuk aktivitas non-aljabar, ubah `hitungKeping`/`cek` per aktivitas, atau lepaskan dengan fungsi pemeriksa di data aktivitas.
6. Kualitas lanjutan: animasi balik halaman, ekspor jawaban (PDF/CSV), dan penyimpanan server baru ditambahkan setelah prototipe diuji.
