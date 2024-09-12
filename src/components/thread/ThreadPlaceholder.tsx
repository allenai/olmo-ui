import { Stack, Typography } from '@mui/material';

export const ThreadPlaceholder = () => {
    return (
        <Stack
            marginBlockStart="auto"
            alignSelf="center"
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap={2}>
            <img src="/ai2-monogram.svg" alt="" width={70} height={70} />
            <Typography variant="body1">
                <br />
                {/* TODO: This still working text will need to show up at some point when we add the loading states */}
                {/* Still working... */}
            </Typography>
        </Stack>
    );
};
