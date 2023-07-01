import React from 'react';
import {play} from './Playback/Player';
import './App.css';
import PianoRollGraph from './PianoRoll/PianoRollGraph';

function App() {
  return (
    <div className="App">
      <PianoRollGraph />
      <button onClick={play} style={{position: 'absolute', top: 0}}>Play</button>
    </div>
  );
}

export default App;
