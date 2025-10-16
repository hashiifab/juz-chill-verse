## Visi Proyek

Proyek ini bertujuan untuk menyediakan pengalaman membaca dan eksplorasi Juz 'Amma Al-Qur'an yang modern, personal, dan imersif bagi generasi Z Muslim. Kami ingin membuat Al-Qur'an lebih mudah diakses dan relevan dalam kehidupan sehari-hari mereka melalui teknologi.

## Arsitektur

- **Frontend**: Dibangun dengan React (Vite) dan TypeScript untuk antarmuka pengguna yang dinamis dan interaktif.
- **Styling**: Menggunakan Tailwind CSS untuk styling yang cepat dan responsif.
- **State Management**: Menggunakan React Context API untuk manajemen state sederhana.
- **Routing**: Menggunakan React Router DOM untuk navigasi antar halaman.
- **Audio Playback**: Menggunakan HTML5 Audio API untuk pemutaran audio ayat-ayat Al-Qur'an.

## Tumpukan Teknologi

- **Bahasa**: TypeScript, JavaScript, HTML, CSS
- **Framework/Library**: React, Vite, Tailwind CSS, React Router DOM
- **Alat Pengembangan**: npm, Git, Vercel (untuk deployment)

## Pedoman Pengkodean

- **Modularitas**: Kode diatur berdasarkan fitur/domain, bukan jenis file. Komponen yang dapat digunakan kembali ditempatkan di folder `components/`.
- **Penamaan**: Ikuti konvensi penamaan yang konsisten (misalnya, PascalCase untuk komponen, camelCase untuk fungsi).
- **Tipe**: Gunakan TypeScript untuk memastikan keamanan tipe di seluruh proyek.
- **Komentar**: Setiap fungsi harus memiliki komentar tingkat fungsi (Google-style docstrings) yang menjelaskan tujuannya, argumen, dan nilai kembalian.
- **Pengujian**: Tulis tes unit untuk setiap fitur (minimal 3 kasus: sukses, edge, gagal).
- **Variabel Lingkungan**: Jangan pernah mengkodekan variabel lingkungan atau kunci API secara langsung; gunakan `.env` atau manajer rahasia.

## Strategi SEO

- **Sitemap**: File `sitemap.xml` dibuat dan ditempatkan di direktori `public/` untuk membantu mesin pencari menemukan dan mengindeks semua halaman publik, terutama halaman detail Surah individual, menggunakan URL produksi `https://quran-gamma-inky.vercel.app/`.
- **Meta Tag**: Meta tag verifikasi situs Google telah ditambahkan ke `index.html` untuk verifikasi kepemilikan situs.