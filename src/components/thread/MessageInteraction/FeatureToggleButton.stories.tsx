import { cva } from '@allenai/varnish-panda-runtime/css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { FeatureToggleButton } from './FeatureToggleButton';

const container = cva({
    base: {
        border: '[1px solid {colors.background.reversed}]',
        margin: '2',
        padding: '4',
    },
    variants: {
        size: {
            desktop: { width: '[750px]' },
            mobile: { width: '[400px]' },
        },
    },
});

const meta: Meta<typeof FeatureToggleButton> = {
    title: 'Components/FeatureToggleButton',
    component: FeatureToggleButton,
};

export default meta;

type Story = StoryObj<typeof FeatureToggleButton>;

export const DesktopDefault: Story = {
    render: () => {
        const Demo = () => {
            const [selected, setSelected] = useState(false);
            return (
                <FeatureToggleButton
                    selected={selected}
                    onChange={setSelected}
                    labelOn="Hide Details"
                    labelOff="Show Details"
                    iconOn={<VisibilityOffIcon fontSize="small" />}
                    iconOff={<VisibilityIcon fontSize="small" />}
                    hint="Toggle detail view"
                    onTrack={(next) => {
                        // Keep analytics simple for the storybook demo
                        // eslint-disable-next-line no-console
                        console.log('onTrack', next);
                    }}
                    buttonProps={{ size: 'small' }}
                />
            );
        };
        return <Demo />;
    },
    decorators: [
        (Story) => (
            <div className={container({ size: 'desktop' })}>
                <Story />
            </div>
        ),
    ],
};

export const DesktopForcedHint: Story = {
    render: () => {
        const [selected, setSelected] = useState(true);
        return (
            <FeatureToggleButton
                selected={selected}
                onChange={setSelected}
                labelOn="Hide"
                labelOff="Show"
                iconOn={<VisibilityOffIcon fontSize="small" />}
                iconOff={<VisibilityIcon fontSize="small" />}
                hint="This hint is always visible"
                showHint={true}
                buttonProps={{ variant: 'text' }}
            />
        );
    },
    decorators: [
        (Story) => (
            <div className={container({ size: 'desktop' })}>
                <Story />
            </div>
        ),
    ],
};

export const DesktopIconsOnly: Story = {
    render: () => {
        const [selected, setSelected] = useState(false);
        return (
            <FeatureToggleButton
                selected={selected}
                onChange={setSelected}
                iconOn={<VisibilityOffIcon />}
                iconOff={<VisibilityIcon />}
                hint="Icon-only desktop variant"
                buttonProps={{ size: 'medium' }}
            />
        );
    },
    decorators: [
        (Story) => (
            <div className={container({ size: 'desktop' })}>
                <Story />
            </div>
        ),
    ],
};

export const MobileDefault: Story = {
    parameters: { viewport: { defaultViewport: 'mobile1' } },
    render: () => {
        const [selected, setSelected] = useState(false);
        return (
            <FeatureToggleButton
                selected={selected}
                onChange={setSelected}
                labelOn="Hide Details"
                labelOff="Show Details"
                iconOn={<VisibilityOffIcon />}
                iconOff={<VisibilityIcon />}
                mobileTooltip="Tap to toggle details"
                ariaLabelOn="Hide details"
                ariaLabelOff="Show details"
                iconButtonProps={{ size: 'small' }}
            />
        );
    },
    decorators: [
        (Story) => (
            <div className={container({ size: 'mobile' })}>
                <Story />
            </div>
        ),
    ],
};

export const MobileControlledTooltip: Story = {
    parameters: { viewport: { defaultViewport: 'mobile1' } },
    render: () => {
        const [selected, setSelected] = useState(false);
        const [open, setOpen] = useState(true);
        return (
            <FeatureToggleButton
                selected={selected}
                onChange={setSelected}
                labelOn="On"
                labelOff="Off"
                iconOn={<VisibilityOffIcon />}
                iconOff={<VisibilityIcon />}
                mobileTooltip="Controlled tooltip"
                mobileTooltipOpen={open}
                onMobileTooltipOpenChange={setOpen}
                ariaLabelOn="Turn off visibility"
                ariaLabelOff="Turn on visibility"
            />
        );
    },
    decorators: [
        (Story) => (
            <div className={container({ size: 'mobile' })}>
                <Story />
            </div>
        ),
    ],
};
