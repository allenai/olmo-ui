import { Link, Typography } from '@mui/material';
import { ReactNode } from 'react';

export const deduceUsageFromSource = (source: string): string => {
    switch (source) {
        case 'dclm-hero-run-fasttext_for_HF':
        case 'dclm':
        case 'arxiv':
        case 'algebraic-stack':
        case 'open-web-math':
        case 'pes2o':
        case 'starcoder':
        case 'wiki':
            return 'Pre-training';
        case 'dolmino':
            return 'Mid-training';
        case 'tulu-3-sft-olmo-2-mixture':
            return 'Post-training (SFT)';
        case 'olmo-2-1124-13b-preference-mix':
            return 'Post-training (DPO)';
        case 'RLVR-GSM-MATH-IF-Mixed-Constraints':
            return 'Post-training (RLVR)';
        default:
            return '';
    }
};

export const prettifySource = (source: string): ReactNode => {
    let displayName = '';
    let url = '';
    let secondaryName = '';
    switch (source) {
        case 'dclm-hero-run-fasttext_for_HF':
        case 'dclm':
            displayName = 'olmo-mix-1124';
            url = 'https://huggingface.co/datasets/allenai/olmo-mix-1124';
            secondaryName = 'web corpus (DCLM)';
            break;
        case 'arxiv':
        case 'algebraic-stack':
        case 'open-web-math':
        case 'pes2o':
        case 'starcoder':
        case 'wiki':
            displayName = 'olmo-mix-1124';
            url = 'https://huggingface.co/datasets/allenai/olmo-mix-1124';
            secondaryName = source;
            break;
        case 'dolmino':
            displayName = 'dolmino-mix-1124';
            url = 'https://huggingface.co/datasets/allenai/dolmino-mix-1124';
            break;
        case 'tulu-3-sft-olmo-2-mixture':
            displayName = 'tulu-3-sft-olmo-2-mixture';
            url = 'https://huggingface.co/datasets/allenai/tulu-3-sft-olmo-2-mixture';
            break;
        case 'olmo-2-1124-13b-preference-mix':
            displayName = 'olmo-2-1124-13b-preference-mix';
            url = 'https://huggingface.co/datasets/allenai/olmo-2-1124-13b-preference-mix';
            break;
        case 'RLVR-GSM-MATH-IF-Mixed-Constraints':
            displayName = 'RLVR-GSM-MATH-IF-Mixed-Constraints';
            url = 'https://huggingface.co/datasets/allenai/RLVR-GSM-MATH-IF-Mixed-Constraints';
            break;
        default:
            return <></>;
    }

    return (
        <>
            <Link href={url} target="_blank" fontWeight={600} color="primary" underline="always">
                {displayName}
            </Link>
            {secondaryName !== '' && (
                <Typography
                    variant="body2"
                    component="span"
                    sx={{ color: (theme) => theme.palette.text.secondary }}>
                    {' > '}
                    {secondaryName}
                </Typography>
            )}
        </>
    );
};
