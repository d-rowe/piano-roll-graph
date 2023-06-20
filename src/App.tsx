import React from 'react';
import {play} from './Playback/Player';
import './App.css';

function App() {
  return (
    <div className="App">
      <button onClick={play}>Play</button>
    </div>
  );
}

export default App;
