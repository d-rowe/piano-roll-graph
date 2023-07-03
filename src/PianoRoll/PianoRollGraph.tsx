import 'reactflow/dist/style.css';
import {
    memo,
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
import NoteNode from './NoteNode';
import {addNoteEdge} from '../features/scoreSlice';

import type {Node, Edge, Connection, NodeChange, EdgeChange} from 'reactflow';
import type {Note, Edge as NoteEdge} from '../constants';
import {useDispatch} from 'react-redux';


const gridSize = 36;
const edgeWidth = 8
const connectionLineStyle = {strokeWidth: edgeWidth};
const snapGrid: [number, number] = [gridSize, gridSize];
const nodeTypes = {
    note: NoteNode,
};

type Props = {
    notes: Note[],
    edges: NoteEdge[],
};

const CustomNodeFlow = memo((props: Props) => {
    const dispatch = useDispatch();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        setNodes(props.notes.map(createNode));
        setEdges(props.edges.map(createEdge));
    }, [setNodes, setEdges, props]);

    const onConnect = useCallback((connection: Connection) => {
        setEdges((eds) => addEdge({
            ...connection,
            style: {strokeWidth: edgeWidth}
        }, eds));

        dispatch(addNoteEdge({
            edge: {
                source: Number(connection.source),
                target: Number(connection.target),
            }
        }));
    }, [setEdges, dispatch]);

    const onNoteChange = useCallback((changes: NodeChange[]) => {
        console.log(changes);
        onNodesChange(changes);
    }, [onNodesChange]);

    const onNoteEdgeChange = useCallback((changes: EdgeChange[]) => {
        console.log(changes);
        onEdgesChange(changes);
    }, [onEdgesChange]);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNoteChange}
            onEdgesChange={onNoteEdgeChange}
            onConnect={onConnect}
            connectionLineStyle={connectionLineStyle}
            onClickCapture={console.log}
            onDoubleClick={console.log}
            nodeTypes={nodeTypes}
            snapToGrid={true}
            snapGrid={snapGrid}
            fitView
            attributionPosition='bottom-right'
        >
            <Controls />
        </ReactFlow>
    );
});

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

function createEdge(edge: NoteEdge): Edge {
    const source = edge.source?.toString() || '';
    const target = edge.target?.toString() || '';
    return {
        id: `${source}-${target}`,
        source,
        target,
        sourceHandle: `${source}-R`,
        targetHandle: `${target}-L`,
        style: {strokeWidth: edgeWidth},
    };
}

export default CustomNodeFlow;
