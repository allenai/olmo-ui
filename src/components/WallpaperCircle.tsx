interface Props {
    color?: string;
    width?: string;
    height?: string;
}
export const WallpaperCircle = ({ color = '#282828', width = '1461', height = '936' }: Props) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 1461 936"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="460" cy="-65" r="1001" fill={color} />
        </svg>
    );
};
