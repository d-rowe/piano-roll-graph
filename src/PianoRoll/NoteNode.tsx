import React, {memo} from 'react';
import {Handle, Position, NodeResizeControl} from 'reactflow';

import type {NodeProps} from 'reactflow';

const TRANSPARENT = 'rgba(255, 255, 255, 0)';

const resizeControlStyle = {
    height: '100%',
    backgroundColor: TRANSPARENT,
    borderColor: TRANSPARENT,
};

export default memo((props: NodeProps) => {
    return (
        <>
            <NodeResizeControl position='left' style={resizeControlStyle} />
            <Handle
                id={`${props.id}-L`}
                type="target"
                position={Position.Left}
                style={{
                    width: '6px',
                    height: '6px',
                }}
            />
            <div style={{
                border: '1px solid black',
                backgroundColor: '#D0D1FF',
                height: '100%',
                boxSizing: 'border-box',
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
                    style={{
                        width: '6px',
                        height: '6px',
                        right: '-3px',
                    }}
                />
            </div>
        </>
    );
});
