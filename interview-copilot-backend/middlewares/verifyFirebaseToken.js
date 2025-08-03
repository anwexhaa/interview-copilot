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

    // ✅ Attach user info for downstream use
    req.user = {
      id: uid,           // Required for Prisma compatibility (e.g. userId)
      email: email,
      name: name || 'Anonymous',
    };

    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err);
    return res.status(403).json({ error: 'Invalid or expired Firebase token' });
  }
};

module.exports = verifyFirebaseToken;
