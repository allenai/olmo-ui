import { Divider, List, styled, useTheme } from '@mui/material';

import { Message } from '@/api/Message';
import { NavigationHeading } from '@/components/OlmoAppBar/NavigationHeading';
import { ThreadLink } from '@/components/ThreadLink';

interface HistoryDrawerSectionProps {
    heading: string;
    threads: Message[];
    hasDivider?: boolean;
}

export const HistoryDivider = styled(Divider)(({ theme }) => ({
    borderColor: theme.palette.background.paper,
    opacity: 0.5,
}));

export const HistoryDrawerSection = ({
    heading,
    threads,
    hasDivider = false,
}: HistoryDrawerSectionProps): JSX.Element => {
    const theme = useTheme();
    if (threads.length === 0) {
        return <></>;
    }

    return (
        <>
            <List>
                <NavigationHeading color={theme.palette.secondary.light}>
                    {heading}
                </NavigationHeading>
                {threads.map((thread) => (
                    <ThreadLink {...thread} key={thread.id} />
                ))}
            </List>
            {hasDivider && <HistoryDivider />}
        </>
    );
};
