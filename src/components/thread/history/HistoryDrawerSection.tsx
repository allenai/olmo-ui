import { Divider, List, styled, useTheme } from '@mui/material';

import { NavigationHeading } from '@/components/OlmoAppBar/NavigationHeading';
import { ThreadLink } from '@/components/ThreadLink';

import { HistoryItem } from './HistoryDrawer';

interface HistoryDrawerSectionProps {
    heading: string;
    history: HistoryItem[];
    hasDivider?: boolean;
}

export const HistoryDrawerSection = ({
    heading,
    history,
    hasDivider = false,
}: HistoryDrawerSectionProps) => {
    const theme = useTheme();

    if (history.length === 0) {
        return <></>;
    }

    return (
        <>
            <List>
                <NavigationHeading color={theme.palette.secondary.light}>
                    {heading}
                </NavigationHeading>
                {history.map((item) => {
                    return (
                        <ThreadLink
                            key={item.id}
                            content={item.content ?? 'message...'}
                            creator={item.creator}
                            createdDate={item.createdDate}
                            threadId={item.id}
                            handleDelete={item.handleDelete}
                        />
                    );
                })}
            </List>
            {hasDivider && <HistoryDivider />}
        </>
    );
};

export const HistoryDivider = styled(Divider)(({ theme }) => ({
    borderColor: theme.palette.text.primary,
    opacity: 0.5,
    marginInline: theme.spacing(2),
}));
