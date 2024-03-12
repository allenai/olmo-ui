import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    tableCellClasses,
    Container,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { ReactNode } from 'react';
import styled from 'styled-components';

interface Data {
    dataset: ReactNode | string;
    examples: string;
    tokens: string;
    sources: string;
    license: string;
    PIIFilter: ReactNode | string;
    toxicityFilter: ReactNode | string;
    language: string;
    qualityFilter: ReactNode | string;
    dedup: ReactNode | string;
    decontam: ReactNode | string;
}

const tableRows: Data[] = [
    {
        dataset: 'OSCAR (July 2019)',
        examples: 'BLOOM (via ROOTS)',
        tokens: '1.08B',
        sources: 'Common Crawl',
        license: 'Varies by data subset *',
        PIIFilter: '-',
        toxicityFilter: '-',
        language: 'Multilingual (152 langs)',
        qualityFilter: '-',
        dedup: <CheckIcon />,
        decontam: '-',
    },
    {
        dataset: 'C4 (Oct 2019)',
        examples: 'T5, FLAN-T5',
        tokens: '156B',
        sources: 'Common Crawl',
        license: 'ODC-BY',
        PIIFilter: '-',
        toxicityFilter: <CheckIcon />,
        language: 'English',
        qualityFilter: <CheckIcon />,
        dedup: '-',
        decontam: '-',
    },
    {
        dataset: 'The Pile (Dec 2020)',
        examples: 'GPT-J, GPT-Neo, Pythia',
        tokens: '300B',
        sources: '22 datasets e.g. Common Crawl, scientific text, books, code, Wikipedia, news',
        license: 'Varies by data subset',
        PIIFilter: '-',
        toxicityFilter: '-',
        language: 'English',
        qualityFilter: <CheckIcon />,
        dedup: <CheckIcon />,
        decontam: (
            <>
                <CheckIcon />
                <small>***</small>
            </>
        ),
    },
    {
        dataset: 'ROOTS (March 2023)',
        examples: 'BLOOM',
        tokens: '341B',
        sources: '517 datasets e.g. Github, news, books, scientific text, Wikipedia',
        license: 'Varies by data subset',
        PIIFilter: <CheckIcon />,
        toxicityFilter: <CheckIcon />,
        language: 'Multilingual (59 langs)',
        qualityFilter: <CheckIcon />,
        dedup: <CheckIcon />,
        decontam: '-',
    },
    {
        dataset: 'RedPajama (April 2023)',
        examples: 'LLaMa reproduction',
        tokens: '1.2T',
        sources: 'Common Crawl, C4, Github, Arxiv, Books, Wikipedia, StackExchange',
        license: 'Varies by data subset',
        PIIFilter: '-',
        toxicityFilter: '-',
        language: 'English',
        qualityFilter: <CheckIcon />,
        dedup: <CheckIcon />,
        decontam: '-',
    },
    {
        dataset: 'RefinedWeb (June 2023)',
        examples: 'Falcon',
        tokens: '600B ****',
        sources: 'Common Crawl',
        license: 'ODC-By 1.0',
        PIIFilter: '-',
        toxicityFilter: <CheckIcon />,
        language: 'English',
        qualityFilter: <CheckIcon />,
        dedup: <CheckIcon />,
        decontam: '-',
    },
    {
        dataset: (
            <>
                <strong>Dolma</strong> (Ours)
            </>
        ),
        examples: 'OLMo (Ongoing)',
        tokens: '3.08T',
        sources: 'Common Crawl, C4, peS2o, Gutenberg, Github, Wikipedia + Wikibooks',
        license: 'Impact MR',
        PIIFilter: <CheckIcon />,
        toxicityFilter: <CheckIcon />,
        language: 'English',
        qualityFilter: <CheckIcon />,
        dedup: <CheckIcon />,
        decontam: <CheckIcon />,
    },
];

export const ComparisonTable = () => {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center">
                            <b>Dataset</b>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                            <b>Example Models</b>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                            <b>Tokens**</b>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                            <b>Sources</b>
                        </StyledTableCell>
                        <StyledTableCell>
                            <b>License</b>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                            <b>PII Filter</b>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                            <b>Toxicity Filter</b>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                            <b>Language</b>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                            <b>Quality Filtering</b>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                            <b>Dedup</b>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                            <b>Decontam</b>
                        </StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableRows.map((row, idx) => (
                        <StyledTableRow key={idx}>
                            <TableCell align="center">{row.dataset}</TableCell>
                            <TableCell align="center">{row.examples}</TableCell>
                            <TableCell align="center">{row.tokens}</TableCell>
                            <TableCell align="center">{row.sources}</TableCell>
                            <TableCell align="center">{row.license}</TableCell>
                            <TableCell align="center">{row.PIIFilter}</TableCell>
                            <TableCell align="center">{row.toxicityFilter}</TableCell>
                            <TableCell align="center">{row.language}</TableCell>
                            <TableCell align="center">{row.qualityFilter}</TableCell>
                            <TableCell align="center">{row.dedup}</TableCell>
                            <TableCell align="center">{row.decontam}</TableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export const ComparisonFootnote = () => {
    return (
        <FootNoteContainer>
            <p>
                *No license is applied to texts in the OSCAR dataset, leaving any determination to
                its users. The packaging of OSCAR is licensed under CC0.
            </p>
            <p>
                **Token counts are based on the tokenizer reported in the linked paper, not
                calculated ourselves.
            </p>
            <p>***In The Pile paper’s evaluation experiments, but not in the released dataset.</p>
            <p>
                ****Released. They also report a version of RefinedWeb with 5T tokens, but this has
                not been released.
            </p>
        </FootNoteContainer>
    );
};

const FootNoteContainer = styled(Container)`
    padding: ${({ theme }) => theme.spacing(4)};
    max-width: 1200px;
    text-align: center;
    p {
        margin: 0;
    }
`;

const StyledTableCell = styled(TableCell)`
    &.${tableCellClasses.head} {
        background-color: ${({ theme }) => theme.palette.common.black};
        color: ${({ theme }) => theme.palette.common.white};
    }
    &.${tableCellClasses.body} {
        font-size: 14;
    }
`;

const StyledTableRow = styled(TableRow)`
    &:nth-of-type(odd) {
        background-color: ${({ theme }) => theme.palette.action.hover};
    }

    &:last-child td, &:last-child th: {
        border: 0;
    }
`;
