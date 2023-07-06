import {Transport} from 'tone';
import SynthPool from './SynthPool';
import {store} from '../app/store';
import ScoreGraph from './ScoreGraph';
import {getBeat, getFrequency} from '../utils/scoreUtils';
import {DEFAULT_VOLUME} from './Synth';

import type {SynthContext} from './SynthPool';
import type {Edge, Note} from '../constants';
import {compressScore} from '../utils/fileUtils';


let prevSynthPool: SynthPool | null = null;
export async function play() {
    const score = store.getState().score;
    console.log(compressScore(score));
    Transport.bpm.value = score.bpm;
    const slideTargetNotes = new Set<Note>();
    Transport.stop();
    Transport.cancel()
    prevSynthPool?.dispose();
    const synthPool = new SynthPool();
    const scoreGraph = new ScoreGraph(score);
    scoreGraph.getChords().forEach(chord => {
        chord.forEach(note => {
            const oscContext = synthPool.requestSynthContext();
            scheduleAttack(oscContext, note);
            traverseFromNote(oscContext, note);
        });
    });

    prevSynthPool = synthPool;
    Transport.start();

    function traverseFromNote(oscContext: SynthContext, note: Note) {
        const noteEnd = note.start + note.duration;
        if (!note.nexts?.length) {
            scheduleRelease(oscContext, noteEnd);
            return;
        }

        note.nexts.forEach((edge, i) => {
            traverseEdge(oscContext, note, edge, i);
        });
    }

    function traverseEdge(
        oscContext: SynthContext,
        note: Note,
        edge: Edge,
        i: number,
    ) {
        const noteEnd = note.start + note.duration;
        const isSynthSplit = i > 0;
        const noteOscContext = isSynthSplit
            ? synthPool.requestSynthContext()
            : oscContext;
        const noteNext = edge.next!;

        Transport.schedule(() => {
            noteOscContext.synth.frequency.exponentialRampTo(
                getFrequency(noteNext.midi),
                getBeat(noteNext.start - noteEnd)
            );
        }, getBeat(noteEnd));

        if (slideTargetNotes.has(noteNext)) {
            scheduleRelease(noteOscContext, getBeat(noteNext.start));
        }
        slideTargetNotes.add(noteNext);

        if (isSynthSplit) {
            noteOscContext.synth.setImmediateAttack();
            scheduleAttack(noteOscContext, note, true);

            Transport.schedule(() => {
                noteOscContext.synth.volume.linearRampTo(
                    DEFAULT_VOLUME,
                    getBeat(noteNext.start - noteEnd),
                )
            }, getBeat(note.start));
        }

        traverseFromNote(noteOscContext, noteNext);
    }
}

function scheduleAttack(oscContext: SynthContext, note: Note, ease = false) {
    Transport.schedule(() => {
        if (ease) {
            oscContext.synth.setVolume(-32);
        }
        oscContext.synth.triggerAttack(getFrequency(note.midi))
    }, getBeat(note.start));
}

function scheduleRelease(oscContext: SynthContext, tick: number) {
    Transport.schedule(() => {
        oscContext.synth.triggerRelease();
        oscContext.release();
    }, getBeat(tick));
}
