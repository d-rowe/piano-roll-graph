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
import getBackgroundStyle from './getBackgroundStyle';
import * as ScoreActions from '../features/scoreActions';
import {NODE_COLOR} from './colors';

import type {Node, Edge, Connection, NodeChange, EdgeChange} from 'reactflow';
import type {Graph, Note, Edge as NoteEdge} from '../constants';


const gridSize = 36;
const horizontalSize = 8;
const edgeWidth = 8
const edgeStyle = {
    strokeWidth: edgeWidth,
    stroke: NODE_COLOR
};
const snapGrid: [number, number] = [gridSize, gridSize];
const nodeTypes = {
    note: NoteNode,
};
const defaultViewport = {
    x: 16,
    y: -1100,
    zoom: 0.6,
};
const translateExtent: [[number, number],[number, number]] = [[-16, 0], [9999, 9999]];

type Props = {
    score: Graph,
};


const PianoRollGraph = ({score}: Props) => {
    const {x, y, zoom} = useViewport();
    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);

    useEffect(() => {
        setNodes(Object.values(score.notes).map(createNode));
        setEdges(Object.values(score.edges).map(createEdge));
    }, [setNodes, setEdges, score]);

    const onConnect = useCallback((connection: Connection) => {
        ScoreActions.addNoteEdge({
            sourceId: connection.source || '',
            targetId: connection.target || '',
        });
    }, []);

    const onClick = useCallback((event: MouseEvent) => {
        const {clientX, clientY} = event;
        const left = clientX - x;
        const top = clientY - y;
        const start = Math.max(Math.floor(left / zoom * horizontalSize / 128) * 128, 0);
        const midi = Math.floor(128 - (top / zoom / gridSize));
        ScoreActions.addNote({
            midi,
            start,
            duration: 1024,
        });
    }, [x, y, zoom]);

    const isValidConnection = useCallback((connection: Connection) => {
        const {source, target} = connection;
        if (!source || !target) {
            return false;
        }
        const noteSource = score.notes[source];
        const noteTarget = score.notes[target];
        return noteSource.start + noteSource.duration < noteTarget.start;
    }, [score.notes]);

    return (
        <ReactFlow
            attributionPosition='bottom-right'
            connectionLineStyle={edgeStyle}
            defaultViewport={defaultViewport}
            edges={edges}
            isValidConnection={isValidConnection}
            maxZoom={5}
            minZoom={0.1}
            nodes={nodes}
            nodeTypes={nodeTypes}
            onConnect={onConnect}
            onDoubleClick={onClick}
            onEdgeDoubleClick={onEdgeDoubleClick}
            onEdgesChange={applyEdgeChanges}
            onNodeDoubleClick={onNodeDoubleClick}
            onNodesChange={applyNodeChanges}
            snapGrid={snapGrid}
            snapToGrid={true}
            style={getBackgroundStyle(x, y, zoom, gridSize)}
            translateExtent={translateExtent}
            zoomOnDoubleClick={false}
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
            x: note.start / horizontalSize,
            y: (127 - note.midi) * gridSize,
        },
        style: {
            width: note.duration / horizontalSize,
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
        style: edgeStyle,
    };
}

function applyNodeChanges(nodeChanges: NodeChange[]) {
    nodeChanges.forEach(change => {
        switch (change.type) {
            case 'remove':
                ScoreActions.deleteNote(change.id);
                break;
            case 'dimensions':
                if (!change.dimensions) {
                    return;
                }
                const {width} = change.dimensions;
                ScoreActions.updateNote({
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
                ScoreActions.updateNote({
                    id: change.id,
                    midi,
                    start: Math.max(x * horizontalSize, 0),
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

        ScoreActions.deleteNoteEdge(change.id);
    });
}

function onNodeDoubleClick(event: MouseEvent, node: Node) {
    event.stopPropagation();
    ScoreActions.deleteNote(node.id);
}

function onEdgeDoubleClick(event: MouseEvent, edge: Edge) {
    event.stopPropagation();
    ScoreActions.deleteNoteEdge(edge.id);
}

const WrappedPianoRoll = memo((props: Props) => (
    <ReactFlowProvider>
        <PianoRollGraph {...props} />
    </ReactFlowProvider>
));

export default WrappedPianoRoll;
