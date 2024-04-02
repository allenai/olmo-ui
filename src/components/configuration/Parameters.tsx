/**
 * Display to alter the options of a message.
 */

import { useState } from 'react';
import { Stack, Box, Grid, Typography, Chip, TextField } from '@mui/material';

import { InputSlider } from './InputSlider';
import { useAppContext } from '../../AppContext';

export const Parameters = () => {
    const inferenceOpts = useAppContext((state) => state.inferenceOpts);
    const updateInferenceOpts = useAppContext((state) => state.updateInferenceOpts);
    const schema = useAppContext((state) => state.schema);

    if (!schema) {
        throw new Error('schema not loaded');
    }

    const opts = schema.Message.InferenceOpts;
    const [stopWordsInput, setStopWordsInput] = useState('');

    // TODO: The sliders for N and LogProbs have been commented out because they do not work
    // with v3 API endpoints, so we want to block users from using them. We will re-enable these
    // once the endpoints are updated.
    return (
        <Stack spacing={2}>
            <InputSlider
                label="Max New Tokens"
                min={opts.max_tokens.min}
                max={opts.max_tokens.max}
                step={opts.max_tokens.step}
                initialValue={opts.max_tokens.default}
                onChange={(v) => updateInferenceOpts({ max_tokens: v })}
            />
            <InputSlider
                label="Temperature"
                min={opts.temperature.min}
                max={opts.temperature.max}
                step={opts.temperature.step}
                initialValue={opts.temperature.default}
                onChange={(v) => updateInferenceOpts({ temperature: v })}
            />
            {/* <InputSlider
                label="N"
                min={opts.n.min}
                max={opts.n.max}
                step={opts.n.step}
                initialValue={opts.n.default}
                onChange={(v) => updateInferenceOpts({ n: v })}
            /> */}
            <InputSlider
                label="Top P"
                min={opts.top_p.min}
                max={opts.top_p.max}
                step={opts.top_p.step}
                initialValue={opts.top_p.default}
                onChange={(v) => updateInferenceOpts({ top_p: v })}
            />
            {/* <InputSlider
                label="Log Probs"
                min={opts.logprobs.min}
                max={opts.logprobs.max}
                step={opts.logprobs.step}
                initialValue={opts.logprobs.default}
                onChange={(v) => updateInferenceOpts({ logprobs: v })}
            /> */}
            <Box sx={{ width: '100%' }}>
                <Typography>Stop Words</Typography>
                <Typography variant="caption">Hit &quot;Tab&quot; to add a new word.</Typography>
                <Grid container spacing={1} paddingY={1}>
                    {inferenceOpts.stop?.map((word, i) => (
                        <Grid item key={`stop-${i}-${word}`}>
                            <Chip
                                label={word}
                                title={word}
                                onDelete={() => {
                                    const current = inferenceOpts.stop ?? [];
                                    const stop = current.slice(0, i).concat(current.slice(i + 1));
                                    updateInferenceOpts({ stop });
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
                <TextField
                    fullWidth
                    value={stopWordsInput}
                    onChange={(e) => setStopWordsInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key !== 'Tab') {
                            return;
                        }
                        e.preventDefault();
                        if (!stopWordsInput) {
                            return;
                        }
                        const current = inferenceOpts.stop ?? [];
                        const unique = new Set(current);
                        const stop = unique.has(stopWordsInput)
                            ? current
                            : [...current, stopWordsInput];
                        updateInferenceOpts({ stop });
                        setStopWordsInput('');
                    }}
                    size="small"
                />
            </Box>
        </Stack>
    );
};
