// see: https://github.com/facebook/lexical/blob/4b4db176bc9a373a33f81f11c0e63dee74a25a20/packages/lexical-playground/src/plugins/DataChipsPlugin/index.tsx

import styled from 'styled-components';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    LexicalTypeaheadMenuPlugin,
    MenuOption,
    MenuTextMatch,
    useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { TextNode } from 'lexical';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MenuItem } from '@mui/material';

import { createDataChipNode } from '../nodes/DataChipNode';
import { DataChip } from '../../../api/DataChip';

// this code is a plugin for lexical that allows users to type  `@` and get a dropdown of datachips to select from.
// this code was largely copied from the link above.

const Punctuation = '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
const Name = '\\b[A-Z][^\\s' + Punctuation + ']';

const DocumentDataChipsRegex = {
    Name,
    Punctuation,
};

const Punc = DocumentDataChipsRegex.Punctuation;

const Triggers = ['@'].join('');

// Chars we expect to see in a dataChip (non-space, non-punctuation).
const ValidChars = '[^' + Triggers + Punc + '\\s]';

// Non-standard series of chars. Each series must be preceded and followed by
// a valid char.
const ValidJoins =
    '(?:' +
    '\\.[ |$]|' + // E.g. "r. " in "Mr. Smith"
    ' |' + // E.g. " " in "Josh Duck"
    '[' +
    Punc +
    ']|' + // E.g. "-' in "Salier-Hellendag"
    ')';

const LengthLimit = 75;

const AtSignDataChipsRegex = new RegExp(
    '(^|\\s|\\()(' +
        '[' +
        Triggers +
        ']' +
        '((?:' +
        ValidChars +
        ValidJoins +
        '){0,' +
        LengthLimit +
        '})' +
        ')$'
);

// 50 is the longest alias length limit.
const AliasLenthLimit = 50;

// Regex used to match alias.
const AtSignDataChipsRegexAliasRegex = new RegExp(
    '(^|\\s|\\()(' +
        '[' +
        Triggers +
        ']' +
        '((?:' +
        ValidChars +
        '){0,' +
        AliasLenthLimit +
        '})' +
        ')$'
);

// At most, 9 suggestions are shown in the popup.
const SuggestionListLengthLimit = 9;

const dataChipsCache = new Map();

const lookupService = {
    search(chips: DataChip[], string: string, callback: (results: Array<DataChip>) => void): void {
        const results = chips.filter((dataChip) =>
            dataChip.name.toLowerCase().includes(string.toLowerCase())
        );
        callback(results);
    },
};

const useDataChipLookupService = (chips: DataChip[], dataChipString: string | null) => {
    const [results, setResults] = useState<Array<DataChip>>([]);

    useEffect(() => {
        const cachedResults = dataChipsCache.get(dataChipString);

        if (dataChipString == null) {
            setResults([]);
            return;
        }

        if (cachedResults === null) {
            return;
        } else if (cachedResults !== undefined) {
            setResults(cachedResults);
            return;
        }

        dataChipsCache.set(dataChipString, null);
        lookupService.search(chips, dataChipString, (newResults) => {
            dataChipsCache.set(dataChipString, newResults);
            setResults(newResults);
        });
    }, [dataChipString]);

    return results;
};

const checkForAtSignDataChips = (text: string, minMatchLength: number): MenuTextMatch | null => {
    let match = AtSignDataChipsRegex.exec(text);

    if (match === null) {
        match = AtSignDataChipsRegexAliasRegex.exec(text);
    }
    if (match !== null) {
        // The strategy ignores leading whitespace but we need to know it's
        // length to add it to the leadOffset
        const maybeLeadingWhitespace = match[1];

        const matchingString = match[3];
        if (matchingString.length >= minMatchLength) {
            return {
                leadOffset: match.index + maybeLeadingWhitespace.length,
                matchingString,
                replaceableString: match[2],
            };
        }
    }
    return null;
};

const getPossibleQueryMatch = (text: string): MenuTextMatch | null => {
    return checkForAtSignDataChips(text, 1);
};

