import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Button, IconButton, Link, Popover, Typography } from '@mui/material';
import { useState } from 'react';

import { links } from '@/Links';

export const ToxicContentPopover = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'toxic-content-popover' : undefined;

    return (
        <>
            {/* TODO: we need to figure out the right color for the info icon we just inherit from text for now */}
            <IconButton onClick={handleClick} sx={{ color: 'inherit' }}>
                <InfoOutlinedIcon />
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: '16px',
                        },
                    },
                }}>
                <Box
                    sx={{
                        display: 'flex',
                        width: '312px',
                        padding: '12px 16px 4px 16px',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        gap: '8px',
                    }}>
                    <Typography variant="subtitle2">Toxicity Filter</Typography>
                    <Typography>
                        We have blurred this area of the results because it may contain offensive
                        language. If you would like to learn more about this, check out our{' '}
                        <Link
                            href={links.faqs}
                            target="_blank"
                            sx={{ color: (theme) => theme.palette.primary.dark }}>
                            FAQs page
                        </Link>
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        width: '100%',
                        padding: '0px 8px',
                        gap: '8px',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        marginTop: '8px',
                        marginBottom: '16px',
                    }}>
                    <Button
                        variant="text"
                        onClick={handleClose}
                        sx={{
                            color: (theme) => theme.palette.primary.dark,
                            padding: 0,
                            alignSelf: 'flex-start',
                            '&:hover': {
                                borderRadius: '16px', // Border radius on hover
                            },
                        }}>
                        Close
                    </Button>
                </Box>
            </Popover>
        </>
    );
};
