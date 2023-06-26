import {
    Signal,
    MonoSynth,
} from 'tone';

const FREQUENCY = 'frequency';

export default class Synth {
    private readonly synth: MonoSynth;
    public readonly frequency: Signal<typeof FREQUENCY>;

    constructor() {
        this.synth = new MonoSynth().toDestination();
        this.synth.volume.value = -12;
        this.frequency = new Signal({
            units: FREQUENCY,
        }).connect(this.synth.frequency);
    }

    triggerAttack(frequency: number) {
        this.synth.triggerAttack(frequency);
    }

    triggerRelease() {
        this.synth.triggerRelease();
    }

    dispose() {
        this.synth.dispose();
    }
}