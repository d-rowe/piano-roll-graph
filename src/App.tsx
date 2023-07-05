import {play} from './Playback/Player';
import './App.css';
import PianoRollGraph from './PianoRoll/PianoRollGraph';
import {Graph} from './constants';
import {RootState} from './app/store';
import {selectScore} from './features/scoreSlice';
import {connect} from 'react-redux';
import {getScoreUrl} from './utils/fileUtils';
import Toolbar from './Toolbar/Toolbar';

type Props = {
  score: Graph,
};

function App({score}: Props) {
  return (
    <div className="App">
      <PianoRollGraph
        score={score}
      />
      <Toolbar score={score} />
    </div>
  );


  function save() {
    navigator.clipboard.writeText(getScoreUrl(score));
  }
}

function mapStateToProps(state: RootState) {
  return {
    score: selectScore(state),
  };
}

export default connect(mapStateToProps)(App);
