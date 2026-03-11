// export-users.js (jalankan dengan node export-users.js)
const fs = require('fs-extra');
const path = require('path');

const USERS_KEY = '@kasirapp_users';

async function exportUsers() {
  try {
    // Kamu perlu copy isi AsyncStorage secara manual dari console app
    // Atau jalankan app, lalu copy hasil console.log dari App.tsx
    // Untuk contoh, anggap data sudah kamu simpan di variabel ini
    const usersData = {
      "dev@example.com": {
        "name": "Dev",
        "email": "dev@example.com",
        "password": "123456",
        "isProfileComplete": true
      }
      // ... tambahkan data real dari console app
    };

    const outputPath = path.join(__dirname, 'data', 'users-export.json');
    await fs.writeJson(outputPath, usersData, { spaces: 2 });
    console.log(`Data diekspor ke: ${outputPath}`);
  } catch (err) {
    console.error('Gagal export:', err);
  }
}

exportUsers();