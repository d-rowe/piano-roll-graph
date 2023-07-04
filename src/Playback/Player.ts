import {Transport} from 'tone';
import SynthPool from './SynthPool';
import {store} from '../app/store';
import ScoreGraph from './ScoreGraph';

import type {SynthContext} from './SynthPool';
import type {Note} from '../constants';
import {getBeat, getFrequency} from './SynthUtils';


let prevSynthPool: SynthPool | null = null;
export async function play() {
    const score = store.getState().score;
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
}

function traverseFromNote(oscContext: SynthContext, note: Note) {
    const noteEnd = note.start + note.duration;
    if (!note.nexts?.length) {
        scheduleRelease(oscContext, noteEnd);
        return;
    }

    note.nexts.forEach(edge => {
        // TODO: we need to request more synth contexts
        //      if theres more than one edge
        const noteNext = edge.next!;
        const {frequency} = oscContext.synth;

        Transport.schedule(() => {
            frequency.exponentialRampTo(
                getFrequency(noteNext.midi),
                getBeat(noteNext.start - noteEnd)
            );
        }, getBeat(noteEnd));

        traverseFromNote(oscContext, noteNext);
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
