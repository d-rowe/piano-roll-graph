import React, {memo} from 'react';
import {Handle, Position, NodeResizeControl} from 'reactflow';

import type {NodeProps} from 'reactflow';

const resizeControlStyle = {
    height: '100%',
    border: '1px solid black',
    backgroundColor: 'white',
    marginTop: '1px',
    width: 0,
};

export default memo((props: NodeProps) => {
    return (
        <>
            <NodeResizeControl position='left' style={resizeControlStyle} />
            <Handle
                id={`${props.id}-L`}
                type="target"
                position={Position.Left}
            />
            <div style={{
                border: '1px solid black',
                borderRadius: '2px',
                backgroundColor: '#D0D1FF',
                height: '100%',
                width: 'calc(100% + 16px)',
            }} />
            <div style={{
                position: 'absolute',
                right: -17,
                top: 0,
                height: '100%'
            }}>
                <NodeResizeControl position='right' style={resizeControlStyle} />
                <Handle
                    id={`${props.id}-R`}
                    type="source"
                    position={Position.Right}
                />
            </div>
        </>
    );
});
