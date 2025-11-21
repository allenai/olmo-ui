import { sva } from '@allenai/varnish-panda-runtime/css';
import { cx } from '@allenai/varnish-ui';
import { FilePresentOutlined, ImageOutlined, VideoFileOutlined } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { type PropsWithChildren, useId } from 'react';

import { CollapseButton } from '@/components/widgets/CollapsibleWidget/CollapseButton';
import {
    CollapsibleWidgetBase,
    type CollapsibleWidgetBaseProps,
} from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetBase';
import { CollapsibleWidgetContent } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetContent';
import { CollapsibleWidgetHeading } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetHeading';
import { CollapsibleWidgetPanel } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetPanel';
import { ExpandArrowContextAware } from '@/components/widgets/CollapsibleWidget/ExpandArrow';
import { pluralize } from '@/utils/pluralize';

type FileTypes = 'file' | 'image' | 'video';
const iconMap = {
    file: <FilePresentOutlined />,
    image: <ImageOutlined />,
    video: <VideoFileOutlined />,
} as const;

const mediaWidgetRecipe = sva({
    slots: [
        'container',
        'heading',
        'trigger',
        'thinkingInProgressIndicator',
        'panel',
        'content',
        'collapse',
    ],
    base: {
        container: {
            '--background-color': '{colors.background}',
            '--spinner-color': '{colors.icon}',
            backgroundColor: 'var(--background-color)',
            boxShadow: 'none',
        },
        heading: {
            alignSelf: 'start',
            backgroundColor: 'transparent',
        },
        trigger: {
            fontWeight: 'medium',
            justifyContent: 'start',
            paddingBlock: '0',
            paddingInline: '0',
        },
        content: {
            marginBlockStart: '4',
            paddingBlock: '0',
            paddingInlineStart: '3',
            borderLeft: '1px solid',
            borderLeftColor: 'elements.default.stroke',
        },
        collapse: {
            fontWeight: 'medium',
            display: 'flex',
            gap: '2',
            marginBlockStart: '2',
            alignSelf: 'start',
            cursor: 'pointer',
        },
    },
});

interface MediaCollapsibleWidgetProps
    extends Omit<CollapsibleWidgetBaseProps, 'children'>,
        PropsWithChildren {
    fileType: FileTypes;
    fileCount: number;
    isPending?: boolean;
}

export const MediaCollapsibleWidget = ({
    className,
    children,
    fileType = 'file',
    fileCount,
    isPending,
    ...rest
}: MediaCollapsibleWidgetProps) => {
    const classNames = mediaWidgetRecipe();

    const id = useId();
    const headingLabelId = `media-widget-heading-label-${id}`;

    const label = `${fileCount} ${pluralize(fileCount, fileType)}`;

    return (
        <CollapsibleWidgetBase
            variant="transparent"
            contrast="off"
            className={cx(classNames.container, className)}
            {...rest}>
            <CollapsibleWidgetHeading
                className={classNames.heading}
                triggerClassName={classNames.trigger}
                startAdornment={iconMap[fileType]}
                // aria-label and aria-labelledby apply to the button and heading respectively
                aria-label={label}
                aria-labelledby={headingLabelId}
                endAdornment={
                    <>
                        {isPending && (
                            <CircularProgress size="1em" sx={{ color: 'var(--spinner-color)' }} />
                        )}
                        <ExpandArrowContextAware />
                    </>
                }>
                <span id={headingLabelId}>{label}</span>
            </CollapsibleWidgetHeading>
            <CollapsibleWidgetPanel className={classNames.panel}>
                <CollapsibleWidgetContent className={classNames.content} contrast="off">
                    {children}
                </CollapsibleWidgetContent>
                <CollapseButton className={classNames.collapse}>
                    Collapse
                    <ExpandArrowContextAware />
                </CollapseButton>
            </CollapsibleWidgetPanel>
        </CollapsibleWidgetBase>
    );
};
