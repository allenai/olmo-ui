export const mathMarkdown =
    '\\left( \\sum_{k=1}^n a_k b_k \\right)^2 \\leq \\left( \\sum_{k=1}^n a_k^2 \\right) \\left( \\sum_{k=1}^n b_k^2 \\right)';

export const markdownMathBlock = `
**The Cauchy-Schwarz Inequality**
\`\`\`math
${mathMarkdown}
\`\`\`
with text underneath
`;

export const markdownInlineBrackets = `
**The Cauchy-Schwarz Inequality**

text surrounding the math \\[${mathMarkdown}\\] text on the other side
`;

export const markdownBlockBrackets = `
**The Cauchy-Schwarz Inequality**

text before the math
\\[
${mathMarkdown}
\\]
text after the math
`;

export const markdownInlineDollars = `
**The Cauchy-Schwarz Inequality**

text surrounding the math $$${mathMarkdown}$$ text on the other side
`;

export const markdownBlockDollars = `
**The Cauchy-Schwarz Inequality**

text before the math
$$
${mathMarkdown}
$$
text after the math
`;
