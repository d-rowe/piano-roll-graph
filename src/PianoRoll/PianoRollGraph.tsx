import 'reactflow/dist/style.css';
import {
    memo,
    useEffect,
    useCallback,
    MouseEvent,
} from 'react';
import ReactFlow, {
    Controls,
    Position,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    useViewport,
} from 'reactflow';
import NoteNode from './NoteNode';
import {addNote, addNoteEdge, deleteNote, deleteNoteEdge, updateNote} from '../features/scoreActions';

import type {Node, Edge, Connection, NodeChange, EdgeChange} from 'reactflow';
import type {Note, Edge as NoteEdge} from '../constants';


const gridSize = 36;
const edgeWidth = 8
const connectionLineStyle = {strokeWidth: edgeWidth};
const snapGrid: [number, number] = [gridSize, gridSize];
const nodeTypes = {
    note: NoteNode,
};
const defaultViewport = {
    x: 128,
    y: -2000,
    zoom: 1,
};

type Props = {
    notes: Record<string, Note>,
    edges: Record<string, NoteEdge>,
};

const PianoRollGraph = (props: Props) => {
    const {x, y, zoom} = useViewport();
    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);

    useEffect(() => {
        setNodes(Object.values(props.notes).map(createNode));
        setEdges(Object.values(props.edges).map(createEdge));
    }, [setNodes, setEdges, props]);

    const onConnect = useCallback((connection: Connection) => {
        addNoteEdge({
            sourceId: connection.source || '',
            targetId: connection.target || '',
        });
    }, []);

    const onClick = useCallback((event: MouseEvent) => {
        const {clientX, clientY} = event;
        const left = clientX - x;
        const top = clientY - y;
        const start = Math.floor(left / zoom * 8 / 128) * 128;
        addNote({
            midi: Math.floor(128 - (top / zoom / gridSize)),
            start,
            duration: 1024,
        });
    }, [x, y, zoom]);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={applyNodeChanges}
            onEdgesChange={applyEdgeChanges}
            onConnect={onConnect}
            connectionLineStyle={connectionLineStyle}
            zoomOnDoubleClick={false}
            defaultViewport={defaultViewport}
            onDoubleClick={onClick}
            nodeTypes={nodeTypes}
            snapToGrid={true}
            snapGrid={snapGrid}
            // fitView
            attributionPosition='bottom-right'
        >
            <Controls />
        </ReactFlow>
    );
};

function createNode(note: Note): Node {
    return {
        id: note.id,
        type: 'note',
        data: {label: ''},
        position: {
            x: note.start / 8,
            y: (127 - note.midi) * gridSize,
        },
        style: {
            width: note.duration / 8,
            height: gridSize,
        },
        sourcePosition: Position.Left,
        targetPosition: Position.Right,
        deletable: true,
    };
}

function createEdge(edge: NoteEdge): Edge {
    const source = edge.sourceId || '';
    const target = edge.targetId || '';
    return {
        id: edge.id,
        source,
        target,
        sourceHandle: `${source}-R`,
        targetHandle: `${target}-L`,
        style: {strokeWidth: edgeWidth},
    };
}

function applyNodeChanges(nodeChanges: NodeChange[]) {
    nodeChanges.forEach(change => {
        switch (change.type) {
            case 'remove':
                deleteNote(change.id);
                break;
            case 'dimensions':
                if (!change.dimensions) {
                    return;
                }
                const {width} = change.dimensions;
                updateNote({
                    id: change.id,
                    duration: Math.max(width * 8, 128),
                })
                break;
            case 'position':
                if (!change.position) {
                    return;
                }
                const {x, y} = change.position;
                const midi = Math.max(Math.floor(127 - (y / gridSize)), 0);
                updateNote({
                    id: change.id,
                    midi,
                    start: Math.max(x * 8, 0),
                })
                break;
            case 'select':
                // play note
                break;
            default:
                break;
        }
    });
}

function applyEdgeChanges(edgeChanges: EdgeChange[]) {
    edgeChanges.forEach(change => {
        if (change.type !== 'remove') {
            return
        }

        deleteNoteEdge(change.id);
    });
}

const WrappedPianoRoll = memo((props: Props) => (
    <ReactFlowProvider>
        <PianoRollGraph {...props} />
    </ReactFlowProvider>
));

export default WrappedPianoRoll;
