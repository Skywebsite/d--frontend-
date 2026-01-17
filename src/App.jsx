import React, { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Chat from './Chat'
import RecentSearches from './RecentSearches'
import Auth from './Auth'
import './index.css'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Menu, X, LogOut, User } from 'lucide-react';

function App() {
  const [searches, setSearches] = useState([]);
  const [activeSearch, setActiveSearch] = useState('');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          photoURL: firebaseUser.photoURL
        });
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          photoURL: firebaseUser.photoURL
        }));
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  const handleNewSearch = (query) => {
    setSearches(prev => {
      const newSearches = [query, ...prev.filter(s => s !== query)].slice(0, 5);
      return newSearches;
    });
  };

  return (
    <div className="App">
      <div className="lottie-bg" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '50%', /* Occupy left half */
        height: '100%',
        zIndex: 0, /* Sit at base level */
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <DotLottieReact
          src="https://lottie.host/f6d08a7d-293e-49c3-9437-a56420483505/WrfXipDXLC.lottie"
          loop
          autoplay
          style={{ width: '100%', height: '100%' }}
          backgroundColor="#000000"
        />
      </div>

      {/* Mobile Header / Hamburger */}
      <div className="mobile-header">
        <button onClick={() => setShowMobileSidebar(true)} className="icon-btn">
          <Menu color="white" />
        </button>
      </div>

      {/* User Profile & Logout Button */}
      <div 
        className="user-profile-button"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(255, 255, 255, 0.98)',
          padding: '8px 12px 8px 16px',
          borderRadius: '28px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          transition: 'all 0.2s ease'
        }}
      >
        {user.photoURL ? (
          <img 
            src={user.photoURL} 
            alt={user.displayName}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1e88e5 0%, #42a5f5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}>
            {user.displayName?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
        <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#333' }}>
          {user.displayName}
        </span>
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            color: '#666',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#c33'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>

      <main style={{ position: 'relative', zIndex: 1 }}>
        <Chat onSearch={handleNewSearch} activeSearch={activeSearch} />
      </main>

      {/* Recent Searches Wrapper (Desktop Right / Mobile Sidebar) */}
      <div className={`recent-searches-wrapper ${showMobileSidebar ? 'open' : ''}`}>
        {/* Close Button for Mobile */}
        <button
          className="mobile-close-btn"
          onClick={() => setShowMobileSidebar(false)}
        >
          <X color="white" />
        </button>

        <RecentSearches
          searches={searches}
          onSelect={(term) => {
            setActiveSearch(term);
            setShowMobileSidebar(false); // Close on select
          }}
        />
      </div>

      {/* Overlay for mobile sidebar */}
      {showMobileSidebar && (
        <div className="sidebar-overlay" onClick={() => setShowMobileSidebar(false)} />
      )}

    </div>
  )
}

export default App
