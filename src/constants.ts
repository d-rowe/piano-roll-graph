export type Edge = {
    id: string,
    sourceId: string,
    targetId: string,
    prev?: Note,
    next?: Note,
};

export type Note = {
    id: string,
    midi: number,
    start: number,
    duration: number,
    prevs?: Edge[],
    nexts?: Edge[],
};

export type Graph = {
    bpm: number,
    notes: Record<string, Note>,
    edges: Record<string, Edge>,
};
