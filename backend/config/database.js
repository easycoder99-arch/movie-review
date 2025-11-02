const admin = require('firebase-admin');

// In-memory fallback storage
const fallbackStorage = {
  reviews: [
    {
      id: "1",
      movieId: "1",
      movieTitle: "The Shawshank Redemption",
      moviePoster: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
      userId: "user1",
      userName: "Movie Critic",
      rating: 5,
      comment: "A masterpiece that gets better with every viewing!",
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: "2", 
      movieId: "2",
      movieTitle: "The Godfather",
      moviePoster: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      userId: "user2",
      userName: "Film Enthusiast", 
      rating: 5,
      comment: "The perfect crime drama. Brando is incredible!",
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10')
    }
  ]
};

let db;
let usingFallback = false;

try {
  // Try to initialize Firebase
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token"
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });

  db = admin.firestore();
  console.log('✅ Firebase Admin initialized');

} catch (error) {
  console.log('⚠️  Firebase initialization failed, using in-memory storage');
  console.log('💡 Enable Firestore API at: https://console.cloud.google.com/apis/api/firestore.googleapis.com/overview?project=' + process.env.FIREBASE_PROJECT_ID);
  
  usingFallback = true;
  
  // Create mock Firestore-like interface
  db = {
    collection: (name) => {
      if (!fallbackStorage[name]) {
        fallbackStorage[name] = [];
      }
      
      return {
        doc: (id) => ({
          get: () => Promise.resolve({
            exists: fallbackStorage[name].some(item => item.id === id),
            data: () => fallbackStorage[name].find(item => item.id === id)
          }),
          set: (data) => {
            const index = fallbackStorage[name].findIndex(item => item.id === id);
            if (index >= 0) {
              fallbackStorage[name][index] = { id, ...data };
            } else {
              fallbackStorage[name].push({ id, ...data });
            }
            return Promise.resolve();
          },
          update: (data) => {
            const index = fallbackStorage[name].findIndex(item => item.id === id);
            if (index >= 0) {
              fallbackStorage[name][index] = { ...fallbackStorage[name][index], ...data };
            }
            return Promise.resolve();
          },
          delete: () => {
            fallbackStorage[name] = fallbackStorage[name].filter(item => item.id !== id);
            return Promise.resolve();
          }
        }),
        add: (data) => {
          const id = Date.now().toString();
          const item = { id, ...data };
          fallbackStorage[name].push(item);
          return Promise.resolve({ id });
        },
        where: (field, operator, value) => ({
          orderBy: (orderField, direction = 'asc') => ({
            get: () => {
              let filtered = fallbackStorage[name].filter(item => {
                if (operator === '==') return item[field] === value;
                return true;
              });
              
              filtered.sort((a, b) => {
                if (direction === 'desc') {
                  return new Date(b[orderField]) - new Date(a[orderField]);
                }
                return new Date(a[orderField]) - new Date(b[orderField]);
              });
              
              return Promise.resolve({
                forEach: (callback) => {
                  filtered.forEach(doc => callback({
                    id: doc.id,
                    data: () => doc
                  }));
                }
              });
            }
          }),
          get: () => {
            const filtered = fallbackStorage[name].filter(item => {
              if (operator === '==') return item[field] === value;
              return true;
            });
            
            return Promise.resolve({
              forEach: (callback) => {
                filtered.forEach(doc => callback({
                  id: doc.id, 
                  data: () => doc
                }));
              }
            });
          }
        })
      };
    }
  };
}

// Add helper to check if using fallback
db.isUsingFallback = () => usingFallback;
db.getFallbackData = () => fallbackStorage;

module.exports = db;