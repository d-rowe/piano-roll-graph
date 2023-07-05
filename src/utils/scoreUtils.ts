const TICKS_PER_BEAT = 1024;

export function getBeat(tick: number): number {
    return tick / TICKS_PER_BEAT;
}

export function getFrequency(midi: number) {
    return 440 * Math.pow(2, (midi - 69) / 12);
}
