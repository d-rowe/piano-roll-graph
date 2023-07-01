import React, {memo} from 'react';
import {Handle, Position} from 'reactflow';

import type {NodeProps} from 'reactflow';

export default memo((props: NodeProps) => {
    return (
        <>
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
