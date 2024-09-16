import { ComponentProps } from 'react';

type Ai2LogoFullProps = Pick<ComponentProps<'img'>, 'height' | 'width' | 'alt'>;

export const Ai2LogoFull = ({ height, width, alt }: Ai2LogoFullProps) => {
    return <img height={height} width={width} alt={alt} src="/ai2-logo-full.svg" />;
};
