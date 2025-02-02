export function remToPx(rem: string) {
    const remValue = +(rem.replace('rem', ''))
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return +remValue * rootFontSize;
}