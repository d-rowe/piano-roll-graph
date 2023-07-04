import React, {memo} from 'react';
import {Handle, Position, NodeResizeControl} from 'reactflow';

import type {NodeProps} from 'reactflow';

const resizeControlStyle = {
    height: '100%',
    border: '1px solid black',
    backgroundColor: 'white',
    marginTop: '1px',
};

export default memo((props: NodeProps) => {
    return (
        <>
            <NodeResizeControl position='left' style={resizeControlStyle} />
            <NodeResizeControl position='right' style={resizeControlStyle} />
            <Handle
                id={`${props.id}-L`}
                type="target"
                position={Position.Left}
            />
            <div style={{
                border: '1px solid black',
                borderRadius: '2px',
                height: '100%',
            }}/>
            <Handle
                id={`${props.id}-R`}
                type="source"
                position={Position.Right}
            />
        </>
    );
});
