import React, { useState } from 'react'
import Chat from './Chat'
import RecentSearches from './RecentSearches'
import './index.css'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Menu, X } from 'lucide-react';

function App() {
  const [searches, setSearches] = useState([]);
  const [activeSearch, setActiveSearch] = useState('');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

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
