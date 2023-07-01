import React, {
    useState,
    useEffect,
    useCallback,
} from 'react';
import ReactFlow, {
    addEdge,
    Controls,
    Position,
    useEdgesState,
    useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

import './index.css';

const initBgColor = '#1A192B';

const connectionLineStyle = {stroke: '#fff'};
const snapGrid: [number, number] = [20, 20];

const defaultViewport = {x: 0, y: 0, zoom: 1.5};

const CustomNodeFlow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [bgColor, setBgColor] = useState(initBgColor);

    useEffect(() => {
        // @ts-ignore
        const onChange = (event) => {
            setNodes((nds) =>
                nds.map((node) => {
                    if (node.id !== '2') {
                        return node;
                    }

                    const color = event.target.value;

                    setBgColor(color);

                    return {
                        ...node,
                        data: {
                            ...node.data,
                            color,
                        },
                    };
                })
            );
        };

        setNodes([
            {
                id: '1',
                type: 'default',
                data: {label: 'An input node'},
                position: {x: 0, y: 50},
                sourcePosition: Position.Left,
                targetPosition: Position.Right,
            },
            {
                id: '2',
                type: 'default',
                data: {onChange: onChange, color: initBgColor},
                style: {border: '1px solid #777', padding: 10},
                position: {x: 300, y: 50},
                sourcePosition: Position.Left,
                targetPosition: Position.Right,
            },
            {
                id: '3',
                type: 'output',
                data: {label: 'Output A'},
                position: {x: 650, y: 25},
                sourcePosition: Position.Left,
                targetPosition: Position.Right,
            },
            {
                id: '4',
                type: 'output',
                data: {label: 'Output B'},
                position: {x: 650, y: 100},
                sourcePosition: Position.Left,
                targetPosition: Position.Right,
            },
        ]);

        setEdges([
            {
                id: 'e1-2',
                source: '1',
                target: '2',
                style: {stroke: '#fff'},
            },
            {
                id: 'e2a-3',
                source: '2',
                target: '3',
                sourceHandle: 'a',
                style: {stroke: '#fff'},
            },
            {
                id: 'e2b-4',
                source: '2',
                target: '4',
                sourceHandle: 'b',
                style: {stroke: '#fff'},
            },
        ]);
    }, []);

    const onConnect = useCallback(
        // @ts-ignore
        (params) =>
            setEdges((eds) => addEdge({...params, style: {stroke: '#fff'}}, eds)),
        []
    );
    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            connectionLineStyle={connectionLineStyle}
            snapToGrid={true}
            style={{backgroundColor: bgColor}}
            snapGrid={snapGrid}
            defaultViewport={defaultViewport}
            fitView
            attributionPosition="bottom-right"
        >
            <Controls />
        </ReactFlow>
    );
};

export default CustomNodeFlow;
