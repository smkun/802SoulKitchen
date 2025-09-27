import React, { useEffect, useState } from 'react';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvGG5PnYpksQRzk8RvZ7Lyc8FaxwM-kG4",
  authDomain: "soulkitchen-9e6b2.firebaseapp.com",
  projectId: "soulkitchen-9e6b2",
  storageBucket: "soulkitchen-9e6b2.firebasestorage.app",
  messagingSenderId: "370735557737",
  appId: "1:370735557737:web:f08d5a4052e12b5a7f06f8",
  measurementId: "G-4XNBK7TP6J"
};

// Firebase CDN URL for v11.6.1 (same as original script.js)
const FIREBASE_CDN_BASE = "https://www.gstatic.com/firebasejs/11.6.1";

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  order?: number;
}

export default function FirebaseMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Use CDN imports exactly like the original script.js
        const { initializeApp } = await import(`${FIREBASE_CDN_BASE}/firebase-app.js`);
        const { getFirestore, collection, onSnapshot } = await import(`${FIREBASE_CDN_BASE}/firebase-firestore.js`);

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        const menuCollection = collection(db, "menu");

        const unsubscribe = onSnapshot(menuCollection,
          (snapshot) => {
            try {
              const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              })) as MenuItem[];

              // Sort in JavaScript (same as original script.js)
              const categoryOrder = ['Mains', 'Combos', 'Sides', 'Drinks', 'Dessert'];
              items.sort((a, b) => {
                if (a.category !== b.category) {
                  return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
                }
                return (a.order || 0) - (b.order || 0);
              });

              setMenuItems(items);
              setLoading(false);
            } catch (err) {
              console.error('Error processing menu data:', err);
              setError('Failed to load menu data');
              setLoading(false);
            }
          },
          (err) => {
            console.error('Error fetching menu:', err);
            setError('Failed to connect to menu database');
            setLoading(false);
          }
        );

        return () => unsubscribe();
      } catch (err) {
        console.error('Firebase initialization failed:', err);
        setError('Failed to initialize Firebase');
        setLoading(false);
      }
    };

    initializeFirebase();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
        <p className="mt-2 text-brand-white/70">Loading our delicious menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-brand-red mb-4">⚠️ {error}</p>
        <p className="text-brand-white/70">Please check back soon for our full menu!</p>
      </div>
    );
  }

  if (menuItems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-brand-white/70">No menu items available at the moment.</p>
        <p className="text-brand-white/70">Check back soon for our delicious offerings!</p>
      </div>
    );
  }

  // Group items by category
  const categorizedItems: { [key: string]: MenuItem[] } = {};
  const categories = ['Mains', 'Combos', 'Sides', 'Drinks', 'Dessert'];

  menuItems.forEach(item => {
    if (!categorizedItems[item.category]) {
      categorizedItems[item.category] = [];
    }
    categorizedItems[item.category].push(item);
  });

  return (
    <div className="menu-grid">
      {categories.map(category => {
        if (!categorizedItems[category] || categorizedItems[category].length === 0) {
          return null;
        }

        return (
          <div key={category} className="menu-category">
            <h3 className="text-xl font-bold mb-4 text-brand-orange">{category}</h3>
            <ul className="menu-bullet-list">
              {categorizedItems[category].map(item => (
                <li key={item.id} className="menu-bullet-item">
                  • <strong className="text-brand-white">{item.name}</strong>
                  {item.description && (
                    <>
                      <br />
                      <span className="text-brand-white/80 text-sm ml-3">{item.description}</span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}