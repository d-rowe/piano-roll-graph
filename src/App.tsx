import React from 'react';
import {play} from './Playback/Player';
import './App.css';
import PianoRollGraph from './PianoRoll/PianoRollGraph';
import {graph} from './constants';

function App() {
  return (
    <div className="App">
      <PianoRollGraph
        notes={graph.notes}
        edges={graph.edges}
      />
      <button onClick={play} style={{position: 'absolute', top: 0}}>Play</button>
    </div>
  );
}

export default App;
