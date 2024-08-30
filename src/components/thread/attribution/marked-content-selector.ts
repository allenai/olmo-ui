import { AppContextState, useAppContext } from '@/AppContext';
import { useFeatureToggles } from '@/FeatureToggleContext';
import { messageAttributionsSelector } from '@/slices/attribution/attribution-selectors';

import { type AttributionHighlightVariant } from './AttributionHighlight';
import { createSpanReplacementRegex } from './span-replacement-regex';

const selectedCorrespondingSpansSelector = (state: AppContextState) => {
    if (state.attribution.selectedDocumentIndex == null) {
        return [];
    }

    const documents = messageAttributionsSelector(state)?.documents;
    return documents?.[state.attribution.selectedDocumentIndex]?.corresponding_span_texts ?? [];
};

const previewCorrespondingSpansSelector = (state: AppContextState) => {
    if (state.attribution.previewDocumentIndex == null) {
        return [];
    }

    const documents = messageAttributionsSelector(state)?.documents;
    return documents?.[state.attribution.previewDocumentIndex]?.corresponding_span_texts ?? [];
};

const checkForBalancedBraces = (string: string) => {
    let openingBracesCount = 0;
    let closingBracesCount = 0;
    for (let i = 0; i < string.length; i++) {
        if (string[i] === '[') {
            openingBracesCount += 1;
        } else if (string[i] === ']') {
            closingBracesCount += 1;
            if (closingBracesCount > openingBracesCount) {
                return false;
            }
        }
    }

    return openingBracesCount === closingBracesCount;
};

export const escapeBraces = (string: string) => {
    const shouldEscapeBraces = !checkForBalancedBraces(string);
    // the markdown renderer can handle matched braces in our highlights but not unmatched ones.
    // checking for balanced braces lets us get around that
    if (shouldEscapeBraces) {
        return string.replaceAll(/(\[|\])/g, '\\$1');
    } else {
        return string;
    }
};

type AttributionHighlightString =
    `:attribution-highlight[${string}]{variant="${AttributionHighlightVariant}" span="${string}"}`;

const getAttributionHighlightString = (
    spanKey: string,
    span: string,
    variant: AttributionHighlightVariant
): AttributionHighlightString =>
    `:attribution-highlight[${span}]{variant="${variant}" span="${spanKey}"}`;

export const documentFirstMarkedContentSelector =
    (messageId: string) =>
    (state: AppContextState): string => {
        const content = state.selectedThreadMessagesById[messageId].content;

        let contentWithMarks = content;

        const selectedSpans = selectedCorrespondingSpansSelector(state);

        selectedSpans.forEach((span) => {
            contentWithMarks = contentWithMarks.replaceAll(
                createSpanReplacementRegex(span),
                getAttributionHighlightString(span, span, 'selected')
            );
        });

        const previewSpans = previewCorrespondingSpansSelector(state);
        const previewSpansThatArentSelected = previewSpans.filter(
            (previewSpan) => !selectedSpans.includes(previewSpan)
        );

        previewSpansThatArentSelected.forEach((span) => {
            contentWithMarks = contentWithMarks.replaceAll(
                createSpanReplacementRegex(span),
                getAttributionHighlightString(span, span, 'preview')
            );
        });

        return contentWithMarks;
    };

export const removeMarkdownCharactersFromStartAndEndOfSpan = (spanText: string): string => {
    /**
     * https://regex101.com/r/5S3uuh
     * This regex checks for markdown characters inside of spans
     * At the start of a string, it looks for things like headings (any number of #) and list symbols (-, +, *, or 1.).
     * At the start and end of a string it looks for markdown symbols that can wrap something. This includes things like emphasis (any number of *, any number of _) and code blocks (`)
     * We also trim after doing the regex matching to make sure there's spaces before and after the highlight as needed
     */
    return spanText.replaceAll(/^(?:[+\->`]|#+|\d\.|\*+|_+)\s*|(?<!\s)(?:\*+|_+|`)$/gm, '').trim();
};

export const spanFirstMarkedContentSelector =
    (messageId: string) =>
    (state: AppContextState): string => {
        const content = state.selectedThreadMessagesById[messageId].content;

        const spans = state.attribution.attributionsByMessageId[messageId]?.spans ?? {};

        const intermediate = Object.entries(spans).reduce((acc, [spanKey, span]) => {
            if (span?.text) {
                const escapedText = removeMarkdownCharactersFromStartAndEndOfSpan(span.text);
                return acc.replaceAll(
                    createSpanReplacementRegex(escapedText),
                    getAttributionHighlightString(spanKey, escapeBraces(escapedText), 'default')
                );
            } else {
                return acc;
            }
        }, content);
        return intermediate;
    };

export const useSpanHighlighting = (messageId: string) => {
    const { attribution, attributionSpanFirst } = useFeatureToggles();

    const highlightSelector = attributionSpanFirst
        ? spanFirstMarkedContentSelector
        : documentFirstMarkedContentSelector;

    const contentWithMarks = useAppContext((state) => {
        if (!attribution) {
            return state.selectedThreadMessagesById[messageId].content;
        }

        return highlightSelector(messageId)(state);
    });

    return contentWithMarks;
};
