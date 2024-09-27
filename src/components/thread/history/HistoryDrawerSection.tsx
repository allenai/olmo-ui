import { Divider, List, useTheme } from '@mui/material';

import { Message } from '@/api/Message';
import { NavigationHeading } from '@/components/OlmoAppBar/NavigationHeading';
import { ThreadLink } from '@/components/ThreadLink';

interface HistoryDrawerSectionProps {
    heading: string;
    threads: Message[];
    hasDivider?: boolean;
}

export const HistoryDrawerSection = ({
    heading,
    threads,
    hasDivider,
}: HistoryDrawerSectionProps): JSX.Element => {
    const theme = useTheme();
    if (threads.length === 0) {
        return <></>;
    }

    return (
        <>
            {hasDivider && <Divider />}
            <List>
                <NavigationHeading color={theme.palette.tertiary.light}>
                    {heading}
                </NavigationHeading>
                {threads.map((thread) => (
                    <ThreadLink {...thread} key={thread.id} />
                ))}
            </List>
        </>
    );
};
