// middlewares/verifyFirebaseToken.js
const admin = require('../utils/firebaseAdmin');

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No Firebase token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name } = decodedToken;

    console.log('✅ Firebase token verified:', { uid, email, name });

    // Just attach user info, don't query or create
    req.user = { uid, email, name };
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err);
    return res.status(403).json({ error: 'Invalid or expired Firebase token' });
  }
};

module.exports = verifyFirebaseToken;
