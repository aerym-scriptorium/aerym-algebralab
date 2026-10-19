// Data aktivitas. Tambahkan objek baru ke AKTIVITAS untuk unit/aktivitas lain.
// polypad.initial = data awal kanvas (format PolypadData dari dokumentasi Polypad).
// cek = jumlah keping yang diharapkan di kanvas, dihitung per nilai `expr` keping aljabar.
export const AKTIVITAS = [
  {
    id: 'penjumlahan-1',
    judul: 'Menjumlahkan bentuk aljabar: (2x + 3) + (x + 2)',
    polypad: { initial: { options: { sidebar: 'algebra', grid: 'square-dots' } } },
    cek: { x: 3, '1': 5 },
    halaman: [
      {
        judul: 'Kenali keping aljabar',
        isi: ['Keping persegi panjang mewakili x. Keping persegi kecil mewakili 1. Dengan keping ini, kita bisa melihat bentuk aljabar sebagai gambar.'],
        petunjuk: [
          'Ambil keping x dan keping 1 dari panel di sisi kanvas, lalu seret ke kanvas.',
          'Susun model (2x + 3) di satu sisi kanvas dan model (x + 2) di sisi lainnya.',
          'Tekan "Periksa keping" untuk mengecek jumlah kepingmu.'
        ],
        pertanyaan: []
      },
      {
        judul: 'Gabungkan keping sejenis',
        isi: ['Jumlahkan kedua ekspresi dengan menyatukan kedua model. Keping yang bentuknya sama adalah suku sejenis.'],
        petunjuk: [
          'Geser keping x ke satu kelompok dan keping 1 ke kelompok lain.',
          'Hitung banyak keping di setiap kelompok.'
        ],
        pertanyaan: [{ id: 'p2', label: 'Setelah digabung, ada berapa keping x dan berapa keping 1?' }]
      },
      {
        judul: 'Tulis bentuk simbolik',
        isi: ['Sekarang ubah gambar kepingmu menjadi tulisan aljabar.'],
        petunjuk: ['Tulis banyak keping x sebagai suku x, dan banyak keping 1 sebagai konstanta.'],
        pertanyaan: [{ id: 'p3', label: 'Tuliskan hasil (2x + 3) + (x + 2) dalam bentuk paling sederhana.' }]
      },
      {
        judul: 'Hubungkan model dan simbol',
        isi: ['Aljabar punya tiga cara bercerita: gambar (keping), simbol (tulisan aljabar), dan kata-kata.'],
        petunjuk: ['Lihat kembali kanvas dan jawabanmu, lalu jelaskan hubungannya.'],
        pertanyaan: [
          { id: 'p4', label: 'Bagian mana dari modelmu yang menunjukkan setiap suku pada hasilmu?' },
          { id: 'p5', label: 'Mengapa keping x dan keping 1 tidak bisa digabung menjadi satu jenis keping?' }
        ]
      }
    ]
  }
];
