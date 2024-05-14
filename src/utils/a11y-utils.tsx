interface ScreenReaderAnnouncerProps {
    level: 'assertive' | 'polite';
    content: string;
}

export const ScreenReaderAnnouncer = ({ level, content }: ScreenReaderAnnouncerProps) => {
    return <span aria-live={level} aria-label={content} />;
};
