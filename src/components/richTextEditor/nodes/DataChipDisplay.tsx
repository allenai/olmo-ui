import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Badge, Box, Tooltip, Chip } from '@mui/material';

import { DataChip } from '../../../api/DataChip';
import { useClient } from '../../../ClientContext';

interface Props {
    chipId: string;
}

// ui element representing a datachip
export const DataChipDisplay = ({ chipId }: Props) => {
    const { dataChipClient } = useClient();
    const [chip, setChip] = useState<DataChip>();
    useEffect(() => {
        dataChipClient.getDataChip(chipId).then((c) => setChip(c));
    }, [chipId]);

    if (!chip) {
        return null;
    }

    return (
        <Tooltip title={<Box sx={{ whiteSpace: 'pre-line' }}>{chip.content}</Box>}>
            <HoverBadge max={999999} color="info" badgeContent={chip.content.length}>
                <Chip sx={{ height: '22px' }} label={chip.name} />
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
