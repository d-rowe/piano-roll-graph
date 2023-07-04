import {Transport, Signal} from 'tone';
import SynthPool from './SynthPool';

import type {SynthContext} from './SynthPool';
import type {Note} from '../constants';
import {store} from '../app/store';
import ScoreGraph from './ScoreGraph';

const TICKS_PER_BEAT = 1024;

let prevSynthPool: SynthPool | null = null;
export async function play() {
    const score = store.getState().score;
    Transport.stop();
    Transport.cancel()
    prevSynthPool?.dispose();
    const synthPool = new SynthPool();
    const scoreGraph = new ScoreGraph(score);
    scoreGraph.getChords().forEach(notes => {
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

    note.nexts.forEach(edge => {
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

function getFrequency(midi: number) {
    return 440 * Math.pow(2, (midi - 69) / 12);
}
