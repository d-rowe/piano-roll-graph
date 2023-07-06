import {CSSProperties, memo} from 'react';
import {loadScoreFromLibrary} from '../features/scoreActions';
import {play} from '../Playback/Player';
// import {NODE_COLOR} from '../PianoRoll/colors';

import type {Graph} from '../constants';

type Props = {
    score: Graph,
};

const containerStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    // width: '100%',
    // height: '24px',
    // backgroundColor: NODE_COLOR,
    // padding: '4px',
};

function Toolbar({score}: Props) {
    return (
        <div style={containerStyle}>
            <Button title='▶️' onClick={play} />
            <Button title='BWV 26' onClick={() => loadScoreFromLibrary('bwv-26')} />
            <Button title='BWV 262' onClick={() => loadScoreFromLibrary('bwv-262')} />
    </div>
    );
}

function Button(props: {title: string, onClick?: () => void}) {
    return (
        <button
            onClick={props.onClick}>
            <span>{props.title}</span>
        </button>
    );
}

export default memo(Toolbar);