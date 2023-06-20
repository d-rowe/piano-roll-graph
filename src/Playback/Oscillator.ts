import {
    Signal,
    Oscillator as ToneOscillator,
} from 'tone';

const FREQUENCY = 'frequency';

export default class Oscillator {
    private readonly osc: ToneOscillator;
    public readonly frequency: Signal<typeof FREQUENCY>;

    constructor() {
        this.osc = new ToneOscillator(440, 'sine').toDestination();
        this.osc.volume.value = -12;
        this.frequency = new Signal({
            units: FREQUENCY,
        }).connect(this.osc.frequency);
    }

    start(frequency?: number) {
        if (frequency !== undefined) {
            this.frequency.value = frequency;
        }
        this.osc.start();
    }

    stop() {
        this.osc.stop();
    }

    dispose() {
        this.osc.dispose();
    }
}