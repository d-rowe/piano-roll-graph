import {createSlice} from '@reduxjs/toolkit';
import {loadScoreFromUrl} from '../utils/fileUtils';

import type {PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../app/store';
import type {Note, Edge} from '../constants';


type State = {
    bpm: number,
    notes: Record<string, Note>,
    edges: Record<string, Edge>,
};

type NoteChange = {
    id: string,
    midi?: number,
    start?: number,
    duration?: number,
};

type DeleteNote = {
    noteId: string,
};

type DeleteNoteEdge = {
    edgeId: string,
};

const defaultState = {
    bpm: 80,
    notes: {},
    edges: {},
};

const initialState: State = loadScoreFromUrl() || defaultState;

const scoreSlice = createSlice({
    name: 'score',
    initialState,
    reducers: {
        addNoteAC: (state, action: PayloadAction<Note>) => {
            const note = action.payload;
            state.notes[note.id] = note;
        },
        updateNoteAC: (state, action: PayloadAction<NoteChange>) => {
            const {id, midi, start, duration} = action.payload;
            const note = state.notes[id];
            note.midi = midi ?? note.midi;
            note.start = start ?? note.start;
            note.duration = duration ?? note.duration;
        },
        deleteNoteAC: (state, action: PayloadAction<DeleteNote>) => {
            const {noteId} = action.payload;
            delete state.notes[noteId];
            // clean up edges connected to note
            Object.values(state.edges).forEach(edge => {
                const {sourceId, targetId} = edge;
                if (sourceId === noteId || targetId === noteId) {
                    delete state.edges[edge.id];
                }
            });
        },
        addNoteEdgeAC: (state, action: PayloadAction<Edge>) => {
            const edge = action.payload;
            state.edges[edge.id] = edge;
        },
        deleteNoteEdgeAC: (state, action: PayloadAction<DeleteNoteEdge>) => {
            const {edgeId} = action.payload;
            delete state.edges[edgeId];
        },
    }
})

export const {
    addNoteAC,
    deleteNoteAC,
    updateNoteAC,
    addNoteEdgeAC,
    deleteNoteEdgeAC
} = scoreSlice.actions;
export const selectScore = (state: RootState) => state.score;
export const scoreReducer = scoreSlice.reducer;
