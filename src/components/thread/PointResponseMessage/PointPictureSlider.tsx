import { Box, IconButton } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { ReactNode, useEffect, useRef, useState } from 'react';

import { ChevronIcon } from '@/components/assets/ChevronIcon';

import { ImagePoints } from '../points/pointsDataTypes';
import {
    MAX_THREAD_IMAGE_HEIGHT_PX,
    MIN_THREAD_IMAGE_HEIGHT_PX,
} from '../ThreadDisplay/threadDisplayConsts';
import { PointPicture, PointsSets } from './PointPicture';
import { PointPictureCaption } from './PointPictureCaption';

interface PointPictureSliderProps {
    initialIndex?: number | null;
    imagePointsSets?: ImagePoints[];
    fileUrls: readonly string[];
    showPerImageCaption?: boolean;
    onClick?: (image: { url: string; index: number }) => void;
}

export const PointPictureSlider = ({
    initialIndex,
    imagePointsSets = [],
    fileUrls,
    showPerImageCaption,
    onClick,
}: PointPictureSliderProps): ReactNode => {
    const sliderRef = useRef<HTMLUListElement | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const itemsRef = useRef<HTMLLIElement[]>([]);
    const [scrollIndex, setScrollIndex] = useState(initialIndex || 0);
    // const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (!sliderRef.current) return;
        if (sliderRef.current.children.length < 2) return;
        itemsRef.current = [...sliderRef.current.children] as HTMLLIElement[];

        // if (observerRef.current) observerRef.current.disconnect();
        // observerRef.current = new IntersectionObserver(
        //     (entries) => {
        //         const index = entries.findIndex((entry) => entry.isIntersecting);
        //         itemsRef.current[index]?.scrollIntoView({
        //             behavior: 'smooth',
        //             inline: 'center',
        //         });
        //     },
        //     {
        //         threshold: 0.5,
        //         root: wrapperRef.current,
        //         rootMargin: '0px 80%',
        //     }
        // );
        // itemsRef.current.forEach((node) => {
        //     observerRef.current?.observe(node);
        // });

        // return () => {
        //     observerRef.current?.disconnect();
        // };
    }, []);

    useEffect(() => {
        itemsRef.current[scrollIndex]?.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
        });
    }, [scrollIndex]);

    const pointsSetsByFileUrl = fileUrls.reduce<Map<string, PointsSets[]>>((acc, url, index) => {
        imagePointsSets.forEach(({ label, alt, imageList }) => {
            const pointsPerImageId = imageList.find(
                ({ imageId }) => imageId === `${index + 1}`
            )?.points;

            const prev = acc.get(url) || [];

            if (pointsPerImageId) {
                acc.set(url, [
                    ...prev,
                    {
                        label,
                        alt,
                        url,
                        points: pointsPerImageId,
                    },
                ]);
            }
        });

        return acc;
    }, new Map());

    const isSingleImageList = fileUrls.length === 1;
    const buttonProps: SxProps<Theme> = (theme) => ({
        position: 'fixed',
        positionAnchor: '--slider',
        color: theme.color['dark-teal-100'].hex,
        backgroundColor: theme.color['cream-10'].hex,
        '&:hover': {
            backgroundColor: theme.color['cream-10'].hex,
        },
    });

    const buttonDisabledProps: SxProps = {
        opacity: 0,
        pointerEvents: 'none',
    };

    return (
        <Box
            ref={wrapperRef}
            sx={{
                position: 'relative',
                anchorName: '--slider',
                height: isSingleImageList ? 'auto' : '100%',
                maxHeight: MAX_THREAD_IMAGE_HEIGHT_PX,
            }}>
            <Box
                component="ul"
                ref={sliderRef}
                sx={{
                    display: 'grid',
                    gridAutoFlow: 'column',
                    gridAutoColumns: 'auto',
                    gridTemplateRows: `minmax(${MIN_THREAD_IMAGE_HEIGHT_PX}px, ${MAX_THREAD_IMAGE_HEIGHT_PX}px)`,
                    gap: 1.5,

                    height: '100%',
                    backgroundColor: 'inherit',

                    overflowX: !isSingleImageList ? 'auto' : undefined,

                    scrollSnapType: 'x mandatory',
                    scrollBehavior: 'smooth',
                }}>
                {fileUrls.map((url, index) => {
                    const pointsSets = pointsSetsByFileUrl.get(url) || [];
                    return (
                        <PointPicture
                            data-index={index}
                            sx={
                                !isSingleImageList
                                    ? {
                                          height: '100%',
                                          width: 'max-content',
                                          paddingBottom: showPerImageCaption ? '2.5em' : 0,
                                          scrollSnapAlign: 'center',
                                      }
                                    : {
                                          height: '100%',
                                      }
                            }
                            key={url}
                            onClick={() => {
                                return onClick?.({ url, index });
                            }}
                            imageLink={url}
                            pointsSets={pointsSets}
                            caption={
                                showPerImageCaption && (
                                    <PointPictureCaption pointsSets={pointsSets} />
                                )
                            }
                        />
                    );
                })}
            </Box>
            <Box
                sx={{
                    height: 12,
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundColor: 'inherit',
                    gap: 1,
                    padding: '0.5rem',
                }}>
                {fileUrls.map((_, index) => (
                    <Box
                        className={index === scrollIndex ? 'active' : undefined}
                        key={index}
                        onClick={() => {
                            setScrollIndex(index);
                        }}
                        sx={{
                            content: '" "',
                            width: 10,
                            height: 10,
                            color: 'currentColor',
                            borderRadius: '50%',
                            border: '1px solid',
                            borderColor: 'currentColor',
                            opacity: 0.8,
                            cursor: 'pointer',
                            '&.active': {
                                backgroundColor: 'currentColor',
                            },
                        }}
                    />
                ))}
            </Box>
            {!isSingleImageList && (
                <>
                    <IconButton
                        onClick={() => {
                            setScrollIndex((prev) =>
                                prev < itemsRef.current.length - 1 ? prev + 1 : prev
                            );
                        }}
                        sx={[
                            buttonProps,
                            {
                                positionArea: 'center right',
                                translate: '-110%',
                            },
                            scrollIndex === itemsRef.current.length - 1 ? buttonDisabledProps : {},
                        ]}>
                        <ChevronIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            setScrollIndex((prev) => (prev > 0 ? prev - 1 : prev));
                        }}
                        sx={[
                            buttonProps,
                            {
                                positionArea: 'center left',
                                translate: '110%',
                                transform: 'rotate(180deg)',
                            },
                            scrollIndex === 0 ? buttonDisabledProps : {},
                        ]}>
                        <ChevronIcon />
                    </IconButton>
                </>
            )}
        </Box>
    );
};
