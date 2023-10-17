// see: https://github.com/facebook/lexical/blob/4b4db176bc9a373a33f81f11c0e63dee74a25a20/packages/lexical-playground/src/plugins/MentionsPlugin/index.tsx

// todo: x

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

import { $createDataChipNode } from './DataChipNode';
import { DataChip } from '../../api/DataChip';

const PUNCTUATION = '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
const NAME = '\\b[A-Z][^\\s' + PUNCTUATION + ']';

const DocumentMentionsRegex = {
    NAME,
    PUNCTUATION,
};

const PUNC = DocumentMentionsRegex.PUNCTUATION;

const TRIGGERS = ['@'].join('');

// Chars we expect to see in a mention (non-space, non-punctuation).
const VALID_CHARS = '[^' + TRIGGERS + PUNC + '\\s]';

// Non-standard series of chars. Each series must be preceded and followed by
// a valid char.
const VALID_JOINS =
    '(?:' +
    '\\.[ |$]|' + // E.g. "r. " in "Mr. Smith"
    ' |' + // E.g. " " in "Josh Duck"
    '[' +
    PUNC +
    ']|' + // E.g. "-' in "Salier-Hellendag"
    ')';

const LENGTH_LIMIT = 75;

const AtSignMentionsRegex = new RegExp(
    '(^|\\s|\\()(' +
        '[' +
        TRIGGERS +
        ']' +
        '((?:' +
        VALID_CHARS +
        VALID_JOINS +
        '){0,' +
        LENGTH_LIMIT +
        '})' +
        ')$'
);

// 50 is the longest alias length limit.
const ALIAS_LENGTH_LIMIT = 50;

// Regex used to match alias.
const AtSignMentionsRegexAliasRegex = new RegExp(
    '(^|\\s|\\()(' +
        '[' +
        TRIGGERS +
        ']' +
        '((?:' +
        VALID_CHARS +
        '){0,' +
        ALIAS_LENGTH_LIMIT +
        '})' +
        ')$'
);

// At most, 5 suggestions are shown in the popup.
const SUGGESTION_LIST_LENGTH_LIMIT = 5;

const mentionsCache = new Map();

const dummyLookupService = {
    search(chips: DataChip[], string: string, callback: (results: Array<DataChip>) => void): void {
        setTimeout(() => {
            const results = chips.filter((mention) =>
                mention.name.toLowerCase().includes(string.toLowerCase())
            );
            callback(results);
        }, 500);
    },
};

function useMentionLookupService(chips: DataChip[], mentionString: string | null) {
    const [results, setResults] = useState<Array<DataChip>>([]);

    useEffect(() => {
        const cachedResults = mentionsCache.get(mentionString);

        if (mentionString == null) {
            setResults([]);
            return;
        }

        if (cachedResults === null) {
            return;
        } else if (cachedResults !== undefined) {
            setResults(cachedResults);
            return;
        }

        mentionsCache.set(mentionString, null);
        dummyLookupService.search(chips, mentionString, (newResults) => {
            mentionsCache.set(mentionString, newResults);
            setResults(newResults);
        });
    }, [mentionString]);

    return results;
}

function checkForAtSignMentions(text: string, minMatchLength: number): MenuTextMatch | null {
    let match = AtSignMentionsRegex.exec(text);

    if (match === null) {
        match = AtSignMentionsRegexAliasRegex.exec(text);
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
}

function getPossibleQueryMatch(text: string): MenuTextMatch | null {
    return checkForAtSignMentions(text, 1);
}

class MentionTypeaheadOption extends MenuOption {
    chip: DataChip;

    constructor(chip: DataChip) {
        super(chip.name);
        this.chip = chip;
    }
}

function MentionsTypeaheadMenuItem({
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
    option: MentionTypeaheadOption;
}) {
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
            aria-hidden="true"
            aria-selected={isSelected}
            id={'typeahead-item-' + index}
            onMouseEnter={onMouseEnter}
            onClick={onClick}
            onKeyDown={onClick}>
            <span className="text">{option.chip.name}</span>
        </MenuItem>
    );
}

export default function DataChipsPlugin({ chips }: { chips: DataChip[] }): JSX.Element | null {
    const [editor] = useLexicalComposerContext();

    const [queryString, setQueryString] = useState<string | null>(null);

    const results = useMentionLookupService(chips, queryString);

    const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
        minLength: 0,
    });

    const options = useMemo(
        () =>
            results
                .map((result) => new MentionTypeaheadOption(result))
                .slice(0, SUGGESTION_LIST_LENGTH_LIMIT),
        [results]
    );

    const onSelectOption = useCallback(
        (
            selectedOption: MentionTypeaheadOption,
            nodeToReplace: TextNode | null,
            closeMenu: () => void
        ) => {
            editor.update(() => {
                const dataChipNode = $createDataChipNode(selectedOption.chip);
                if (nodeToReplace) {
                    nodeToReplace.replace(dataChipNode);
                }

                closeMenu();
            });
        },
        [editor]
    );

    const checkForMentionMatch = useCallback(
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
        <LexicalTypeaheadMenuPlugin<MentionTypeaheadOption>
            onQueryChange={setQueryString}
            onSelectOption={onSelectOption}
            triggerFn={checkForMentionMatch}
            options={options}
            menuRenderFn={(
                anchorElementRef,
                { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
            ) =>
                anchorElementRef.current && results.length
                    ? ReactDOM.createPortal(
                          <Container>
                              <div
                                  style={{ zIndex: 999 }}
                                  className="typeahead-popover mentions-menu">
                                  <ul>
                                      {options.map((option, i: number) => (
                                          <MentionsTypeaheadMenuItem
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
                                  </ul>
                              </div>
                          </Container>,
                          anchorElementRef.current
                      )
                    : null
            }
        />
    );
}

const Container = styled.div`
    .typeahead-popover {
        background: #fff;
        box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        margin-top: 25px;
    }

    .typeahead-popover ul {
        padding: 0;
        list-style: none;
        margin: 0;
        border-radius: 8px;
        max-height: 200px;
        overflow-y: scroll;
    }

    .typeahead-popover ul::-webkit-scrollbar {
        display: none;
    }

    .typeahead-popover ul {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .typeahead-popover ul li {
        margin: 0;
        min-width: 180px;
        font-size: 14px;
        outline: none;
        cursor: pointer;
        border-radius: 8px;
    }

    .typeahead-popover ul li.selected {
        background: #eee;
    }

    .typeahead-popover li {
        margin: 0 8px 0 8px;
        padding: 8px;
        color: #050505;
        cursor: pointer;
        line-height: 16px;
        font-size: 15px;
        display: flex;
        align-content: center;
        flex-direction: row;
        flex-shrink: 0;
        background-color: #fff;
        border-radius: 8px;
        border: 0;
    }

    .typeahead-popover li.active {
        display: flex;
        width: 20px;
        height: 20px;
        background-size: contain;
    }

    .typeahead-popover li:first-child {
        border-radius: 8px 8px 0px 0px;
    }

    .typeahead-popover li:last-child {
        border-radius: 0px 0px 8px 8px;
    }

    .typeahead-popover li:hover {
        background-color: #eee;
    }

    .typeahead-popover li .text {
        display: flex;
        line-height: 20px;
        flex-grow: 1;
        min-width: 150px;
    }

    .typeahead-popover li .icon {
        display: flex;
        width: 20px;
        height: 20px;
        user-select: none;
        margin-right: 8px;
        line-height: 16px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

    .mentions-menu {
        width: 250px;
    }
`;
