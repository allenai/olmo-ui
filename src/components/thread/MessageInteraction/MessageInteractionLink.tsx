import { css } from '@allenai/varnish-panda-runtime/css';
import { ButtonLink, cx } from '@allenai/varnish-ui';
import { ComponentProps } from 'react';

import { useDesktopOrUp } from '@/components/dolma/shared';
import { StyledTooltip } from '@/components/StyledTooltip';

interface MessageInteractionLinkProps extends ComponentProps<typeof ButtonLink> {
    tooltip?: string;
    buttonText?: string;
}

export const MessageInteractionLink = ({
    buttonText,
    tooltip,
    className,
    ...buttonLinkProps
}: MessageInteractionLinkProps) => {
    const isDesktop = useDesktopOrUp();

    if (isDesktop) {
        return (
            <StyledTooltip content={tooltip} placement="top">
                <ButtonLink
                    className={cx(baseButtonClass)}
                    variant="text"
                    color="primary"
                    aria-label={buttonText}
                    {...buttonLinkProps}>
                    {buttonText}
                </ButtonLink>
            </StyledTooltip>
        );
    }

    return (
        <StyledTooltip content={tooltip} placement="top">
            <ButtonLink
                className={cx(baseButtonClass)}
                variant="text"
                color="primary"
                aria-label={buttonText}
                {...buttonLinkProps}
                iconOnly
            />
        </StyledTooltip>
    );
};

const baseButtonClass = css({
    paddingInline: '2',
    paddingBlock: '2',
});
