import { Box, IconButton } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { ReactNode, useEffect, useRef, useState } from 'react';

import { ChevronIcon } from '@/components/assets/ChevronIcon';

import { ImagePoints } from '../points/pointsDataTypes';
import { MIN_THREAD_IMAGE_HEIGHT_PX } from '../ThreadDisplay/threadDisplayConsts';
import { PointPicture, PointsSets } from './PointPicture';
import { PointPictureCaption } from './PointPictureCaption';

interface PointPictureSliderProps {
    moveToItem?: number;
    imagePointsSets?: ImagePoints[];
    fileUrls: readonly string[];
    showPerImageCaption?: boolean;
    onClick?: (image: { url: string; index: number }) => void;
    onItemChange?: (newItemIndex: number) => void;
}

export const PointPictureSlider = ({
    moveToItem,
    imagePointsSets = [],
    fileUrls,
    showPerImageCaption,
    onClick,
    onItemChange,
}: PointPictureSliderProps): ReactNode => {
    const sliderRef = useRef<HTMLUListElement | null>(null);
    const itemsRef = useRef<HTMLLIElement[]>([]);
    const scrollBehaviorRef = useRef<ScrollBehavior>('instant');
    const [scrollIndex, setScrollIndex] = useState(0);

    const isAtStart = scrollIndex <= 0;
    const isAtEnd = scrollIndex >= fileUrls.length - 1;

    useEffect(() => {
        if (!sliderRef.current) return;
        if (sliderRef.current.children.length < 2) return;
        itemsRef.current = [...sliderRef.current.children] as HTMLLIElement[];

        sliderRef.current.addEventListener('scrollend', (event) => {
            if (event.target instanceof Element) {
                if (event.target.scrollLeft <= 10) {
                    // at start
                    setScrollIndex(0);
                } else if (
                    // at end
                    event.target.scrollLeft ===
                    event.target.scrollWidth - event.target.clientWidth
                ) {
                    setScrollIndex(itemsRef.current.length - 1);
                } else if (
                    event.target.scrollLeft > 0 &&
                    event.target.scrollLeft >= event.target.scrollWidth - 10
                ) {
                    // middle calculates item nearset middle of scroll window (clientWidth)
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
        onItemChange?.(scrollIndex);
        return () => {
            clearTimeout(to);
        };
    }, [onItemChange, scrollIndex]);

    // use moveToItem and onItemChange for controlled movement
    useEffect(() => {
        if (moveToItem != null) {
            setScrollIndex(moveToItem);
        }
    }, [moveToItem]);

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
        position: 'absolute',
        top: '50%',
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
                height: '100%',
            }}>
            <Box
                component="ul"
                ref={sliderRef}
                sx={{
                    display: 'grid',
                    gridAutoFlow: 'column',
                    gridAutoColumns: 'max-content',
                    gridTemplateRows: `minmax(${MIN_THREAD_IMAGE_HEIGHT_PX}px, 50vmin)`,
                    gap: 1.5,

                    height: '100%',
                    backgroundColor: 'inherit',

                    overflowX: 'auto',

                    scrollSnapType: 'x mandatory',
                    scrollBehavior: 'smooth',

                    // this is the computed size of the pager
                    // 12px + 8px + 8px
                    paddingBottom: '28px',
                }}>
                {fileUrls.map((url, index) => {
                    const pointsSets = pointsSetsByFileUrl.get(url) || [];
                    return (
                        <PointPicture
                            key={url}
                            component="li"
                            sx={{
                                height: '100%',
                                paddingBottom: showPerImageCaption ? '2.5em' : 0,
                                scrollSnapAlign: 'center',
                            }}
                            onClick={
                                onClick
                                    ? () => {
                                          onClick({ url, index });
                                      }
                                    : undefined
                            }
                            imageLink={url}
                            imageAlt={`image ${index + 1}`} // llm response will often refer to images by number
                            pointsSets={pointsSets}
                            caption={
                                showPerImageCaption && (
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        width="100%"
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
            <Box
                sx={{
                    height: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundColor: 'inherit',
                    gap: 1,
                    padding: '0.5rem',

                    // position the pager to the bottom of the container
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    // this is extra space for the scroll bar (made up value here).
                    marginBottom: '10px',
                }}>
                {fileUrls.map((_, index) => (
                    <Box
                        key={index}
                        className={index === scrollIndex ? 'active' : undefined}
                        component="button"
                        onClick={() => {
                            setScrollIndex(index);
                        }}
                        aria-label={`scroll to image ${index + 1}`}
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
            {/* Page Marks */}

            {!isSingleImageList && (
                <>
                    {/* Previous Button */}
                    <IconButton
                        onClick={() => {
                            setScrollIndex((prev) => (prev > 0 ? prev - 1 : prev));
                        }}
                        sx={[
                            buttonProps,
                            {
                                left: 0,
                                translate: '50%',
                                transform: 'rotate(180deg)',
                            },
                            isAtStart ? buttonDisabledProps : {},
                        ]}>
                        <ChevronIcon />
                    </IconButton>

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
                                right: 0,
                                translate: '-50%',
                            },
                            isAtEnd ? buttonDisabledProps : {},
                        ]}>
                        <ChevronIcon />
                    </IconButton>
                </>
            )}
        </Box>
    );
};
