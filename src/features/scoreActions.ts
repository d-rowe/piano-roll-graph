import {nanoid} from 'nanoid';
import {store} from '../app/store';
import {
    addNoteAC,
    addNoteEdgeAC,
    deleteNoteAC,
    deleteNoteEdgeAC,
    updateNoteAC,
} from './scoreSlice';

import type {Note, Edge} from '../constants';


type NoteWithoutId = Omit<Note, 'id'>;
type EdgeWithoutId = Omit<Edge, 'id'>;

export function addNote(props: NoteWithoutId) {
    store.dispatch(addNoteAC({
        ...props,
        id: generateId(),
    }));
}

export function updateNote(noteChange: {
    id: string,
    midi?: number,
    start?: number,
    duration?: number,
}) {
    store.dispatch(updateNoteAC(noteChange));
}

export function deleteNote(noteId: string) {
    store.dispatch(deleteNoteAC({noteId}));
}

export function addNoteEdge(props: EdgeWithoutId) {
    store.dispatch(addNoteEdgeAC({
        ...props,
        id: generateId(),
    }));
}

export function deleteNoteEdge(edgeId: string) {
    store.dispatch(deleteNoteEdgeAC({edgeId}));
}

function generateId(): string {
    return nanoid(10);
}
