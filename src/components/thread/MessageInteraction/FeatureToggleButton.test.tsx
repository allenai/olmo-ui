import { fireEvent, render, screen } from '@test-utils';
import { vi } from 'vitest';

import * as layout from '@/components/dolma/shared';

import { FeatureToggleButton } from './FeatureToggleButton';

// Helper to mock desktop vs mobile
const mockIsDesktop = (value: boolean) => {
    vi.spyOn(layout, 'useDesktopOrUp').mockReturnValue(value);
};

describe('FeatureToggleButton (desktop)', () => {
    beforeEach(() => {
        mockIsDesktop(true);
    });

    it('shows labelOn when selected=true', () => {
        const labelOn = 'Hide OLMoTrace';
        render(
            <FeatureToggleButton
                selected
                onChange={() => {}}
                labelOn={labelOn}
                labelOff="Show OLMoTrace"
            />
        );

        expect(screen.getByRole('button', { name: labelOn })).toBeInTheDocument();
    });

    it('shows labelOff when selected=false', () => {
        const labelOff = 'Show OLMoTrace';
        render(
            <FeatureToggleButton
                selected={false}
                onChange={() => {}}
                labelOn="Hide OLMoTrace"
                labelOff={labelOff}
            />
        );

        expect(screen.getByRole('button', { name: labelOff })).toBeInTheDocument();
    });

    it('calls onChange with toggled value and onTrack with same', () => {
        const onChange = vi.fn();
        const onTrack = vi.fn();
        const labelOn = 'Hide';

        render(
            <FeatureToggleButton
                selected
                onChange={onChange}
                onTrack={onTrack}
                labelOn={labelOn}
                labelOff="Show"
            />
        );

        fireEvent.click(screen.getByRole('button', { name: labelOn }));
        expect(onChange).toHaveBeenCalledWith(false);
        expect(onTrack).toHaveBeenCalledWith(false);
    });

    it('renders hint content when showHint=true', () => {
        const hintContent = 'Hint content';
        render(
            <FeatureToggleButton
                selected
                onChange={() => {}}
                labelOn="Hide"
                labelOff="Show"
                hint={hintContent}
                showHint
            />
        );

        expect(screen.getByText(hintContent)).toBeInTheDocument();
    });
});

describe('FeatureToggleButton (mobile)', () => {
    beforeEach(() => {
        mockIsDesktop(false);
    });

    it('uses aria-label from string labelOff when selected=false', () => {
        const labelOff = 'Show OLMoTrace';
        render(
            <FeatureToggleButton
                selected={false}
                onChange={() => {}}
                labelOn="Hide OLMoTrace"
                labelOff={labelOff}
            />
        );

        expect(screen.getByRole('button', { name: labelOff })).toBeInTheDocument();
    });

    it('uses ariaLabelOn/ariaLabelOff when labels are React nodes', () => {
        const ariaLabelOn = 'Hide label';
        render(
            <FeatureToggleButton
                selected={true}
                onChange={() => {}}
                labelOn={(<span>HIDE</span>) as unknown as string}
                labelOff={(<span>SHOW</span>) as unknown as string}
                ariaLabelOn={ariaLabelOn}
                ariaLabelOff="Show label"
            />
        );

        expect(screen.getByRole('button', { name: ariaLabelOn })).toBeInTheDocument();
    });

    it('toggles and calls onChange/onTrack on mobile', () => {
        const onChange = vi.fn();
        const onTrack = vi.fn();
        const labelOff = 'Show';

        render(
            <FeatureToggleButton
                selected={false}
                onChange={onChange}
                onTrack={onTrack}
                labelOn="Hide"
                labelOff={labelOff}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: labelOff }));
        expect(onChange).toHaveBeenCalledWith(true);
        expect(onTrack).toHaveBeenCalledWith(true);
    });

    it('renders mobileTooltip when provided (string)', () => {
        const mobileTooltip = 'Mobile hint';
        render(
            <FeatureToggleButton
                selected={false}
                onChange={() => {}}
                labelOn="Hide"
                labelOff="Show"
                mobileTooltip={mobileTooltip}
                mobileTooltipOpen
            />
        );

        expect(screen.getByText(mobileTooltip)).toBeInTheDocument();
    });

    it('renders mobileTooltip when provided (node)', () => {
        const mobileTipTestId = 'mobile-tip';
        const mobileTipText = 'TipNode';
        render(
            <FeatureToggleButton
                selected={false}
                onChange={() => {}}
                labelOn="Hide"
                labelOff="Show"
                mobileTooltip={<span data-testid={mobileTipTestId}>{mobileTipText}</span>}
                mobileTooltipOpen
            />
        );

        expect(screen.getByTestId(mobileTipTestId)).toBeInTheDocument();
        expect(screen.getByText(mobileTipText)).toBeInTheDocument();
    });
});
