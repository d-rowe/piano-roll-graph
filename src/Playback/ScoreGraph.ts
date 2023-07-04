import cloneDeep from 'lodash.clonedeep';

import type {Graph, Note} from '../constants';

type GScore = Map<number, Note[]>;

class ScoreGraph {
    private graph: GScore;

    constructor(score: Graph) {
        const notes = cloneDeep(score.notes);
        const edges = cloneDeep(score.edges);
        const scoreGraph: GScore = new Map();

        // add notes by start tick
        Object.values(notes).forEach(note => {
            if (!scoreGraph.get(note.start)) {
                scoreGraph.set(note.start, []);
            }
            scoreGraph.get(note.start)!.push(note);
        });

        Object.values(edges).forEach(edge => {
            // wire up edges
            const noteFrom = notes[edge.sourceId];
            const noteTo = notes[edge.targetId];
            edge.prev = noteFrom;
            edge.next = noteTo;
            noteFrom.nexts = noteFrom.nexts || [];
            noteTo.prevs = noteTo.prevs || [];
            noteFrom.nexts.push(edge);
            noteTo.prevs.push(edge);

            const startEntries = scoreGraph.get(noteTo.start);
            if (!startEntries) {
                return;
            }

            // remove notes with leading edges (they'll be traversed to)
            const filteredStartEntries = startEntries.filter(n => n !== noteTo);
            if (filteredStartEntries.length === 0) {
                scoreGraph.delete(noteTo.start);
            } else {
                scoreGraph.set(noteTo.start, filteredStartEntries);
            }
        });

        // order entries
        const orderedScoreGraph: GScore = new Map();
        const orderedStarts = Array.from(scoreGraph.keys()).sort();
        orderedStarts.forEach(start => {
            orderedScoreGraph.set(start, scoreGraph.get(start)!);
        });

        this.graph = orderedScoreGraph;
    }

    getChords() {
        return Array.from(this.graph.values());
    }
}

export default ScoreGraph;
