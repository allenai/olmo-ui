const checkForBalancedBraces = (string: string) => {
    let openingBracesCount = 0;
    let closingBracesCount = 0;
    for (let i = 0; i < string.length; i++) {
        if (string[i] === '[') {
            openingBracesCount += 1;
        } else if (string[i] === ']') {
            closingBracesCount += 1;
            if (closingBracesCount > openingBracesCount) {
                return false;
            }
        }
    }

    return openingBracesCount === closingBracesCount;
};

export const escapeBraces = (string: string) => {
    const shouldEscapeBraces = !checkForBalancedBraces(string);
    // the markdown renderer can handle matched braces in our highlights but not unmatched ones.
    // checking for balanced braces lets us get around that
    if (shouldEscapeBraces) {
        return string.replaceAll(/(\[|\])/g, '\\$1');
    } else {
        return string;
    }
};
