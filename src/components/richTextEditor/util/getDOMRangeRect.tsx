// see: https://github.com/facebook/lexical/blob/4b4db176bc9a373a33f81f11c0e63dee74a25a20/packages/lexical-playground/src/utils/getDOMRangeRect.ts

// util function taken from link above
export const getDOMRangeRect = (nativeSelection: Selection, rootElement: HTMLElement): DOMRect => {
    const domRange = nativeSelection.getRangeAt(0);

    let rect;

    if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild != null) {
            inner = inner.firstElementChild as HTMLElement;
        }
        rect = inner.getBoundingClientRect();
    } else {
        rect = domRange.getBoundingClientRect();
    }

    return rect;
};
