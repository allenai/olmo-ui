import type { AttributionHighlightVariant } from '../AttributionHighlight';

type AttributionHighlightString =
    `:attribution-highlight[${string}]{variant="${AttributionHighlightVariant}" span="${string}"}`;
export const getAttributionHighlightString = (
    spanKey: string,
    span: string,
    variant: AttributionHighlightVariant
): AttributionHighlightString =>
    `:attribution-highlight[${span}]{variant="${variant}" span="${spanKey}"}`;
