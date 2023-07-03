import Synth from './Synth';

const SIZE = 8;

export type SynthContext = {
    synth: Synth,
    release: () => void,
};

export default class SynthPool {
    private synthsById: Record<string, Synth>;
    private availableSynths: Set<string>;

    constructor() {
        this.synthsById = {};
        for (let id = 0; id < SIZE; id++) {
            this.synthsById[id] = new Synth();
        }
        this.availableSynths = new Set(Object.keys(this.synthsById));
    }

    requestSynthContext(): SynthContext {
        if (this.availableSynths.size === 0) {
            throw new Error('Cannot provide synth as none are available');
        }

        const synthId: string = this.availableSynths.values().next().value;
        this.availableSynths.delete(synthId);
        return {
            synth: this.synthsById[synthId],
            release: () => this.releaseSynth(synthId),
        };
    }

    dispose() {
        Object.entries(this.synthsById).forEach(([id, synth]) => {
            this.availableSynths.add(id);
            synth.triggerRelease();
            // allow for release tail to taper off
            setTimeout(() => synth.dispose(), 500);
        });
    }

    private releaseSynth(synthId: string) {
        this.availableSynths.add(synthId);
    }
}
