// Satu-satunya berkas yang menyentuh API Polypad.
// Dasar: https://polypad.amplify.com/api/documentation
//  - skrip: .../api/latest/polypad.js?lang=..&apiKey=.. (dipasang di <body>)
//  - Polypad.create(elemen, opsi) -> instance
//  - instance.on('change'), serialize(), unSerialize(data), resize()
const URL_SKRIP = 'https://polypad.amplify.com/api/latest/polypad.js';
let janjiMuat = null;

function muatSkrip(cfg) {
  if (window.Polypad) return Promise.resolve();
  if (!janjiMuat) {
    janjiMuat = new Promise((ok, gagal) => {
      const s = document.createElement('script');
      s.src = `${URL_SKRIP}?lang=${encodeURIComponent(cfg.lang || 'id')}&apiKey=${encodeURIComponent(cfg.polypadApiKey)}`;
      s.onload = ok;
      s.onerror = () => { janjiMuat = null; gagal(new Error('Skrip Polypad gagal dimuat. Periksa API key, koneksi, dan domain.')); };
      document.body.appendChild(s);
    });
  }
  return janjiMuat;
}

export async function buatPolypad(wadah, cfg, dataAwal, onChange) {
  await muatSkrip(cfg);
  if (!window.Polypad) throw new Error('Objek Polypad tidak tersedia setelah skrip dimuat.');
  const pad = window.Polypad.create(wadah, { lightUI: true, initial: dataAwal, resetState: dataAwal });
  pad.on('change', () => onChange());

  return {
    simpan: () => pad.serialize(),
    muat: (data) => { pad.unSerialize(data || dataAwal); onChange(); },
    reset: () => { pad.unSerialize(dataAwal); onChange(); },
    ubahUkuran: () => pad.resize(),
    // Menghitung keping aljabar per nilai expr, mis. { x: 3, '1': 5 }
    hitungKeping() {
      const hasil = {};
      const tiles = pad.serialize().tiles || {};
      for (const id in tiles) {
        if (tiles[id].name === 'algebra') hasil[tiles[id].expr] = (hasil[tiles[id].expr] || 0) + 1;
      }
      return hasil;
    }
  };
}
