import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Button, ButtonProps, IconButton, Stack, styled, Tooltip, Typography } from '@mui/material';
import { useEffect } from 'react';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';
import { useNavigate } from 'react-router-dom';

import { search } from '@/api/dolma/search';
import { useAppContext } from '@/AppContext';
import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';
import { links } from '@/Links';

import { getFAQIdByShortId } from '../faq/faq-utils';

interface SearchBarProps {
    defaultValue?: string;
    disabled?: boolean;
    showTooltip?: boolean;
    title?: React.ReactNode;
    submitButtonProps?: ButtonProps;
}

export const SearchBar = ({
    defaultValue = '',
    disabled,
    showTooltip = true,
    title,
    submitButtonProps,
}: SearchBarProps) => {
    const nav = useNavigate();
    const getMeta = useAppContext((state) => state.getMeta);
    const meta = useAppContext((state) => state.meta);
    const placeholder = meta?.count
        ? `Search ${meta.count.toLocaleString()} pretraining documents…`
        : 'Search pretraining documents…';

    const formContext = useForm<{ queryText: string }>({
        defaultValues: {
            queryText: defaultValue,
        },
    });

    useEffect(() => {
        if (meta === undefined) {
            getMeta().catch((error: unknown) => {
                console.error('getMeta() failed' + String(error));
            });
        }
    }, [getMeta, meta]);

    const submitSearch = (formData: { queryText: string }) => {
        nav(`${links.search}?${search.toQueryString({ query: formData.queryText })}`);
    };

    return (
        <FormContainer formContext={formContext} onSuccess={submitSearch}>
            <Stack gap={1.5} alignItems="flex-start">
                <Typography variant="h3" sx={{ alignSelf: 'center' }}>
                    {title}
                </Typography>
                <SearchTextField
                    name="queryText"
                    inputProps={{
                        'aria-label': 'Search Term',
                        maxLength: 100,
                    }}
                    placeholder={placeholder}
                    fullWidth
                    disabled={disabled}
                    required
                    validation={{ pattern: /[^\s]+/ }}
                />
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%">
                    <Button
                        type="submit"
                        variant="contained"
                        {...submitButtonProps}
                        disabled={disabled}
                        sx={{
                            backgroundColor: (theme) => theme.palette.background.reversed,
                            color: (theme) => theme.palette.secondary.light,
                            ':hover': {
                                backgroundColor: (theme) => theme.color['teal-100'].hex,
                                color: (theme) => theme.palette.secondary.light,
                            },
                            ':focus': {
                                background: (theme) => theme.color['teal-90'].hex,
                                color: (theme) => theme.palette.secondary.light,
                            },
                        }}>
                        Submit
                    </Button>
                    {showTooltip && (
                        <Tooltip
                            title="About Dataset Explorer"
                            sx={{ color: (theme) => theme.palette.text.primary }}>
                            <IconButton
                                aria-label="About Dataset Explorer"
                                size="large"
                                href={links.faqs + getFAQIdByShortId('dataset-explorer-intro')}
                                sx={{
                                    color: (theme) => theme.palette.text.primary,
                                    padding: 1,
                                    right: '-8px',
                                    display: {
                                        xs: 'none',
                                        [DESKTOP_LAYOUT_BREAKPOINT]: 'inline-flex',
                                    },
                                }}>
                                <InfoOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </Stack>
            </Stack>
        </FormContainer>
    );
};

const SearchTextField = styled(TextFieldElement)`
    background-color: ${({ theme }) => theme.palette.background.default};
    border-radius: 4px;
    fieldset {
        border-color: ${({ theme }) => theme.color.N5.hex};
    }
    input::placeholder {
        opacity: 1;
    }
`;