class DataChipTypeaheadOption extends MenuOption {
    chip: DataChip;

    constructor(chip: DataChip) {
        super(chip.name);
        this.chip = chip;
    }
}

const DataChipsTypeaheadMenuItem = ({
    index,
    isSelected,
    onClick,
    onMouseEnter,
    option,
}: {
    index: number;
    isSelected: boolean;
    onClick: () => void;
    onMouseEnter: () => void;
    option: DataChipTypeaheadOption;
}) => {
    let className = 'item';
    if (isSelected) {
        className += ' selected';
    }
    return (
        <MenuItem
            key={option.chip.id}
            tabIndex={-1}
            className={className}
            ref={option.setRefElement}
            role="option"
            aria-selected={isSelected}
            id={'typeahead-item-' + index}
            onMouseEnter={onMouseEnter}
            onClick={onClick}
            onKeyDown={onClick}>
            <span className="text">{option.chip.name}</span>
        </MenuItem>
    );
};

export const DataChipsPlugin = ({ chips }: { chips: DataChip[] }): JSX.Element | null => {
    const [editor] = useLexicalComposerContext();

    const [queryString, setQueryString] = useState<string | null>(null);

    const results = useDataChipLookupService(chips, queryString);

    const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
        minLength: 0,
    });

    const options = useMemo(
        () =>
            results
                .map((result) => new DataChipTypeaheadOption(result))
                .slice(0, SuggestionListLengthLimit),
        [results]
    );

    const onSelectOption = useCallback(
        (
            selectedOption: DataChipTypeaheadOption,
            nodeToReplace: TextNode | null,
            closeMenu: () => void
        ) => {
            editor.update(() => {
                const dataChipNode = createDataChipNode(selectedOption.chip);
                if (nodeToReplace) {
                    nodeToReplace.replace(dataChipNode);
                }

                closeMenu();
            });
        },
        [editor]
    );

    const checkForDataChipMatch = useCallback(
        (text: string) => {
            const slashMatch = checkForSlashTriggerMatch(text, editor);
            if (slashMatch !== null) {
                return null;
            }
            return getPossibleQueryMatch(text);
        },
        [checkForSlashTriggerMatch, editor]
    );

    return (
        <LexicalTypeaheadMenuPlugin<DataChipTypeaheadOption>
            onQueryChange={setQueryString}
            onSelectOption={onSelectOption}
            triggerFn={checkForDataChipMatch}
            options={options}
            menuRenderFn={(
                anchorElementRef,
                { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
            ) =>
                anchorElementRef.current && results.length
                    ? ReactDOM.createPortal(
                          <MenuContainer>
                              <MenuList>
                                  {options.map((option, i: number) => (
                                      <DataChipsTypeaheadMenuItem
                                          index={i}
                                          isSelected={selectedIndex === i}
                                          onClick={() => {
                                              setHighlightedIndex(i);
                                              selectOptionAndCleanUp(option);
                                          }}
                                          onMouseEnter={() => {
                                              setHighlightedIndex(i);
                                          }}
                                          key={option.chip.id}
                                          option={option}
                                      />
                                  ))}
                              </MenuList>
                          </MenuContainer>,
                          anchorElementRef.current
                      )
                    : null
            }
        />
    );
};

const MenuContainer = styled.div`
    background: ${({ theme }) => theme.color2.N1};
    // matching mui
    box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 5px -3px, rgba(0, 0, 0, 0.14) 0px 8px 10px 1px,
        rgba(0, 0, 0, 0.12) 0px 3px 14px 2px;
    margin-top: ${({ theme }) => theme.spacing(3)};
    width: 250px;
`;

const MenuList = styled.ul`
    margin: 0;
    padding: ${({ theme }) => theme.spacing(1)} 0;
    list-style: none;
    max-height: 250px;
    overflow-y: scroll;
    scrollbar-width: none;

    ::-webkit-scrollbar {
        display: none;
    }

    li {
        margin: 0;
        min-width: 180px;
        cursor: pointer;
    }

    li.selected {
        // matching mui
        background: rgb(239, 240, 241);
    }
`;
