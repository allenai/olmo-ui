import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, Typography } from '@mui/material';
import { useLayoutEffect, useRef, useState } from 'react';

import { BlurContentWarning } from './BlurContentWarning';
import { InlineContentWarning } from './InlineContentWarning';
import { ToxicContentPopover } from './ToxicContentPopover';

interface ToxicContentWarningProps {
    isRevealed: boolean;
    onReveal: () => void;
}

export const ToxicContentWarning = ({ isRevealed, onReveal }: ToxicContentWarningProps) => {
    const containerRef = useRef<HTMLElement | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined);

    const Wrapper = isRevealed ? InlineContentWarning : BlurContentWarning;

    useLayoutEffect(() => {
        if (containerRef.current) {
            setAnchorEl(containerRef.current);
        }
    }, [isRevealed]); // Re-run when isRevealed changes

    return (
        <Wrapper onReveal={onReveal}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    flexWrap: 'wrap',
                }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}>
                    <WarningAmberIcon
                        sx={(theme) => ({
                            mr: 1,
                            color: theme.palette.error.dark,
                        })}
                    />
                    <Typography
                        sx={(theme) => ({
                            color: theme.palette.error.dark,
                        })}>
                        Caution
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}>
                    <Typography ref={containerRef}>May contain inappropriate language</Typography>
                    <ToxicContentPopover anchorEl={anchorEl} />
                </Box>
            </Box>
        </Wrapper>
    );
};
