// src/App.js
import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Registration from './components/Registration';

function App() {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="App">
      <div className="app-container">
        <header className="App-header">
          <h1>Poalim Flex Application</h1>
        </header>
        <main>
          <div className="tab-container">
            <div className="tabs">
              <button 
                className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </button>
              <button 
                className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => setActiveTab('register')}
              >
                Register
              </button>
            </div>
            
            {activeTab === 'login' ? <Login /> : <Registration />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;