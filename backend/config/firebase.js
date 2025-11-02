const admin = require('firebase-admin');

// Check if Firebase app is already initialized
function initializeFirebase() {
  try {
    // Check if Firebase app is already initialized
    if (admin.apps.length > 0) {
      console.log('✅ Firebase app already initialized, reusing existing app');
      return admin.app();
    }

    // Check if all required environment variables are present
    const requiredEnvVars = [
      'FIREBASE_PROJECT_ID',
      'FIREBASE_PRIVATE_KEY_ID', 
      'FIREBASE_PRIVATE_KEY',
      'FIREBASE_CLIENT_EMAIL',
      'FIREBASE_CLIENT_ID'
    ];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        console.error(`❌ Missing required environment variable: ${envVar}`);
        console.error('💡 Please check your .env file and make sure all Firebase variables are set');
        return null;
      }
    }

    // Initialize Firebase Admin
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL)}`
    };

    // Initialize Firebase
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
    });

    console.log('✅ Firebase Admin initialized successfully');
    return app;

  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    console.log('💡 Troubleshooting tips:');
    console.log('1. Check if your .env file has correct Firebase credentials');
    console.log('2. Make sure private key is properly formatted with \\n for newlines');
    console.log('3. Verify your Firebase project exists');
    return null;
  }
}

// Initialize Firebase and get db instance
const app = initializeFirebase();
const db = app ? admin.firestore(app) : null;

// Export a function to get the database instance
function getDatabase() {
  if (!db) {
    throw new Error('Firebase not initialized. Check your configuration.');
  }
  return db;
}

// Test connection only if Firebase is initialized
if (db) {
  db.collection('test').doc('connection').get()
    .then(() => {
      console.log('✅ Firebase Firestore connected successfully!');
    })
    .catch((error) => {
      console.error('❌ Firebase Firestore connection failed:', error.message);
      console.log('💡 This might be normal if indexes are still building');
    });
}

module.exports = getDatabase;