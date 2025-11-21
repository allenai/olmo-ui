export type MediaType = {
    id: string;
    accept: string;
    label: string;
    maxFiles?: number;
};

export const mediaTypeList: MediaType[] = [
    {
        id: 'image',
        accept: 'image/*',
        label: 'image', // Right now same as `id` -- but might not be?
    },
    {
        id: 'video',
        accept: 'video/*',
        label: 'video',
        maxFiles: 1,
    },
] as const;
