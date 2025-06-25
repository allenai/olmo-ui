import { Divider, List, styled, useTheme } from '@mui/material';

import { Thread } from '@/api/playgroundApi/thread';
import { Role } from '@/api/Role';
import { NavigationHeading } from '@/components/OlmoAppBar/NavigationHeading';
import { ThreadLink } from '@/components/ThreadLink';

const getThreadContent = (thread: Thread) => {
    const userMessage = thread.messages.find((message) => {
        return message.role === Role.User;
    });
    return userMessage?.content || 'message...'; // this _shouldnt_ happen
};

interface HistoryDrawerSectionProps {
    heading: string;
    threads: Thread[];
    hasDivider?: boolean;
}

export const HistoryDivider = styled(Divider)(({ theme }) => ({
    borderColor: theme.palette.text.primary,
    opacity: 0.5,
    marginInline: theme.spacing(2),
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
                {threads.map((thread) => {
                    const created = thread.messages.at(0)?.created;
                    const createdDate = created ? new Date(created) : new Date(); // shouldnt happen
                    return (
                        <ThreadLink
                            content={getThreadContent(thread)}
                            created={createdDate}
                            id={thread.id}
                            key={thread.id}
                        />
                    );
                })}
            </List>
            {hasDivider && <HistoryDivider />}
        </>
    );
};
