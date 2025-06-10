import { useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form-mui';

import { QueryFormValues } from '@/components/thread/QueryForm/QueryForm';

// Image resize configuration (should this be an env var?)
export const MAX_IMAGE_AREA = 25_000_000; // 25MP (roughly)

// Debugging function to get image dimensions
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            resolve({
                width: img.naturalWidth,
                height: img.naturalHeight,
            });
            URL.revokeObjectURL(url);
        };

        img.onerror = () => {
            reject(new Error('Failed to load image'));
            URL.revokeObjectURL(url);
        };

        img.src = url;
    });
};

// Custom hook to process and resize images when files change
export const useImageProcessing = (
    files: FileList | undefined,
    formContext: UseFormReturn<QueryFormValues>
) => {
    useEffect(() => {
        if (files && files.length > 0) {
            const processImages = async () => {
                const processedFiles: File[] = [];
                let hasResizedImages = false;

                for (const file of Array.from(files)) {
                    if (file.type.startsWith('image/')) {
                        try {
                            const originalDimensions = await getImageDimensions(file);
                            const imageArea = originalDimensions.width * originalDimensions.height;

                            // Check if image needs resizing
                            if (imageArea > MAX_IMAGE_AREA) {
                                const resizedFile = await resizeImage(file, MAX_IMAGE_AREA);
                                const resizedSizeInKB = Math.round(resizedFile.size / 1024);
                                const resizedSizeInMB = (resizedFile.size / (1024 * 1024)).toFixed(
                                    2
                                );

                                console.log(
                                    `Resized file size: ${resizedSizeInKB} KB (${resizedSizeInMB} MB)`
                                );

                                processedFiles.push(resizedFile);
                                hasResizedImages = true;
                            } else {
                                processedFiles.push(file);
                            }
                        } catch (error) {
                            console.error(`Failed to process image ${file.name}:`, error);
                            processedFiles.push(file); // Keep original file if processing fails
                        }
                    } else {
                        processedFiles.push(file); // Keep non-image files as-is
                    }
                }

                // Update form with processed files if any images were resized
                if (hasResizedImages) {
                    const dataTransfer = new DataTransfer();
                    processedFiles.forEach((file) => dataTransfer.items.add(file));
                    formContext.setValue('files', dataTransfer.files);
                }
            };

            processImages().catch((error: unknown) => {
                console.error('Failed to process images:', error);
            });
        }
    }, [files, formContext]);
};

// Function to resize image using canvas
export const resizeImage = (file: File, maxArea: number = MAX_IMAGE_AREA): Promise<File> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                URL.revokeObjectURL(url);
                reject(new Error('Failed to get canvas context'));
                return;
            }

            const { width, height } = img;

            let newWidth = width;
            let newHeight = height;

            if (width * height > maxArea) {
                const aspectRatio = width / height;
                newWidth = Math.sqrt(maxArea * aspectRatio);
                newHeight = Math.sqrt(maxArea / aspectRatio);
            }

            canvas.width = newWidth;
            canvas.height = newHeight;

            // Draw resized image
            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            // Convert canvas to blob
            canvas.toBlob(
                (blob) => {
                    URL.revokeObjectURL(url);
                    if (blob) {
                        // Create new file with same name and type
                        const resizedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now(),
                        });
                        resolve(resizedFile);
                    } else {
                        reject(new Error('Failed to create resized image blob'));
                    }
                },
                file.type,
                0.9 // Quality for JPEG images
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image for resizing'));
        };

        img.src = url;
    });
};
