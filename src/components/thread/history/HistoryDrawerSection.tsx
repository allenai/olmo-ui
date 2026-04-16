import { Divider, List, styled } from '@mui/material';

import { NavigationHeading } from '@/components/OlmoAppBar/NavigationHeading';
import { ThreadLink, ThreadLinkProps } from '@/components/ThreadLink';

interface HistoryDrawerSectionProps {
    heading: string;
    history: ThreadLinkProps[];
    hasDivider?: boolean;
}

export const HistoryDrawerSection = ({
    heading,
    history,
    hasDivider = false,
}: HistoryDrawerSectionProps) => {
    if (history.length === 0) {
        return <></>;
    }

    return (
        <>
            <List>
                <NavigationHeading color="secondary.light">
                    {heading}
                </NavigationHeading>
                {history.map((item) => {
                    return <ThreadLink key={item.threadId} {...item} />;
                })}
            </List>
            {hasDivider && <HistoryDivider />}
        </>
    );
};

export const HistoryDivider = styled(Divider)(({ theme }) => ({
    borderColor: theme.vars?.palette.text.primary,
    opacity: 0.5,
    marginInline: theme.spacing(2),
}));
