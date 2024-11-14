import { Divider, List, styled, useTheme } from '@mui/material';

import { Message } from '@/api/Message';
import { Role } from '@/api/Role';
import { NavigationHeading } from '@/components/OlmoAppBar/NavigationHeading';
import { ThreadLink } from '@/components/ThreadLink';

const getThreadContent = (thread: Message) => {
    if (thread.role === Role.System) {
        const firstUserMessageContent = thread.children?.find(
            (child) => child.role === Role.User
        )?.content;

        // If there's no user message we revert to the default
        // This isn't always correct, but covers us if we're in this non-standard situation
        if (firstUserMessageContent != null) {
            return firstUserMessageContent;
        }
    }

    return thread.content;
};

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
                    <ThreadLink
                        content={getThreadContent(thread)}
                        created={thread.created}
                        id={thread.id}
                        key={thread.id}
                    />
                ))}
            </List>
            {hasDivider && <HistoryDivider />}
        </>
    );
};
