interface BaseResponseContainerProps {
    children: JSX.Element;
}

interface ChatResponseContainerProps extends BaseResponseContainerProps {
    setHover: (value: boolean) => void;
}

export const ChatResponseContainer = ({ children, setHover }: ChatResponseContainerProps) => {
    return (
        <div
            style={{ position: 'relative', overflow: 'auto' }}
            role="presentation" // TODO: need a better a11y keyboard-only story pre-release
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onFocus={() => setHover(true)}
            onBlur={() => {
                setHover(false);
            }}>
            {children}
        </div>
    );
};
