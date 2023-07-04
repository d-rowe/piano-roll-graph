import React from 'react';
import {play} from './Playback/Player';
import './App.css';
import PianoRollGraph from './PianoRoll/PianoRollGraph';
import {Graph} from './constants';
import {RootState} from './app/store';
import {selectScore} from './features/scoreSlice';
import {connect} from 'react-redux';

type Props = {
  score: Graph,
}
function App(props: Props) {
  return (
    <div className="App">
      <PianoRollGraph
        notes={props.score.notes}
        edges={props.score.edges}
      />
      <button onClick={play} style={{position: 'absolute', top: 0}}>Play</button>
    </div>
  );
}

function mapStateToProps(state: RootState) {
  return {
    score: selectScore(state),
  };
}

export default connect(mapStateToProps)(App);
