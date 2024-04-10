import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

import { useState } from 'react';

import { ResponsiveButton } from './ResponsiveButton';
import { useAppContext } from '@/AppContext';
import { links } from '@/Links';

export const ShareThreadButton = () => {
    const selectedThreadInfo = useAppContext((state) => state.selectedThreadInfo);
    const [urlCopied, setUrlCopied] = useState('');

    const handleShareThread = () => {
        if (selectedThreadInfo.data) {
            navigator.clipboard.writeText(
                location.origin + links.thread(selectedThreadInfo.data.id)
            );
            setUrlCopied(location.origin + links.thread(selectedThreadInfo.data.id));
        }
    };

    return (
        <ResponsiveButton
            variant={urlCopied.length > 0 ? 'contained' : 'outlined'}
            startIcon={<ShareOutlinedIcon />}
            title="Share"
            onClick={handleShareThread}
        />
    );
};
