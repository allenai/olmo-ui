import React from 'react';
import styled from 'styled-components';
import { Badge, Box, Tooltip, Chip } from '@mui/material';
import { SubMentionComponentProps } from '@draft-js-plugins/mention/lib/Mention';

export const ChipDisplay = (props: SubMentionComponentProps) => {
    return (
        <Tooltip title={<Box sx={{ whiteSpace: 'pre-line' }}>{props.mention.content}</Box>}>
            <HoverBadge max={999999} color="info" badgeContent={props.mention.content.length}>
                <Chip sx={{ height: '22px' }} label={props.children} />
            </HoverBadge>
        </Tooltip>
    );
};

const HoverBadge = styled(Badge)`
    &&& {
        vertical-align: unset;
        .MuiBadge-badge {
            visibility: hidden;
        }
        :hover {
            .MuiBadge-badge {
                visibility: unset;
            }
        }
    }
`;
