export const dateTimeFormat = 'M/D/YY h:mm a';

export const convertHtmlToText = (htmlStr: string): string => {
    return htmlStr
        .replace(/<\/?[a-zA-Z0-9=":\-;_ ]*>/g, ' ')
        .replace(/\s\s+/g, ' ')
        .trim();
};
