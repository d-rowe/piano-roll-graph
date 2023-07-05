import {
    Signal,
    MonoSynth,
} from 'tone';

const FREQUENCY = 'frequency';
const DECIBELS = 'decibels';
const ATTACK = 0.1;
export const DEFAULT_VOLUME = -16;

export default class Synth {
    private readonly synth: MonoSynth;
    public readonly frequency: Signal<typeof FREQUENCY>;
    public readonly volume: Signal<typeof DECIBELS>;

    constructor() {
        this.synth = new MonoSynth({
            filterEnvelope: {
                attack: ATTACK,
                attackCurve: 'linear',
            },
            envelope: {
                attack: ATTACK,
                attackCurve: 'linear',
            },
            oscillator: {
                type: 'triangle',
            }
        }).toDestination();

        this.setVolume(DEFAULT_VOLUME);

        this.volume = new Signal({
            units: DECIBELS,
        });
        this.frequency = new Signal({
            units: FREQUENCY,
        }).connect(this.synth.frequency);
    }

    triggerAttack(frequency: number) {
        this.frequency.value = frequency;
        this.synth.triggerAttack(frequency);
    }

    triggerRelease() {
        this.synth.triggerRelease();
    }

    setVolume(volume: number) {
        this.synth.volume.value = volume;
    }

    setImmediateAttack() {
        this.synth.envelope.attack = 0;
        this.synth.filterEnvelope.attack = 0;
    }

    dispose() {
        this.synth.dispose();
        this.frequency.dispose();
        this.volume.dispose();
    }
}