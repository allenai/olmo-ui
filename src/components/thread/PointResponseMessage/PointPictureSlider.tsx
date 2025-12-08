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
    pageMarkHeightPx?: number;
    onClick?: (image: { url: string; index: number }) => void;
    onItemChange?: (newItemIndex: number) => void;
}

export const PointPictureSlider = ({
    moveToItem = 0,
    imagePointsSets = [],
    fileUrls,
    showPerImageCaption,
    pageMarkHeightPx = 12,
    onClick,
    onItemChange,
}: PointPictureSliderProps): ReactNode => {
    const sliderRef = useRef<HTMLUListElement | null>(null);
    const itemsRef = useRef<HTMLLIElement[]>([]);
    const [activeItems, setActiveItems] = useState<Array<boolean>>(
        fileUrls.map((_, index) => index === moveToItem)
    );

    const isAtStart = activeItems[0];
    const isAtEnd = activeItems[fileUrls.length - 1];

    useEffect(() => {
        if (!sliderRef.current) return;
        if (sliderRef.current.children.length < 2) return;

        const sliderEl = sliderRef.current;
        itemsRef.current = [...sliderEl.children] as HTMLLIElement[];

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const itemIndex = itemsRef.current.indexOf(entry.target as HTMLLIElement);
                    if (entry.isIntersecting) {
                        setActiveItems((prev) => {
                            prev[itemIndex] = true;
                            return [...prev];
                        });
                    } else {
                        setActiveItems((prev) => {
                            prev[itemIndex] = false;
                            return [...prev];
                        });
                    }
                });
            },
            {
                root: sliderEl,
                rootMargin: '1px',
                threshold: 0.8,
            }
        );

        itemsRef.current.forEach((el) => {
            observer.observe(el);
        });

        return () => {
            itemsRef.current.forEach((el) => {
                observer.unobserve(el);
            });
        };
    }, []);

    const handleClickToMove = (scrollToIndex: number) => {
        itemsRef.current[scrollToIndex]?.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
        });
        onItemChange?.(scrollToIndex);
    };

    // use moveToItem and onItemChange for controlled movement
    useEffect(() => {
        if (moveToItem !== 0) {
            itemsRef.current[moveToItem]?.scrollIntoView({
                behavior: 'instant',
                inline: 'center',
            });
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
                    gridTemplateRows: `minmax(${MIN_THREAD_IMAGE_HEIGHT_PX}px, 60vmin)`,
                    gap: 1.5,

                    height: '100%',
                    backgroundColor: 'inherit',
                    paddingBottom: `${pageMarkHeightPx * 2 + 16}px`, // total height of page marker div
                    overflowX: 'auto',

                    scrollSnapType: 'x mandatory',
                    scrollBehavior: 'smooth',
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
                                        display="grid"
                                        gridTemplateColumns="repeat(auto-fit, minmax(10px, auto))"
                                        alignItems="start"
                                        gap={1}
                                        width="100%"
                                        padding={1}>
                                        <PointPictureCaption pointsSets={pointsSets} />
                                        <Box justifySelf="end">
                                            {/* removing on small to better avoid misaligning svg overlay */}
                                            <Box
                                                component="span"
                                                sx={{ display: ['none', 'inline'] }}>
                                                Image{' '}
                                            </Box>
                                            {`${index + 1}/${fileUrls.length}`}
                                        </Box>
                                    </Box>
                                )
                            }
                        />
                    );
                })}
            </Box>

            {!isSingleImageList && (
                <>
                    {/* Page Marks */}
                    <Box
                        sx={{
                            height: 'auto',
                            display: 'flex',
                            justifyContent: 'center',
                            backgroundColor: 'inherit',
                            gap: 1,
                            padding: '0.5rem',

                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',

                            // extimated extra space for the scroll bar
                            marginBottom: `${pageMarkHeightPx}px`,
                        }}>
                        {fileUrls.map((_, index) => (
                            <Box
                                key={index}
                                className={activeItems[index] ? 'active' : undefined}
                                component="button"
                                onClick={() => {
                                    handleClickToMove(index);
                                }}
                                aria-label={`scroll to image ${index + 1}`}
                                sx={{
                                    content: '" "',
                                    width: pageMarkHeightPx,
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

                    {/* Previous Button */}
                    <IconButton
                        onClick={() => {
                            const scrollIndex = activeItems.findIndex((item) => item);
                            handleClickToMove(scrollIndex > 0 ? scrollIndex - 1 : scrollIndex);
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
                            const scrollIndex = activeItems.findLastIndex((item) => item);
                            handleClickToMove(
                                scrollIndex < itemsRef.current.length - 1
                                    ? scrollIndex + 1
                                    : scrollIndex
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
