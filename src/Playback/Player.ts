import {Transport, Signal, Offline, Player} from 'tone';
import OscPool from './SynthPool';
import type {OscContext} from './SynthPool';

const TICKS_PER_BEAT = 1024;

type Edge = {
    from: number,
    to: number,
    prev?: Note,
    next?: Note,
}

type Note = {
    midi: number,
    start: number,
    duration: number,
    prevs?: Edge[],
    nexts?: Edge[],
};

type IGraph = {
    notes: Note[],
    edges: Edge[],
};

export const graph: IGraph = {
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
            from: 2,
            to: 3,
        },
        {
            from: 0,
            to: 4,
        },
        // {
        //     from: 1,
        //     to: 5,
        // },
    ],
};

export async function play() {
    const score = constructScoreGraph(graph.notes, graph.edges);
    const oscPool = new OscPool();
    const noteGroups = Array.from(score.values());
    noteGroups.forEach(notes => {
        notes.forEach(note => {
            const oscContext = oscPool.requestOscContext();
            scheduleAttack(oscContext, note);
            traverseFromNote(oscContext, note);

            if (!note.nexts?.length) {
                scheduleRelease(oscContext, note.start + note.duration);
                return;
            }
        });
    });

    Transport.start();
}

function traverseFromNote(oscContext: OscContext, note: Note) {
    const noteEnd = note.start + note.duration;
    if (!note.nexts?.length) {
        scheduleRelease(oscContext, noteEnd);
        return;
    }

    note.nexts?.forEach((edge, i) => {
        // if i > 1 we need to request more synth contexts
        const noteNext = edge.next!;
        const signal = new Signal({
            value: getFrequency(note.midi),
            units: 'frequency',
        }).connect(oscContext.osc.frequency);

        Transport.schedule(() => {
            signal.exponentialRampTo(
                getFrequency(noteNext.midi),
                getBeat(noteNext.start - noteEnd)
            );
        }, getBeat(noteEnd));

        Transport.schedule(() => {
            signal.dispose();
        }, getBeat(noteNext.start + noteNext.duration));
    });
}

function scheduleAttack(oscContext: OscContext, note: Note) {
    Transport.schedule(() => {
        console.log('triggering attack');
        oscContext.osc.start(getFrequency(note.midi))
    }, getBeat(note.start));
}

function scheduleRelease(oscContext: OscContext, tick: number) {
    Transport.schedule(() => {
        console.log('triggering release');
        oscContext.osc.stop();
        oscContext.release();
    }, getBeat(tick));
}

function getBeat(tick: number): number {
    return tick / TICKS_PER_BEAT;
}

function constructScoreGraph(notes: Note[], edges: Edge[]) {
    const scoreGraph = new Map<number, Note[]>();

    // add notes by start tick
    notes.forEach(note => {
        if (!scoreGraph.get(note.start)) {
            scoreGraph.set(note.start, []);
        }
        scoreGraph.get(note.start)!.push(note);
    });

    edges.forEach(edge => {
        // wire up edges
        const noteFrom = notes[edge.from];
        const noteTo = notes[edge.to];
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
    const orderedScoreGraph = new Map<number, Note[]>();
    const orderedStarts = Array.from(scoreGraph.keys()).sort();
    orderedStarts.forEach(start => {
        orderedScoreGraph.set(start, scoreGraph.get(start)!);
    });

    return orderedScoreGraph;
}

function getFrequency(midi: number) {
    return 440 * Math.pow(2, (midi - 69) / 12);
}