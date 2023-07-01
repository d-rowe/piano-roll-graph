export type Edge = {
    source: number,
    target: number,
    prev?: Note,
    next?: Note,
};

export type Note = {
    midi: number,
    start: number,
    duration: number,
    prevs?: Edge[],
    nexts?: Edge[],
};

export type Graph = {
    notes: Note[],
    edges: Edge[],
};

export const graph: Graph = {
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
    edges: [
        {
            source: 2,
            target: 3,
        },
        {
            source: 0,
            target: 4,
        },
        {
            source: 1,
            target: 5,
        },
    ],
};
