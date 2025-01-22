type AttributionHighlightString = `:attribution-highlight[${string}]{span="${string}"}`;

export const getAttributionHighlightString = (
    spanKey: string,
    span: string
): AttributionHighlightString => `:attribution-highlight[${span}]{span="${spanKey}"}`;
