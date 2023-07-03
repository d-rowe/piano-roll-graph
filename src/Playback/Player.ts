import {Transport, Signal} from 'tone';
import SynthPool from './SynthPool';

import type {SynthContext} from './SynthPool';
import type {Note, Edge} from '../constants';
import {store} from '../app/store';

const TICKS_PER_BEAT = 1024;

type IGraph = {
    notes: Note[],
    edges: Edge[],
};

type ScoreGraph = Map<number, Note[]>;

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

let prevSynthPool: SynthPool | null = null;
export async function play() {
    const {notes, edges} = store.getState().score;
    Transport.stop();
    Transport.cancel()
    prevSynthPool?.dispose();
    const synthPool = new SynthPool();
    const score = constructScoreGraph(notes, edges);
    const noteGroups = Array.from(score.values());
    noteGroups.forEach(notes => {
        notes.forEach(note => {
            const oscContext = synthPool.requestSynthContext();
            scheduleAttack(oscContext, note);
            traverseFromNote(oscContext, note);

            if (!note.nexts?.length) {
                scheduleRelease(oscContext, note.start + note.duration);
            }
        });
    });

    prevSynthPool = synthPool;
    Transport.start();
}

function traverseFromNote(oscContext: SynthContext, note: Note) {
    const noteEnd = note.start + note.duration;
    if (!note.nexts?.length) {
        scheduleRelease(oscContext, noteEnd);
        return;
    }

    note.nexts?.forEach((edge, i) => {
        // TODO: if i > 1 we need to request more synth contexts
        const noteNext = edge.next!;
        const frequencySignal = new Signal({
            value: getFrequency(note.midi),
            units: 'frequency',
        }).connect(oscContext.synth.frequency);

        Transport.schedule(() => {
            frequencySignal.exponentialRampTo(
                getFrequency(noteNext.midi),
                getBeat(noteNext.start - noteEnd)
            );
        }, getBeat(noteEnd));

        Transport.schedule(() => {
            frequencySignal.dispose();
        }, getBeat(noteNext.start + noteNext.duration));
    });
}

function scheduleAttack(oscContext: SynthContext, note: Note) {
    Transport.schedule(() => {
        oscContext.synth.triggerAttack(getFrequency(note.midi))
    }, getBeat(note.start));
}

function scheduleRelease(oscContext: SynthContext, tick: number) {
    Transport.schedule(() => {
        oscContext.synth.triggerRelease();
        oscContext.release();
    }, getBeat(tick));
}

function getBeat(tick: number): number {
    return tick / TICKS_PER_BEAT;
}

function constructScoreGraph(notes: Note[], edges: Edge[]): ScoreGraph {
    const currentNotes = notes.map(n => ({...n}));
    const currentEdges = edges.map(e => ({...e}));
    const scoreGraph: ScoreGraph = new Map();

    // add notes by start tick
    currentNotes.forEach(note => {
        if (!scoreGraph.get(note.start)) {
            scoreGraph.set(note.start, []);
        }
        scoreGraph.get(note.start)!.push(note);
    });

    currentEdges.forEach(edge => {
        // wire up edges
        const noteFrom = currentNotes[edge.source];
        const noteTo = currentNotes[edge.target];
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
    const orderedScoreGraph: ScoreGraph = new Map();
    const orderedStarts = Array.from(scoreGraph.keys()).sort();
    orderedStarts.forEach(start => {
        orderedScoreGraph.set(start, scoreGraph.get(start)!);
    });

    return orderedScoreGraph;
}

function getFrequency(midi: number) {
    return 440 * Math.pow(2, (midi - 69) / 12);
}