import debounce from 'lodash.debounce';
import {compressToBase64, decompressFromBase64} from 'lz-string';

import type {Graph} from '../constants';

const SCORE_PARAM = 's';

export function compressScore(score: Graph): string {
    return compressToBase64(JSON.stringify(score));
}

export function uncompressScore(compressedScore: string): Graph {
    return JSON.parse(decompressFromBase64(compressedScore));
}

export function getScoreUrl(score: Graph): string {
    const searchParams = new URLSearchParams({
        [SCORE_PARAM]: compressScore(score),
    }).toString();
    const {location} = window;
    const url = `${location.origin}${location.pathname}`;
    return `${url}?${searchParams}`;
}

export async function getScoreFromLibrary(name: string) {
    const response = await fetch(`/scores/${name}.prg`);
    const compressedScore = await response.text();
    return uncompressScore(compressedScore);
}

export function loadScoreFromUrl(): Graph | null {
    const compressedScore = new URLSearchParams(window.location.search).get(SCORE_PARAM);
    if (!compressedScore) {
        return null;
    }
    return uncompressScore(compressedScore);
}

export const updateScoreUrl = debounce((score: Graph) => {
    window.history.replaceState({}, '', getScoreUrl(score));
}, 200);
