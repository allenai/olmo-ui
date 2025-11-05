export const processPageMetadata = ({
    offset,
    limit,
    total,
}: {
    offset?: number | null;
    limit?: number | null;
    total?: number | null;
}) => {
    offset ??= 0;
    limit ??= 10;
    total ??= 0;
    const pageCount = Math.ceil(total / limit);
    const firstPage = 1;
    const lastPage = pageCount;
    const currentPage = offset / limit + 1;
    return {
        offset,
        limit,
        total,
        hasNextPage: currentPage < lastPage,
        hasPrevPage: currentPage > firstPage,
    };
};
