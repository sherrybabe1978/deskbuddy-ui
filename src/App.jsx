import React, { useState } from 'react'
import './App.css'

function App() {
  const [activeButton, setActiveButton] = useState(null)

  const handleButtonClick = (buttonName) => {
    setActiveButton(activeButton === buttonName ? null : buttonName)
  }

  return (
    <div className="app">
      <div className="digital-web"></div>
      <div className="content-wrapper">
        <nav>
          <div className="nav-left">
            <button 
              className={`nav-button ${activeButton === 'signin' ? 'active' : ''}`}
              onClick={() => handleButtonClick('signin')}
            >
              Sign In
            </button>
            <button 
              className={`nav-button ${activeButton === 'signup' ? 'active' : ''}`}
              onClick={() => handleButtonClick('signup')}
            >
              Sign Up
            </button>
            <button 
              className={`nav-button ${activeButton === 'pricing' ? 'active' : ''}`}
              onClick={() => handleButtonClick('pricing')}
            >
              Pricing
            </button>
          </div>
          <div className="logo">
            LOGO
          </div>
        </nav>
        
        <main>
          <div className="content">
            <div className="tagline">
              <h1>Meet Desk Buddy</h1>
              <p>Your AI-powered assistant that manages your Gmail and Google Calendar so you don't have to.</p>
            </div>
            <div className="bento-box">
              <div className="bento-item large">
                <h2>Smart Email Management</h2>
                <p>Automatically categorize and prioritize your emails</p>
              </div>
              <div className="bento-item">
                <h2>Calendar</h2>
                <p>Intelligent scheduling assistant</p>
              </div>
              <div className="bento-item">
                <h2>AI Powered</h2>
                <p>Advanced automation</p>
                <button className="learn-more">Learn More</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
