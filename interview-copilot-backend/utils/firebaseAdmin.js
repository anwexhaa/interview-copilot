// utils/firebaseAdmin.js
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// __dirname is available in CommonJS by default
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'firebase-admin.json'), 'utf-8')
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
