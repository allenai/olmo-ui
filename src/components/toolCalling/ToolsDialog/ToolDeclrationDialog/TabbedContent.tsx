import { css } from '@allenai/varnish-panda-runtime/css';
import { Button, ModalActions, Tab, TabPanel, Tabs } from '@allenai/varnish-ui';
import { type ReactElement } from 'react';
import { type Key } from 'react-aria-components';
import { Control, UseFormSetValue } from 'react-hook-form';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { ControlledTextArea } from '@/components/form/TextArea/ControlledTextArea';

import { ControlledToolToggleTable } from './ControlledToolToggleTable';
import { EXAMPLE_DECLARATIONS } from './exampleDeclarations';
import { DataFields } from './ToolDeclarationDialog';
import { validateToolDefinitions } from './toolDeclarationUtils';

type Items = {
    id: string;
    header: (props?: React.ComponentProps<typeof Tab>) => ReactElement;
    content: (props?: React.ComponentProps<typeof TabPanel>) => ReactElement;
    isDisabled?: boolean;
};

type TabbedContentProps = {
    tabSelected: Key;
    setTabSelect: (t: Key) => void;
    isDisabled?: boolean;
    control: Control<DataFields>;
    tools: Model['available_tools'];
    setValue: UseFormSetValue<DataFields>;
};

const labelStyle = css({
    marginBottom: '2',
});

const exampleButtons = css({
    display: 'flex',
    justifyContent: 'flex-start',
    paddingInline: '0',
    marginBottom: '4',
});

const modalInput = css({
    flex: '1',
    '& textarea': {
        fontFamily: 'monospace',
        fontSize: 'md',
        textWrap: 'nowrap',
    },
    '& > div:first-of-type': {
        // hack to select div inside of varnish text area
        height: '[100%]',
    },
});

const fullHeight = css({ height: '[100%]' });

const tabHeight = css({
    height: '[100%]',
});

const tabPanelClassName = css({
    overflowY: 'auto',
    paddingInline: '4',
});

const tabContentContainer = css({
    display: 'flex',
    flexDirection: 'column',
    height: '[100%]',
});

export const TabbedContent = ({
    control,
    isDisabled,
    tools,
    setValue,
    setTabSelect,
    tabSelected,
}: TabbedContentProps) => {
    const systemToolsTabItem: Items = {
        id: 'system-functions',
        header: (props) => <Tab {...props}>System tools</Tab>,
        content: (props) => (
            <TabPanel {...props} className={tabPanelClassName}>
                <div className={tabContentContainer}>
                    <p className={labelStyle}>Tools below will be added to the conversation.</p>
                    <ControlledToolToggleTable
                        isDisabled={isDisabled}
                        control={{ control }}
                        tools={tools}
                    />
                </div>
            </TabPanel>
        ),
    };

    const items: Items[] = [
        ...(tools && tools.length > 0 ? [systemToolsTabItem] : []),
        {
            id: 'user-functions',
            header: (props) => <Tab {...props}>User defined tools</Tab>,
            content: (props) => (
                <TabPanel {...props} className={tabPanelClassName}>
                    <div className={tabContentContainer}>
                        <p className={labelStyle}>
                            Enter a JSON array of tool declarations the model can call. Each tool
                            should include a name, description, and JSON Schema parameters. Start
                            with an example below or see the API docs for more.
                        </p>
                        <ControlledTextArea
                            className={modalInput}
                            textAreaClassName={fullHeight}
                            growContainerClassName={fullHeight}
                            name="declaration"
                            isDisabled={isDisabled}
                            controllerProps={{
                                control,
                                rules: {
                                    validate: validateToolDefinitions,
                                },
                            }}
                        />

                        {!isDisabled && (
                            <ModalActions className={exampleButtons} fullWidth>
                                <Button
                                    size="small"
                                    color="secondary"
                                    onClick={() => {
                                        setValue(
                                            'declaration',
                                            EXAMPLE_DECLARATIONS.getWeather.trim()
                                        );
                                    }}>
                                    getWeather
                                </Button>
                                <Button
                                    size="small"
                                    color="secondary"
                                    onClick={() => {
                                        setValue(
                                            'declaration',
                                            EXAMPLE_DECLARATIONS.getStockIndex.trim()
                                        );
                                    }}>
                                    getStockIndex
                                </Button>
                            </ModalActions>
                        )}
                    </div>
                </TabPanel>
            ),
        },
    ] as const;

    return (
        <Tabs
            className={tabHeight}
            tabListClassName={css({
                borderBottom: '1px solid',
                borderBottomColor: 'links/50',
                marginBottom: '2',
                marginInline: '4',
            })}
            onSelectionChange={setTabSelect}
            selectedKey={tabSelected}
            items={items}
        />
    );
};
