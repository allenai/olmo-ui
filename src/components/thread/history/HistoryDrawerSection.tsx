import { Divider, List } from '@mui/material';

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
    if (threads.length === 0) {
        return <></>;
    }

    return (
        <>
            {hasDivider && <Divider />}
            <List>
                <NavigationHeading>{heading}</NavigationHeading>
                {threads.map((thread) => (
                    <ThreadLink {...thread} key={thread.id} />
                ))}
            </List>
        </>
    );
};
