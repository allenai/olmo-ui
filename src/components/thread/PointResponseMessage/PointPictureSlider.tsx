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
    const itemsRef = useRef<HTMLLIElement[]>([]);
    const scrollBehaviorRef = useRef<ScrollBehavior>('instant');
    const [scrollIndex, setScrollIndex] = useState(initialIndex || 0);

    const isAtStart = scrollIndex <= 0;
    const isAtEnd = scrollIndex >= itemsRef.current.length - 1;

    useEffect(() => {
        if (!sliderRef.current) return;
        if (sliderRef.current.children.length < 2) return;
        itemsRef.current = [...sliderRef.current.children] as HTMLLIElement[];

        sliderRef.current.addEventListener('scrollend', (event) => {
            if (event.target instanceof Element) {
                // at start
                if (event.target.scrollLeft === 0) {
                    setScrollIndex(0);
                }

                //
                if (
                    event.target.scrollLeft ===
                    event.target.scrollWidth - event.target.clientWidth
                ) {
                    setScrollIndex(itemsRef.current.length - 1);
                }

                // middle calculates item nearset middle of scroll window (clientWidth)
                if (
                    event.target.scrollLeft > 0 &&
                    event.target.scrollLeft < event.target.scrollWidth
                ) {
                    const targetCenter = event.target.scrollLeft + event.target.clientWidth / 2;
                    const closestIndex = itemsRef.current.reduce<{
                        index: number;
                        distance: number;
                    }>(
                        (acc, item, index) => {
                            const itemCenter = item.offsetLeft + item.offsetWidth / 2;
                            const distance = Math.abs(itemCenter - targetCenter);
                            if (distance < acc.distance) {
                                return { index, distance };
                            }
                            return acc;
                        },
                        { index: 0, distance: Infinity }
                    ).index;
                    setScrollIndex(closestIndex);
                }
            }
        });
    }, []);

    useEffect(() => {
        // needs small timout to scroll properly on mount
        const to = setTimeout(() => {
            itemsRef.current[scrollIndex]?.scrollIntoView({
                behavior: scrollBehaviorRef.current,
                inline: 'center',
            });
            scrollBehaviorRef.current = 'smooth';
        }, 50);
        return () => {
            clearTimeout(to);
        };
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
        positionAnchor: '--slider-container',
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
            sx={{
                position: 'relative',
                anchorName: '--slider-container',
                height: '100%',
                maxHeight: MAX_THREAD_IMAGE_HEIGHT_PX + 20, // clearance for markers
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

                    overflowX: 'auto',

                    scrollSnapType: 'x mandatory',
                    scrollBehavior: 'smooth',
                }}>
                {fileUrls.map((url, index) => {
                    const pointsSets = pointsSetsByFileUrl.get(url) || [];
                    return (
                        <PointPicture
                            data-index={index}
                            sx={{
                                height: '100%',
                                width: 'max-content',
                                paddingBottom: showPerImageCaption ? '2.5em' : 0,
                                scrollSnapAlign: 'center',
                            }}
                            key={url}
                            onClick={() => {
                                return onClick?.({ url, index });
                            }}
                            imageLink={url}
                            pointsSets={pointsSets}
                            caption={
                                showPerImageCaption && (
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        padding={1}>
                                        <PointPictureCaption pointsSets={pointsSets} />
                                        <span>{`Image ${index + 1}/${fileUrls.length}`}</span>
                                    </Box>
                                )
                            }
                        />
                    );
                })}
            </Box>

            {/* Page Marks */}
            <Box
                sx={{
                    height: 'auto',
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
                            width: 12,
                            aspectRatio: 1,
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
                    {/* Next Button */}
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
                            isAtEnd ? buttonDisabledProps : {},
                        ]}>
                        <ChevronIcon />
                    </IconButton>

                    {/* Previous Button */}
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
                            isAtStart ? buttonDisabledProps : {},
                        ]}>
                        <ChevronIcon />
                    </IconButton>
                </>
            )}
        </Box>
    );
};
