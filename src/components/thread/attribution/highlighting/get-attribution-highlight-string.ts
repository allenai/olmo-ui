type AttributionHighlightString =
    `<attribution-highlight span="${string}">${string}</attribution-highlight>`;

export const getAttributionHighlightString = (
    spanKey: string,
    span: string
): AttributionHighlightString =>
    `<attribution-highlight span="${spanKey}">${span}</attribution-highlight>`;
