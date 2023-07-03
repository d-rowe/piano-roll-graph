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
    notes: [],
    edges: [],
};

const scoreSlice = createSlice({
    name: 'score',
    initialState,
    reducers: {
        addNote: (state, action: PayloadAction<AddNotePayload>) => {
            state.notes.push(action.payload.note);
        },
        addEdge: (state, action: PayloadAction<AddEdgePayload>) => {
            state.edges.push(action.payload.edge);
        },
    }
})

export const {
    addNote,
    addEdge,
} = scoreSlice.actions;
export const selectScore = (state: RootState) => state.score;
export const scoreReducer = scoreSlice.reducer;
