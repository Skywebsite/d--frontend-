import React, { useState } from 'react'
import Chat from './Chat'
import RecentSearches from './RecentSearches'
import './index.css'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function App() {
  const [searches, setSearches] = useState([]);
  const [activeSearch, setActiveSearch] = useState('');

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
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Chat onSearch={handleNewSearch} activeSearch={activeSearch} />
      </main>

      <div style={{
        position: 'fixed',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10
      }}>
        <RecentSearches searches={searches} onSelect={setActiveSearch} />
      </div>
    </div>
  )
}

export default App
