# Love Language App

Love Language App adalah aplikasi berbasis web yang dikembangkan menggunakan Preact, Tailwind CSS, dan Firebase. Aplikasi ini dirancang untuk membantu pengguna memahami dan mengekspresikan bahasa cinta mereka.

## 🚀 Teknologi yang Digunakan
- **Preact**: Framework JavaScript ringan untuk membangun antarmuka pengguna.
- **Tailwind CSS**: Framework CSS untuk styling yang cepat dan responsif.
- **Firebase**: Backend as a Service (BaaS) yang menyediakan otentikasi, database, dan hosting.

## 📌 Fitur Utama
- Kuis untuk menentukan bahasa cinta pengguna.
- Penyimpanan hasil kuis di Firebase Firestore.
- Autentikasi pengguna dengan Firebase Authentication.
- Antarmuka responsif dan ringan.

## 🛠️ Instalasi & Menjalankan Proyek
1. **Kloning repositori:**
   ```sh
   git clone https://github.com/username/love-language-app.git
   cd love-language-app
   ```
2. **Instal dependensi:**
   ```sh
   npm install
   ```
3. **Konfigurasi Firebase:**
   - Buat proyek baru di [Firebase Console](https://console.firebase.google.com/).
   - Aktifkan Authentication dan Firestore Database.
   - Salin konfigurasi Firebase dan simpan di file `.env`:
     ```env
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```
4. **Jalankan aplikasi secara lokal:**
   ```sh
   npm run dev
   ```

## 📦 Build untuk Produksi
Untuk membangun aplikasi versi produksi, gunakan perintah:
```sh
npm run build
```

## 📜 Lisensi
Proyek ini menggunakan lisensi **MIT**.

---
Dibuat dengan ❤️ menggunakan Preact, Tailwind CSS, dan Firebase.

