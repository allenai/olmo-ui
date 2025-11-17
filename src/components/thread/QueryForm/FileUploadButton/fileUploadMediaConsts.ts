export const MediaTypes = {
    image: {
        accept: 'image/*',
        label: 'image', // same as key, but not necessarily
        maxFiles: undefined, // type this object better
    },
    video: {
        accept: 'video/*',
        label: 'video',
        maxFiles: 1,
    },
} as const;

export type MediaTypesType = typeof MediaTypes;
export type MediaTypeKey = keyof MediaTypesType;
export type MediaTypeConfig = MediaTypesType[MediaTypeKey];

export const typeIsMediaType = (type: unknown): type is MediaTypeKey =>
    typeof type === 'string' && Object.keys(MediaTypes).includes(type);
