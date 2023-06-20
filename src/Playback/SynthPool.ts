import Oscillator from './Oscillator';

const SIZE = 8;

export type OscContext = {
    osc: Oscillator,
    release: () => void,
};

export default class OscPool {
    private oscs: Record<string, Oscillator>;
    private availableOscs: Set<string>;

    constructor() {
        this.oscs = {};
        for (let id = 0; id < SIZE; id++) {
            this.oscs[id] = new Oscillator();
        }
        this.availableOscs = new Set(Object.keys(this.oscs));
    }

    requestOscContext(): OscContext {
        if (this.availableOscs.size === 0) {
            throw new Error('Cannot provide synth as none are available');
        }

        const oscId: string = this.availableOscs.values().next().value;
        console.log('oscillator', oscId, 'borrowed');
        this.availableOscs.delete(oscId);
        return {
            osc: this.oscs[oscId],
            release: () => this.releaseOsc(oscId),
        };
    }

    private releaseOsc(oscId: string) {
        console.log('oscillator', oscId, 'returned');
        this.availableOscs.add(oscId);
    }
}
