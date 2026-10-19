import { AKTIVITAS } from './activities.js';
import { buatPolypad } from './polypad-adapter.js';

const cfg = window.ALGEBRALAB_CONFIG || {};
const akt = AKTIVITAS[0];
const $ = (id) => document.getElementById(id);
const KUNCI = 'algebralab:' + akt.id;
let hal = 0;
let pad = null;

function el(tag, kelas, teks) {
  const e = document.createElement(tag);
  if (kelas) e.className = kelas;
  if (teks !== undefined) e.textContent = teks;
  return e;
}

// Jawaban siswa disimpan di penyimpanan peramban saja (tanpa server/basis data).
let jawaban = {};
try { jawaban = JSON.parse(localStorage.getItem(KUNCI)) || {}; } catch { jawaban = {}; }
function simpanJawaban() { try { localStorage.setItem(KUNCI, JSON.stringify(jawaban)); } catch { /* abaikan */ } }

function render() {
  const h = akt.halaman[hal];
  $('judul-aktivitas').textContent = akt.judul;
  $('penanda').textContent = `Halaman ${hal + 1} dari ${akt.halaman.length}`;
  $('judul-halaman').textContent = h.judul;

  const isi = $('isi'); isi.replaceChildren(...h.isi.map((t) => el('p', '', t)));

  const pet = $('petunjuk'); pet.replaceChildren();
  if (h.petunjuk.length) {
    const ol = el('ol');
    h.petunjuk.forEach((t) => ol.append(el('li', '', t)));
    pet.append(el('h3', '', 'Petunjuk'), ol);
  }

  const soal = $('pertanyaan'); soal.replaceChildren();
  h.pertanyaan.forEach((q) => {
    const lab = el('label', 'soal', q.label);
    const ta = el('textarea'); ta.rows = 3; ta.value = jawaban[q.id] || '';
    ta.placeholder = 'Tulis jawabanmu di sini';
    ta.addEventListener('input', () => { jawaban[q.id] = ta.value; simpanJawaban(); });
    lab.append(ta); soal.append(lab);
  });

  $('sebelumnya').disabled = hal === 0;
  $('berikutnya').disabled = hal === akt.halaman.length - 1;
  const titik = $('titik'); titik.replaceChildren();
  akt.halaman.forEach((_, i) => {
    const b = el('button', i === hal ? 'aktif' : '');
    b.type = 'button'; b.setAttribute('aria-label', `Ke halaman ${i + 1}`);
    if (i === hal) b.setAttribute('aria-current', 'page');
    b.addEventListener('click', () => pindah(i));
    titik.append(b);
  });
}

function pindah(i) {
  if (i < 0 || i >= akt.halaman.length) return;
  const arah = i > hal ? 'maju' : 'mundur';
  hal = i; render();
  const m = document.querySelector('.materi');
  m.classList.remove('maju', 'mundur'); void m.offsetWidth; m.classList.add(arah);
  $('judul-halaman').focus();
}

function perbaruiHitung() {
  if (!pad) return;
  const h = pad.hitungKeping();
  const teks = Object.entries(h).map(([e, n]) => `${e}: ${n}`).join(', ');
  $('hitung').textContent = teks ? `Keping di kanvas, ${teks}` : 'Kanvas masih kosong';
}

function periksa() {
  if (!pad) return;
  const h = pad.hitungKeping(), t = akt.cek;
  const sama = Object.keys({ ...h, ...t }).every((k) => (h[k] || 0) === (t[k] || 0));
  $('umpan').textContent = sama
    ? 'Jumlah keping sudah sesuai. Sekarang gabungkan keping yang sejenis.'
    : 'Jumlah keping belum sesuai. Periksa lagi: setiap ekspresi memakai berapa keping x dan berapa keping 1?';
}

function tampilkanPlaceholder(pesan) {
  const p = el('div', 'placeholder');
  p.append(el('strong', '', 'Kanvas Polypad belum aktif'), el('p', '', pesan));
  $('polypad').replaceChildren(p);
  ['periksa', 'reset'].forEach((id) => { $(id).disabled = true; });
}

async function mulaiPolypad() {
  if (!cfg.polypadApiKey) {
    tampilkanPlaceholder('API key belum diisi. Isi polypadApiKey di config.js, lalu muat ulang halaman (lihat README.md).');
    return;
  }
  try {
    pad = await buatPolypad($('polypad'), cfg, akt.polypad.initial, perbaruiHitung);
    perbaruiHitung();
  } catch (galat) {
    tampilkanPlaceholder(galat.message);
  }
}

$('sebelumnya').addEventListener('click', () => pindah(hal - 1));
$('berikutnya').addEventListener('click', () => pindah(hal + 1));
$('periksa').addEventListener('click', periksa);
$('reset').addEventListener('click', () => {
  if (pad && confirm('Hapus semua keping dan mulai dari kanvas awal?')) { pad.reset(); $('umpan').textContent = ''; }
});

// Panah kiri/kanan membalik halaman (tidak aktif saat mengetik atau memakai kanvas).
document.addEventListener('keydown', (e) => {
  if (/TEXTAREA|INPUT/.test(e.target.tagName) || e.target.closest('#polypad')) return;
  if (e.key === 'ArrowRight') pindah(hal + 1);
  if (e.key === 'ArrowLeft') pindah(hal - 1);
});

render();
mulaiPolypad();
