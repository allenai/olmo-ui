export const MediaTypes = {
    image: {
        accept: 'image/*',
        label: 'Upload images',
        maxFiles: undefined, // type this object better
    },
    video: {
        accept: 'video/*',
        label: 'Upload videos',
        maxFiles: 1,
    },
} as const;

export const typeIsMediaType = (type: unknown): type is keyof typeof MediaTypes =>
    typeof type === 'string' && Object.keys(MediaTypes).includes(type);
