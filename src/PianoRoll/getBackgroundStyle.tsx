import type {CSSProperties} from 'react';

const NATURAL_INDEXES = new Set([0, 2, 3, 5, 7, 8, 10]);

const encodedSVG = getEncodedSVG();

function getBackgroundStyle(
    x: number,
    y: number,
    zoom: number,
    gridSize: number,
): CSSProperties {
    return {
        backgroundImage: `url(${encodedSVG})`,
        backgroundRepeat: 'repeat',
        backgroundSize: `${gridSize * zoom * 4}px`,
        backgroundPositionX: x,
        backgroundPositionY: y,
    };
}

function getEncodedSVG(): string  {
    const horizontalLines = Array(12).fill('').map((_, i) => {
        const y = i * 256;
        let line;
        if (!NATURAL_INDEXES.has(i % 12)) {
            line = `<rect width="1024" height="256" y="${y}" fill="#EAEAEA" />`;
        }
        line += `<line x1="0" y1="${y}" x2="1024" y2="${y}" stroke="black" stroke-width="2" />`;
        return line;
    }).join();
    const serializedSvg = `
        <svg viewBox="0 0 1024 3072" xmlns="http://www.w3.org/2000/svg">
            ${horizontalLines}
            <line x1="0" y1="0" x2="0" y2="3072" stroke="black" stroke-width="8" />
            <line x1="256" y1="0" x2="256" y2="3072" stroke="black" />
            <line x1="512" y1="0" x2="512" y2="3072" stroke="black" />
            <line x1="768" y1="0" x2="768" y2="3072" stroke="black" />
        </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(serializedSvg)}`;
}

export default getBackgroundStyle;
