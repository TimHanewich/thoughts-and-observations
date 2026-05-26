import { useState } from 'react'
import './App.css'
import Reader from './Reader'

function App() {
  const [isReading, setIsReading] = useState(false)

  if (isReading) {
    return <Reader onClose={() => setIsReading(false)} />
  }

  return (
    <main className="landing">
      <img
        src="https://i.imgur.com/ugA8tMc.png"
        alt="Charlie E. Aussenhofer"
        className="portrait"
      />
      <h1 className="title">Thoughts and Observations</h1>
      <p className="byline">by Charles E. Aussenhofer</p>
      <div className="divider" />
      <button className="open-btn" onClick={() => setIsReading(true)}>
        Open
      </button>
    </main>
  )
}

export default App
