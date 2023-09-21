import React from 'react';

import { ItalicButton, BoldButton, UnderlineButton, CodeButton } from '@draft-js-plugins/buttons';
import { ToolbarChildrenProps } from '@draft-js-plugins/inline-toolbar/lib/components/Toolbar';

import { SearchButton } from './SearchButton';

export const ToolBar = (externalProps: ToolbarChildrenProps) => {
    return (
        <>
            <SearchButton {...externalProps} />
            <BoldButton {...externalProps} />
            <ItalicButton {...externalProps} />
            <UnderlineButton {...externalProps} />
            <CodeButton {...externalProps} />
        </>
    );
};
