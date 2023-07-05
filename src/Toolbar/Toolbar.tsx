import {CSSProperties, memo} from 'react';
import {play} from '../Playback/Player';

import type {Graph} from '../constants';
import {NODE_COLOR} from '../PianoRoll/colors';

type Props = {
    score: Graph,
};

const containerStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '24px',
    backgroundColor: NODE_COLOR,
    padding: '4px',
};

function Toolbar({score}: Props) {
    return (
        <div style={containerStyle}>
            <Button title='▶️' onClick={play} />
    </div>
    );
}

function Button(props: {title: string, onClick?: () => void}) {
    return (
        <button
            style={{height: '100%'}}
            onClick={props.onClick}>
            <span>{props.title}</span>
        </button>
    );
}

export default memo(Toolbar);