import { css } from '@allenai/varnish-panda-runtime/css';
import {
    SliderBase,
    type SliderProps,
    SliderThumb,
    SliderTrack,
    SliderTrackIndicator,
} from '@allenai/varnish-ui';
import { VolumeUpRounded } from '@mui/icons-material';
import { memo, useCallback } from 'react';
import {
    DialogTrigger,
    Popover,
    type SliderTrackRenderProps as AriaSliderTrackRenderProps,
} from 'react-aria-components';

import { useControls } from './context/ControlsContext';
import { useVolume } from './context/useVolume';
import { ControlButton } from './ControlButton';

const volumePopover = css({
    backgroundColor: {
        base: 'white',
        _dark: 'elements.default.contrast',
    },
    height: '[100px]',
    paddingBlock: '4',
    paddingInline: '1',
    borderRadius: 'sm',
    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.20)',
});

export const VolumeControl = memo(function VolumeControl() {
    const { isDisabled } = useControls();
    const { volume, isMuted, setVolume, unMute } = useVolume();

    const handleChange = useCallback(
        (value: number) => {
            const newVolume = Number(value) / 100;
            if (newVolume > 0 && isMuted) {
                unMute();
            }
            setVolume(newVolume);
        },
        [isMuted, setVolume, unMute]
    );

    return (
        <DialogTrigger>
            <ControlButton isDisabled={isDisabled}>
                <VolumeUpRounded />
            </ControlButton>
            <Popover offset={2} className={volumePopover} placement="top">
                <Slider
                    outputClassName={css({ display: 'none' })}
                    orientation="vertical"
                    value={volume * 100}
                    onChange={handleChange}
                    aria-label="Volume control"
                />
            </Popover>
        </DialogTrigger>
    );
});

// wanted access to the thumb for a11y focus (otherwise the container gets focus instead)
// this is essentially stolen from varnish-ui
const Slider = <T extends number | number[]>({
    color = 'default',
    size = 'medium',
    orientation,
    ...props
}: SliderProps<T>) => (
    <SliderBase color={color} size={size} orientation={orientation} {...props}>
        <SliderTrack color={color} size={size} orientation={orientation}>
            {({ orientation, state }: AriaSliderTrackRenderProps) => (
                <>
                    <SliderTrackIndicator
                        color={color}
                        size={size}
                        orientation={orientation}
                        state={state}
                    />
                    {state.values.map((_, i) => {
                        return (
                            <SliderThumb
                                color={color}
                                size={size}
                                // this need orientation for the css variants
                                // eslint-disable-next-line @typescript-eslint/no-deprecated
                                orientation={orientation}
                                // popover gives focus to the whole component, instead of the thumb
                                // eslint-disable-next-line jsx-a11y/no-autofocus
                                autoFocus
                                key={i}
                                index={i}
                            />
                        );
                    })}
                </>
            )}
        </SliderTrack>
    </SliderBase>
);
