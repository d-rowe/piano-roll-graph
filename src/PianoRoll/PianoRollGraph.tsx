import {
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
import {graph} from '../constants';
import NoteNode from './NoteNode';

import type {Node, Edge, Connection} from 'reactflow';
import type {Note, Edge as NoteEdge} from '../constants';


const connectionLineStyle = {stroke: '#000'};
const gridSize = 36;
const snapGrid: [number, number] = [gridSize, gridSize];
const nodeTypes = {
    note: NoteNode,
};

const CustomNodeFlow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        const edges = graph.edges.map(createEdge);
        console.log(edges);
        setNodes(graph.notes.map(createNode));
        setEdges(edges);
    }, []);

    const onConnect = useCallback(
        (connection: Connection) =>
            setEdges((eds) => addEdge({...connection, style: {stroke: '#000'}}, eds)),
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
            onClickCapture={console.log}
            onDoubleClick={console.log}
            nodeTypes={nodeTypes}
            snapToGrid={true}
            snapGrid={snapGrid}
            fitView
            attributionPosition="bottom-right"
        >
            <Controls />
        </ReactFlow>
    );
};

function createNode(note: Note, id: number): Node {
    return {
        id: id.toString(),
        type: 'note',
        data: {label: ''},
        position: {
            x: note.start / 8,
            y: (127 - note.midi) * gridSize,
        },
        style: {
            width: (note.start + note.duration) / 8,
            height: gridSize,
        },
        sourcePosition: Position.Left,
        targetPosition: Position.Right,
        deletable: true,
    };
}

function createEdge(edge: NoteEdge, id: number): Edge {
    const source = edge.source?.toString() || '';
    const target = edge.target?.toString() || '';
    return {
        id: `${source}-${target}`,
        source,
        target,
        sourceHandle: `${source}-R`,
        targetHandle: `${target}-L`,
        style: {stroke: '#000'},
    };
}

export default CustomNodeFlow;
