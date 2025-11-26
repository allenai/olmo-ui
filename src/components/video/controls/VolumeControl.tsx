import { css } from '@allenai/varnish-panda-runtime/css';
import {
    SliderBase,
    type SliderProps,
    SliderThumb,
    SliderTrack,
    SliderTrackIndicator,
} from '@allenai/varnish-ui';
import { VolumeUpRounded } from '@mui/icons-material';
import type { PlayerRef } from '@remotion/player';
import { memo, type RefObject, useCallback, useEffect, useState } from 'react';
import {
    DialogTrigger,
    Popover,
    type SliderTrackRenderProps as AriaSliderTrackRenderProps,
} from 'react-aria-components';

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

interface VolumeControlProps {
    playerRef: RefObject<PlayerRef | null>;
}

export const VolumeControl = memo(function VolumeControl({ playerRef }: VolumeControlProps) {
    // default UI to muted and 0 volume
    const [volume, setVolume] = useState(playerRef.current?.getVolume() ?? 0);
    const [_muted, setMuted] = useState(playerRef.current?.isMuted() ?? true);

    useEffect(() => {
        const player = playerRef.current;
        if (!player) {
            return;
        }

        const onVolumeChange = () => {
            setVolume(player.getVolume());
        };

        const onMuteChange = () => {
            setMuted(player.isMuted());
        };

        player.addEventListener('volumechange', onVolumeChange);
        player.addEventListener('mutechange', onMuteChange);

        return () => {
            player.removeEventListener('volumechange', onVolumeChange);
            player.removeEventListener('mutechange', onMuteChange);
        };
    }, [playerRef]);

    const handleChange = useCallback(
        (value: number) => {
            const player = playerRef.current;
            if (!player) {
                return;
            }

            const newVolume = Number(value) / 100;
            if (newVolume > 0 && player.isMuted()) {
                player.unmute();
            }

            player.setVolume(newVolume);
            setVolume(newVolume);
        },
        [playerRef]
    );

    return (
        <DialogTrigger>
            <ControlButton>
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
