import {createSlice} from '@reduxjs/toolkit';

import type {PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../app/store';
import type {Note, Edge} from '../constants';

type AddNotePayload = {
    note: Note,
};

type AddEdgePayload = {
    edge: Edge,
};

type State = {
    notes: Note[],
    edges: Edge[],
};

const initialState: State = {
    notes: [
        {
            midi: 48,
            duration: 1048,
            start: 0,
        },
        {
            midi: 55,
            duration: 1024,
            start: 0,
        },
        {
            midi: 64,
            duration: 1024,
            start: 0,
        },
        {
            midi: 48,
            duration: 1024,
            start: 4096,
        },
        {
            midi: 52,
            duration: 1024,
            start: 4096,
        },
        {
            midi: 55,
            duration: 1024,
            start: 4096,
        }
    ],
    edges: [],
};

const scoreSlice = createSlice({
    name: 'score',
    initialState,
    reducers: {
        addNote: (state, action: PayloadAction<AddNotePayload>) => {
            state.notes.push(action.payload.note);
        },
        addNoteEdge: (state, action: PayloadAction<AddEdgePayload>) => {
            state.edges.push(action.payload.edge);
        },
    }
})

export const {
    addNote,
    addNoteEdge,
} = scoreSlice.actions;
export const selectScore = (state: RootState) => state.score;
export const scoreReducer = scoreSlice.reducer;
