import {store} from '../app/store';
import type {Note, Edge} from '../constants';
import {v4 as uuidv4} from 'uuid';
import {addNoteAC, addNoteEdgeAC, deleteNoteAC, deleteNoteEdgeAC, updateNoteAC} from './scoreSlice';

type NoteWithoutId = Omit<Note, 'id'>;
type EdgeWithoutId = Omit<Edge, 'id'>;

export function addNote(props: NoteWithoutId) {
    store.dispatch(addNoteAC({
        ...props,
        id: uuidv4(),
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
        id: uuidv4(),
    }));
}

export function deleteNoteEdge(edgeId: string) {
    store.dispatch(deleteNoteEdgeAC({edgeId}));
}
