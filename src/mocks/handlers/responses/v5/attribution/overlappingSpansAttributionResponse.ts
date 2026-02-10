import type { SchemaAttributionResponse } from '@/api/playgroundApi/v5playgroundApiSchema';

// this has math which eslint thinks are template strings
// and I don't want to fix (escape) the actual contents
//
/* eslint-disable no-template-curly-in-string */
export default {
    documents: [
        {
            correspondingSpanTexts: ['the rate of change of \\( f \\) with respect to \\('],
            correspondingSpans: [7],
            index: '3162503913',
            relevanceScore: 546.0492432154936,
            snippets: [
                {
                    correspondingSpanText: 'the rate of change of \\( f \\) with respect to \\(',
                    text: 'f(x, y, \\ldots) \\) with respect to one of its variables, say \\( x \\), is denoted by \\( \\frac{\\partial f}{\\partial x} \\). It represents the rate of change of \\( f \\) with respect to \\( x \\), treating all other variables as constants.\n\n### Numerical Example:\n\nConsider the function:\n\\[ f(x, y) = 3x',
                },
            ],
            source: 'olmo-2-1124-13b-preference-mix',
            textLong:
                '<|user|>\nAGI en 2030\n<|assistant|>\nCertainly! A partial derivative is a tool used in calculus to measure how a function changes as one of its input variables changes, while all other variables are held constant. It is particularly useful when dealing with functions of multiple variables.\n\n### Definition:\nThe partial derivative of a function \\( f(x, y, \\ldots) \\) with respect to one of its variables, say \\( x \\), is denoted by \\( \\frac{\\partial f}{\\partial x} \\). It represents the rate of change of \\( f \\) with respect to \\( x \\), treating all other variables as constants.\n\n### Numerical Example:\n\nConsider the function:\n\\[ f(x, y) = 3x^2y + 2y^2 \\]\n\n#### Step-by-Step Calculation of Partial Derivative:\n\n1. **Partial Derivative with respect to \\( x \\):**\n   \\[\n   \\frac{\\partial f}{\\partial x} = \\frac{\\partial}{\\partial x}(3x^2y + 2y^2)\n   \\]\n   - The term \\( 3x^2y \\) involves \\( x \\), so we treat \\( y \\) as a constant.\n   - The term \\( 2y^2 \\) does not involve \\( x \\), so it is treated as a constant and its derivative with respect to \\( x \\) is 0.\n   - Therefore,\n   \\[\n   \\frac{\\partial f}{\\partial x} = 3 \\cdot 2xy + 0 = 6xy\n   \\]\n\n2. **Partial Derivative with respect to \\( y \\):**\n   \\[\n  ',
            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                'derivative \\( \\frac{\\partial^2 f}{\\partial',
                '-order derivative \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
            ],
            correspondingSpans: [17],
            index: '3159760942',
            relevanceScore: 543.2080938720474,
            snippets: [
                {
                    correspondingSpanText: 'derivative \\( \\frac{\\partial^2 f}{\\partial',
                    text: '-problem 1\n\nGiven the function \\( f(x, y) = e^{xy} \\sin(x+y) \\), we need to compute the second-order partial derivative \\( \\frac{\\partial^2 f}{\\partial x \\partial y} \\).\n\nFirst, find the first-order partial derivatives of \\( f \\).\n\n1. **First partial derivative with respect to \\( y \\)**:\n',
                },
                {
                    correspondingSpanText: 'derivative \\( \\frac{\\partial^2 f}{\\partial',
                    text: 'skills. \n\nSub-problem 1: Suppose \\( f(x, y) = e^{xy} \\sin(x+y) \\). Compute the second-order partial derivative \\( \\frac{\\partial^2 f}{\\partial x \\partial y} \\).\n\nSub-problem 2: You also want students to understand the application of linear algebra in calculus. Consider the vector field \\( \\mathbf{F}(x',
                },
            ],
            source: 'dolmino',
            textLong:
                "As an academic advisor, you are developing a new study technique to enhance the understanding of advanced calculus among students. You decide to create a complex problem involving multivariable calculus and linear algebra to challenge their skills. \n\nSub-problem 1: Suppose \\( f(x, y) = e^{xy} \\sin(x+y) \\). Compute the second-order partial derivative \\( \\frac{\\partial^2 f}{\\partial x \\partial y} \\).\n\nSub-problem 2: You also want students to understand the application of linear algebra in calculus. Consider the vector field \\( \\mathbf{F}(x, y, z) = (x^2y, 3xy^2, z^3) \\). Compute the divergence of \\( \\mathbf{F} \\) and evaluate it at the point \\( (1, 2, 1) \\).\nLet's solve the given sub-problems step-by-step.\n\n### Sub-problem 1\n\nGiven the function \\( f(x, y) = e^{xy} \\sin(x+y) \\), we need to compute the second-order partial derivative \\( \\frac{\\partial^2 f}{\\partial x \\partial y} \\).\n\nFirst, find the first-order partial derivatives of \\( f \\).\n\n1. **First partial derivative with respect to \\( y \\)**:\n   \\[\n   \\frac{\\partial f}{\\partial y} = \\frac{\\partial}{\\partial y} (e^{xy} \\sin(x+y))\n   \\]\n   \n   Using the product rule, where \\( u = e^{xy} \\) and \\( v = \\sin(x+y) \\):\n   \\[\n   \\frac{\\partial (uv)}{\\partial y} = u \\frac{\\partial v}{\\partial y} + v \\frac{\\partial u}{\\partial y}\n   \\]\n   \n   Compute \\( \\frac{\\partial u}{\\partial y} \\) and \\( \\frac{\\partial v}{\\partial y} \\):\n   \\[\n   \\frac{\\partial u}{\\partial y} = \\frac{\\partial}{\\partial y} e^{xy} = xe^{xy}\n   \\]\n   \\[\n   \\frac{\\partial v}{\\partial y} = \\frac{\\partial}{\\partial y} \\sin(x+y) = \\cos(x+",
            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                'derivative \\( \\frac{\\partial^2 f}{\\partial',
                '-order derivative \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
            ],
            correspondingSpans: [17],
            index: '3163325039',
            relevanceScore: 541.1979066278022,
            snippets: [
                {
                    correspondingSpanText: 'derivative \\( \\frac{\\partial^2 f}{\\partial',
                    text: '-problem 1\n\nGiven the function \\( f(x, y) = e^{xy} \\sin(x+y) \\), we need to compute the second-order partial derivative \\( \\frac{\\partial^2 f}{\\partial x \\partial y} \\).\n\nFirst, find the first-order partial derivatives of \\( f \\).\n\n1. **First partial derivative with respect to \\( y \\)**:\n',
                },
                {
                    correspondingSpanText: 'derivative \\( \\frac{\\partial^2 f}{\\partial',
                    text: 'skills. \n\nSub-problem 1: Suppose \\( f(x, y) = e^{xy} \\sin(x+y) \\). Compute the second-order partial derivative \\( \\frac{\\partial^2 f}{\\partial x \\partial y} \\).\n\nSub-problem 2: You also want students to understand the application of linear algebra in calculus. Consider the vector field \\( \\mathbf{F}(x',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                "are developing a new study technique to enhance the understanding of advanced calculus among students. You decide to create a complex problem involving multivariable calculus and linear algebra to challenge their skills. \n\nSub-problem 1: Suppose \\( f(x, y) = e^{xy} \\sin(x+y) \\). Compute the second-order partial derivative \\( \\frac{\\partial^2 f}{\\partial x \\partial y} \\).\n\nSub-problem 2: You also want students to understand the application of linear algebra in calculus. Consider the vector field \\( \\mathbf{F}(x, y, z) = (x^2y, 3xy^2, z^3) \\). Compute the divergence of \\( \\mathbf{F} \\) and evaluate it at the point \\( (1, 2, 1) \\).\n<|assistant|>\nLet's solve the given sub-problems step-by-step.\n\n### Sub-problem 1\n\nGiven the function \\( f(x, y) = e^{xy} \\sin(x+y) \\), we need to compute the second-order partial derivative \\( \\frac{\\partial^2 f}{\\partial x \\partial y} \\).\n\nFirst, find the first-order partial derivatives of \\( f \\).\n\n1. **First partial derivative with respect to \\( y \\)**:\n   \\[\n   \\frac{\\partial f}{\\partial y} = \\frac{\\partial}{\\partial y} (e^{xy} \\sin(x+y))\n   \\]\n   \n   Using the product rule, where \\( u = e^{xy} \\) and \\( v = \\sin(x+y) \\):\n   \\[\n   \\frac{\\partial (uv)}{\\partial y} = u \\frac{\\partial v}{\\partial y} + v \\frac{\\partial u}{\\partial y}\n   \\]\n   \n   Compute \\( \\frac{\\partial u}{\\partial y} \\) and \\( \\frac{\\partial v}{\\partial y} \\):\n   \\[\n   \\frac{\\partial u}{\\partial y} = \\frac{\\partial}{\\partial y} e^{xy} = xe^{xy}\n   \\]\n   \\[\n   \\frac{\\partial v}{\\partial y} = \\frac{\\partial}{\\partial y} \\sin(x+y) = \\cos(x+",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                'a square matrix \\( \\mathbf{A} \\), \\(',
                ' **Determinant**: The determinant of a square matrix \\( \\mathbf{A} \\),',
            ],
            correspondingSpans: [1, 4],
            index: '3163246288',
            relevanceScore: 527.3256203123576,
            snippets: [
                {
                    correspondingSpanText: 'a square matrix \\( \\mathbf{A} \\), \\(',
                    text: 'addition. However, this problem can be simplified by considering the matrix scalar multiplication and the determinant:\n\n1. **Scalar Multiplication Property**: For any scalar \\( c \\) and a square matrix \\( \\mathbf{A} \\), \\( \\det(c \\mathbf{A}) = c^n \\det(\\mathbf{A}) \\), where \\( n \\) is the order of the square matrix. Here, \\( c = ',
                },
                {
                    correspondingSpanText: 'a square matrix \\( \\mathbf{A} \\),',
                    text: 'addition. However, this problem can be simplified by considering the matrix scalar multiplication and the determinant:\n\n1. **Scalar Multiplication Property**: For any scalar \\( c \\) and a square matrix \\( \\mathbf{A} \\), \\( \\det(c \\mathbf{A}) = c^n \\det(\\mathbf{A}) \\), where \\( n \\) is the order of the square matrix. Here, \\( c =',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                'at \\( t = 0 \\) was \\( g(0) = g_0 \\) and the GDP doubled after 10 years, determine the value of \\( k \\). Then, use this value to project the GDP \\( g(t) \\) at \\( t = 20 \\) years.\n<|assistant|>\nLet\'s solve the given problem step-by-step.\n\n### Part 1: Determinant of \\( \\mathbf{Y} \\)\n\nGiven:\n- \\( \\mathbf{X} \\) is a 3x3 matrix with \\(\\det(\\mathbf{X}) = 5\\).\n- \\( \\mathbf{Y} = 2\\mathbf{X} + \\mathbf{I} \\), where \\(\\mathbf{I}\\) is the identity matrix.\n\nTo find \\(\\det(\\mathbf{Y})\\), we start with the determinant properties. Specifically, we need to use the property that relates to the determinant of matrix addition. However, this problem can be simplified by considering the matrix scalar multiplication and the determinant:\n\n1. **Scalar Multiplication Property**: For any scalar \\( c \\) and a square matrix \\( \\mathbf{A} \\), \\( \\det(c \\mathbf{A}) = c^n \\det(\\mathbf{A}) \\), where \\( n \\) is the order of the square matrix. Here, \\( c = 2 \\) and \\( n = 3 \\) (since \\(\\mathbf{X}\\) is a 3x3 matrix).\n   \\[\n   \\det(2\\mathbf{X}) = 2^3 \\det(\\mathbf{X}) = 8 \\cdot 5 = 40\n   \\]\n\n2. **Matrix Addition Property**: Unfortunately, there is no straightforward property for the determinant of a sum of matrices that applies here. However, there is a result for a specific type of matrices called the "matrix determinant lemma," but it does not directly apply in this scenario.\n\nThus, for a detailed and accurate result, we calculate the determinant of \\(\\mathbf{Y}\\) directly if more specific elements of \\(\\mathbf{X}\\) were given. However, based on the typical assumption that \\(\\mathbf{X}\\) and \\(\\mathbf{I}\\) are not singular or special matrices, and considering the problem setup, the determinant of \\( \\mathbf{Y} \\) can be derived with the',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '    \\frac{\\partial}{\\partial \\mathbf{',
                '     \\frac{\\partial}{\\partial \\mathbf{A}} \\mathrm{tr}(\\mathbf{A}^{-1} \\mathbf{A}^{-',
                '     \\frac{\\partial}{\\partial \\mathbf{A}}',
            ],
            correspondingSpans: [15, 31],
            index: '3163343661',
            relevanceScore: 525.88800821045,
            snippets: [
                {
                    correspondingSpanText: '    \\frac{\\partial}{\\partial \\mathbf{',
                    text: 'Term-by-Term Derivation**:\n   - For the quadratic term \\( \\mathbf{g}^T \\mathbf{A} \\mathbf{g} \\):\n     \\[\n     \\frac{\\partial}{\\partial \\mathbf{g}} (\\mathbf{g}^T \\mathbf{A} \\mathbf{g}) = 2\\mathbf{A} \\mathbf{g}\n     \\]\n     because \\( \\mathbf',
                },
                {
                    correspondingSpanText: '    \\frac{\\partial}{\\partial \\mathbf{',
                    text: '= \\mathbf{b}\n     \\]\n   - The constant term \\( c \\) does not depend on \\( \\mathbf{g} \\), so its gradient is zero:\n     \\[\n     \\frac{\\partial}{\\partial \\mathbf{g}} c = 0\n     \\]\n\n2. **Combine the Results**:\n   \\[\n   \\nabla f(\\mathbf{g}) = 2\\mathbf{A',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                's data from a neural network and finds that the synaptic plasticity rate \\( f(\\mathbf{g}) \\) is maximized when \\( \\mathbf{g} \\) satisfies a certain constraint \\( \\mathbf{g}^T \\mathbf{g} = 1 \\). Using the method of Lagrange multipliers, determine the condition that \\( \\mathbf{g} \\) must satisfy to maximize \\( f(\\mathbf{g}) \\) under this constraint.\n<|assistant|>\n### Solution:\n\n#### Part 1: Derive the Gradient \\( \\nabla f(\\mathbf{g}) \\)\n\nGiven the function:\n\\[ f(\\mathbf{g}) = \\mathbf{g}^T \\mathbf{A} \\mathbf{g} + \\mathbf{b}^T \\mathbf{g} + c \\]\n\nWe need to find the gradient \\( \\nabla f(\\mathbf{g}) \\) with respect to \\( \\mathbf{g} \\).\n\n1. **Term-by-Term Derivation**:\n   - For the quadratic term \\( \\mathbf{g}^T \\mathbf{A} \\mathbf{g} \\):\n     \\[\n     \\frac{\\partial}{\\partial \\mathbf{g}} (\\mathbf{g}^T \\mathbf{A} \\mathbf{g}) = 2\\mathbf{A} \\mathbf{g}\n     \\]\n     because \\( \\mathbf{A} \\) is symmetric (\\( \\mathbf{A} = \\mathbf{A}^T \\)).\n   - For the linear term \\( \\mathbf{b}^T \\mathbf{g} \\):\n     \\[\n     \\frac{\\partial}{\\partial \\mathbf{g}} (\\mathbf{b}^T \\mathbf{g}) = \\mathbf{b}\n     \\]\n   - The constant term \\( c \\) does not depend on \\( \\mathbf{g} \\), so its gradient is zero:\n     \\[\n     \\frac{\\partial}{\\partial \\mathbf{g}} c = 0\n     \\]\n\n2. **Combine the Results**:\n   \\[\n   \\nabla f(\\mathbf{g}) = 2\\mathbf{A} \\mathbf{g} + \\mathbf{b}\n   \\]\n\n#### Part 2: Maximizing \\( f(\\mathbf{g}) \\) with Constraint \\( \\mathbf{g}^T \\mathbf{g} = ',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                'a square matrix \\( \\mathbf{A} \\), \\(',
                ' **Determinant**: The determinant of a square matrix \\( \\mathbf{A} \\),',
            ],
            correspondingSpans: [1, 4],
            index: '3159768176',
            relevanceScore: 525.3630190129908,
            snippets: [
                {
                    correspondingSpanText: 'a square matrix \\( \\mathbf{A} \\), \\(',
                    text: 'addition. However, this problem can be simplified by considering the matrix scalar multiplication and the determinant:\n\n1. **Scalar Multiplication Property**: For any scalar \\( c \\) and a square matrix \\( \\mathbf{A} \\), \\( \\det(c \\mathbf{A}) = c^n \\det(\\mathbf{A}) \\), where \\( n \\) is the order of the square matrix. Here, \\( c = ',
                },
                {
                    correspondingSpanText: 'a square matrix \\( \\mathbf{A} \\),',
                    text: 'addition. However, this problem can be simplified by considering the matrix scalar multiplication and the determinant:\n\n1. **Scalar Multiplication Property**: For any scalar \\( c \\) and a square matrix \\( \\mathbf{A} \\), \\( \\det(c \\mathbf{A}) = c^n \\det(\\mathbf{A}) \\), where \\( n \\) is the order of the square matrix. Here, \\( c =',
                },
            ],
            source: 'dolmino',
            textLong:
                'growth rate. If the GDP at \\( t = 0 \\) was \\( g(0) = g_0 \\) and the GDP doubled after 10 years, determine the value of \\( k \\). Then, use this value to project the GDP \\( g(t) \\) at \\( t = 20 \\) years.\nLet\'s solve the given problem step-by-step.\n\n### Part 1: Determinant of \\( \\mathbf{Y} \\)\n\nGiven:\n- \\( \\mathbf{X} \\) is a 3x3 matrix with \\(\\det(\\mathbf{X}) = 5\\).\n- \\( \\mathbf{Y} = 2\\mathbf{X} + \\mathbf{I} \\), where \\(\\mathbf{I}\\) is the identity matrix.\n\nTo find \\(\\det(\\mathbf{Y})\\), we start with the determinant properties. Specifically, we need to use the property that relates to the determinant of matrix addition. However, this problem can be simplified by considering the matrix scalar multiplication and the determinant:\n\n1. **Scalar Multiplication Property**: For any scalar \\( c \\) and a square matrix \\( \\mathbf{A} \\), \\( \\det(c \\mathbf{A}) = c^n \\det(\\mathbf{A}) \\), where \\( n \\) is the order of the square matrix. Here, \\( c = 2 \\) and \\( n = 3 \\) (since \\(\\mathbf{X}\\) is a 3x3 matrix).\n   \\[\n   \\det(2\\mathbf{X}) = 2^3 \\det(\\mathbf{X}) = 8 \\cdot 5 = 40\n   \\]\n\n2. **Matrix Addition Property**: Unfortunately, there is no straightforward property for the determinant of a sum of matrices that applies here. However, there is a result for a specific type of matrices called the "matrix determinant lemma," but it does not directly apply in this scenario.\n\nThus, for a detailed and accurate result, we calculate the determinant of \\(\\mathbf{Y}\\) directly if more specific elements of \\(\\mathbf{X}\\) were given. However, based on the typical assumption that \\(\\mathbf{X}\\) and \\(\\mathbf{I}\\) are not singular or special matrices, and considering the problem setup, the determinant of \\( \\mathbf{Y} \\) can be derived with the',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\( \\det(\\mathbf{A}) \\)', ' \\( \\det(\\mathbf{A}) \\)'],
            correspondingSpans: [26, 27],
            index: '3159703933',
            relevanceScore: 523.8279292165091,
            snippets: [
                {
                    correspondingSpanText: '\\( \\det(\\mathbf{A}) \\)',
                    text: '\\mathbf{A}^{-1} \\), we must calculate the determinant of \\( \\mathbf{A} \\) modulo 7 and ensure it is invertible.\n\n   The determinant \\( \\det(\\mathbf{A}) \\) can be calculated using cofactor expansion along the first row:\n\n   \\[\n   \\det(\\mathbf{A}) = 2 \\det\\begin{pmatrix}1 & 4',
                },
            ],
            source: 'dolmino',
            textLong:
                '\\( x = 1, 2, 3, \\) and \\( 4 \\) respectively, find the polynomial \\( p(x) \\).\nTo solve the given problem, we need to address both parts: finding the inverse of the matrix and decrypting the message, and determining the polynomial.\n\n**Part 1: Find \\( \\mathbf{A}^{-1} \\) modulo 7 and decrypt the message**\n\n1. **Find the inverse matrix \\( \\mathbf{A}^{-1} \\) modulo 7:**\n\n   Matrix \\( \\mathbf{A} \\) is:\n   \\[\n   \\mathbf{A} = \\begin{pmatrix}\n   2 & 3 & 1 & 4 \\\\\n   0 & 1 & 4 & 2 \\\\\n   3 & 0 & 2 & 5 \\\\\n   1 & 2 & 3 & 0\n   \\end{pmatrix}\n   \\]\n\n   To find \\( \\mathbf{A}^{-1} \\), we must calculate the determinant of \\( \\mathbf{A} \\) modulo 7 and ensure it is invertible.\n\n   The determinant \\( \\det(\\mathbf{A}) \\) can be calculated using cofactor expansion along the first row:\n\n   \\[\n   \\det(\\mathbf{A}) = 2 \\det\\begin{pmatrix}1 & 4 & 2 \\\\ 0 & 2 & 5 \\\\ 2 & 3 & 0\\end{pmatrix}\n   - 3 \\det\\begin{pmatrix}0 & 4 & 2 \\\\ 3 & 2 & 5 \\\\ 1 & 3 & 0\\end{pmatrix}\n   + 1 \\det\\begin{pmatrix}0 & 1 & 2 \\\\ 3 & 0 & 5 \\\\ 1 & 2 & 0\\end{pmatrix}\n   - 4 \\det\\begin{pmatrix}0 & 1 & 4 \\\\ 3 & 0 & 2 \\\\ 1 & 2 & 3\\end{pmatrix}\n   \\]\n\n   Calculate each \\( 3 \\times 3 \\) determinant modulo 7:\n\n   \\[\n   \\det\\begin{pmatrix}1 & 4 & 2 \\\\ 0 & 2 & 5 \\\\ 2 & ',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\( \\det(\\mathbf{A}) \\)', ' \\( \\det(\\mathbf{A}) \\)'],
            correspondingSpans: [26, 27],
            index: '3163350958',
            relevanceScore: 518.3666263114272,
            snippets: [
                {
                    correspondingSpanText: '\\( \\det(\\mathbf{A}) \\)',
                    text: '\\mathbf{A}^{-1} \\), we must calculate the determinant of \\( \\mathbf{A} \\) modulo 7 and ensure it is invertible.\n\n   The determinant \\( \\det(\\mathbf{A}) \\) can be calculated using cofactor expansion along the first row:\n\n   \\[\n   \\det(\\mathbf{A}) = 2 \\det\\begin{pmatrix}1 & 4',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                '2, 3, \\) and \\( 4 \\) respectively, find the polynomial \\( p(x) \\).\n<|assistant|>\nTo solve the given problem, we need to address both parts: finding the inverse of the matrix and decrypting the message, and determining the polynomial.\n\n**Part 1: Find \\( \\mathbf{A}^{-1} \\) modulo 7 and decrypt the message**\n\n1. **Find the inverse matrix \\( \\mathbf{A}^{-1} \\) modulo 7:**\n\n   Matrix \\( \\mathbf{A} \\) is:\n   \\[\n   \\mathbf{A} = \\begin{pmatrix}\n   2 & 3 & 1 & 4 \\\\\n   0 & 1 & 4 & 2 \\\\\n   3 & 0 & 2 & 5 \\\\\n   1 & 2 & 3 & 0\n   \\end{pmatrix}\n   \\]\n\n   To find \\( \\mathbf{A}^{-1} \\), we must calculate the determinant of \\( \\mathbf{A} \\) modulo 7 and ensure it is invertible.\n\n   The determinant \\( \\det(\\mathbf{A}) \\) can be calculated using cofactor expansion along the first row:\n\n   \\[\n   \\det(\\mathbf{A}) = 2 \\det\\begin{pmatrix}1 & 4 & 2 \\\\ 0 & 2 & 5 \\\\ 2 & 3 & 0\\end{pmatrix}\n   - 3 \\det\\begin{pmatrix}0 & 4 & 2 \\\\ 3 & 2 & 5 \\\\ 1 & 3 & 0\\end{pmatrix}\n   + 1 \\det\\begin{pmatrix}0 & 1 & 2 \\\\ 3 & 0 & 5 \\\\ 1 & 2 & 0\\end{pmatrix}\n   - 4 \\det\\begin{pmatrix}0 & 1 & 4 \\\\ 3 & 0 & 2 \\\\ 1 & 2 & 3\\end{pmatrix}\n   \\]\n\n   Calculate each \\( 3 \\times 3 \\) determinant modulo 7:\n\n   \\[\n   \\det\\begin{pmatrix}1 & 4 & 2 \\\\ 0 & 2 & 5 \\\\ 2 & ',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '    \\frac{\\partial}{\\partial \\mathbf{',
                '     \\frac{\\partial}{\\partial \\mathbf{A}} \\mathrm{tr}(\\mathbf{A}^{-1} \\mathbf{A}^{-',
                '     \\frac{\\partial}{\\partial \\mathbf{A}}',
            ],
            correspondingSpans: [15, 31],
            index: '3159798745',
            relevanceScore: 510.5805593871032,
            snippets: [
                {
                    correspondingSpanText: '    \\frac{\\partial}{\\partial \\mathbf{',
                    text: '= \\mathbf{b}\n     \\]\n   - The constant term \\( c \\) does not depend on \\( \\mathbf{g} \\), so its gradient is zero:\n     \\[\n     \\frac{\\partial}{\\partial \\mathbf{g}} c = 0\n     \\]\n\n2. **Combine the Results**:\n   \\[\n   \\nabla f(\\mathbf{g}) = 2\\mathbf{A',
                },
                {
                    correspondingSpanText: '    \\frac{\\partial}{\\partial \\mathbf{',
                    text: 'Term-by-Term Derivation**:\n   - For the quadratic term \\( \\mathbf{g}^T \\mathbf{A} \\mathbf{g} \\):\n     \\[\n     \\frac{\\partial}{\\partial \\mathbf{g}} (\\mathbf{g}^T \\mathbf{A} \\mathbf{g}) = 2\\mathbf{A} \\mathbf{g}\n     \\]\n     because \\( \\mathbf',
                },
            ],
            source: 'dolmino',
            textLong:
                '} + \\mathbf{b}^T \\mathbf{g} + c \\]\n\nWe need to find the gradient \\( \\nabla f(\\mathbf{g}) \\) with respect to \\( \\mathbf{g} \\).\n\n1. **Term-by-Term Derivation**:\n   - For the quadratic term \\( \\mathbf{g}^T \\mathbf{A} \\mathbf{g} \\):\n     \\[\n     \\frac{\\partial}{\\partial \\mathbf{g}} (\\mathbf{g}^T \\mathbf{A} \\mathbf{g}) = 2\\mathbf{A} \\mathbf{g}\n     \\]\n     because \\( \\mathbf{A} \\) is symmetric (\\( \\mathbf{A} = \\mathbf{A}^T \\)).\n   - For the linear term \\( \\mathbf{b}^T \\mathbf{g} \\):\n     \\[\n     \\frac{\\partial}{\\partial \\mathbf{g}} (\\mathbf{b}^T \\mathbf{g}) = \\mathbf{b}\n     \\]\n   - The constant term \\( c \\) does not depend on \\( \\mathbf{g} \\), so its gradient is zero:\n     \\[\n     \\frac{\\partial}{\\partial \\mathbf{g}} c = 0\n     \\]\n\n2. **Combine the Results**:\n   \\[\n   \\nabla f(\\mathbf{g}) = 2\\mathbf{A} \\mathbf{g} + \\mathbf{b}\n   \\]\n\n#### Part 2: Maximizing \\( f(\\mathbf{g}) \\) with Constraint \\( \\mathbf{g}^T \\mathbf{g} = 1 \\)\n\nTo maximize \\( f(\\mathbf{g}) \\) subject to the constraint \\( \\mathbf{g}^T \\mathbf{g} = 1 \\), we use the method of Lagrange multipliers.\n\n1. **Lagrangian Function**:\n   Define the Lagrangian \\( \\mathcal{L} \\):\n   \\[\n   \\mathcal{L}(\\mathbf{g}, \\lambda) = f(\\mathbf{g}) - \\lambda (\\mathbf{g}^T \\mathbf{g} - 1)\n   \\]\n   where \\( \\lambda \\) is the Lagrange multiplier.\n\n2. **Compute the Gradient of \\( \\mathcal{L} \\)**:\n   \\[\n   \\mathcal',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\( \\frac{\\partial^2 g}{\\partial',
                '-order derivative \\( \\frac{\\partial^2 g}{\\partial',
                ' \\( \\frac{\\partial^2 g}{\\partial',
            ],
            correspondingSpans: [23, 29, 37],
            index: '3163313215',
            relevanceScore: 500.26914413480324,
            snippets: [
                {
                    correspondingSpanText: '\\( \\frac{\\partial^2 g}{\\partial',
                    text: ').\n\nTherefore, the conditions for \\( g(x, t) \\) to remain bounded are:\n\\[ \\sigma > 0 \\]\n\nFinal Answer: The final answer is \\( \\frac{\\partial^2 g}{\\partial t^2} = c^2 \\frac{\\partial^2 g}{\\partial x^2} + \\left( \\frac{\\partial^2 T}{\\partial t^2} f +',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                '\\):\n\\[ T(x, t) = e^{-(x^2 + t^2) / \\sigma^2} \\cos(\\alpha x - \\beta t) \\]\n\n1. **Exponential part:**\n   \\[\n   e^{-(x^2 + t^2) / \\sigma^2}\n   \\]\n   This term is always bounded since the exponential function decays to zero as \\( x \\) and \\( t \\) go to infinity. The decay rate is controlled by \\( \\sigma \\). \n\n   For \\( T(x, t) \\) to remain bounded, \\( \\sigma \\) must be a positive real number.\n\n2. **Cosine part:**\n   \\[\n   \\cos(\\alpha x - \\beta t)\n   \\]\n   The cosine function is inherently bounded between -1 and 1 for all real values of \\( \\alpha \\), \\( \\beta \\), \\( x \\), and \\( t \\).\n\nTherefore, the conditions for \\( g(x, t) \\) to remain bounded are:\n\\[ \\sigma > 0 \\]\n\nFinal Answer: The final answer is \\( \\frac{\\partial^2 g}{\\partial t^2} = c^2 \\frac{\\partial^2 g}{\\partial x^2} + \\left( \\frac{\\partial^2 T}{\\partial t^2} f + 2 \\frac{\\partial T}{\\partial t} \\frac{\\partial f}{\\partial t} \\right) - c^2 \\left( \\frac{\\partial^2 T}{\\partial x^2} f + 2 \\frac{\\partial T}{\\partial x} \\frac{\\partial f}{\\partial x} \\right) \\). For stability, \\( \\sigma > 0 \\). I hope it is correct.',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '{A}^{-1} \\mathbf{A}^{-',
                '     \\frac{\\partial}{\\partial \\mathbf{A}} \\mathrm{tr}(\\mathbf{A}^{-1} \\mathbf{A}^{-',
            ],
            correspondingSpans: [13, 15],
            index: '3163531477',
            relevanceScore: 500.0115104976055,
            snippets: [
                {
                    correspondingSpanText: '{A}^{-1} \\mathbf{A}^{-',
                    text: 'their inverses in reverse order.\n3. Specifically, \\((\\mathbf{A}^2)^{-1} = (\\mathbf{A} \\mathbf{A})^{-1} = \\mathbf{A}^{-1} \\mathbf{A}^{-1} = (\\mathbf{A}^{-1})^2\\).\n\nGiven:\n\\[\n\\mathbf{A}^{-1} = \\begin{pmatrix} -4 & 1 \\\\',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                "<|user|>\nIf $\\mathbf{A}^{-1} = \\begin{pmatrix} -4 & 1 \\\\ 0 & 2 \\end{pmatrix},$ then find the inverse of $\\mathbf{A}^2.$\n<|assistant|>\nTo find the inverse of \\(\\mathbf{A}^2\\), we can use some properties of matrix inverses:\n\n1. If \\(\\mathbf{A}\\) is invertible, then \\(\\mathbf{A}^{-1}\\) is also invertible.\n2. The inverse of a product of matrices is the product of their inverses in reverse order.\n3. Specifically, \\((\\mathbf{A}^2)^{-1} = (\\mathbf{A} \\mathbf{A})^{-1} = \\mathbf{A}^{-1} \\mathbf{A}^{-1} = (\\mathbf{A}^{-1})^2\\).\n\nGiven:\n\\[\n\\mathbf{A}^{-1} = \\begin{pmatrix} -4 & 1 \\\\ 0 & 2 \\end{pmatrix}\n\\]\n\nWe can find the inverse of \\(\\mathbf{A}^2\\) by computing \\((\\mathbf{A}^{-1})^2\\). Let's do this step by step using Python.\n\nFirst, let's define the matrix \\(\\mathbf{A}^{-1}\\) and then compute its square.\n\nLet's use Python to compute \\((\\mathbf{A}^{-1})^2\\).\n```python\nimport numpy as np\n\n# Define the inverse matrix A^{-1}\nA_inv = np.array([[-4, 1], [0, 2]])\n\n# Compute (A^{-1})^2\nA_inv_squared = np.dot(A_inv, A_inv)\nprint(A_inv_squared)\n```\n```output\narray([[16, -2],\n       [ 0,  4]])\n```\nFrom the calculation using Python, we have:\n",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '    \\frac{\\partial^2 f}{\\partial',
                '     \\frac{\\partial^2 f}{\\partial \\mathbf{',
            ],
            correspondingSpans: [18, 20],
            index: '3159719177',
            relevanceScore: 499.7179491283179,
            snippets: [
                {
                    correspondingSpanText: '    \\frac{\\partial^2 f}{\\partial',
                    text: '^2)} \\cdot \\sin(\\pi y)\n     \\]\n\n   - Compute \\( \\frac{\\partial^2 f}{\\partial y^2} \\):\n     \\[\n     \\frac{\\partial^2 f}{\\partial y^2} = \\frac{\\partial}{\\partial y} \\left( e^{-(x^2 + y^2)} \\cdot \\cos(\\pi y) \\cdot \\pi -',
                },
            ],
            source: 'dolmino',
            textLong:
                '\\cos(\\pi y) \\cdot \\pi - 2y e^{-(x^2 + y^2)} \\cdot \\sin(\\pi y)\n     \\]\n\n2. **Calculate the divergence \\( \\nabla \\cdot \\nabla f \\):**\n\n   The divergence is:\n   \\[\n   \\nabla \\cdot \\nabla f = \\frac{\\partial^2 f}{\\partial x^2} + \\frac{\\partial^2 f}{\\partial y^2}\n   \\]\n\n   - Compute \\( \\frac{\\partial^2 f}{\\partial x^2} \\):\n     \\[\n     \\frac{\\partial^2 f}{\\partial x^2} = \\frac{\\partial}{\\partial x}\\left( -2x e^{-(x^2 + y^2)} \\cdot \\sin(\\pi y) \\right)\n     \\]\n     \\[\n     = (-2 + 4x^2) e^{-(x^2 + y^2)} \\cdot \\sin(\\pi y)\n     \\]\n\n   - Compute \\( \\frac{\\partial^2 f}{\\partial y^2} \\):\n     \\[\n     \\frac{\\partial^2 f}{\\partial y^2} = \\frac{\\partial}{\\partial y} \\left( e^{-(x^2 + y^2)} \\cdot \\cos(\\pi y) \\cdot \\pi - 2y e^{-(x^2 + y^2)} \\cdot \\sin(\\pi y) \\right)\n     \\]\n\n     Evaluating these at \\( (0, 0.5) \\) simplifies the calculations significantly, especially since \\( x = 0 \\). The derivatives at the specific point would need to be computed explicitly.\n\n3. **Interpret the Divergence:**\n\n   The divergence at \\( (0, 0.5) \\) gives insight into the behavior of the field near that point. A high divergence may suggest rapid change in opinions, indicating variability or polarization around the center.\n\nFinal Answer: The final answer is the computed average opinion strength and the divergence at the point, both needing numerical evaluation for exact values. I hope it is correct.',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '    \\frac{\\partial^2 f}{\\partial',
                '     \\frac{\\partial^2 f}{\\partial \\mathbf{',
            ],
            correspondingSpans: [18, 20],
            index: '3163287500',
            relevanceScore: 499.7179491283179,
            snippets: [
                {
                    correspondingSpanText: '    \\frac{\\partial^2 f}{\\partial',
                    text: '^2)} \\cdot \\sin(\\pi y)\n     \\]\n\n   - Compute \\( \\frac{\\partial^2 f}{\\partial y^2} \\):\n     \\[\n     \\frac{\\partial^2 f}{\\partial y^2} = \\frac{\\partial}{\\partial y} \\left( e^{-(x^2 + y^2)} \\cdot \\cos(\\pi y) \\cdot \\pi -',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                '\\cos(\\pi y) \\cdot \\pi - 2y e^{-(x^2 + y^2)} \\cdot \\sin(\\pi y)\n     \\]\n\n2. **Calculate the divergence \\( \\nabla \\cdot \\nabla f \\):**\n\n   The divergence is:\n   \\[\n   \\nabla \\cdot \\nabla f = \\frac{\\partial^2 f}{\\partial x^2} + \\frac{\\partial^2 f}{\\partial y^2}\n   \\]\n\n   - Compute \\( \\frac{\\partial^2 f}{\\partial x^2} \\):\n     \\[\n     \\frac{\\partial^2 f}{\\partial x^2} = \\frac{\\partial}{\\partial x}\\left( -2x e^{-(x^2 + y^2)} \\cdot \\sin(\\pi y) \\right)\n     \\]\n     \\[\n     = (-2 + 4x^2) e^{-(x^2 + y^2)} \\cdot \\sin(\\pi y)\n     \\]\n\n   - Compute \\( \\frac{\\partial^2 f}{\\partial y^2} \\):\n     \\[\n     \\frac{\\partial^2 f}{\\partial y^2} = \\frac{\\partial}{\\partial y} \\left( e^{-(x^2 + y^2)} \\cdot \\cos(\\pi y) \\cdot \\pi - 2y e^{-(x^2 + y^2)} \\cdot \\sin(\\pi y) \\right)\n     \\]\n\n     Evaluating these at \\( (0, 0.5) \\) simplifies the calculations significantly, especially since \\( x = 0 \\). The derivatives at the specific point would need to be computed explicitly.\n\n3. **Interpret the Divergence:**\n\n   The divergence at \\( (0, 0.5) \\) gives insight into the behavior of the field near that point. A high divergence may suggest rapid change in opinions, indicating variability or polarization around the center.\n\nFinal Answer: The final answer is the computed average opinion strength and the divergence at the point, both needing numerical evaluation for exact values. I hope it is correct.',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\( \\frac{\\partial^2 g}{\\partial',
                ' \\( \\frac{\\partial^2 g}{\\partial',
                '-order derivative \\( \\frac{\\partial^2 g}{\\partial',
            ],
            correspondingSpans: [23, 29, 37],
            index: '3159713458',
            relevanceScore: 486.2492504411698,
            snippets: [
                {
                    correspondingSpanText: '\\( \\frac{\\partial^2 g}{\\partial',
                    text: 'g}{\\partial x^2} = \\frac{2(y^2 - x^2)}{(x^2 + 2xy + y^2)^2} \\)\n     - \\( \\frac{\\partial^2 g}{\\partial y^2} = \\frac{2(x^2 - y^2)}{(x^2 + 2xy + y^2)^2} \\)\n     - \\( \\frac',
                },
                {
                    correspondingSpanText: '\\( \\frac{\\partial^2 g}{\\partial',
                    text: 'g}{\\partial y^2} = \\frac{2(x^2 - y^2)}{(x^2 + 2xy + y^2)^2} \\)\n     - \\( \\frac{\\partial^2 g}{\\partial x \\partial y} = \\frac{2(x^2 + y^2)}{(x^2 + 2xy + y^2)^2} \\)\n\n   - At',
                },
            ],
            source: 'dolmino',
            textLong:
                "2x + 2y}{x^2 + 2xy + y^2} \\)\n\n3. **Set partial derivatives to zero**:\n   - Since \\( \\frac{\\partial g}{\\partial x} = \\frac{\\partial g}{\\partial y} \\), we have:\n     \\[\n     2x + 2y = 0\n     \\]\n   - Hence, \\( x + y = 0 \\).\n\n4. **Substitute aspect ratio**:\n   - Substituting \\( y = 1.618x \\) gives:\n     \\[\n     x + 1.618x = 0 \\implies 2.618x = 0 \\implies x = 0 \\quad \\text{and} \\quad y = 0\n     \\]\n\n5. **Classify the critical point \\((0, 0)\\)**:\n   - Second derivatives:\n     - \\( \\frac{\\partial^2 g}{\\partial x^2} = \\frac{2(y^2 - x^2)}{(x^2 + 2xy + y^2)^2} \\)\n     - \\( \\frac{\\partial^2 g}{\\partial y^2} = \\frac{2(x^2 - y^2)}{(x^2 + 2xy + y^2)^2} \\)\n     - \\( \\frac{\\partial^2 g}{\\partial x \\partial y} = \\frac{2(x^2 + y^2)}{(x^2 + 2xy + y^2)^2} \\)\n\n   - At \\((0, 0)\\), these derivatives are undefined because the denominator becomes zero.\n\nThus, \\((0, 0)\\) is not a valid critical point due to the logarithmic function's domain.\n\n### Final Answer:\n\nThe relationship between the constants is \\(2a = -1.618b - 5.236c\\). The critical point at \\((0,0)\\) is not valid. I hope it is correct.",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\( \\frac{\\partial^2 g}{\\partial',
                '-order derivative \\( \\frac{\\partial^2 g}{\\partial',
                ' \\( \\frac{\\partial^2 g}{\\partial',
            ],
            correspondingSpans: [23, 29, 37],
            index: '3163258313',
            relevanceScore: 486.2492504411698,
            snippets: [
                {
                    correspondingSpanText: '\\( \\frac{\\partial^2 g}{\\partial',
                    text: 'g}{\\partial x^2} = \\frac{2(y^2 - x^2)}{(x^2 + 2xy + y^2)^2} \\)\n     - \\( \\frac{\\partial^2 g}{\\partial y^2} = \\frac{2(x^2 - y^2)}{(x^2 + 2xy + y^2)^2} \\)\n     - \\( \\frac',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                "2x + 2y}{x^2 + 2xy + y^2} \\)\n\n3. **Set partial derivatives to zero**:\n   - Since \\( \\frac{\\partial g}{\\partial x} = \\frac{\\partial g}{\\partial y} \\), we have:\n     \\[\n     2x + 2y = 0\n     \\]\n   - Hence, \\( x + y = 0 \\).\n\n4. **Substitute aspect ratio**:\n   - Substituting \\( y = 1.618x \\) gives:\n     \\[\n     x + 1.618x = 0 \\implies 2.618x = 0 \\implies x = 0 \\quad \\text{and} \\quad y = 0\n     \\]\n\n5. **Classify the critical point \\((0, 0)\\)**:\n   - Second derivatives:\n     - \\( \\frac{\\partial^2 g}{\\partial x^2} = \\frac{2(y^2 - x^2)}{(x^2 + 2xy + y^2)^2} \\)\n     - \\( \\frac{\\partial^2 g}{\\partial y^2} = \\frac{2(x^2 - y^2)}{(x^2 + 2xy + y^2)^2} \\)\n     - \\( \\frac{\\partial^2 g}{\\partial x \\partial y} = \\frac{2(x^2 + y^2)}{(x^2 + 2xy + y^2)^2} \\)\n\n   - At \\((0, 0)\\), these derivatives are undefined because the denominator becomes zero.\n\nThus, \\((0, 0)\\) is not a valid critical point due to the logarithmic function's domain.\n\n### Final Answer:\n\nThe relationship between the constants is \\(2a = -1.618b - 5.236c\\). The critical point at \\((0,0)\\) is not valid. I hope it is correct.",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\( \\frac{\\partial^2 g}{\\partial',
                ' \\( \\frac{\\partial^2 g}{\\partial',
                '-order derivative \\( \\frac{\\partial^2 g}{\\partial',
            ],
            correspondingSpans: [23, 29, 37],
            index: '3159698350',
            relevanceScore: 483.35684197105974,
            snippets: [
                {
                    correspondingSpanText: '\\( \\frac{\\partial^2 g}{\\partial',
                    text: '-3 & 6 \\\\\n     \\end{bmatrix}\n     \\]\n     Determinant = \\( 36 - 9 = 27 > 0 \\), but \\( \\frac{\\partial^2 g}{\\partial x^2} = 6 > 0 \\), indicating a local minimum.\n\n   - At \\( (-1, -1) \\):\n     \\[\n     H = \\begin',
                },
                {
                    correspondingSpanText: '\\( \\frac{\\partial^2 g}{\\partial',
                    text: '-3 & -6 \\\\\n     \\end{bmatrix}\n     \\]\n     Determinant = \\( 36 - 9 = 27 > 0 \\), but \\( \\frac{\\partial^2 g}{\\partial x^2} = -6 < 0 \\), indicating a local maximum.\n\nThus, the function \\( g(x, y) \\) has a saddle point at \\( (',
                },
            ],
            source: 'dolmino',
            textLong:
                'g}{\\partial y^2} \\\\\n   \\end{bmatrix}\n   \\]\n\n   Second derivatives:\n   \\[\n   \\frac{\\partial^2 g}{\\partial x^2} = 6x, \\quad \\frac{\\partial^2 g}{\\partial y^2} = 6y, \\quad \\frac{\\partial^2 g}{\\partial x \\partial y} = -3\n   \\]\n\n   Evaluate the Hessian at each critical point:\n   - At \\( (0, 0) \\):\n     \\[\n     H = \\begin{bmatrix}\n     0 & -3 \\\\\n     -3 & 0 \\\\\n     \\end{bmatrix}\n     \\]\n     Determinant = \\( -9 < 0 \\), indicating a saddle point.\n\n   - At \\( (1, 1) \\):\n     \\[\n     H = \\begin{bmatrix}\n     6 & -3 \\\\\n     -3 & 6 \\\\\n     \\end{bmatrix}\n     \\]\n     Determinant = \\( 36 - 9 = 27 > 0 \\), but \\( \\frac{\\partial^2 g}{\\partial x^2} = 6 > 0 \\), indicating a local minimum.\n\n   - At \\( (-1, -1) \\):\n     \\[\n     H = \\begin{bmatrix}\n     -6 & -3 \\\\\n     -3 & -6 \\\\\n     \\end{bmatrix}\n     \\]\n     Determinant = \\( 36 - 9 = 27 > 0 \\), but \\( \\frac{\\partial^2 g}{\\partial x^2} = -6 < 0 \\), indicating a local maximum.\n\nThus, the function \\( g(x, y) \\) has a saddle point at \\( (0, 0) \\), a local minimum at \\( (1, 1) \\), and a local maximum at \\( (-1, -1) \\).\n\nFinal Answer: The critical points of \\( f(x, y, z) \\) are saddle points, and \\( g(x, y) \\) has a saddle point at \\( (0, 0) \\), a local minimum at \\( (1, 1) \\), and a local maximum at \\( (-1, -1)',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '{A}^{-1} \\mathbf{A}^{-',
                ' \\mathrm{tr}(\\mathbf{A}^{-1} \\mathbf{A}^{-',
                '     \\frac{\\partial}{\\partial \\mathbf{A}} \\mathrm{tr}(\\mathbf{A}^{-1} \\mathbf{A}^{-',
            ],
            correspondingSpans: [13, 15],
            index: '3163511811',
            relevanceScore: 473.998563905731,
            snippets: [
                {
                    correspondingSpanText: '{A}^{-1} \\mathbf{A}^{-',
                    text: "lying \\(\\mathbf{A}^{-1}\\) by itself.\n\nFirst, let's calculate \\(\\mathbf{A}^{-1} \\mathbf{A}^{-1}\\):\n\n\\[ \\mathbf{A}^{-1} \\mathbf{A}^{-1} = \\begin{pmatrix} 2 & 5 \\\\ -1 & -3 \\end{pmatrix} \\begin{pmatrix} 2 & 5 \\\\ -1 & -3",
                },
                {
                    correspondingSpanText: '{A}^{-1} \\mathbf{A}^{-',
                    text: "}\\), we can compute \\( (\\mathbf{A}^2)^{-1} \\) by simply multiplying \\(\\mathbf{A}^{-1}\\) by itself.\n\nFirst, let's calculate \\(\\mathbf{A}^{-1} \\mathbf{A}^{-1}\\):\n\n\\[ \\mathbf{A}^{-1} \\mathbf{A}^{-1} = \\begin{pmatrix} 2 & 5 \\\\ -1 & -3 \\end",
                },
                {
                    correspondingSpanText: '{A}^{-1} \\mathbf{A}^{-',
                    text: '(\\mathbf{A}^2)^{-1}\\), it follows that \\((\\mathbf{A}^2)^{-1} = (\\mathbf{A} \\mathbf{A})^{-1} = \\mathbf{A}^{-1} \\mathbf{A}^{-1}\\).\n\n4. Given \\(\\mathbf{A}^{-1}\\), we can compute \\( (\\mathbf{A}^2)^{-1} \\) by simply multiplying \\(\\mathbf{A}^{-1',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                "{pmatrix}\\), we can denote the inverse of \\(\\mathbf{A}^2\\) as \\( (\\mathbf{A}^2)^{-1} \\).\n\n2. The inverse of a product of two matrices \\(\\mathbf{A}\\) and \\(\\mathbf{B}\\) (in particular \\(\\mathbf{A}\\) and itself in \\(\\mathbf{A}^2\\)) follows the rule: \\((\\mathbf{A} \\mathbf{B})^{-1} = \\mathbf{B}^{-1} \\mathbf{A}^{-1}\\).\n\n3. So for \\((\\mathbf{A} \\mathbf{A})^{-1} = (\\mathbf{A}^2)^{-1}\\), it follows that \\((\\mathbf{A}^2)^{-1} = (\\mathbf{A} \\mathbf{A})^{-1} = \\mathbf{A}^{-1} \\mathbf{A}^{-1}\\).\n\n4. Given \\(\\mathbf{A}^{-1}\\), we can compute \\( (\\mathbf{A}^2)^{-1} \\) by simply multiplying \\(\\mathbf{A}^{-1}\\) by itself.\n\nFirst, let's calculate \\(\\mathbf{A}^{-1} \\mathbf{A}^{-1}\\):\n\n\\[ \\mathbf{A}^{-1} \\mathbf{A}^{-1} = \\begin{pmatrix} 2 & 5 \\\\ -1 & -3 \\end{pmatrix} \\begin{pmatrix} 2 & 5 \\\\ -1 & -3 \\end{pmatrix} \\]\n\nWe will use Python to handle the matrix multiplication accurately.\n```python\nimport numpy as np\n\n# Define the inverse of A\nA_inv = np.array([[2, 5], [-1, -3]])\n\n# Compute the inverse of A squared\nA2_inv = np.dot(A_inv, A_inv)\nprint(A2_inv)\n```\n```output\narray([[-1, -5],\n       [ 1,  4]])\n```\nThe inverse of \\(\\mathbf{A}^2\\) is found to be:\n\n\\[ \\boxed{\\begin{pmatrix} -1 & -5 \\\\ 1 & 4 \\end{pmatrix}} \\]\n\nThis is the final answer, and it has been verified using Python for accuracy.",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['1} \\cdot \\frac{\\partial \\mathbf{'],
            correspondingSpans: [16],
            index: '3163364944',
            relevanceScore: 473.8191557404497,
            snippets: [
                {
                    correspondingSpanText: '1} \\cdot \\frac{\\partial \\mathbf{',
                    text: 'L}{\\partial \\hat{y}} \\cdot \\frac{\\partial \\hat{y}}{\\partial z_2} \\cdot \\frac{\\partial z_2}{\\partial \\mathbf{a}_1} \\cdot \\frac{\\partial \\mathbf{a}_1}{\\partial \\mathbf{z}_1} \\cdot \\frac{\\partial \\mathbf{z}_1}{\\partial \\mathbf{W}_1} \\right)\n\\]\n\n',
                },
                {
                    correspondingSpanText: '1} \\cdot \\frac{\\partial \\mathbf{',
                    text: '_2} \\cdot \\frac{\\partial z_2}{\\partial \\mathbf{a}_1} \\cdot \\frac{\\partial \\mathbf{a}_1}{\\partial \\mathbf{z}_1} \\cdot \\frac{\\partial \\mathbf{z}_1}{\\partial \\mathbf{W}_1} \\right)\n\\]\n\nSubstituting the partial derivatives:\n\\[\n\\frac{\\partial L}{\\partial \\mathbf',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                'a}_1 \\) with respect to \\( \\mathbf{z}_1 \\) (the ReLU activation):\n  \\[\n  \\frac{\\partial \\mathbf{a}_1}{\\partial \\mathbf{z}_1} = \\text{diag}(\\mathbf{z}_1 > 0)\n  \\]\n  where \\( \\text{diag}(\\mathbf{z}_1 > 0) \\) is a diagonal matrix with 1s where \\( \\mathbf{z}_1 > 0 \\) and 0s otherwise.\n\n- Finally, the derivative of \\( \\mathbf{z}_1 \\) with respect to \\( \\mathbf{W}_1 \\):\n  \\[\n  \\frac{\\partial \\mathbf{z}_1}{\\partial \\mathbf{W}_1} = \\mathbf{x}^T\n  \\]\n\nPutting it all together, we have:\n\\[\n\\frac{\\partial L}{\\partial \\mathbf{W}_1} = \\left( \\frac{\\partial L}{\\partial \\hat{y}} \\cdot \\frac{\\partial \\hat{y}}{\\partial z_2} \\cdot \\frac{\\partial z_2}{\\partial \\mathbf{a}_1} \\cdot \\frac{\\partial \\mathbf{a}_1}{\\partial \\mathbf{z}_1} \\cdot \\frac{\\partial \\mathbf{z}_1}{\\partial \\mathbf{W}_1} \\right)\n\\]\n\nSubstituting the partial derivatives:\n\\[\n\\frac{\\partial L}{\\partial \\mathbf{W}_1} = (\\hat{y} - y) \\cdot \\mathbf{W}_2 \\cdot \\text{diag}(\\mathbf{z}_1 > 0) \\cdot \\mathbf{x}^T\n\\]\n\nFinal Answer: The final answer is \\( \\frac{\\partial L}{\\partial \\mathbf{W}_1} = (\\hat{y} - y) \\cdot \\mathbf{W}_2 \\cdot \\text{diag}(\\mathbf{z}_1 > 0) \\cdot \\mathbf{x}^T \\). I hope it is correct.',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['1} \\cdot \\frac{\\partial \\mathbf{'],
            correspondingSpans: [16],
            index: '3159766779',
            relevanceScore: 473.8191557404497,
            snippets: [
                {
                    correspondingSpanText: '1} \\cdot \\frac{\\partial \\mathbf{',
                    text: 'L}{\\partial \\hat{y}} \\cdot \\frac{\\partial \\hat{y}}{\\partial z_2} \\cdot \\frac{\\partial z_2}{\\partial \\mathbf{a}_1} \\cdot \\frac{\\partial \\mathbf{a}_1}{\\partial \\mathbf{z}_1} \\cdot \\frac{\\partial \\mathbf{z}_1}{\\partial \\mathbf{W}_1} \\right)\n\\]\n\n',
                },
                {
                    correspondingSpanText: '1} \\cdot \\frac{\\partial \\mathbf{',
                    text: '_2} \\cdot \\frac{\\partial z_2}{\\partial \\mathbf{a}_1} \\cdot \\frac{\\partial \\mathbf{a}_1}{\\partial \\mathbf{z}_1} \\cdot \\frac{\\partial \\mathbf{z}_1}{\\partial \\mathbf{W}_1} \\right)\n\\]\n\nSubstituting the partial derivatives:\n\\[\n\\frac{\\partial L}{\\partial \\mathbf',
                },
            ],
            source: 'dolmino',
            textLong:
                'a}_1 \\) with respect to \\( \\mathbf{z}_1 \\) (the ReLU activation):\n  \\[\n  \\frac{\\partial \\mathbf{a}_1}{\\partial \\mathbf{z}_1} = \\text{diag}(\\mathbf{z}_1 > 0)\n  \\]\n  where \\( \\text{diag}(\\mathbf{z}_1 > 0) \\) is a diagonal matrix with 1s where \\( \\mathbf{z}_1 > 0 \\) and 0s otherwise.\n\n- Finally, the derivative of \\( \\mathbf{z}_1 \\) with respect to \\( \\mathbf{W}_1 \\):\n  \\[\n  \\frac{\\partial \\mathbf{z}_1}{\\partial \\mathbf{W}_1} = \\mathbf{x}^T\n  \\]\n\nPutting it all together, we have:\n\\[\n\\frac{\\partial L}{\\partial \\mathbf{W}_1} = \\left( \\frac{\\partial L}{\\partial \\hat{y}} \\cdot \\frac{\\partial \\hat{y}}{\\partial z_2} \\cdot \\frac{\\partial z_2}{\\partial \\mathbf{a}_1} \\cdot \\frac{\\partial \\mathbf{a}_1}{\\partial \\mathbf{z}_1} \\cdot \\frac{\\partial \\mathbf{z}_1}{\\partial \\mathbf{W}_1} \\right)\n\\]\n\nSubstituting the partial derivatives:\n\\[\n\\frac{\\partial L}{\\partial \\mathbf{W}_1} = (\\hat{y} - y) \\cdot \\mathbf{W}_2 \\cdot \\text{diag}(\\mathbf{z}_1 > 0) \\cdot \\mathbf{x}^T\n\\]\n\nFinal Answer: The final answer is \\( \\frac{\\partial L}{\\partial \\mathbf{W}_1} = (\\hat{y} - y) \\cdot \\mathbf{W}_2 \\cdot \\text{diag}(\\mathbf{z}_1 > 0) \\cdot \\mathbf{x}^T \\). I hope it is correct.',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\frac{\\partial f}{\\partial \\mathbf{A}}',
                ' Compute \\( \\frac{\\partial f}{\\partial \\mathbf{A}}',
                ' derivative \\( \\frac{\\partial f}{\\partial \\mathbf{A}}',
                ' \\frac{\\partial f}{\\partial \\mathbf{A}} = ',
            ],
            correspondingSpans: [5, 8, 11, 34],
            index: '3055216540',
            relevanceScore: 470.71755282383197,
            snippets: [
                {
                    correspondingSpanText: '\\frac{\\partial f}{\\partial \\mathbf{A}}',
                    text: 'M}$, we define the gradient of $f$ with respect to $\\mathbf{A}$ as:\n#\n# \\begin{equation*}\n# \\nabla_{\\mathbf{A}}f = \\frac{\\partial f}{\\partial \\mathbf{A}} =  \\begin{bmatrix}\n# \\frac{\\partial f}{\\partial \\mathbf{A}_{1,1}} & \\dots & \\frac{\\partial f}{\\partial \\mathbf{A',
                },
                {
                    correspondingSpanText: '\\frac{\\partial f}{\\partial \\mathbf{A}} = ',
                    text: 'M}$, we define the gradient of $f$ with respect to $\\mathbf{A}$ as:\n#\n# \\begin{equation*}\n# \\nabla_{\\mathbf{A}}f = \\frac{\\partial f}{\\partial \\mathbf{A}} =  \\begin{bmatrix}\n# \\frac{\\partial f}{\\partial \\mathbf{A}_{1,1}} & \\dots & \\frac{\\partial f}{\\partial \\mathbf{A}_{1',
                },
            ],
            source: 'starcoder',
            textLong:
                "will use is a toy dataset. We will generate $N=100$ observations with only one *feature* and a real value associated to each of them. We can view these observations as being pairs *(area of a real state in square meters, price of the real state)*. Our task is to construct a model that is able to predict the price of a real state, given its area.\n\nX, y = get_housing_prices_data(N=100)\n\n# ### Ploting the data\n\nplot_points_regression(X,\n                       y,\n                       title='Real estate prices prediction',\n                       xlabel=\"m\\u00b2\",\n                       ylabel='$')\n\n\n# ### The solution\n#\n# Given $f:\\mathbb{R}^{N\\times M} \\rightarrow \\mathbb{R}$ and $\\mathbf{A} \\in \\mathbb{R}^{N\\times M}$, we define the gradient of $f$ with respect to $\\mathbf{A}$ as:\n#\n# \\begin{equation*}\n# \\nabla_{\\mathbf{A}}f = \\frac{\\partial f}{\\partial \\mathbf{A}} =  \\begin{bmatrix}\n# \\frac{\\partial f}{\\partial \\mathbf{A}_{1,1}} & \\dots & \\frac{\\partial f}{\\partial \\mathbf{A}_{1,m}} \\\\\n# \\vdots &  \\ddots & \\vdots \\\\\n# \\frac{\\partial f}{\\partial \\mathbf{A}_{n,1}} &  \\dots & \\frac{\\partial f}{\\partial \\mathbf{A}_{n,m}}\n# \\end{bmatrix}\n# \\end{equation*}\n#\n# Let $\\mathbf{X} \\in \\mathbb{R}^{N\\times d}$ be a matrix (sometimes also called the *design matrix*) whose rows are the observations of the dataset and let $\\mathbf{y} \\in \\mathbb{R}^{N}$ be the vector consisting of all values $y^{(i)}$ (i.e., $\\mathbf{X}^{(i,:)} = \\mathbf{x}^{(i)}$ and $\\mathbf{y}^{(i)} = y^{(i)}$). It can be verified that: \n#\n# \\begin{equation}\n# J(\\mathbf{w}) = \\frac{1",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\( \\mathbf{A} \\), \\( \\mathbf{'],
            correspondingSpans: [1],
            index: '3159757927',
            relevanceScore: 470.2817310302795,
            snippets: [
                {
                    correspondingSpanText: '\\( \\mathbf{A} \\), \\( \\mathbf{',
                    text: 'the total points scored by both universities. Write the equation in the form of a matrix equation \\( \\mathbf{A}\\mathbf{x} = \\mathbf{b} \\) and identify the matrices \\( \\mathbf{A} \\), \\( \\mathbf{x} \\), and \\( \\mathbf{b} \\).\n\n2. The fan notices that the performance of teams can be influenced by several factors such as home-field advantage, weather',
                },
            ],
            source: 'dolmino',
            textLong:
                'fan is analyzing the performance of various university teams in the last season. Given that they don\u2019t know much about Texas Southern University, they decide to create a mathematical model to compare the performance of Texas Southern University with other universities.\n\n1. The fan collects data on the number of touchdowns, field goals, and extra points scored by Texas Southern University and another university of their choice over the last season. Let \\( T_{tsu} \\), \\( F_{tsu} \\), and \\( E_{tsu} \\) represent the number of touchdowns, field goals, and extra points scored by Texas Southern University respectively. Similarly, let \\( T_{other} \\), \\( F_{other} \\), and \\( E_{other} \\) represent the respective values for the other university.\n\n   Using the scoring system where a touchdown is worth 6 points, a field goal is worth 3 points, and an extra point is worth 1 point, create a linear algebraic equation that expresses the total points scored by both universities. Write the equation in the form of a matrix equation \\( \\mathbf{A}\\mathbf{x} = \\mathbf{b} \\) and identify the matrices \\( \\mathbf{A} \\), \\( \\mathbf{x} \\), and \\( \\mathbf{b} \\).\n\n2. The fan notices that the performance of teams can be influenced by several factors such as home-field advantage, weather conditions, and player injuries. They decide to perform a multivariable regression analysis to predict the total points scored by Texas Southern University in future games. Assume that the predictive model is given by:\n\n   \\[\n   P_{tsu} = \\beta_0 + \\beta_1 H + \\beta_2 W + \\beta_3 I + \\epsilon\n   \\]\n\n   where \\( P_{tsu} \\) is the total points scored by Texas Southern University, \\( H \\) is a binary variable indicating home-field advantage (1 if home, 0 if away), \\( W \\) is a variable representing weather conditions, \\( I \\) is a variable representing the number of player injuries, \\( \\beta_0, \\beta_1, \\beta_2, \\beta_3 \\) are the coefficients to be determined, and \\( \\epsilon \\) is the error term.\n\n   Given the following data from previous games:\n\n   \\[\n   \\begin{array}{|c|',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '    \\frac{\\partial^2 f}{\\partial',
                '     \\frac{\\partial^2 f}{\\partial \\mathbf{',
            ],
            correspondingSpans: [18, 20],
            index: '3163300131',
            relevanceScore: 461.5975844955481,
            snippets: [
                {
                    correspondingSpanText: '    \\frac{\\partial^2 f}{\\partial',
                    text: '0, \\pm 1\\) for all \\(i\\).\n\n2. **Determine the Hessian matrix**:\n   - Compute the second derivatives:\n     \\[\n     \\frac{\\partial^2 f}{\\partial x_i^2} = 12x_i^2 - 4\n     \\]\n   - The Hessian matrix \\(H(f)\\) is diagonal:\n     \\[',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                '1. **Find the critical points**:\n   - Compute the gradient \\(\\nabla f(\\mathbf{x})\\).\n     \\[\n     \\nabla f(\\mathbf{x}) = \\left( \\frac{\\partial f}{\\partial x_1}, \\frac{\\partial f}{\\partial x_2}, \\ldots, \\frac{\\partial f}{\\partial x_n} \\right)\n     \\]\n     \\[\n     \\frac{\\partial f}{\\partial x_i} = 4x_i^3 - 4x_i = 4x_i(x_i^2 - 1)\n     \\]\n   - Set \\(\\nabla f(\\mathbf{x}) = \\mathbf{0}\\).\n     \\[\n     4x_i(x_i^2 - 1) = 0 \\quad \\Rightarrow \\quad x_i = 0, \\, \\pm 1\n     \\]\n   - The critical points are combinations of \\(x_i = 0, \\pm 1\\) for all \\(i\\).\n\n2. **Determine the Hessian matrix**:\n   - Compute the second derivatives:\n     \\[\n     \\frac{\\partial^2 f}{\\partial x_i^2} = 12x_i^2 - 4\n     \\]\n   - The Hessian matrix \\(H(f)\\) is diagonal:\n     \\[\n     H(f)(\\mathbf{x}) = \\text{diag}(12x_1^2 - 4, 12x_2^2 - 4, \\ldots, 12x_n^2 - 4)\n     \\]\n\n3. **Evaluate the Hessian at critical points**:\n   - At \\(x_i = 0\\), the Hessian entry is \\(-4\\).\n   - At \\(x_i = \\pm 1\\), the Hessian entry is \\(8\\).\n\n4. **Identify a saddle point**:\n   - A saddle point requires both positive and negative eigenvalues. Consider \\(\\mathbf{x}^* = (0, 1, 1, \\ldots, 1)\\).\n   - For this \\(\\mathbf{x}^*\\), the Hessian is:\n     \\[\n     H(f)(\\mathbf{x}^*) = \\text',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\( \\frac{\\partial^2 g}{\\partial',
                '-order derivative \\( \\frac{\\partial^2 g}{\\partial',
                ' \\( \\frac{\\partial^2 g}{\\partial',
            ],
            correspondingSpans: [23, 29, 37],
            index: '3163252136',
            relevanceScore: 459.1164429883764,
            snippets: [
                {
                    correspondingSpanText: '\\( \\frac{\\partial^2 g}{\\partial',
                    text: '-3 & -6 \\\\\n     \\end{bmatrix}\n     \\]\n     Determinant = \\( 36 - 9 = 27 > 0 \\), but \\( \\frac{\\partial^2 g}{\\partial x^2} = -6 < 0 \\), indicating a local maximum.\n\nThus, the function \\( g(x, y) \\) has a saddle point at \\( (',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                ':\n   - At \\( (0, 0) \\):\n     \\[\n     H = \\begin{bmatrix}\n     0 & -3 \\\\\n     -3 & 0 \\\\\n     \\end{bmatrix}\n     \\]\n     Determinant = \\( -9 < 0 \\), indicating a saddle point.\n\n   - At \\( (1, 1) \\):\n     \\[\n     H = \\begin{bmatrix}\n     6 & -3 \\\\\n     -3 & 6 \\\\\n     \\end{bmatrix}\n     \\]\n     Determinant = \\( 36 - 9 = 27 > 0 \\), but \\( \\frac{\\partial^2 g}{\\partial x^2} = 6 > 0 \\), indicating a local minimum.\n\n   - At \\( (-1, -1) \\):\n     \\[\n     H = \\begin{bmatrix}\n     -6 & -3 \\\\\n     -3 & -6 \\\\\n     \\end{bmatrix}\n     \\]\n     Determinant = \\( 36 - 9 = 27 > 0 \\), but \\( \\frac{\\partial^2 g}{\\partial x^2} = -6 < 0 \\), indicating a local maximum.\n\nThus, the function \\( g(x, y) \\) has a saddle point at \\( (0, 0) \\), a local minimum at \\( (1, 1) \\), and a local maximum at \\( (-1, -1) \\).\n\nFinal Answer: The critical points of \\( f(x, y, z) \\) are saddle points, and \\( g(x, y) \\) has a saddle point at \\( (0, 0) \\), a local minimum at \\( (1, 1) \\), and a local maximum at \\( (-1, -1) \\). I hope it is correct.',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                'Compute \\( \\frac{\\partial f}{\\partial',
                ' Compute \\( \\frac{\\partial f}{\\partial \\mathbf{A}}',
                '- \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
            ],
            correspondingSpans: [8, 35],
            index: '3163313521',
            relevanceScore: 455.5873091014183,
            snippets: [
                {
                    correspondingSpanText: 'Compute \\( \\frac{\\partial f}{\\partial',
                    text: 'partial f}{\\partial x} \\):\n  \\[\n  \\frac{\\partial f}{\\partial x} = 2x - 2y - 2z\n  \\]\n\n- Compute \\( \\frac{\\partial f}{\\partial y} \\):\n  \\[\n  \\frac{\\partial f}{\\partial y} = 2y - 2x + 2z\n  \\]\n\n- Compute \\( \\',
                },
                {
                    correspondingSpanText: 'Compute \\( \\frac{\\partial f}{\\partial',
                    text: 'nabla f = \\left( \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z} \\right) \\]\n\n- Compute \\( \\frac{\\partial f}{\\partial x} \\):\n  \\[\n  \\frac{\\partial f}{\\partial x} = 2x - 2y - 2z\n  \\]\n\n- Compute \\( \\',
                },
                {
                    correspondingSpanText: 'Compute \\( \\frac{\\partial f}{\\partial',
                    text: 'partial f}{\\partial y} \\):\n  \\[\n  \\frac{\\partial f}{\\partial y} = 2y - 2x + 2z\n  \\]\n\n- Compute \\( \\frac{\\partial f}{\\partial z} \\):\n  \\[\n  \\frac{\\partial f}{\\partial z} = 2z + 2y - 2x\n  \\]\n\nThus, the gradient',
                },
                {
                    correspondingSpanText: '- \\( \\frac{\\partial^2 f}{\\partial',
                    text: 'z^2}\n\\end{bmatrix} \\]\n\nCompute the second derivatives:\n- \\( \\frac{\\partial^2 f}{\\partial x^2} = 2 \\)\n- \\( \\frac{\\partial^2 f}{\\partial y^2} = 2 \\)\n- \\( \\frac{\\partial^2 f}{\\partial z^2} = 2 \\)\n- \\( \\frac{\\partial^2 f}{\\partial',
                },
                {
                    correspondingSpanText: '- \\( \\frac{\\partial^2 f}{\\partial',
                    text: '^2 f}{\\partial z \\partial y} & \\frac{\\partial^2 f}{\\partial z^2}\n\\end{bmatrix} \\]\n\nCompute the second derivatives:\n- \\( \\frac{\\partial^2 f}{\\partial x^2} = 2 \\)\n- \\( \\frac{\\partial^2 f}{\\partial y^2} = 2 \\)\n- \\( \\frac{\\partial^2 f}{\\partial',
                },
                {
                    correspondingSpanText: '- \\( \\frac{\\partial^2 f}{\\partial',
                    text: '\\( \\frac{\\partial^2 f}{\\partial z^2} = 2 \\)\n- \\( \\frac{\\partial^2 f}{\\partial x \\partial y} = -2 \\)\n- \\( \\frac{\\partial^2 f}{\\partial x \\partial z} = -2 \\)\n- \\( \\frac{\\partial^2 f}{\\partial y \\partial z} = 2 \\)\n\nThus, the Hessian matrix',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                "\\\\ y \\\\ z \\end{bmatrix} \\). Write the transformed function \\( g(u, v, w) \\) and determine if the classification of the critical points changes under this transformation.\n<|assistant|>\nTo solve this problem, we'll tackle each part step-by-step. \n\n### Part 1: Critical Points and Classification\n\nGiven the function:\n\\[ f(x, y, z) = x^2 + y^2 + z^2 - 2xy + 2yz - 2zx \\]\n\n**Step 1: Compute the Gradient**\n\nThe gradient of \\( f \\), denoted \\( \\nabla f \\), is the vector of partial derivatives:\n\\[ \\nabla f = \\left( \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z} \\right) \\]\n\n- Compute \\( \\frac{\\partial f}{\\partial x} \\):\n  \\[\n  \\frac{\\partial f}{\\partial x} = 2x - 2y - 2z\n  \\]\n\n- Compute \\( \\frac{\\partial f}{\\partial y} \\):\n  \\[\n  \\frac{\\partial f}{\\partial y} = 2y - 2x + 2z\n  \\]\n\n- Compute \\( \\frac{\\partial f}{\\partial z} \\):\n  \\[\n  \\frac{\\partial f}{\\partial z} = 2z + 2y - 2x\n  \\]\n\nThus, the gradient is:\n\\[ \\nabla f = (2x - 2y - 2z, 2y - 2x + 2z, 2z + 2y - 2x) \\]\n\n**Step 2: Find Critical Points**\n\nSet the gradient to zero to find critical points:\n1. \\( 2x - 2y - 2z = 0 \\)\n2. \\( 2y - 2x + 2z = 0 \\)\n3. \\( 2z + 2y - 2x = 0 \\)\n\nSolving these equations:\n\nFrom equation (1): \\( x = y + z \\)\n\nSubstitute \\( x = y + z \\) into equation (",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                'Compute \\( \\frac{\\partial f}{\\partial',
                ' Compute \\( \\frac{\\partial f}{\\partial \\mathbf{A}}',
                '- \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
            ],
            correspondingSpans: [8, 35],
            index: '3159683551',
            relevanceScore: 454.5309322139791,
            snippets: [
                {
                    correspondingSpanText: 'Compute \\( \\frac{\\partial f}{\\partial',
                    text: 'partial f}{\\partial x} \\):\n  \\[\n  \\frac{\\partial f}{\\partial x} = 2x - 2y - 2z\n  \\]\n\n- Compute \\( \\frac{\\partial f}{\\partial y} \\):\n  \\[\n  \\frac{\\partial f}{\\partial y} = 2y - 2x + 2z\n  \\]\n\n- Compute \\( \\',
                },
                {
                    correspondingSpanText: 'Compute \\( \\frac{\\partial f}{\\partial',
                    text: 'nabla f = \\left( \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z} \\right) \\]\n\n- Compute \\( \\frac{\\partial f}{\\partial x} \\):\n  \\[\n  \\frac{\\partial f}{\\partial x} = 2x - 2y - 2z\n  \\]\n\n- Compute \\( \\',
                },
                {
                    correspondingSpanText: 'Compute \\( \\frac{\\partial f}{\\partial',
                    text: 'partial f}{\\partial y} \\):\n  \\[\n  \\frac{\\partial f}{\\partial y} = 2y - 2x + 2z\n  \\]\n\n- Compute \\( \\frac{\\partial f}{\\partial z} \\):\n  \\[\n  \\frac{\\partial f}{\\partial z} = 2z + 2y - 2x\n  \\]\n\nThus, the gradient',
                },
                {
                    correspondingSpanText: '- \\( \\frac{\\partial^2 f}{\\partial',
                    text: '- \\( \\frac{\\partial^2 f}{\\partial y^2} = 2 \\)\n- \\( \\frac{\\partial^2 f}{\\partial z^2} = 2 \\)\n- \\( \\frac{\\partial^2 f}{\\partial x \\partial y} = -2 \\)\n- \\( \\frac{\\partial^2 f}{\\partial x \\partial z} = -2 \\)\n- \\( \\frac{\\partial^2 f',
                },
                {
                    correspondingSpanText: '- \\( \\frac{\\partial^2 f}{\\partial',
                    text: '- \\( \\frac{\\partial^2 f}{\\partial x^2} = 2 \\)\n- \\( \\frac{\\partial^2 f}{\\partial y^2} = 2 \\)\n- \\( \\frac{\\partial^2 f}{\\partial z^2} = 2 \\)\n- \\( \\frac{\\partial^2 f}{\\partial x \\partial y} = -2 \\)\n- \\( \\frac{\\partial^2 f}{\\',
                },
                {
                    correspondingSpanText: '- \\( \\frac{\\partial^2 f}{\\partial',
                    text: '\\( \\frac{\\partial^2 f}{\\partial z^2} = 2 \\)\n- \\( \\frac{\\partial^2 f}{\\partial x \\partial y} = -2 \\)\n- \\( \\frac{\\partial^2 f}{\\partial x \\partial z} = -2 \\)\n- \\( \\frac{\\partial^2 f}{\\partial y \\partial z} = 2 \\)\n\nThus, the Hessian matrix',
                },
            ],
            source: 'dolmino',
            textLong:
                "A \\begin{bmatrix} x \\\\ y \\\\ z \\end{bmatrix} \\). Write the transformed function \\( g(u, v, w) \\) and determine if the classification of the critical points changes under this transformation.\nTo solve this problem, we'll tackle each part step-by-step. \n\n### Part 1: Critical Points and Classification\n\nGiven the function:\n\\[ f(x, y, z) = x^2 + y^2 + z^2 - 2xy + 2yz - 2zx \\]\n\n**Step 1: Compute the Gradient**\n\nThe gradient of \\( f \\), denoted \\( \\nabla f \\), is the vector of partial derivatives:\n\\[ \\nabla f = \\left( \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z} \\right) \\]\n\n- Compute \\( \\frac{\\partial f}{\\partial x} \\):\n  \\[\n  \\frac{\\partial f}{\\partial x} = 2x - 2y - 2z\n  \\]\n\n- Compute \\( \\frac{\\partial f}{\\partial y} \\):\n  \\[\n  \\frac{\\partial f}{\\partial y} = 2y - 2x + 2z\n  \\]\n\n- Compute \\( \\frac{\\partial f}{\\partial z} \\):\n  \\[\n  \\frac{\\partial f}{\\partial z} = 2z + 2y - 2x\n  \\]\n\nThus, the gradient is:\n\\[ \\nabla f = (2x - 2y - 2z, 2y - 2x + 2z, 2z + 2y - 2x) \\]\n\n**Step 2: Find Critical Points**\n\nSet the gradient to zero to find critical points:\n1. \\( 2x - 2y - 2z = 0 \\)\n2. \\( 2y - 2x + 2z = 0 \\)\n3. \\( 2z + 2y - 2x = 0 \\)\n\nSolving these equations:\n\nFrom equation (1): \\( x = y + z \\)\n\nSubstitute \\( x = y + z \\) into equation (",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '{A}^{-1} \\mathbf{A}^{-',
                '     \\frac{\\partial}{\\partial \\mathbf{A}} \\mathrm{tr}(\\mathbf{A}^{-1} \\mathbf{A}^{-',
            ],
            correspondingSpans: [13, 15],
            index: '2956169109',
            relevanceScore: 451.0265378406632,
            snippets: [
                {
                    correspondingSpanText: '{A}^{-1} \\mathbf{A}^{-',
                    text: "\\mathbf{A}^{-1}\\right]\n\\equiv f({\\bf k}')\\mathbf{M},\n\\end{equation}\nwhere we define $\\mathbf{M} =\\mathbf{A}^{-1} \\mathbf{A}^{-1} $ and $f({\\bf k}') =  k'^{2} S(\\mathbf{A}^{-1} {\\bf k}') / |\\mathbf{A}^{-1} {\\",
                },
            ],
            source: 'open-web-math',
            textLong:
                "\\Rightarrow\\quad\n  \\mathbf{s}^f({\\bf q})=-\\mathbf{A} \\mathbf{\\tilde S}_{*}{\\bf\\Psi}(\\mathbf{A}^{-1}{\\bf q})\n    \\label{shift}\n\\end{equation}\nwhere the configuration-space expression $\\mathbf{\\tilde S}_{*}{\\bf\\Psi} \\equiv \\mathbf{\\tilde S} \\ast {\\bf\\Psi}$ is short for a convolution corresponding to the multiplication in Fourier space.\nWe note that in terms of the argument $ {\\bf k}'=\\mathbf{A}{\\bf k}$ of the Fourier transform of ${\\bf\\Psi}$, $\\mathbf{S}$ corresponds to \n\\begin{equation}\n\\mathbf{S}({\\bf k}' ) =\\left[ \\frac{  k^{'2} S(\\mathbf{A}^{-1} {\\bf k}')}{|\\mathbf{A}^{-1} {\\bf k}' |^2}    \\mathbf{A}^{-1}  \\mathbf{A}^{-1}\\right]\n\\equiv f({\\bf k}')\\mathbf{M},\n\\end{equation}\nwhere we define $\\mathbf{M} =\\mathbf{A}^{-1} \\mathbf{A}^{-1} $ and $f({\\bf k}') =  k'^{2} S(\\mathbf{A}^{-1} {\\bf k}') / |\\mathbf{A}^{-1} {\\bf k}' |^2$.\n\nThe displaced and shifted fields now become\n\\begin{equation}\n\\delta^f_s({\\bf k}) = \\int d^3q e^{-i {\\bf k} \\cdot {\\bf q}} \\left( e^{-i {\\bf k}\\cdot\\left[ - \\mathbf{A}\\mathbf{\\tilde S}_{*}  {\\bf\\Psi}(\\mathbf{A}^{-1}  {\\bf q})\\right]} -1\\right\n\\end{equation}\nand\n\\begin{equation}\n\\delta^f_d({\\bf k}) = \\int d^3q e^{-i {\\bf k} \\cdot {\\bf q}} \\left( e^{-i {\\bf k} \\cdot \\left[ \\mathbf{A} {\\bf\\Psi}(\\mathbf{A}^{-1}  {\\bf q})  -\\mathbf{A} \\mathbf{\\tilde S}_{*}{\\bf\\Psi}(\\mathbf{A}^{-1}",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['{A}) = \\det(\\mathbf{A})'],
            correspondingSpans: [24],
            index: '2951491635',
            relevanceScore: 448.958370778586,
            snippets: [
                {
                    correspondingSpanText: '{A}) = \\det(\\mathbf{A})',
                    text: '}\nThe adjugate $ \\operatorname{adj}(\\mathbf{A})$ of a matrix $\\mathbf{A}$ is defined through the relation $\\mathbf{A} \\operatorname{adj}(\\mathbf{A}) = \\det(\\mathbf{A}) \\, \\mathbf{I}$.\nNotice that a semipositive-definite matrix is copositive, therefore a semipositive-definite $\\mathbf{\\Lambda}$ is sufficient',
                },
            ],
            source: 'arxiv',
            textLong:
                'emph{Hadamard power} is given by $(\\mathbf{A}^{\\circ n})_{ij} = A_{ij}^{n}$.\n\nThe potential is required to be bounded from below, for which a necessary and sufficient condition is that the matrix $\\mathbf{\\Lambda}$ be copositive \\cite{Kannike:2012pe}. This can be ascertained via the Cottle-Habetler-Lemke theorem \\cite{Cottle1970295}: Suppose that the order $n-1$ principal submatrices of a real symmetric matrix $\\mathbf{A}$ of order $n$ are copositive. Then $\\mathbf{A}$ is copositive if and only if \n\\begin{equation}\n  \\det (\\mathbf{A}) \\geq 0 \\quad \\lor \\quad \\text{some element(s) of } \\operatorname{adj} \\mathbf{A} < 0.\n\\end{equation}\nThe adjugate $ \\operatorname{adj}(\\mathbf{A})$ of a matrix $\\mathbf{A}$ is defined through the relation $\\mathbf{A} \\operatorname{adj}(\\mathbf{A}) = \\det(\\mathbf{A}) \\, \\mathbf{I}$.\nNotice that a semipositive-definite matrix is copositive, therefore a semipositive-definite $\\mathbf{\\Lambda}$ is sufficient for the stability of the potential.\n\nThe norm of $\\mathbf{\\Phi}$ can be expressed through its Hadamard square as\n\\begin{equation}\n  \\mathbf{\\Phi}^{T} \\mathbf{\\Phi} = \\mathbf{e}^{T} \\mathbf{\\Phi}^{\\circ 2},\n\\label{eq:norm}  \n\\end{equation}\nwhere $\\mathbf{e}= (1, \\ldots, 1)^{T}$, the vector of ones, is an identity element of the Hadamard product. The relation \\eqref{eq:norm} is quadratic in the field $\\mathbf{\\Phi}$ but only linear in $\\mathbf{\\Phi}^{\\circ 2}$.\n\nWe restrict the potential \\eqref{eq:biq:pot} to the unit hypersphere by means of a Lagrange multiplier,\n\\begin{equation}\n  V(\\mathbf{N}, \\lambda) = (\\mathbf{N}^{\\circ 2})^T \\mathbf{\\Lambda} \\',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['derivative \\( \\frac{\\partial f}{\\partial'],
            correspondingSpans: [11],
            index: '2951421201',
            relevanceScore: 446.02579957574545,
            snippets: [
                {
                    correspondingSpanText: 'derivative \\( \\frac{\\partial f}{\\partial',
                    text: '1}{2}\\left(q^{\\imath} + q^{\\jmath} + q^{\\kappa} -q \\right)  \\). In this way, we can  write the partial derivative \\( \\frac{\\partial f}{\\partial q}     \\) and its conjugate $\\left(\\frac{\\partial f}{\\partial q}\\right)^*$ as\n\\begin{equation}\n \\frac{\\partial f}{\\partial q} =',
                },
            ],
            source: 'arxiv',
            textLong:
                'atives is rigorous and has provided a quantum step forward in the derivation of stochastic gradient algorithms in the quaternion domain. However, despite its mathematical correctness it does not necessarily equip the quaternion domain with algorithms that are generic extensions of its real- and complex- valued counterparts, the LMS or CLMS (as seen from \\cite{Clive_QLMS_2009} and (\\ref{Eq:QLMS:w(k+1)Final})). It is therefore necessary to introduce a novel gradient definition that not only unifies the QLMS algorithms but also simplifies into CLMS and LMS for lower dimensional data. To that end, consider  the involution based representation in (\\ref{eq:involution}), where \\( q= \\frac{1}{2}\\left(q ^{{\\imath}^*} + q ^{{\\jmath}^*} + q ^{{\\kappa}^*} -q^* \\right)  \\) and \\( q^*= \\frac{1}{2}\\left(q^{\\imath} + q^{\\jmath} + q^{\\kappa} -q \\right)  \\). In this way, we can  write the partial derivative \\( \\frac{\\partial f}{\\partial q}     \\) and its conjugate $\\left(\\frac{\\partial f}{\\partial q}\\right)^*$ as\n\\begin{equation}\n \\frac{\\partial f}{\\partial q} =   \\frac{1}{2} \\left(  \\left(\\frac{\\partial f}{\\partial q}\\right) ^{{\\imath}^*} + \\left(\\frac{\\partial f}{\\partial q}\\right) ^{{\\jmath}^*} + \\left(\\frac{\\partial f}{\\partial q}\\right) ^{{\\kappa}^*} - \\left(\\frac{\\partial f}{\\partial q}\\right)^*   \\right)\n \\label{Eq:SimpleQLMS:df/dq}\n \\end{equation}\n\\begin{equation}\n \\left(\\frac{\\partial f}{\\partial q}\\right)^* =   \\frac{1}{2} \\left(  \\left(\\frac{\\partial f}{\\partial q}\\right)^{\\imath} + \\left(\\frac{\\partial f}{\\partial q}\\right)^{\\jmath} + \\left(\\frac{\\partial f}{\\partial q}\\right)^{\\kappa} - \\frac{\\partial f}{\\partial q}   \\right)\n \\label',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\) and \\( \\frac{\\partial^2 f}{\\partial',
                ' \\) and \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
            ],
            correspondingSpans: [9],
            index: '3162905377',
            relevanceScore: 442.91983866863427,
            snippets: [
                {
                    correspondingSpanText: '\\) and \\( \\frac{\\partial^2 f}{\\partial',
                    text: '}(a,b) - \\left(\\frac{\\partial^2 f}{\\partial x \\partial y}(a,b)\\right)^2 \\)\n\n    * If \\( D > 0 \\) and \\( \\frac{\\partial^2 f}{\\partial x^2}(a,b) > 0 \\), then \\((a,b)\\) is a local minimum.\n    * If \\( D > 0 \\) and \\( \\frac{\\',
                },
                {
                    correspondingSpanText: '\\) and \\( \\frac{\\partial^2 f}{\\partial',
                    text: 'partial^2 f}{\\partial x^2}(a,b) > 0 \\), then \\((a,b)\\) is a local minimum.\n    * If \\( D > 0 \\) and \\( \\frac{\\partial^2 f}{\\partial x^2}(a,b) < 0 \\), then \\((a,b)\\) is a local maximum.\n    * If \\( D < 0 \\), then \\((a',
                },
            ],
            source: 'olmo-2-1124-13b-preference-mix',
            textLong:
                "  Solving this system of equations analytically can be challenging.  We can use numerical methods or graphing calculators to find approximate solutions for \\(x\\) and \\(y\\) that satisfy both equations. These solutions will be the critical points.\n\n* **Step 3: Find the second partial derivatives.**\n\n  We need the second partial derivatives to apply the second partials test:\n\n   * \\( \\frac{\\partial^2 f}{\\partial x^2} \\)\n   * \\( \\frac{\\partial^2 f}{\\partial y^2} \\)\n   * \\( \\frac{\\partial^2 f}{\\partial x \\partial y} \\)\n\n* **Step 4: Apply the second partials test.**\n\n   For each critical point \\((a,b)\\), calculate the discriminant:\n\n   \\( D = \\frac{\\partial^2 f}{\\partial x^2}(a,b) \\frac{\\partial^2 f}{\\partial y^2}(a,b) - \\left(\\frac{\\partial^2 f}{\\partial x \\partial y}(a,b)\\right)^2 \\)\n\n    * If \\( D > 0 \\) and \\( \\frac{\\partial^2 f}{\\partial x^2}(a,b) > 0 \\), then \\((a,b)\\) is a local minimum.\n    * If \\( D > 0 \\) and \\( \\frac{\\partial^2 f}{\\partial x^2}(a,b) < 0 \\), then \\((a,b)\\) is a local maximum.\n    * If \\( D < 0 \\), then \\((a,b)\\) is a saddle point.\n    * If \\(D = 0\\), the test is inconclusive.\n\n **2. Calculating the Total Energy (Double Integral)** \n\nTo compute the double integral  \\( \\iint_{R} f(x, y)^2 \\, dA \\), we'll follow these steps:\n\n* **Step 1: Set up the integral.**\n\n   \\( \\iint_{R} f(x, y)^2 \\, dA = \\int_{-2}^{2} \\int_{-2}^{2} [e^{-(x^2 + y^2)} \\sin(2\\pi x) \\cos(2\\pi y)]^2 \\, dx \\, dy \\)\n\n",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\frac{\\partial f}{\\partial \\mathbf{A}}',
                ' Compute \\( \\frac{\\partial f}{\\partial \\mathbf{A}}',
                ' derivative \\( \\frac{\\partial f}{\\partial \\mathbf{A}}',
                ' \\frac{\\partial f}{\\partial \\mathbf{A}} = ',
            ],
            correspondingSpans: [5, 8, 11, 34],
            index: '2950234654',
            relevanceScore: 436.5761611182406,
            snippets: [
                {
                    correspondingSpanText: '\\frac{\\partial f}{\\partial \\mathbf{A}}',
                    text: 'N\\times M}$, we define the gradient of $f$ with respect to $\\mathbf{A}$ as:\n\n\\begin{equation*}\n\\nabla_{\\mathbf{A}}f = \\frac{\\partial f}{\\partial \\mathbf{A}} =  \\begin{bmatrix}\n\\frac{\\partial f}{\\partial \\mathbf{A}_{1,1}} & \\dots & \\frac{\\partial f}{\\partial \\mathbf{A}_{',
                },
                {
                    correspondingSpanText: '\\frac{\\partial f}{\\partial \\mathbf{A}} = ',
                    text: 'N\\times M}$, we define the gradient of $f$ with respect to $\\mathbf{A}$ as:\n\n\\begin{equation*}\n\\nabla_{\\mathbf{A}}f = \\frac{\\partial f}{\\partial \\mathbf{A}} =  \\begin{bmatrix}\n\\frac{\\partial f}{\\partial \\mathbf{A}_{1,1}} & \\dots & \\frac{\\partial f}{\\partial \\mathbf{A}_{1,',
                },
            ],
            source: 'algebraic-stack',
            textLong:
                "1)\n    y shape = (100, 1)\n    \n    X: mean 645.0, sdt 323.65, max 1200.00, min 90.00\n    y: mean 44221.50, sdt 16674.25, max 79182.43, min 12196.20\n\n\n### Ploting the data\n\n\n```python\nplot_points_regression(X,\n                       y,\n                       title='Real estate prices prediction',\n                       xlabel=\"m\\u00b2\",\n                       ylabel='$')\n```\n\n### The solution\n\nGiven $f:\\mathbb{R}^{N\\times M} \\rightarrow \\mathbb{R}$ and $\\mathbf{A} \\in \\mathbb{R}^{N\\times M}$, we define the gradient of $f$ with respect to $\\mathbf{A}$ as:\n\n\\begin{equation*}\n\\nabla_{\\mathbf{A}}f = \\frac{\\partial f}{\\partial \\mathbf{A}} =  \\begin{bmatrix}\n\\frac{\\partial f}{\\partial \\mathbf{A}_{1,1}} & \\dots & \\frac{\\partial f}{\\partial \\mathbf{A}_{1,m}} \\\\\n\\vdots &  \\ddots & \\vdots \\\\\n\\frac{\\partial f}{\\partial \\mathbf{A}_{n,1}} &  \\dots & \\frac{\\partial f}{\\partial \\mathbf{A}_{n,m}}\n\\end{bmatrix}\n\\end{equation*}\n\nLet $\\mathbf{X} \\in \\mathbb{R}^{N\\times d}$ be a matrix (sometimes also called the *design matrix*) whose rows are the observations of the dataset and let $\\mathbf{y} \\in \\mathbb{R}^{N}$ be the vector consisting of all values $y^{(i)}$ (i.e., $\\mathbf{X}^{(i,:)} = \\mathbf{x}^{(i)}$ and $\\mathbf{y}^{(i)} = y^{(i)}$). It can be verified that: \n\n\\begin{equation}\nJ(\\mathbf{w}) = \\frac{1}{N}(\\mathbf{X}\\mathbf{w",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['**Determinant**: The determinant of a square matrix'],
            correspondingSpans: [4],
            index: '3139452663',
            relevanceScore: 436.34950887673926,
            snippets: [
                {
                    correspondingSpanText: '**Determinant**: The determinant of a square matrix',
                    text: '\u03bb.\n* **Trace**: The trace of a square matrix A, denoted tr(A), is the sum of elements along its main diagonal (from top left to bottom right).\n* **Determinant**: The determinant of a square matrix A, denoted det(A), measures the scaling factor when A linearly transforms space. If det(A) > 0, A preserves orientation; if det(A) < ',
                },
            ],
            source: 'dolmino',
            textLong:
                " To determine whether a 3x3 matrix has a positive eigenvalue, we can utilize several criteria involving the matrix's trace and determinant. Eigenvalues play a crucial role in linear algebra since they reveal important information about a given square matrix, including its transformation properties and stability. We will delve into these concepts and their applications while exploring conditions for positive eigenvalues.\n\nFirstly, let us define some essential terms:\n\n* **Eigenvalue**: An eigenvalue of a square matrix A is a scalar \u03bb such that Ax = \u03bbx for some nonzero vector x. Here, x is called the eigenvector associated with \u03bb.\n* **Trace**: The trace of a square matrix A, denoted tr(A), is the sum of elements along its main diagonal (from top left to bottom right).\n* **Determinant**: The determinant of a square matrix A, denoted det(A), measures the scaling factor when A linearly transforms space. If det(A) > 0, A preserves orientation; if det(A) < 0, A reverses orientation.\n\nNow, onto our primary question\u2014whether we can ascertain if a 3x3 matrix contains a positive eigenvalue based on its trace and determinant. Indeed, there exists a useful connection between these quantities and the eigenvalues themselves:\n\n1. **Trace relationship**: The trace of a matrix equals the sum of all its eigenvalues (counting multiplicities). Specifically, if A is a 3x3 matrix, then\n   tr(A) = \u03bb\u2081 + \u03bb\u2082 + \u03bb\u2083,\n   where \u03bb\u2081, \u03bb\u2082, and \u03bb\u2083 denote the eigenvalues of A. Consequently, having a positive trace does guarantee the existence of at least one positive eigenvalue among them. However, note that the reverse is not generally valid; e.g., consider a matrix with eigenvalues {-2, 1, 1}. Its trace is zero despite having two positive eigenvalues.\n\n2. **Determinant relationship**:",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\frac{\\partial f}{\\partial \\mathbf{A}}',
                ' Compute \\( \\frac{\\partial f}{\\partial \\mathbf{A}}',
                ' derivative \\( \\frac{\\partial f}{\\partial \\mathbf{A}}',
                ' \\frac{\\partial f}{\\partial \\mathbf{A}} = ',
            ],
            correspondingSpans: [5, 8, 11, 34],
            index: '2950241447',
            relevanceScore: 436.3258038163042,
            snippets: [
                {
                    correspondingSpanText: '\\frac{\\partial f}{\\partial \\mathbf{A}}',
                    text: 'N\\times M}$, we define the gradient of $f$ with respect to $\\mathbf{A}$ as:\n\n\\begin{equation*}\n\\nabla_{\\mathbf{A}}f = \\frac{\\partial f}{\\partial \\mathbf{A}} =  \\begin{bmatrix}\n\\frac{\\partial f}{\\partial \\mathbf{A}_{1,1}} & \\dots & \\frac{\\partial f}{\\partial \\mathbf{A}_{',
                },
                {
                    correspondingSpanText: '\\frac{\\partial f}{\\partial \\mathbf{A}} = ',
                    text: 'N\\times M}$, we define the gradient of $f$ with respect to $\\mathbf{A}$ as:\n\n\\begin{equation*}\n\\nabla_{\\mathbf{A}}f = \\frac{\\partial f}{\\partial \\mathbf{A}} =  \\begin{bmatrix}\n\\frac{\\partial f}{\\partial \\mathbf{A}_{1,1}} & \\dots & \\frac{\\partial f}{\\partial \\mathbf{A}_{1,',
                },
            ],
            source: 'algebraic-stack',
            textLong:
                ", 1)\n    y shape = (100, 1)\n    \n    X: mean 645.0, sdt 323.65, max 1200.00, min 90.00\n    y: mean 44003.19, sdt 17195.94, max 79998.91, min 5441.34\n\n\n### Ploting the data\n\n\n```python\nplot_points_regression(X,\n                       y,\n                       title='Real estate prices prediction',\n                       xlabel=\"m\\u00b2\",\n                       ylabel='$')\n```\n\n### The solution\n\nGiven $f:\\mathbb{R}^{N\\times M} \\rightarrow \\mathbb{R}$ and $\\mathbf{A} \\in \\mathbb{R}^{N\\times M}$, we define the gradient of $f$ with respect to $\\mathbf{A}$ as:\n\n\\begin{equation*}\n\\nabla_{\\mathbf{A}}f = \\frac{\\partial f}{\\partial \\mathbf{A}} =  \\begin{bmatrix}\n\\frac{\\partial f}{\\partial \\mathbf{A}_{1,1}} & \\dots & \\frac{\\partial f}{\\partial \\mathbf{A}_{1,m}} \\\\\n\\vdots &  \\ddots & \\vdots \\\\\n\\frac{\\partial f}{\\partial \\mathbf{A}_{n,1}} &  \\dots & \\frac{\\partial f}{\\partial \\mathbf{A}_{n,m}}\n\\end{bmatrix}\n\\end{equation*}\n\nLet $\\mathbf{X} \\in \\mathbb{R}^{N\\times d}$ be a matrix (sometimes also called the *design matrix*) whose rows are the observations of the dataset and let $\\mathbf{y} \\in \\mathbb{R}^{N}$ be the vector consisting of all values $y^{(i)}$ (i.e., $\\mathbf{X}^{(i,:)} = \\mathbf{x}^{(i)}$ and $\\mathbf{y}^{(i)} = y^{(i)}$). It can be verified that: \n\n\\begin{equation}\nJ(\\mathbf{w}) = \\frac{1}{N}(\\mathbf{X}\\mathbf{w",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\frac{\\partial^2 f}{\\partial \\mathbf{',
                ' \\) and \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
                '-order derivative \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
                '     \\frac{\\partial^2 f}{\\partial \\mathbf{',
                '- \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
            ],
            correspondingSpans: [6, 9, 17, 18, 20, 35],
            index: '2956125906',
            relevanceScore: 433.15086656267283,
            snippets: [
                {
                    correspondingSpanText: '\\frac{\\partial^2 f}{\\partial \\mathbf{',
                    text: '$-dim input $\\mathbf{x}$ is defined by\n\\begin{equation}\n    \\label{eq:definition_hessian}\n    H = \n    \\left( \\frac{\\partial^2 f}{\\partial \\mathbf{x}_{[i]} \\mathbf{x}_{[j]}} \\right)\n    \\in\\mathbb{R}^{d\\times d},\n\\end{equation}\nwhere $\\',
                },
            ],
            source: 'open-web-math',
            textLong:
                "by fine-tuning the model structure \\cite{dombrowski2019explanations,dombrowski2021towards}, training with adversarial samples \\cite{madry2017towards} or adding smoothing regularizers \\cite{dombrowski2021towards,wang2020smoothed,moosavi2019robustness}.\nWe focus on adding smoothing regularizers for robustness.\n\n\\subsection{Hessian-Free Smoothing}\n\\label{sec:hvp}\nA strategy for more robust explanations is smoothing the target model's curvature,\nwhich can be depicted by the Hessian matrix $H$ \\cite{moosavi2019robustness,dombrowski2021towards}.\nThe Hessian of a function $f(x)$ with respect to a $d$-dim input $\\mathbf{x}$ is defined by\n\\begin{equation}\n    \\label{eq:definition_hessian}\n    H = \n    \\left( \\frac{\\partial^2 f}{\\partial \\mathbf{x}_{[i]} \\mathbf{x}_{[j]}} \\right)\n    \\in\\mathbb{R}^{d\\times d},\n\\end{equation}\nwhere $\\mathbf{x}_{[i]}$ denotes the $i$-th entry of $\\mathbf{x}$.\nDue to the heavy calculation of Hessian matrix,\nrecent researches \\cite{moosavi2019robustness,pearlmutter1994fast} apply \na Hessian-free method to compute the multiplication of the Hessian matrix and any vector $\\mathbf{v}$ as\n\\begin{equation}\n    \\label{eq:hessian_vector_product_fd}\n    H\\mathbf{v} = \\lim_{h\\to0} \\frac{\\nabla f(\\mathbf{x}+h\\mathbf{v}) - \\nabla f(\\mathbf{x})}{h}\n    \\approx \\frac{\\nabla f(\\mathbf{x}+h\\mathbf{v}) - \\nabla f(\\mathbf{x})}{h}.\n\\end{equation}\nIn practice, \n$H\\mathbf{",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '    \\frac{\\partial}{\\partial \\mathbf{',
                '     \\frac{\\partial}{\\partial \\mathbf{A}}',
            ],
            correspondingSpans: [15, 31],
            index: '2950899765',
            relevanceScore: 432.88054984414896,
            snippets: [
                {
                    correspondingSpanText: '    \\frac{\\partial}{\\partial \\mathbf{',
                    text: '}^{(k)}\\right), \\label{eq:part_deriv}\n\\end{align}\nwhere we have used the well-known matrix calculus rule\n\\begin{align}\n     \\frac{\\partial}{\\partial \\mathbf{X}}\\Tr\\left(\\mathbf{X}\\mathbf{W}\\right)=\\mathbf{W}^T.\n\\end{align}\n\n\n\nThe corresponding procedure is depicted in graph',
                },
            ],
            source: 'algebraic-stack',
            textLong:
                ')\\right)\\phi^T(x_n)\\right) \\nonumber \\\\\n                 &=\\Tr\\left(\\mathbf{A}^{(n)}\\left(\\bigcircledast_{\\substack{k=1 \\\\ k\\neq n}}^N\\mathbf{A}^{(k)T} \\phi(x_k)\\right)\\phi^T(x_n)\\right),\n\\end{align}\nwhere $\\Tr(\\cdot)$ denotes the trace operator of which its cyclic property is used here.\n\nThe partial derivative of the prediction w.r.t. the $n$\\textsuperscript{th} factor matrix $ \\mathbf{A}^{(n)}$ is then given by\n\\begin{align} \n    \\frac{\\partial f(\\mathbf{x})}{\\partial \\mathbf{A}^{(n)}}=\\phi(x_n)\\left(\\bigcircledast_{\\substack{k=1 \\\\ k\\neq n}}^N\\phi^T(x_k)\\mathbf{A}^{(k)}\\right), \\label{eq:part_deriv}\n\\end{align}\nwhere we have used the well-known matrix calculus rule\n\\begin{align}\n     \\frac{\\partial}{\\partial \\mathbf{X}}\\Tr\\left(\\mathbf{X}\\mathbf{W}\\right)=\\mathbf{W}^T.\n\\end{align}\n\n\n\nThe corresponding procedure is depicted in graphical notation in Fig. \\ref{fig:learning_algo}. Notice that a naive implementation of (\\ref{eq:part_deriv}) could lead to a computational complexity of $\\mathcal{O}(NRd)$ for obtaining the partial derivative w.r.t. each factor matrix and thus, a total of $\\mathcal{O}(N^2Rd)$ w.r.t. to all factors. The quadratic scaling with $N$ is due to the repetition of the same matrix-vector products as we take the derivative w.r.t. different factors, which can be avoided by storing these products. This leads to the proposed Algorithm \\ref{algo:learning}, which has a complexity of $\\mathcal{O}(NRd)$.\n\n\\begin{algorithm}\n\\SetAlgoLined\n\\textbf{Input}: Data point $\\mathbf{x}\\in\\mathbb{R}^N$ and factor matrices $\\mathbf{A}^{(n)}\\in\\mathbb{R}^{',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\frac{\\partial}{\\partial \\mathbf{A}}',
                '     \\frac{\\partial}{\\partial \\mathbf{A}}',
            ],
            correspondingSpans: [31],
            index: '2957064517',
            relevanceScore: 430.5115756029332,
            snippets: [
                {
                    correspondingSpanText: '\\frac{\\partial}{\\partial \\mathbf{A}}',
                    text: 'lagr_mult_pf_1}\n\\begin{split}\n\\frac{\\partial \\partition{\\mathbf{A}}}{\\partial \\mathbf{A}} &= \\int_{\\Sp} \\frac{\\partial}{\\partial \\mathbf{A}} \\left( \\mathbf{p}\\tp \\mathbf{A} \\mathbf{p} \\right) \\exp \\left( \\mathbf{p}\\tp \\mathbf{A} \\mathbf',
                },
                {
                    correspondingSpanText: '\\frac{\\partial}{\\partial \\mathbf{A}}',
                    text: 'equation}\\label{eqn:Newton_bilinear_form}\n\\begin{split}\nm_{\\mathbf{A}} (\\mathbf{P}, \\mathbf{T}) &:= \\frac{\\partial}{\\partial \\mathbf{A}} F_{\\mathbf{Q}}(\\mathbf{A};\\mathbf{P}) \\dd \\mathbf{T} \\\\\n&= \\frac{1}{\\partition{\\mathbf{A}}} \\mathbf{P',
                },
            ],
            source: 'open-web-math',
            textLong:
                'equation}\nwhere the $e^{c}$ term cancels out.  Since the minimizer is unique, we have proven \\eqref{eqn:fbulk_density}.  The second KKT condition simply recovers the constraint $\\mathbf{0} = \\partial \\Lagr{\\omega}{\\mathbf{A}} / \\partial \\mathbf{A} = \\Constr{\\omega}$.\n\n\\textbf{Step 4.} Finally, the last step in the inversion is an equation to determine $\\mathbf{A} \\in \\vXi$.  Starting from the relation $\\partition{\\mathbf{A}} = \\int_{\\Sp} \\exp \\left( \\mathbf{p}\\tp \\mathbf{A} \\mathbf{p} \\right) \\dA{\\mathbf{p}}$, we first differentiate with respect $\\mathbf{A}$ but in the direction of general symmetric matrices, not necessarily trace free:\n\\begin{equation}\\label{eqn:implicit_eqn_lagr_mult_pf_1}\n\\begin{split}\n\\frac{\\partial \\partition{\\mathbf{A}}}{\\partial \\mathbf{A}} &= \\int_{\\Sp} \\frac{\\partial}{\\partial \\mathbf{A}} \\left( \\mathbf{p}\\tp \\mathbf{A} \\mathbf{p} \\right) \\exp \\left( \\mathbf{p}\\tp \\mathbf{A} \\mathbf{p} \\right) \\dA{\\mathbf{p}} = \\int_{\\Sp} \\left( \\mathbf{p} \\otimes \\mathbf{p} \\right) \\exp \\left( \\mathbf{p}\\tp \\mathbf{A} \\mathbf{p} \\right) \\dA{\\mathbf{p}} \\\\\n&= \\int_{\\Sp} \\left( \\mathbf{p} \\otimes \\mathbf{p} - \\frac{1}{3} \\mathbf{I} \\right) \\exp \\left( \\mathbf{p}\\tp \\mathbf{A} \\mathbf{p} \\right) \\dA{\\mathbf{p}} + \\frac{1}{3} \\mathbf{I} \\int_{\\Sp} \\exp \\left( \\mathbf{p}\\tp \\mathbf{A} \\mathbf{p} \\right) \\dA{\\mathbf{p}} \\\\\n&= \\partition{\\mathbf{A}} \\left[ \\int_{\\Sp} \\',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\frac{\\partial f}{\\partial \\mathbf{A}}',
                ' Compute \\( \\frac{\\partial f}{\\partial \\mathbf{A}}',
                ' derivative \\( \\frac{\\partial f}{\\partial \\mathbf{A}}',
                ' \\frac{\\partial f}{\\partial \\mathbf{A}} = ',
            ],
            correspondingSpans: [5, 8, 11, 34],
            index: '3055938160',
            relevanceScore: 430.44519107903017,
            snippets: [
                {
                    correspondingSpanText: '\\frac{\\partial f}{\\partial \\mathbf{A}}',
                    text: 'mathbb{R}^{N\\times M}$, we define the gradient of $f$ with respect to $\\mathbf{A}$ as:\\begin{equation*}\\nabla_{\\mathbf{A}}f = \\frac{\\partial f}{\\partial \\mathbf{A}} =  \\begin{bmatrix}\\frac{\\partial f}{\\partial \\mathbf{A}_{1,1}} & \\dots & \\frac{\\partial f}{\\partial \\mathbf{A}_{1,',
                },
                {
                    correspondingSpanText: '\\frac{\\partial f}{\\partial \\mathbf{A}} = ',
                    text: 'mathbb{R}^{N\\times M}$, we define the gradient of $f$ with respect to $\\mathbf{A}$ as:\\begin{equation*}\\nabla_{\\mathbf{A}}f = \\frac{\\partial f}{\\partial \\mathbf{A}} =  \\begin{bmatrix}\\frac{\\partial f}{\\partial \\mathbf{A}_{1,1}} & \\dots & \\frac{\\partial f}{\\partial \\mathbf{A}_{1,m}}',
                },
            ],
            source: 'starcoder',
            textLong:
                "y shape = (100, 1)\n\nX: mean 645.0, sdt 323.65, max 1200.00, min 90.00\ny: mean 44221.50, sdt 16674.25, max 79182.43, min 12196.20<jupyter_text>Ploting the data<jupyter_code>plot_points_regression(X,\n                       y,\n                       title='Real estate prices prediction',\n                       xlabel=\"m\\u00b2\",\n                       ylabel='$')<jupyter_output><empty_output><jupyter_text>The solutionGiven $f:\\mathbb{R}^{N\\times M} \\rightarrow \\mathbb{R}$ and $\\mathbf{A} \\in \\mathbb{R}^{N\\times M}$, we define the gradient of $f$ with respect to $\\mathbf{A}$ as:\\begin{equation*}\\nabla_{\\mathbf{A}}f = \\frac{\\partial f}{\\partial \\mathbf{A}} =  \\begin{bmatrix}\\frac{\\partial f}{\\partial \\mathbf{A}_{1,1}} & \\dots & \\frac{\\partial f}{\\partial \\mathbf{A}_{1,m}} \\\\\\vdots &  \\ddots & \\vdots \\\\\\frac{\\partial f}{\\partial \\mathbf{A}_{n,1}} &  \\dots & \\frac{\\partial f}{\\partial \\mathbf{A}_{n,m}}\\end{bmatrix}\\end{equation*}Let $\\mathbf{X} \\in \\mathbb{R}^{N\\times d}$ be a matrix (sometimes also called the *design matrix*) whose rows are the observations of the dataset and let $\\mathbf{y} \\in \\mathbb{R}^{N}$ be the vector consisting of all values $y^{(i)}$ (i.e., $\\mathbf{X}^{(i,:)} = \\mathbf{x}^{(i)}$ and $\\mathbf{y}^{(i)} = y^{(i)}$). It can be verified that: \\begin{equation}J(\\mathbf{w}) = \\frac{1}{N}(\\mathbf{X}\\mathbf{w} - \\mathbf{y})^{T}(\\mathbf{X}\\",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['1} \\cdot \\frac{\\partial \\mathbf{'],
            correspondingSpans: [16],
            index: '3163248023',
            relevanceScore: 427.4516350863526,
            snippets: [
                {
                    correspondingSpanText: '1} \\cdot \\frac{\\partial \\mathbf{',
                    text: '\\(\\delta_{t+1}\\):\n\n   \\[ \\delta_t = \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{h}_t} + \\delta_{t+1} \\cdot \\frac{\\partial \\mathbf{h}_{t+1}}{\\partial \\mathbf{h}_t} \\]\n\n   Since \\(\\mathbf{h}_{t+1} = \\tanh(\\mathbf{W}_h \\mathbf',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                '\\mathbf{x}_t + \\mathbf{b}) \\]\n\nThe loss function to be minimized is:\n\n\\[ \\mathcal{L} = \\sum_{t=1}^N \\ell(\\mathbf{h}_t, \\mathbf{y}_t) \\]\n\nWe aim to derive the gradient of the loss function \\( \\mathcal{L} \\) with respect to the weight matrix \\( \\mathbf{W}_h \\).\n\n#### Step-by-Step Gradient Derivation using Backpropagation Through Time (BPTT):\n\n1. **Compute gradients at each time step:**\n\n   Let \\(\\delta_t = \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{h}_t}\\) be the gradient of the loss with respect to the hidden state at time \\(t\\).\n\n2. **Backpropagate through the hidden states:**\n\n   Using the chain rule, we can express \\(\\delta_t\\) in terms of \\(\\delta_{t+1}\\):\n\n   \\[ \\delta_t = \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{h}_t} + \\delta_{t+1} \\cdot \\frac{\\partial \\mathbf{h}_{t+1}}{\\partial \\mathbf{h}_t} \\]\n\n   Since \\(\\mathbf{h}_{t+1} = \\tanh(\\mathbf{W}_h \\mathbf{h}_t + \\mathbf{W}_x \\mathbf{x}_{t+1} + \\mathbf{b})\\), we have:\n\n   \\[ \\frac{\\partial \\mathbf{h}_{t+1}}{\\partial \\mathbf{h}_t} = \\mathbf{W}_h^T \\cdot \\text{diag}(1 - \\tanh^2(\\mathbf{W}_h \\mathbf{h}_t + \\mathbf{W}_x \\mathbf{x}_{t+1} + \\mathbf{b})) \\]\n\n   Let \\(\\mathbf{z}_{t+1} = \\mathbf{W}_h \\mathbf{h}_t + \\mathbf{W}_x \\mathbf{x}_{t+1} + \\mathbf{b}\\), then:\n\n   \\[ \\frac{\\partial \\mathbf{h}_{t+1}}{\\partial \\mathbf{h}_t} = \\mathbf{W}_h^T \\cdot \\text{diag}(1 - \\',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['1} \\cdot \\frac{\\partial \\mathbf{'],
            correspondingSpans: [16],
            index: '3159773493',
            relevanceScore: 427.4516350863526,
            snippets: [
                {
                    correspondingSpanText: '1} \\cdot \\frac{\\partial \\mathbf{',
                    text: '\\(\\delta_{t+1}\\):\n\n   \\[ \\delta_t = \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{h}_t} + \\delta_{t+1} \\cdot \\frac{\\partial \\mathbf{h}_{t+1}}{\\partial \\mathbf{h}_t} \\]\n\n   Since \\(\\mathbf{h}_{t+1} = \\tanh(\\mathbf{W}_h \\mathbf',
                },
            ],
            source: 'dolmino',
            textLong:
                '\\mathbf{x}_t + \\mathbf{b}) \\]\n\nThe loss function to be minimized is:\n\n\\[ \\mathcal{L} = \\sum_{t=1}^N \\ell(\\mathbf{h}_t, \\mathbf{y}_t) \\]\n\nWe aim to derive the gradient of the loss function \\( \\mathcal{L} \\) with respect to the weight matrix \\( \\mathbf{W}_h \\).\n\n#### Step-by-Step Gradient Derivation using Backpropagation Through Time (BPTT):\n\n1. **Compute gradients at each time step:**\n\n   Let \\(\\delta_t = \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{h}_t}\\) be the gradient of the loss with respect to the hidden state at time \\(t\\).\n\n2. **Backpropagate through the hidden states:**\n\n   Using the chain rule, we can express \\(\\delta_t\\) in terms of \\(\\delta_{t+1}\\):\n\n   \\[ \\delta_t = \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{h}_t} + \\delta_{t+1} \\cdot \\frac{\\partial \\mathbf{h}_{t+1}}{\\partial \\mathbf{h}_t} \\]\n\n   Since \\(\\mathbf{h}_{t+1} = \\tanh(\\mathbf{W}_h \\mathbf{h}_t + \\mathbf{W}_x \\mathbf{x}_{t+1} + \\mathbf{b})\\), we have:\n\n   \\[ \\frac{\\partial \\mathbf{h}_{t+1}}{\\partial \\mathbf{h}_t} = \\mathbf{W}_h^T \\cdot \\text{diag}(1 - \\tanh^2(\\mathbf{W}_h \\mathbf{h}_t + \\mathbf{W}_x \\mathbf{x}_{t+1} + \\mathbf{b})) \\]\n\n   Let \\(\\mathbf{z}_{t+1} = \\mathbf{W}_h \\mathbf{h}_t + \\mathbf{W}_x \\mathbf{x}_{t+1} + \\mathbf{b}\\), then:\n\n   \\[ \\frac{\\partial \\mathbf{h}_{t+1}}{\\partial \\mathbf{h}_t} = \\mathbf{W}_h^T \\cdot \\text{diag}(1 - \\',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '    \\frac{\\partial^2 f}{\\partial',
                '     \\frac{\\partial^2 f}{\\partial \\mathbf{',
            ],
            correspondingSpans: [18, 20],
            index: '2950948565',
            relevanceScore: 426.5845989633433,
            snippets: [
                {
                    correspondingSpanText: '    \\frac{\\partial^2 f}{\\partial',
                    text: '2 \\sigma_{i}^2 / (n_i + n_{i+k})^3$. Then the non-zero Hessian entries are:\n\n\\begin{equation*}\n     \\frac{\\partial^2 f}{\\partial n_j \\partial n_i} =\n     \\begin{cases} \n     \\; \\; \\psi_i & 1 \\leq i \\leq k \\textrm{  and',
                },
            ],
            source: 'arxiv',
            textLong:
                'treat the optimal selection of stream predictors as a sub-problem, which we solve prior to solving the optimization problem. We propose a heuristic in section \\ref{sec:predictors} for obtaining a solution to this sub-problem efficiently, which leads to the following result.\n\n\\noindent\n\\textbf{Theorem. } \\textit{The problem in \\textrm{equation 1}\\;is a convex optimization problem when $p$ is treated as a constant and the integer constraints are relaxed on the objective variables.} \\\\[10pt]\n\n\\noindent\n\\textbf{Proof.} Concatenate $n_{r}$ and $n_{s}$ to form a single vector $n = (n_{r}, n_{s}) \\in \\mathbb{R}^{2k}_{\\geq 0}$. To simplify notation for the Hessian, for $i \\in 1\\;...\\;k$, we define the non-negative variables $\\psi_i = 2 w_i^2 \\sigma_{i}^2 / (n_i + n_{i+k})^3$. Then the non-zero Hessian entries are:\n\n\\begin{equation*}\n     \\frac{\\partial^2 f}{\\partial n_j \\partial n_i} =\n     \\begin{cases} \n     \\; \\; \\psi_i & 1 \\leq i \\leq k \\textrm{  and  } j=i \\\\[0.75em]\n     \\; \\; \\psi_{i-k} & k \\leq i \\leq 2k  \\textrm{  and  } j=i \\\\[0.75em]\n     \\; \\; \\psi_i & 1 \\leq i \\leq k  \\textrm{  and  } j=i+k \\\\[0.75em]\n     \\; \\; \\psi_{i-k} & k \\leq i \\leq 2k   \\textrm{  and  } j=i-k\\\\[0.75em]\n   \\end{cases}\n\\end{equation*}\n\n\\noindent\nFor arbitrary $z \\in \\mathbb{R}^{2k}$, we have:\n\n\\begin{align*}\n    z^T(\\nabla^2 f(n))z &= \\sum_{i=1}^k \\sum_{j=1}^k z_iz_',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\mathbf{A}^{-1} = -\\mathbf{',
                ' \\mathbf{A}^{-1} = -\\mathbf{A}^{-1} \\cdot \\mathbf{A}^{-1} = -\\mathbf{',
            ],
            correspondingSpans: [32],
            index: '3142122507',
            relevanceScore: 416.50015388522235,
            snippets: [
                {
                    correspondingSpanText: '\\mathbf{A}^{-1} = -\\mathbf{',
                    text: '+ \\mathbf{A}^{-1} = \\mathbf{0}.\\]Then $\\mathbf{A}^{-1} = -\\mathbf{A}.$  Hence,\n\\[\\mathbf{A} \\mathbf{A}^{-1} = -\\mathbf{A}^2 = \\mathbf{I}.\\]Then $\\det (\\mathbf{A} \\mathbf{A}^{-1}) = \\det \\mathbf{I} = 1,$ so $\\det',
                },
            ],
            source: 'dolmino',
            textLong:
                'Let $\\mathbf{A} = \\begin{pmatrix} a & 1 \\\\ -2 & d \\end{pmatrix}$ for some real numbers $a$ and $d.$  If\n\\[\\mathbf{A} + \\mathbf{A}^{-1} = \\mathbf{0},\\]then find $\\det \\mathbf{A}.$\nWe have that\n\\[\\mathbf{A} + \\mathbf{A}^{-1} = \\mathbf{0}.\\]Then $\\mathbf{A}^{-1} = -\\mathbf{A}.$  Hence,\n\\[\\mathbf{A} \\mathbf{A}^{-1} = -\\mathbf{A}^2 = \\mathbf{I}.\\]Then $\\det (\\mathbf{A} \\mathbf{A}^{-1}) = \\det \\mathbf{I} = 1,$ so $\\det \\mathbf{A} \\det \\mathbf{A}^{-1} = 1.$  But $\\det \\mathbf{A}^{-1} = \\frac{1}{\\det \\mathbf{A}},$ so\n\\[\\det \\mathbf{A} \\left( \\frac{1}{\\det \\mathbf{A}} \\right) = 1.\\]Hence, $\\det \\mathbf{A} = \\boxed{1}.$\nThe answer is: 1',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\mathbf{A}^{-1} = -\\mathbf{',
                ' \\mathbf{A}^{-1} = -\\mathbf{A}^{-1} \\cdot \\mathbf{A}^{-1} = -\\mathbf{',
            ],
            correspondingSpans: [32],
            index: '3142049006',
            relevanceScore: 414.8077456358023,
            snippets: [
                {
                    correspondingSpanText: '\\mathbf{A}^{-1} = -\\mathbf{',
                    text: 'the product of a matrix and its inverse is the identity matrix.\n\nThus, we have\n\\[\\mathbf{A}^{-1} \\mathbf{A} = -\\mathbf{A} \\mathbf{A}^{-1} = -\\mathbf{I}.\\]\n\nThen $\\det (\\mathbf{A}^{-1} \\mathbf{A}) = \\det (-\\mathbf{I}) = (-1)^2 \\det \\mathbf{I',
                },
            ],
            source: 'dolmino',
            textLong:
                'Let $\\mathbf{A} = \\begin{pmatrix} a & 1 \\\\ -2 & d \\end{pmatrix}$ for some real numbers $a$ and $d.$  If\n\\[\\mathbf{A} + \\mathbf{A}^{-1} = \\mathbf{0},\\]then find $\\det \\mathbf{A}.$\n\nWe can write $\\mathbf{A} + \\mathbf{A}^{-1} = \\mathbf{0}$ as $\\mathbf{A}^{-1} = -\\mathbf{A}.$\n\nRecall that the product of a matrix and its inverse is the identity matrix.\n\nThus, we have\n\\[\\mathbf{A}^{-1} \\mathbf{A} = -\\mathbf{A} \\mathbf{A}^{-1} = -\\mathbf{I}.\\]\n\nThen $\\det (\\mathbf{A}^{-1} \\mathbf{A}) = \\det (-\\mathbf{I}) = (-1)^2 \\det \\mathbf{I} = 1,$ so\n\\[\\det \\mathbf{A}^{-1} \\det \\mathbf{A} = 1.\\]\n\nSince $\\det \\mathbf{A}^{-1} = \\frac{1}{\\det \\mathbf{A}},$ we can substitute to get\n\\[\\frac{1}{\\det \\mathbf{A}} \\det \\mathbf{A} = 1.\\]\n\nThis means $\\det \\mathbf{A} = \\boxed{1}.$\n\nThe answer is: 1',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\( \\mathbf{A} \\), \\( \\mathbf{'],
            correspondingSpans: [1],
            index: '3159721334',
            relevanceScore: 410.1596176868436,
            snippets: [
                {
                    correspondingSpanText: '\\( \\mathbf{A} \\), \\( \\mathbf{',
                    text: 'score. Determine the vector \\( \\mathbf{x}^* \\) that maximizes \\( S(\\mathbf{x}) \\), and express \\( \\mathbf{x}^* \\) in terms of \\( \\mathbf{A} \\), \\( \\mathbf{b} \\), and \\( c \\).\n\n2. To further refine the content, the AI algorithm incorporates a regularization term \\( R(\\mathbf{x}) = \\lambda',
                },
            ],
            source: 'dolmino',
            textLong:
                "A data scientist is developing an AI algorithm that generates optimized content for various digital platforms. The algorithm is designed to evaluate and enhance the content's engagement using a numerical score based on several factors such as readability, relevance, and novelty.\n\n1. The AI model uses a vector space representation where each piece of content is represented as a vector \\( \\mathbf{x} \\in \\mathbb{R}^n \\). The engagement score \\( S(\\mathbf{x}) \\) is calculated as a function of these vectors using the formula \\( S(\\mathbf{x}) = \\mathbf{x}^\\top \\mathbf{A} \\mathbf{x} + \\mathbf{b}^\\top \\mathbf{x} + c \\), where \\( \\mathbf{A} \\) is a symmetric positive definite matrix, \\( \\mathbf{b} \\in \\mathbb{R}^n \\), and \\( c \\in \\mathbb{R} \\). The goal is to maximize the engagement score. Determine the vector \\( \\mathbf{x}^* \\) that maximizes \\( S(\\mathbf{x}) \\), and express \\( \\mathbf{x}^* \\) in terms of \\( \\mathbf{A} \\), \\( \\mathbf{b} \\), and \\( c \\).\n\n2. To further refine the content, the AI algorithm incorporates a regularization term \\( R(\\mathbf{x}) = \\lambda \\|\\mathbf{x}\\|^2 \\), where \\( \\lambda > 0 \\) is a regularization parameter. The new objective function becomes \\( F(\\mathbf{x}) = S(\\mathbf{x}) - R(\\mathbf{x}) \\). Analyze how the introduction of the regularization term affects the optimal solution \\( \\mathbf{x}^* \\), and determine the conditions under which the regularized solution differs from the unregularized solution.\nTo solve this problem, we need to determine the vector \\( \\mathbf{x}^* \\) that maximizes the objective functions \\( S(\\mathbf{x}) \\) and \\( F(\\mathbf{x}) \\).\n\n1. **Maximizing \\( S(\\mathbf{x}) = \\mathbf{x}^\\top \\mathbf{A} \\mathbf{x} + \\mathbf{b}^\\top \\mathbf{x} + c \\):**\n\n   - Since \\( \\mathbf{A} \\) is symmetric positive definite, \\( S(\\mathbf",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['**Determinant**: The determinant of a square matrix'],
            correspondingSpans: [4],
            index: '3140575208',
            relevanceScore: 409.67061342136884,
            snippets: [
                {
                    correspondingSpanText: '**Determinant**: The determinant of a square matrix',
                    text: '\u03bb.\n* **Trace**: The trace of a square matrix A, denoted tr(A), is the sum of elements along its main diagonal (from top left to bottom right).\n* **Determinant**: The determinant of a square matrix A, denoted det(A), measures the scaling factor when A linearly transforms space. If det(A) > 0, A preserves orientation; if det(A) < ',
                },
            ],
            source: 'dolmino',
            textLong:
                ": Write with an academic, professional and engaging tone that captivates interest.\n- Application: Incorporate specific, practical examples, such as proofs in calculus or critical dates and figures in history.\nDo not include a title or an introduction, simply write the content without headlines and introductory phrases. Do not use images. To determine whether a 3x3 matrix has a positive eigenvalue, we can utilize several criteria involving the matrix's trace and determinant. Eigenvalues play a crucial role in linear algebra since they reveal important information about a given square matrix, including its transformation properties and stability. We will delve into these concepts and their applications while exploring conditions for positive eigenvalues.\n\nFirstly, let us define some essential terms:\n\n* **Eigenvalue**: An eigenvalue of a square matrix A is a scalar \u03bb such that Ax = \u03bbx for some nonzero vector x. Here, x is called the eigenvector associated with \u03bb.\n* **Trace**: The trace of a square matrix A, denoted tr(A), is the sum of elements along its main diagonal (from top left to bottom right).\n* **Determinant**: The determinant of a square matrix A, denoted det(A), measures the scaling factor when A linearly transforms space. If det(A) > 0, A preserves orientation; if det(A) < 0, A reverses orientation.\n\nNow, onto our primary question\u2014whether we can ascertain if a 3x3 matrix contains a positive eigenvalue based on its trace and determinant. Indeed, there exists a useful connection between these quantities and the eigenvalues themselves:\n\n1. **Trace relationship**: The trace of a matrix equals the sum of all its eigenvalues (counting multiplicities). Specifically, if A is a 3x3 matrix, then\n   tr(A) = \u03bb\u2081 + \u03bb\u2082 + \u03bb\u2083,\n   where \u03bb\u2081, \u03bb\u2082, and \u03bb\u2083 denote the eigenvalues of A. Consequently, having a positive trace does guarantee the existence of at least one positive eigenvalue among them. However, note that the reverse is not generally valid; e.g., consider a matrix with eigenvalues {-2, 1, 1}. Its trace is zero despite having two positive eigenvalues.\n\n2. **Determinant relationship**:",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['{A}) = \\mathrm{tr}(\\mathbf{'],
            correspondingSpans: [10],
            index: '2951409260',
            relevanceScore: 403.20364516777994,
            snippets: [
                {
                    correspondingSpanText: '{A}) = \\mathrm{tr}(\\mathbf{',
                    text: '4learning, kwok2003learning}.\nWe also consider the \\defn{trace norm regularizer}, which is of the form\n\\begin{equation}\n    r(\\mathbf{A}) = \\mathrm{tr}(\\mathbf{A})\n\\end{equation}\nThe trace norm regularizer is the matrix analogue of the $L_1$ regularizer and it encourages the matrix $\\mathbf{A}$ to',
                },
            ],
            source: 'arxiv',
            textLong:
                'We also take advantage of two common regularization techniques employed in the metric learning literature to further improve the transformations learned;\nboth act on the matrix $\\mathbf{A}=\\mathbf{B}^{\\top} \\mathbf{B}$ and are added to the objective\nspecified in \\cref{eq:min_distance}.\nThe \\defn{Frobenius norm regularizer} takes the form\n\\begin{equation}\n    r(\\mathbf{A}) = ||\\mathbf{A}||^2_{\\mathrm{F}} = \\mathrm{tr}\\left(\\mathbf{A}^{\\top} \\mathbf{A}\\right)\n\\end{equation}\nThis is the matrix analogue of the $L_2$ squared regularizer.\nMinimizing the Frobenius norm of the learned matrix has the effect of keeping the values in the matrix small.\nIt has been a popular choice for regularization in metric learning with adaptations to a variety of problems \\citep{schultz2004learning, kwok2003learning}.\nWe also consider the \\defn{trace norm regularizer}, which is of the form\n\\begin{equation}\n    r(\\mathbf{A}) = \\mathrm{tr}(\\mathbf{A})\n\\end{equation}\nThe trace norm regularizer is the matrix analogue of the $L_1$ regularizer and it encourages the matrix $\\mathbf{A}$ to be low rank.\nAs \\newcite{jain2010inductive} point out, using a low-rank transformation in conjunction with a kernel corresponds to a supervised kernel dimensionality reduction method.\n\\begin{table*}\n\\centering\n\\resizebox{\\textwidth}{!}{%\n\\begin{tabular}{lcccccccccccc}\\toprule\n \\multicolumn{1}{c}{} & \\multicolumn{2}{c}{Basque} &\n\\multicolumn{2}{c}{English} &\n\\multicolumn{2}{c}{Finnish} &\n\\multicolumn{2}{c}{Korean} &\n\\multicolumn{2}{c}{Tamil} &\n\\multicolumn{2}{c}{Turkish} \\\\ \\cmidrule(lr{.5em}){2-3} \\cmidrule(lr{.5em}){4-5} \\cmidrule(lr{.5em}){6-7} \\',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '    \\frac{\\partial^2 f}{\\partial',
                '     \\frac{\\partial^2 f}{\\partial \\mathbf{',
            ],
            correspondingSpans: [18, 20],
            index: '2957063877',
            relevanceScore: 402.45126719508124,
            snippets: [
                {
                    correspondingSpanText: '    \\frac{\\partial^2 f}{\\partial',
                    text: '2M}{\\delta} \\, \\frac{\\partial e}{\\partial p_i},\n\\end{equation}\nand\n\\begin{equation}\\label{2ndderiv2}\n     \\frac{\\partial^2 f}{\\partial p_i \\partial p_j}= \\frac{1}{\\delta}\\, M^2\\,\\frac{\\partial^2 e}{\\partial p_i \\partial p_j}.\n\\end',
                },
            ],
            source: 'open-web-math',
            textLong:
                '}) leads to:\n\n\\begin{eqnarray}\n  \\frac{\\partial f}{\\partial M} &=& M \\, (r_0 + 2\\, e(p_1,p_2,\\ldots)/\\delta + u\\, M^2)=0\\label{firstderivM} \\\\\n   \\frac{\\partial f}{\\partial p_i} &=& \\frac{M^2}{\\delta}\\, \\frac{\\partial e}{\\partial p_i}=0 \\label{firstderivp}\n\\end{eqnarray}\nWe also have;\n\\begin{equation}\\label{2ndderivM}\n    \\frac{\\partial^2 f}{\\partial M^2}= r_0 +2\\, e/\\delta+ 3u\\, M^2,\n\\end{equation}\n\n\\begin{equation}\\label{2ndderiv1}\n     \\frac{\\partial^2 f}{\\partial M \\partial p_i} = \\frac{2M}{\\delta} \\, \\frac{\\partial e}{\\partial p_i},\n\\end{equation}\nand\n\\begin{equation}\\label{2ndderiv2}\n     \\frac{\\partial^2 f}{\\partial p_i \\partial p_j}= \\frac{1}{\\delta}\\, M^2\\,\\frac{\\partial^2 e}{\\partial p_i \\partial p_j}.\n\\end{equation}\n$M=0$ is always a solution of the extremal equations (\\ref{firstderivM})-(\\ref{firstderivp}) and the corresponding free energy $f=0$ is independent of the parameter values of $(p_1,p_2,\\ldots)$. Hence, all the second derivatives are zero, except\n\n\n\\begin{equation}\\label{stabM0}\n\\left. \\frac{\\partial^2 f}{\\partial M^2}\\right|_{M=0} = r_0 + 2\\, e/\\delta,\n\\end{equation}\n\n\n\\noindent which controls the stability of the $M=0$ solution.\n\nAn ordered solution (local minimum of $f$) with $M \\neq 0$ exists whenever  $r_0 +2\\, e/\\delta<0$. From Eqs.(\\ref{firstderivM})-(\\ref{firstderivp}) we have that:\n\n\\',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['1} \\cdot \\mathbf{A}^{-1}'],
            correspondingSpans: [32],
            index: '2952962479',
            relevanceScore: 387.83349151767015,
            snippets: [
                {
                    correspondingSpanText: '1} \\cdot \\mathbf{A}^{-1}',
                    text: 'initial condition. Since the inner planet eccentricities are initially zero, we have that:\n\\begin{equation}\nb_n = e_p \\left(\\mathbf{V}^{-1} \\cdot \\mathbf{A}^{-1} \\cdot \\mathbf{B}\\right)_n.\n\\label{eq:bn}\n\\end{equation}\nThe RMS eccentricity of planet $j$ is then',
                },
            ],
            source: 'arxiv',
            textLong:
                '\\begin{equation}\n\\mathcal{E}_j(t) = \\mathcal{E}_{fj} + \\sum_n^N b_n (\\mathrm{V_n})_j \\exp{(i\\lambda_n t)} .\n\\label{eq:e_multi_t}\n\\end{equation}\nwhere $(\\mathrm{V_n})_j$ is the $j$-th component of vector $\\mathrm{V_n}$, and $\\mathcal{E}_{fj}$ is the forced eccentricity on the $j$-th planet given by \n\\begin{equation}\n\\mathbf{\\mathcal{E}}_{fj} = (\\mathbf{A}^{-1} \\mathbf{B})_j e_p.\n\\label{eq:e_f_multi}\n\\end{equation}\nThe co-efficient $b_n$ can be obtained by matching Eq. (\\ref{eq:e_multi_t}) to the initial condition. Since the inner planet eccentricities are initially zero, we have that:\n\\begin{equation}\nb_n = e_p \\left(\\mathbf{V}^{-1} \\cdot \\mathbf{A}^{-1} \\cdot \\mathbf{B}\\right)_n.\n\\label{eq:bn}\n\\end{equation}\nThe RMS eccentricity of planet $j$ is then given by:\n\\begin{equation}\n\\langle e_j^2 \\rangle^{1/2} = \\left( \\sum_n b_n^2 (\\mathrm{V_n})_j^2  + \\mathcal{E}_{fj}^2  \\right)^{1/2}.\n\\label{eq:rms_e_gen}\n\\end{equation}\nAnalogous to the $N = 2$ case, in either the strong-coupling limit ($\\bar{\\epsilon} \\ll 1$) or the weak-coupling limit ($\\bar{\\epsilon} \\gg 1$), the forced eccentricity term dominates over the other modes, and a good approximation is\n\\begin{equation}\n\\langle e_j^2 \\rangle^{1/2} = \\sqrt{2} \\mathcal{E}_{fj}.\n\\label{eq:rms_e_strong_coupling}\n\\end{equation',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\frac{\\partial}{\\partial \\mathbf{A}} \\mathrm',
                '     \\frac{\\partial}{\\partial \\mathbf{A}}',
            ],
            correspondingSpans: [15, 31],
            index: '3055454185',
            relevanceScore: 386.6277960878982,
            snippets: [
                {
                    correspondingSpanText: '\\frac{\\partial}{\\partial \\mathbf{A}} \\mathrm',
                    text: '|\\Sigma^{-1}| \\\\\n# \\frac{\\partial}{\\partial \\mathbf{A}} \\log |\\mathbf{A^{-1}}| &= (\\mathbf{A})^\\top \\\\\n# \\frac{\\partial}{\\partial \\mathbf{A}} \\mathrm{Tr}(\\mathbf{\\mathbf{x} \\mathbf{x}^\\top A}) &= (\\mathbf{x} \\mathbf{x}^\\top)^\\top\n# \\end{aligned}$$\n',
                },
                {
                    correspondingSpanText: '\\frac{\\partial}{\\partial \\mathbf{A}}',
                    text: '|\\Sigma^{-1}| \\\\\n# \\frac{\\partial}{\\partial \\mathbf{A}} \\log |\\mathbf{A^{-1}}| &= (\\mathbf{A})^\\top \\\\\n# \\frac{\\partial}{\\partial \\mathbf{A}} \\mathrm{Tr}(\\mathbf{\\mathbf{x} \\mathbf{x}^\\top A}) &= (\\mathbf{x} \\mathbf{x}^\\top)^\\top\n# \\end{aligned',
                },
                {
                    correspondingSpanText: '\\frac{\\partial}{\\partial \\mathbf{A}}',
                    text: '# We also note the following matrix calculus identities\n#\n# $$\n# \\begin{aligned}\n# -\\log |\\Sigma| &= \\log |\\Sigma^{-1}| \\\\\n# \\frac{\\partial}{\\partial \\mathbf{A}} \\log |\\mathbf{A^{-1}}| &= (\\mathbf{A})^\\top \\\\\n# \\frac{\\partial}{\\partial \\mathbf{A}} \\mathrm{Tr}(\\mathbf{\\mathbf',
                },
            ],
            source: 'starcoder',
            textLong:
                '}|\\mathbf{\\mu}, \\Sigma) &= - \\frac{N}{2} \\log |\\Sigma| - \\frac{1}{2}\\sum_{n=1}^{N} (\\mathbf{x} - \\mathbf{\\mu})^\\top  \\Sigma^{-1} (\\mathbf{x} - \\mathbf{\\mu}) + \\mathrm{const.} \\\\\n# &=  - \\frac{N}{2} \\log |\\Sigma| - \\frac{1}{2} \\sum_{n=1}^{N} \\mathrm{Tr}\\left [(\\mathbf{x} - \\mathbf{\\mu}) (\\mathbf{x} - \\mathbf{\\mu})^\\top \\Sigma^{-1} \\right]+ \\mathrm{const.}\n# \\end{aligned} \\label{eq:loglsig} \\tag{2}$$\n#\n# We also note the following matrix calculus identities\n#\n# $$\n# \\begin{aligned}\n# -\\log |\\Sigma| &= \\log |\\Sigma^{-1}| \\\\\n# \\frac{\\partial}{\\partial \\mathbf{A}} \\log |\\mathbf{A^{-1}}| &= (\\mathbf{A})^\\top \\\\\n# \\frac{\\partial}{\\partial \\mathbf{A}} \\mathrm{Tr}(\\mathbf{\\mathbf{x} \\mathbf{x}^\\top A}) &= (\\mathbf{x} \\mathbf{x}^\\top)^\\top\n# \\end{aligned}$$\n#\n# Where the first identity uses the fact that the determinant of the inverse of a matrix is the inverse of the determinant. Now, using the first identity rewrite Eq. \\eqref{eq:loglsig} in terms of the precision $\\Sigma^{-1}$, then take the derivative of the log-likelihood with respect to the precision $\\Sigma^{-1}$ and set it to zero to find the maximum likelihood estimator for the covariance\n#\n# $$\\Sigma_{\\mathrm{ML}} = \\frac{1}{N} \\sum_{n=1}^{N} (\\mathbf{x} - \\mathbf{\\mu}_{\\mathrm{ML}}) (\\mathbf{x} - \\mathbf{\\mu}_{\\mathrm{ML}})^\\top$$\n#\n# Show all your work.\n#\n# **Q5**. Are the maximum likelihood estimators for the mean and covariance of the multivariate Gaussian biased? If so, show how to correct for the bias. _Hint:',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['1} \\cdot \\frac{\\partial \\mathbf{'],
            correspondingSpans: [16],
            index: '2951450144',
            relevanceScore: 386.623422064427,
            snippets: [
                {
                    correspondingSpanText: '1} \\cdot \\frac{\\partial \\mathbf{',
                    text: '\n    F_{f_{\\rm NL}^{\\rm loc}} = \\frac{\\partial \\mathbf{D}}{\\partial f_{\\rm NL}^{\\rm loc}} \\cdot \\mathbf{C}^{-1} \\cdot \\frac{\\partial \\mathbf{D}^T}{\\partial f_{\\rm NL}^{\\rm loc}}\n\\end{equation}\nbeing $\\mathbf{D} = (P,B)$ the vector of power spectrum and',
                },
            ],
            source: 'arxiv',
            textLong:
                'a minimum of $50$ particles. \nWe compute the power spectrum and bispectrum in an analogous grid to \\textsf{Q}$1$\\xspace (see Table \\ref{tab:binning}), where both $k_{\\rm min}$ and $k_{\\rm max}$ are half the size, since the \\textsc{Eos}\\xspace box size is twice the one of \\textsc{Quijote}\\xspace simulations.  We call these measurements \\textsf{E1}.\n\n\n\\subsection{Fisher matrix forecasts}\n\nWe want to determine the Fisher matrix for the parameter $f_{\\rm NL}^{\\rm loc}$ using our predictions for the theoretical covariance matrix of the power spectrum and bispectrum. We use the simulations with primordial non-Gaussianity to infer the numerical derivative of the power spectrum and bispectrum with respect to $f_{\\rm NL}^{\\rm loc}$. The Fisher matrix is defined as\n\\begin{equation}\n    F_{f_{\\rm NL}^{\\rm loc}} = \\frac{\\partial \\mathbf{D}}{\\partial f_{\\rm NL}^{\\rm loc}} \\cdot \\mathbf{C}^{-1} \\cdot \\frac{\\partial \\mathbf{D}^T}{\\partial f_{\\rm NL}^{\\rm loc}}\n\\end{equation}\nbeing $\\mathbf{D} = (P,B)$ the vector of power spectrum and bispectrum values as a function of $k$ and $\\mathbf{C}$ the full covariance matrix as defined in Equation~\\eqref{eq:fullmat}.\\footnote{ One might be worried that by neglecting non-Gaussian covariance terms in the $P$ covariance we are underestimating the gain due to the bispectrum. However, for the specific case of local-type non-Gaussianity, most of the constraining power in the power spectrum comes from the large scales, because of the scale dependent bias effect \\cite{Dalal:2007cu,Slosar:2008hx,Matarrese:2008nc}. Therefore we do not expect a strong impact in our estimations due to neglecting non-Gaussianity in the power spectrum covariance. A similar discussion applies for the cross power spectrum-bispectrum covariance: we do include terms where the power spectrum is evaluated',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '    \\frac{\\partial^2 f}{\\partial',
                '     \\frac{\\partial^2 f}{\\partial \\mathbf{',
            ],
            correspondingSpans: [18, 20],
            index: '2957111856',
            relevanceScore: 379.6713412244421,
            snippets: [
                {
                    correspondingSpanText: '    \\frac{\\partial^2 f}{\\partial',
                    text: '& \\cdots & \\frac{\\partial^2 f}{\\partial x_1 \\partial x_N} \\\\\r\n      \\vdots& \\ddots & \\vdots \\\\\r\n     \\frac{\\partial^2 f}{\\partial x_N \\partial x_1} & \\cdots & \\frac{\\partial^2 f}{\\partial x_N^2} \\\\\r\n    \\end{array}\r\n  \\',
                },
            ],
            source: 'open-web-math',
            textLong:
                'only need to show that the objective function is\r\nconvex or concave since all the constraints are linear. Denote the\r\nobjective function  of the relaxation problem as $f_r$, then $f_r$\r\nis convex/concave if its Hessian is positive/negative semidefinite.\r\nDenote the Hessian of $f_r$ as $\\boldsymbol{H}$, we show that\r\n$\\boldsymbol{H}$ is negative semidefinite by the following\r\nproposition.\r\n\r\n\r\n\\underline{\\textbf{Proposition 3.3}}: The Hessian $\\boldsymbol{H}$\r\nis negative semidefinite.\r\n\r\n\\emph{Proof:} The Hessian of $f$ can be written as\r\n\\begin{align}\r\n\\boldsymbol{H}=\\left(\r\n    \\begin{array}{ccc}\r\n      \\frac{\\partial^2 f}{\\partial x_1^2} & \\cdots & \\frac{\\partial^2 f}{\\partial x_1 \\partial x_N} \\\\\r\n      \\vdots& \\ddots & \\vdots \\\\\r\n     \\frac{\\partial^2 f}{\\partial x_N \\partial x_1} & \\cdots & \\frac{\\partial^2 f}{\\partial x_N^2} \\\\\r\n    \\end{array}\r\n  \\right),\r\n\\end{align}\r\nwhere the diagonal elements and off-diagonal elements can be\r\nobtained as $ \\frac{\\partial^2 f}{\\partial\r\nx_k^2}\\kern-0.5mm=\\kern-0.5mm-\\frac{\\lambda\r\nS_{k,B}^2}{\\left(1+\\kern-0.5mm\\sum_{i=1}^N\r\nS_{i,B}x_i\\right)^2}\\kern-0.5mm-\\kern-0.5mm\\frac{(\\lambda-\\mu)\r\nS_{k,A}^2}{\\left(1+\\kern-0.5mm\\sum_{i=1}^N\r\nS_{i,A}(1\\kern-0.5mm-x_i)\\right)^2}, $ and $ \\frac{\\partial^2\r\nf}{\\partial x_k \\partial x_j}\\kern-0.5mm',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\( \\mathbf{A} \\), \\( \\mathbf{'],
            correspondingSpans: [1],
            index: '3159764740',
            relevanceScore: 375.0808140577839,
            snippets: [
                {
                    correspondingSpanText: '\\( \\mathbf{A} \\), \\( \\mathbf{',
                    text: 'connected to the end of \\( \\mathbf{B} \\) such that it can rotate in the XY-plane relative to \\( \\mathbf{B} \\). If the angles of rotation for segments \\( \\mathbf{A} \\), \\( \\mathbf{B} \\), and \\( \\mathbf{C} \\) are \\( \\theta_1 \\), \\( \\theta_2 \\), and \\( \\theta_3 \\) respectively, express the coordinates of',
                },
            ],
            source: 'dolmino',
            textLong:
                "A tech blogger has recently published a series of posts about a new robotic arm that operates with a combination of linear actuators and rotational joints. The robotic arm's motion can be modeled using a combination of linear algebra and calculus.\n\n1. The robotic arm consists of three segments. The first segment \\( \\mathbf{A} \\) is 2 units long and can rotate around the origin in the XY-plane. The second segment \\( \\mathbf{B} \\) is 3 units long and is connected to the end of \\( \\mathbf{A} \\) such that it can rotate in the XY-plane relative to \\( \\mathbf{A} \\). The third segment \\( \\mathbf{C} \\) is 1 unit long and is connected to the end of \\( \\mathbf{B} \\) such that it can rotate in the XY-plane relative to \\( \\mathbf{B} \\). If the angles of rotation for segments \\( \\mathbf{A} \\), \\( \\mathbf{B} \\), and \\( \\mathbf{C} \\) are \\( \\theta_1 \\), \\( \\theta_2 \\), and \\( \\theta_3 \\) respectively, express the coordinates of the end effector (the tip of segment \\( \\mathbf{C} \\)) as a function of \\( \\theta_1 \\), \\( \\theta_2 \\), and \\( \\theta_3 \\).\n\n2. Suppose the end effector must trace a circular path of radius 2 units centered at the point (4, 3) in the XY-plane. Derive the equations that \\( \\theta_1 \\), \\( \\theta_2 \\), and \\( \\theta_3 \\) must satisfy to achieve this motion.\nLet's solve the problem step-by-step.\n\n### Problem 1: Express Coordinates of the End Effector\n\nThe robotic arm's configuration consists of three segments, each with specific lengths and rotational capabilities. To find the coordinates of the end effector, we need to calculate the position after each segment's rotation.\n\n1. **Segment \\( \\mathbf{A} \\):**\n\n   - Length",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['**Determinant**: The determinant of a square matrix'],
            correspondingSpans: [4],
            index: '3139548323',
            relevanceScore: 375.0611571327197,
            snippets: [
                {
                    correspondingSpanText: '**Determinant**: The determinant of a square matrix',
                    text: 'k!},$$ where $X$ is a square matrix. This operation shares many properties with its scalar counterpart, including $(e^X)^{-1} = e^{-X}$.\n2. **Determinant**: The determinant of a square matrix $A$ is a special number associated with the matrix that helps determine various properties, such as whether the matrix is invertible or what kind of transformations it represents. Specifically, for an $n x',
                },
            ],
            source: 'dolmino',
            textLong:
                " To begin, let us establish the necessary mathematical background required to understand the problem at hand. We will then proceed to analyze the issue with the initial proposition and explore potential solutions.\n\n### Mathematical Preliminaries\n\n1. **Matrix Exponential**: The matrix exponential, denoted by $e^X$, is defined as the infinite series $$e^X = \\sum\\_{k=0}^{\\infty} \\frac{X^k}{k!},$$ where $X$ is a square matrix. This operation shares many properties with its scalar counterpart, including $(e^X)^{-1} = e^{-X}$.\n2. **Determinant**: The determinant of a square matrix $A$ is a special number associated with the matrix that helps determine various properties, such as whether the matrix is invertible or what kind of transformations it represents. Specifically, for an $n x n$ matrix, the determinant is computed using Leibniz's formula $$\\text{det}(A) = \\sum\\_{\\sigma \\in S\\_n} (\\text{sgn}(\\sigma)) \\prod\\_{i=1}^{n} a\\_{i,\\sigma(i)},$$ where $S\\_n$ denotes the symmetric group of all permutations of $\\{1,...,n\\}$ and sgn($\\sigma$) gives +1 when $\\sigma$ is even and -1 when it is odd.\n3. **Trace**: The trace of a square matrix $A$ is the sum of its diagonal elements, i.e., $\\text{tr}(A) = \\sum\\_{i=1}^{n} a\\_{ii}.$ It satisfies several useful properties, among which are $\\text{tr}(AB)=\\text{tr}(BA)$, and more importantly for our discussion, $\\text{tr}(e^X)=e^x,$ where $x$ is the sum",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['1}) = \\mathrm{tr}(\\mathbf{'],
            correspondingSpans: [14],
            index: '2948220685',
            relevanceScore: 370.7925689393051,
            snippets: [
                {
                    correspondingSpanText: '1}) = \\mathrm{tr}(\\mathbf{',
                    text: '\n\\end{gather}\nNote that $\\Fe_{,\\parallel}:\\Fe_{,\\parallel}^{-T}=\\mathrm{tr}(\\Fe_{,\\parallel}\\cdot \\Fe_{,\\parallel}^{-1}) = \\mathrm{tr}(\\mathbf{I}_{\\parallel}) = 2$. Therefore, the equation above is equal to the nutrient limited growth equation $\\partial_t \\lambda_\\mathrm{g} = k_\\mathrm{g',
                },
            ],
            source: 'algebraic-stack',
            textLong:
                'equation}\nNext, we leverage the fact that the total in-plane deformation can be decomposed as $\\mathbf{F}_{\\parallel} = (\\Fe\\cdot\\Fg)_{\\parallel} = \\lambda_\\mathrm{g}\\Fe_{,\\parallel}$. Thus we obtain  $\\dot{\\mathbf{F}}_{\\parallel} = (\\partial_t \\lambda_\\mathrm{g})\\Fe_{,\\parallel} + \\lambda_\\mathrm{g} \\dot{\\Fe}_{,\\parallel}$ and $\\mathbf{F}_{\\parallel}^{-T} = \\lambda_\\mathrm{g}^{-1}\\Fe_{,\\parallel}^{-T}$. By combining these equations with Eqs. (\\ref{Eq:Jep2}) and (\\ref{Eq:Jep3}) we obtain\n\\begin{gather}\n \\lambda_\\mathrm{g}^{-1} (\\partial_t \\lambda_\\mathrm{g})  (\\Fe_{,\\parallel} : \\Fe_{,\\parallel}^{-T})= 2k_\\mathrm{g}.\n\\end{gather}\nNote that $\\Fe_{,\\parallel}:\\Fe_{,\\parallel}^{-T}=\\mathrm{tr}(\\Fe_{,\\parallel}\\cdot \\Fe_{,\\parallel}^{-1}) = \\mathrm{tr}(\\mathbf{I}_{\\parallel}) = 2$. Therefore, the equation above is equal to the nutrient limited growth equation $\\partial_t \\lambda_\\mathrm{g} = k_\\mathrm{g} \\lambda_\\mathrm{g}$, which is thus indeed equivalent to the mass conservation law in Eq.~(\\ref{Eq:MassConservation}).\n\nTo complete the Eulerian formulation of the chemo-mechanical model we also need to express the constitutive relation $\\bs{\\sigma}_\\parallel(\\Fep)$ in the current coordinates $\\bs{x}_\\parallel$.\nWe start by defining a map $\\bs{\\chi}(\\bs{x}_\\parallel,t)=\\bs{X}_{0,\\parallel}$ from the current coordinates $\\bs{x}_\\parallel$ to the initial coordinates  $\\bs{X}_{0,\\parallel}$. By definition the material derivative of this map is zero, i.e.\n\\begin{gather}\n\\partial_t \\bs{\\chi} + \\bs{v}_\\parallel\\cdot\\nabla_\\parallel\\bs{\\chi} = \\mathbf{0}.\n\\label{Eq:ChiMap}\n\\end{gather}\nThe gradient',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '    \\frac{\\partial}{\\partial \\mathbf{',
                '     \\frac{\\partial}{\\partial \\mathbf{A}}',
            ],
            correspondingSpans: [15, 31],
            index: '2957065543',
            relevanceScore: 370.54723739133453,
            snippets: [
                {
                    correspondingSpanText: '    \\frac{\\partial}{\\partial \\mathbf{',
                    text: 'r})=  \\sum_{j}\n                     \\Pi_j(x) \n                     {\\tilde a}_s\n                     \\delta(\\mathbf{r})\n                     \\frac{\\partial}{\\partial \\mathbf{r}}\\mathbf{r}\\, ,\n  \\qquad {\\tilde a}_s := \\frac{4\\pi \\hbar^2 a_s}{m}\\, , \n  \\end{',
                },
            ],
            source: 'open-web-math',
            textLong:
                '\n                            \\left[ \n                                  \\frac{m \\omega^2}{2K^2} \\sin^2(Kx)-\n                                  \\frac{m\\omega^2}{2} \n                                  x_j^2\n                            \\right].\n  \\end{eqnarray}\n  The term $V_j$ is the local second-order expansion of the optical potential,\n  thus equation \\eqref{eq:Tunn_Ham} represents the discrepancy between an\n  harmonic potential and the true optical potential, describing hopping of\n  atoms between neighbouring sites.\n  \n  Neutrality of the atoms, ensuring a finite-range interaction allows us to\n  introduce a pseudo-potential approximation (see e.g. \\cite{KH87})\n  \\begin{equation}\n    \\label{eq:PseudoPot}\n     U(\\mathbf{r})=  \\sum_{j}\n                     \\Pi_j(x) \n                     {\\tilde a}_s\n                     \\delta(\\mathbf{r})\n                     \\frac{\\partial}{\\partial \\mathbf{r}}\\mathbf{r}\\, ,\n  \\qquad {\\tilde a}_s := \\frac{4\\pi \\hbar^2 a_s}{m}\\, , \n  \\end{equation}\n  where $\\mathbf{r}$ is the interatomic distance and $a_s$ the $s-$wave\n  scattering length ($a_s$ in our approximation is considered constant).  The\n  validity of this model is ensured by the low energies involved in these\n  interactions, direct consequence of both low temperature limit (virtually\n  zero) and diluteness (low Fermi energy). Besides, the form of Eq.\n  \\eqref{eq:PseudoPot} shows that on-site terms only will contribute to the\n  interaction Hamiltonian.\n  Thus Eq. \\eqref{eq:ft-hamiltonian} can be rewritten in the form\n  \\begin{multline}\n    \\label{eq:ft-hamiltonian2}\n     \\hat{\\mathsf{H}}= \n                                        \\sum_j  \\Bigl [\n                                         \\int d\\mathbf{r} \n',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\( \\mathbf{A} \\), \\( \\mathbf{'],
            correspondingSpans: [1],
            index: '3163380458',
            relevanceScore: 367.2671261868366,
            snippets: [
                {
                    correspondingSpanText: '\\( \\mathbf{A} \\), \\( \\mathbf{',
                    text: 'under which the tensor decomposition is unique, given the constraints on the ranks \\( r_1 \\), \\( r_2 \\), and \\( r_3 \\), and the properties of the factor matrices \\( \\mathbf{A} \\), \\( \\mathbf{B} \\), and \\( \\mathbf{C} \\).\n\n2. The computer scientist wishes to apply a regularization term to the factor matrices to prevent overfitting. Define a',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                'mathbf{G} \\) and factor matrices \\( \\mathbf{A} \\), \\( \\mathbf{B} \\), and \\( \\mathbf{C} \\). The decomposition follows the form:\n\n\\[ \\mathbf{X} \\approx \\sum_{i=1}^{r_1} \\sum_{j=1}^{r_2} \\sum_{k=1}^{r_3} \\mathbf{G}_{ijk} \\mathbf{a}_i \\otimes \\mathbf{b}_j \\otimes \\mathbf{c}_k \\]\n\nwhere \\( \\otimes \\) denotes the outer product, \\( \\mathbf{a}_i \\in \\mathbb{R}^n \\), \\( \\mathbf{b}_j \\in \\mathbb{R}^m \\), \\( \\mathbf{c}_k \\in \\mathbb{R}^p \\), and \\( r_1 \\), \\( r_2 \\), \\( r_3 \\) are the ranks of the decomposition.\n\n1. Determine the conditions under which the tensor decomposition is unique, given the constraints on the ranks \\( r_1 \\), \\( r_2 \\), and \\( r_3 \\), and the properties of the factor matrices \\( \\mathbf{A} \\), \\( \\mathbf{B} \\), and \\( \\mathbf{C} \\).\n\n2. The computer scientist wishes to apply a regularization term to the factor matrices to prevent overfitting. Define a regularization term that minimizes the sum of squares of the Frobenius norms of the differences between the original tensor \\( \\mathbf{X} \\) and its approximation, while ensuring that each factor matrix remains orthogonal. Provide a mathematical formulation of this regularization term.\n<|assistant|>\nTo solve the problem, we need to address the two parts separately:\n\n1. **Conditions for Uniqueness of Tensor Decomposition:**\n\n   The uniqueness of the tensor decomposition, specifically the CANDECOMP/PARAFAC (CP) decomposition, depends on the ranks and the properties of the factor matrices involved. For a tensor \\(\\mathbf{X} \\in \\mathbb{R}^{n \\times m \\times p}\\) with decomposition ranks \\(r_1, r_2, r_3\\), and factor matrices \\(\\mathbf{A} \\in \\mathbb{R}^{n \\times r_1}\\), \\(\\mathbf{B} \\in \\mathbb{',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['derivative \\( \\frac{\\partial f}{\\partial'],
            correspondingSpans: [11],
            index: '3162872703',
            relevanceScore: 364.53041553878256,
            snippets: [
                {
                    correspondingSpanText: 'derivative \\( \\frac{\\partial f}{\\partial',
                    text: '\n\n2. To determine the threshold \\( \\lambda \\) such that the average rate of change of the surface height due to erosion does not exceed \\( \\lambda \\), we calculate the partial derivative \\( \\frac{\\partial f}{\\partial t} \\).\n\nFirst, we find the derivative of \\( f(x, y, t) \\) with respect to \\( t \\):\n\\[ f(x, y, t',
                },
            ],
            source: 'olmo-2-1124-13b-preference-mix',
            textLong:
                ', t)])^2] = \\mathbb{E}[(e^{-t} \\sin(x_0 + y_0) + W(x_0, y_0, t) - e^{-t} \\sin(x_0 + y_0))^2]. \\]\nSince \\( e^{-t} \\sin(x_0 + y_0) \\) is a constant and does not contribute to the variance, we have:\n\\[ \\text{Var}[f(x_0, y_0, t)] = \\mathbb{E}[(W(x_0, y_0, t))^2] = t. \\]\n\nSo, the answers are:\n\\[ \\mathbb{E}[f(x_0, y_0, t)] = e^{-t} \\sin(x_0 + y_0), \\]\n\\[ \\text{Var}[f(x_0, y_0, t)] = t. \\]\n\n2. To determine the threshold \\( \\lambda \\) such that the average rate of change of the surface height due to erosion does not exceed \\( \\lambda \\), we calculate the partial derivative \\( \\frac{\\partial f}{\\partial t} \\).\n\nFirst, we find the derivative of \\( f(x, y, t) \\) with respect to \\( t \\):\n\\[ f(x, y, t) = e^{-t} \\sin(x + y) + W(x, y, t). \\]\nSince \\( W(x, y, t) \\) is a Brownian motion, \\( \\frac{\\partial W(x, y, t)}{\\partial t} \\) does not exist in a pointwise sense but we can consider it as having unit variance (i.e., its increment variance is related to the time interval). Thus, the deterministic part is differentiated:\n\\[ \\frac{\\partial f}{\\partial t} = \\frac{\\partial}{\\partial t} (e^{-t} \\sin(x + y)) + \\frac{\\partial W(x, y, t)}{\\partial t} = -e^{-t} \\sin(x + y) + \\frac{\\partial W(x, y, t)}{\\partial t}. \\]\n\nThe partial derivative \\( \\frac{\\partial}{\\partial t} W(x, y, t) \\) is a Gaussian random variable with mean ',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\mathrm{tr}(\\mathbf{A}^{-',
                ' \\mathrm{tr}(\\mathbf{A}^{-',
                ' \\mathrm{tr}(\\mathbf{A}^{-1} \\mathbf{A}^{-',
                '1}) = \\mathrm{tr}(\\mathbf{A}^{-T} \\mathbf{A}^{-',
                '     \\frac{\\partial}{\\partial \\mathbf{A}} \\mathrm{tr}(\\mathbf{A}^{-1} \\mathbf{A}^{-',
            ],
            correspondingSpans: [10, 12, 13, 14, 15],
            index: '2951463167',
            relevanceScore: 362.9555284448771,
            snippets: [
                {
                    correspondingSpanText: '\\mathrm{tr}(\\mathbf{A}^{-',
                    text: '\\mathbf{A}, H &\\sim& \\mathcal{I}\\mathcal{G} ( \\frac{r_k+n_kd}{2}, \\frac{p_k + \\mathrm{tr}(\\mathbf{A}^{-1}  ( \\frac{n_k \\kappa_n}{n_k+\\kappa_n} (\\bar{\\mathbf{x}}_k - \\boldsymbol{\\mu}_0) (\\',
                },
                {
                    correspondingSpanText: '\\mathrm{tr}(\\mathbf{A}^{-1}',
                    text: '\\mathbf{A}, H &\\sim& \\mathcal{I}\\mathcal{G} ( \\frac{r_k+n_kd}{2}, \\frac{p_k + \\mathrm{tr}(\\mathbf{A}^{-1}  ( \\frac{n_k \\kappa_n}{n_k+\\kappa_n} (\\bar{\\mathbf{x}}_k - \\boldsymbol{\\mu}_0) (\\bar{\\',
                },
            ],
            source: 'arxiv',
            textLong:
                'X}, \\mathbf{z}, \\boldsymbol{\\Sigma}_k, H &\\sim& \\mathcal{N} (\\boldsymbol{\\mu}_n, \\boldsymbol{\\Sigma}_k/(n_k+\\kappa_n)) \\nonumber \\\\\n a_j|\\mathbf{X}, \\mathbf{z}, \\lambda_k, H &\\sim& \\mathcal{I}\\mathcal{G} (   \\frac{n+\\nu_k + Kd+1}{2},      \\frac{\\text{diag}(\\sum_{k=1}^{K} \\lambda_k^{-1}  (\\frac{n_k \\kappa_n}{n_k+\\kappa_n} (\\bar{\\mathbf{x}}_k - \\boldsymbol{\\mu}_0) (\\bar{\\mathbf{x}}_k - \\boldsymbol{\\mu}_0)^T + W_k + \\Lambda_k)  )}{2}  ) \\nonumber \\\\\n \\lambda_k|\\mathbf{X}, \\mathbf{z}, \\mathbf{A}, H &\\sim& \\mathcal{I}\\mathcal{G} ( \\frac{r_k+n_kd}{2}, \\frac{p_k + \\mathrm{tr}(\\mathbf{A}^{-1}  ( \\frac{n_k \\kappa_n}{n_k+\\kappa_n} (\\bar{\\mathbf{x}}_k - \\boldsymbol{\\mu}_0) (\\bar{\\mathbf{x}}_k - \\boldsymbol{\\mu}_0)^T + W_k + \\Lambda_k ) )}{2} ).\\nonumber \n\\end{eqnarray}\n}\n\\vspace{-0.5cm}\n\\subsection{General models}\n\\paragraph{(5) Model $\\lambda \\mathbf{D} \\mathbf{A} \\mathbf{D}^T$}\nThe first general model has the $\\lambda \\mathbf{D} \\mathbf{A} \\mathbf{D}^T$ parametrization,\nwhere the covariance matrices have the same volume $\\lambda>0$, orientation $\\mathbf{D}$ and shape $\\mathbf{A}$ for all the components of the mixture.\nThis is equivalent, in the literature, to the model where the covariance $\\boldsymbol{\\Sigma}$ is considered equal throw all the components of the mixture.\nThe resulting conjugate normal inverse Wishart prior over the parameters $(\\boldsymbol{\\mu}_1, \\ldots, \\boldsymbol',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '    \\frac{\\partial^2 f}{\\partial',
                '     \\frac{\\partial^2 f}{\\partial \\mathbf{',
            ],
            correspondingSpans: [18, 20],
            index: '1674400691',
            relevanceScore: 354.979598079806,
            snippets: [
                {
                    correspondingSpanText: '    \\frac{\\partial^2 f}{\\partial',
                    text: '41 <Jr Mime> Yes\n00:42 <Jr Mime> Goes alphabetic\n00:42 <Dtm142>     \\frac{\\partial^2 f}{\\partial y \\, \\partial x} = \\frac{\\partial}{\\partial y} \\left( \\frac{\\partial f}{\\partial x} \\right) = f_{xy} = \\partial_{y',
                },
            ],
            source: 'dclm-hero-run-fasttext_for_HF',
            textLong:
                'idro> Lol\n00:32 <Haidro> easy task\n00:37 <Jr Mime> Haidro\n00:37 <Jr Mime> 600-700 moves for canada -> Canada\n00:41 <Dtm142> Partial derivatives\n00:41 <Dtm142> Subscripts.\n00:41 <Jr Mime> What\n00:41 <Jr Mime> Stop talking spanish\n00:41 <Dtm142> Is the first one done first?\n00:41 <Dtm142> Like if you have u_xy\n00:41 <Dtm142> Does that mean you take du/dx first\n00:41 <Dtm142> Then find the derivative with respect to y of that?\n00:41 <Jr Mime> Yes\n00:42 <Jr Mime> Goes alphabetic\n00:42 <Dtm142>     \\frac{\\partial^2 f}{\\partial y \\, \\partial x} = \\frac{\\partial}{\\partial y} \\left( \\frac{\\partial f}{\\partial x} \\right) = f_{xy} = \\partial_{yx} f. \n00:42 <Dtm142>\n00:43 <Dtm142> Makes sense\n00:43 <Jr Mime> Da fudge are you talking about\n00:43 <Jr Mime> Really, I do not understand except  "Does that mean you take du/dx first"\n00:43 <Dtm142> You do the one on the left first.\n00:43 <Jr Mime> Lol\n00:43 <Dtm142>\n00:43 <Dtm142> (H)\n00:44 <Jr Mime> I got AAA AAB AAC ect\n00:47 <Haidro> [[RS:RAFFLE]]\n00:48 -!- Dtm142 has left Special:Ch',

            url: 'https://runescape.wiki/w/RuneScape:Chat/Logs/02_February_2013',
            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                "this problem, let's first recall some fundamental definitions and properties of",
            ],
            correspondingSpans: [0],
            index: '3139352090',
            relevanceScore: 352.28736424088544,
            snippets: [
                {
                    correspondingSpanText:
                        "this problem, let's first recall some fundamental definitions and properties of",
                    text: " To solve this problem, let's first recall some fundamental definitions and properties of cumulative distribution functions (CDFs) and expected values. Then, we will apply these concepts step by step to compute the expected value E(X) for the given CDF F(x",
                },
            ],
            source: 'dolmino',
            textLong:
                " To solve this problem, let's first recall some fundamental definitions and properties of cumulative distribution functions (CDFs) and expected values. Then, we will apply these concepts step by step to compute the expected value E(X) for the given CDF F(x) = 1 - x^(-\u03b1), x \u2265 1, and identify the values of \u03b1 for which E(X) exists.\n\n**Cumulative Distribution Functions (CDFs)**\n\nA cumulative distribution function F(x) of a random variable X is defined as the probability that X takes on a value less than or equal to x:\n\nF(x) := P(X \u2264 x)\n\nSome important properties of CDFs include:\n\n1. F(x) is non-decreasing; i.e., if x1 < x2, then F(x1) \u2264 F(x2).\n2. F(x) is right-continuous; i.e., lim{x' \u2192 x+} F(x') = F(x).\n3. F(\u2212\u221e) = 0 and F(+\u221e) = 1.\n4. If f(x) is the probability density",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '    \\frac{\\partial^2 f}{\\partial',
                '     \\frac{\\partial^2 f}{\\partial \\mathbf{',
            ],
            correspondingSpans: [18, 20],
            index: '2948224399',
            relevanceScore: 351.6424958103242,
            snippets: [
                {
                    correspondingSpanText: '    \\frac{\\partial^2 f}{\\partial',
                    text: '}{\\partial t \\partial s} &  \\frac{\\partial^2 f}{\\partial t^2} &  \\frac{\\partial^2 f}{\\partial t \\partial b} \\\\\n     \\frac{\\partial^2 f}{\\partial b \\partial s} &  \\frac{\\partial^2 f}{\\partial b \\partial t} &  \\frac{\\partial^2 f}{\\partial b^2}\n\\end{',
                },
            ],
            source: 'algebraic-stack',
            textLong:
                '{\\partial f}{\\partial s}=\\frac{\\partial f}{\\partial t}=\\frac{\\partial f}{\\partial b}=0,\n\\end{equation}\nsubjected to the conditions\n\\begin{equation}\n\\label{stb}\\frac{\\partial^2 f}{\\partial s^2}\\ge 0,\n\\quad{\\begin{bmatrix}\n   \\frac{\\partial^2 f}{\\partial s^2} & \\frac{\\partial^2 f}{\\partial s \\partial t}  \\\\\n    \\frac{\\partial^2 f}{\\partial t \\partial s} &  \\frac{\\partial^2 f}{\\partial t^2}\n\\end{bmatrix}}\\geq 0,\n\\quad {\\begin{bmatrix}\n   \\frac{\\partial^2 f}{\\partial s^2} & \\frac{\\partial^2 f}{\\partial s \\partial t} & \\frac{\\partial^2 f}{\\partial s \\partial b} \\\\\n    \\frac{\\partial^2 f}{\\partial t \\partial s} &  \\frac{\\partial^2 f}{\\partial t^2} &  \\frac{\\partial^2 f}{\\partial t \\partial b} \\\\\n     \\frac{\\partial^2 f}{\\partial b \\partial s} &  \\frac{\\partial^2 f}{\\partial b \\partial t} &  \\frac{\\partial^2 f}{\\partial b^2}\n\\end{bmatrix}}\\geq 0\n\\end{equation}\nEquations (\\ref{df}) have always the trivial solution\n\\begin{equation}\n\\label{4} s=t=|{\\bf b}|=0,\n\\end{equation}\ncorresponding to the non deformed  (uniform) state. The stability of this state requires that, as it follows from the conditions of stability represented by (\\ref{stb}),\n\\begin{equation}\n\\label{5}K_{11}\\geq 0,\\quad\\quad K_{11} K_{22}\\geq 0,\\quad\\quad K_{11}K_{22}K_{33}\\geq 0.\n\\end{equation}\nAs  expected the non deformed state is stable only if the elastic constants of Frank-Oseen are positive. Hereafter, trivial solutions are not discussed.\n\n\nIn case of non--trivial solutions implying at least one negative',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\frac{\\partial^2 f}{\\partial \\mathbf{',
                ' \\) and \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
                '-order derivative \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
                '     \\frac{\\partial^2 f}{\\partial \\mathbf{',
                '- \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
            ],
            correspondingSpans: [6, 9, 17, 18, 20, 35],
            index: '2957140970',
            relevanceScore: 351.2698630548679,
            snippets: [
                {
                    correspondingSpanText: '\\frac{\\partial^2 f}{\\partial \\mathbf{',
                    text: "\n    =\\frac{\\partial \\mathbf{h}}{\\partial \\mathbf{y}}\n    -\\left(\n    (z'-f(\\mathbf{y}_{\\text{p}}))\n    \\frac{\\partial^2 f}{\\partial \\mathbf{y}^2}(\\mathbf{y}_{\\text{p}})\n    -\\nabla f(\\mathbf{y}_{\\text{p}})\n    \\nabla f(\\mathbf{y}_{\\text{p}}",
                },
            ],
            source: 'open-web-math',
            textLong:
                "{p}}),1)_B,\n    $$\n    which implies that\n    \\begin{equation}\\label{eq:A:x-projection-general-f}\n    \\mathbf{y}'= \\mathbf{y}_{\\text{p}}-(z'-f(\\mathbf{y}_{\\text{p}})) \\nabla f(\\mathbf{y}_{\\text{p}})=:\\mathbf{F}(\\mathbf{y}_{\\text{p}}).\n    \\end{equation}\n    Using the fact that $\\mathbf{y}_{\\text{p}}=\\mathbf{h}(\\mathbf{y}',z')$\n    and\n    differentiating both sides with\n    respect to $\\mathbf{y}'$ gives us,\n    \\begin{align*}\n    I&=\n    \\frac{\\partial \\mathbf{F}(\\y_{\\text{p}})}{\\partial \\y_{\\text{p}}}^T\n    \\frac{\\partial \\mathbf{h}}{\\partial \\mathbf{y}}\n    =\\frac{\\partial \\mathbf{h}}{\\partial \\mathbf{y}}\n    -\\left(\n    (z'-f(\\mathbf{y}_{\\text{p}}))\n    \\frac{\\partial^2 f}{\\partial \\mathbf{y}^2}(\\mathbf{y}_{\\text{p}})\n    -\\nabla f(\\mathbf{y}_{\\text{p}})\n    \\nabla f(\\mathbf{y}_{\\text{p}})^T\\right)\\frac{\\partial \\mathbf{h}}{\\partial \\mathbf{y}},\n    \\end{align*}\n    and the result follows upon evaluating\n    at $\\mathbf{y}'=\\mathbf{y}_{\\text{p}}=\\mathbf{0}$ and using \\eqref{eq:f-properties-def-M}.\n    Since $\\mathbf{h}$ is smooth on ${\\mathcal M}_L$\n    the matrix $D$ must thus be well-defined.\n    \n    For the second order term in the Taylor expansion,\n    we write $\\y_{\\text{p}}=(y_1,y_2)$, $\\mathbf{h}=(h_1,h_2)^T$ and\n    $\\mathbf{F}=(F_1,F_2)^T$. We then\n    get for $j=1,2$,\n    $$\n    \\mathbf{0} =\\frac{\\partial^2 F_j(\\mathbf{h})}{\\",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['of \\( f \\) with respect to \\( \\mathbf{'],
            correspondingSpans: [7],
            index: '3163266946',
            relevanceScore: 344.09084375424135,
            snippets: [
                {
                    correspondingSpanText: 'of \\( f \\) with respect to \\( \\mathbf{',
                    text: "with respect to \\( W \\):**\n\nFor \\( W \\), consider the component \\( \\mathbf{w}_i \\cdot \\mathbf{x} \\) in the activation function. The gradient of \\( f \\) with respect to \\( \\mathbf{w}_i \\) is:\n\\[ \\frac{\\partial f}{\\partial \\mathbf{w}_i} = v_i \\sigma'(\\mathbf{w}_i \\cdot \\mathbf",
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                "y, f(\\mathbf{x})) \\) is differentiable. We need to find the gradients \\( \\frac{\\partial L}{\\partial \\mathbf{v}} \\) and \\( \\frac{\\partial L}{\\partial W} \\).\n\n**Gradient with respect to \\( \\mathbf{v} \\):**\n\nThe output \\( f(\\mathbf{x}) \\) is linear in \\( \\mathbf{v} \\), so:\n\\[ \\frac{\\partial f}{\\partial v_i} = \\sigma(\\mathbf{w}_i \\cdot \\mathbf{x}) \\]\n\nUsing the chain rule, the gradient of the loss with respect to \\( v_i \\) is:\n\\[ \\frac{\\partial L}{\\partial v_i} = \\frac{\\partial L}{\\partial f} \\frac{\\partial f}{\\partial v_i} = \\frac{\\partial L}{\\partial f} \\cdot \\sigma(\\mathbf{w}_i \\cdot \\mathbf{x}) \\]\n\n**Gradient with respect to \\( W \\):**\n\nFor \\( W \\), consider the component \\( \\mathbf{w}_i \\cdot \\mathbf{x} \\) in the activation function. The gradient of \\( f \\) with respect to \\( \\mathbf{w}_i \\) is:\n\\[ \\frac{\\partial f}{\\partial \\mathbf{w}_i} = v_i \\sigma'(\\mathbf{w}_i \\cdot \\mathbf{x}) \\mathbf{x} \\]\n\nThe gradient of the loss with respect to \\( \\mathbf{w}_i \\) is:\n\\[ \\frac{\\partial L}{\\partial \\mathbf{w}_i} = \\frac{\\partial L}{\\partial f} \\frac{\\partial f}{\\partial \\mathbf{w}_i} = \\frac{\\partial L}{\\partial f} \\cdot v_i \\sigma'(\\mathbf{w}_i \\cdot \\mathbf{x}) \\mathbf{x} \\]\n\nThus, the gradient with respect to \\( W \\) is:\n\\[ \\frac{\\partial L}{\\partial W} = \\begin{bmatrix} \n\\frac{\\partial L}{\\partial \\mathbf{w}_1} \\\\ \n\\frac{\\partial L}{\\partial \\mathbf{w}_2} \\\\ \n\\vdots \\\\ \n\\frac{\\partial L}{\\partial \\mathbf{w}_m} \n\\end{bmatrix} = \\begin{bmatrix} ",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['of \\( f \\) with respect to \\( \\mathbf{'],
            correspondingSpans: [7],
            index: '3159697586',
            relevanceScore: 344.09084375424135,
            snippets: [
                {
                    correspondingSpanText: 'of \\( f \\) with respect to \\( \\mathbf{',
                    text: "with respect to \\( W \\):**\n\nFor \\( W \\), consider the component \\( \\mathbf{w}_i \\cdot \\mathbf{x} \\) in the activation function. The gradient of \\( f \\) with respect to \\( \\mathbf{w}_i \\) is:\n\\[ \\frac{\\partial f}{\\partial \\mathbf{w}_i} = v_i \\sigma'(\\mathbf{w}_i \\cdot \\mathbf",
                },
            ],
            source: 'dolmino',
            textLong:
                "y, f(\\mathbf{x})) \\) is differentiable. We need to find the gradients \\( \\frac{\\partial L}{\\partial \\mathbf{v}} \\) and \\( \\frac{\\partial L}{\\partial W} \\).\n\n**Gradient with respect to \\( \\mathbf{v} \\):**\n\nThe output \\( f(\\mathbf{x}) \\) is linear in \\( \\mathbf{v} \\), so:\n\\[ \\frac{\\partial f}{\\partial v_i} = \\sigma(\\mathbf{w}_i \\cdot \\mathbf{x}) \\]\n\nUsing the chain rule, the gradient of the loss with respect to \\( v_i \\) is:\n\\[ \\frac{\\partial L}{\\partial v_i} = \\frac{\\partial L}{\\partial f} \\frac{\\partial f}{\\partial v_i} = \\frac{\\partial L}{\\partial f} \\cdot \\sigma(\\mathbf{w}_i \\cdot \\mathbf{x}) \\]\n\n**Gradient with respect to \\( W \\):**\n\nFor \\( W \\), consider the component \\( \\mathbf{w}_i \\cdot \\mathbf{x} \\) in the activation function. The gradient of \\( f \\) with respect to \\( \\mathbf{w}_i \\) is:\n\\[ \\frac{\\partial f}{\\partial \\mathbf{w}_i} = v_i \\sigma'(\\mathbf{w}_i \\cdot \\mathbf{x}) \\mathbf{x} \\]\n\nThe gradient of the loss with respect to \\( \\mathbf{w}_i \\) is:\n\\[ \\frac{\\partial L}{\\partial \\mathbf{w}_i} = \\frac{\\partial L}{\\partial f} \\frac{\\partial f}{\\partial \\mathbf{w}_i} = \\frac{\\partial L}{\\partial f} \\cdot v_i \\sigma'(\\mathbf{w}_i \\cdot \\mathbf{x}) \\mathbf{x} \\]\n\nThus, the gradient with respect to \\( W \\) is:\n\\[ \\frac{\\partial L}{\\partial W} = \\begin{bmatrix} \n\\frac{\\partial L}{\\partial \\mathbf{w}_1} \\\\ \n\\frac{\\partial L}{\\partial \\mathbf{w}_2} \\\\ \n\\vdots \\\\ \n\\frac{\\partial L}{\\partial \\mathbf{w}_m} \n\\end{bmatrix} = \\begin{bmatrix} ",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\frac{\\partial f}{\\partial \\mathbf{A}}',
                ' Compute \\( \\frac{\\partial f}{\\partial \\mathbf{A}}',
                ' derivative \\( \\frac{\\partial f}{\\partial \\mathbf{A}}',
                ' \\frac{\\partial f}{\\partial \\mathbf{A}} = ',
            ],
            correspondingSpans: [5, 8, 11, 34],
            index: '2950233806',
            relevanceScore: 343.31436186918756,
            snippets: [
                {
                    correspondingSpanText: '\\frac{\\partial f}{\\partial \\mathbf{A}}',
                    text: 'm}$, definimos o gradiente de $f$ com respeito a $\\mathbf{A}$ como:\n\n\\begin{equation*}\n\\nabla_{\\mathbf{A}}f = \\frac{\\partial f}{\\partial \\mathbf{A}} =  \\begin{bmatrix}\n\\frac{\\partial f}{\\partial \\mathbf{A}_{1,1}} & \\dots & \\frac{\\partial f}{\\partial \\mathbf{A}_{',
                },
                {
                    correspondingSpanText: '\\frac{\\partial f}{\\partial \\mathbf{A}} = ',
                    text: 'm}$, definimos o gradiente de $f$ com respeito a $\\mathbf{A}$ como:\n\n\\begin{equation*}\n\\nabla_{\\mathbf{A}}f = \\frac{\\partial f}{\\partial \\mathbf{A}} =  \\begin{bmatrix}\n\\frac{\\partial f}{\\partial \\mathbf{A}_{1,1}} & \\dots & \\frac{\\partial f}{\\partial \\mathbf{A}_{1,',
                },
            ],
            source: 'algebraic-stack',
            textLong:
                "um im\u00f3vel, pre\u00e7o desse im\u00f3vel em $)*. Nossa tarefa \u00e9 construir um modelo que consiga predizer o valor dos im\u00f3veis, dadas as suas \u00e1reas.\n\n\n```python\nX, y = get_housing_prices_data(N=100)\n```\n\n### Plotando os dados\n\nAcima temos algumas informa\u00e7\u00f5es sobre os dados. Podemos tamb\u00e9m visualizar cada ponto.\n\n\n```python\nplot_points_regression(X,\n                       y,\n                       title='Real estate prices prediction',\n                       xlabel=\"m\\u00b2\",\n                       ylabel='$')\n```\n\n### Equa\u00e7\u00f5es normais\n\nDados $f:\\mathbb{R}^{n\\times m} \\rightarrow \\mathbb{R}$ e $\\mathbf{A} \\in \\mathbb{R}^{n\\times m}$, definimos o gradiente de $f$ com respeito a $\\mathbf{A}$ como:\n\n\\begin{equation*}\n\\nabla_{\\mathbf{A}}f = \\frac{\\partial f}{\\partial \\mathbf{A}} =  \\begin{bmatrix}\n\\frac{\\partial f}{\\partial \\mathbf{A}_{1,1}} & \\dots & \\frac{\\partial f}{\\partial \\mathbf{A}_{1,m}} \\\\\n\\vdots &  \\ddots & \\vdots \\\\\n\\frac{\\partial f}{\\partial \\mathbf{A}_{n,1}} &  \\dots & \\frac{\\partial f}{\\partial \\mathbf{A}_{n,m}}\n\\end{bmatrix}\n\\end{equation*}\n\nSeja $\\mathbf{X} \\in \\mathbb{R}^{N\\times m}$ a matriz cujas linhas s\u00e3o as observa\u00e7\u00f5es do dataset (tamb\u00e9m chamada de *design matrix*) e seja $\\mathbf{y} \\in \\mathbb{R}^{N}$ o vetor contendo todos os valores de $y_{i}$ (i.e., $\\mathbf{X}_{i,:} = \\mathbf{x}_{i}$ e $\\mathbf{y}_{i} =y_{i}$). \u00c9 f\u00e1cil checar que: \n\n\n\\begin{equation}\nJ(\\mathbf{w}) = \\frac{",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                "this problem, let's first recall some fundamental definitions and properties of",
            ],
            correspondingSpans: [0],
            index: '3139447230',
            relevanceScore: 343.1950674517662,
            snippets: [
                {
                    correspondingSpanText:
                        "this problem, let's first recall some fundamental definitions and properties of",
                    text: " To solve this problem, let's first recall some fundamental definitions and properties of vectors and vector-valued functions. Then, we will apply these concepts to derive the equation of the tangent plane to a parametric surface at a specified point. This approach should help clarify any",
                },
            ],
            source: 'dolmino',
            textLong:
                " To solve this problem, let's first recall some fundamental definitions and properties of vectors and vector-valued functions. Then, we will apply these concepts to derive the equation of the tangent plane to a parametric surface at a specified point. This approach should help clarify any confusion regarding determining partial derivatives ($f_x$ and $f_y$) when dealing with coordinate systems other than Cartesian ones.\n\nLet $\\mathbf r(t) = x(t)\\hat{\\imath}+y(t)\\hat\\jmath + z(t)\\hat{k}$ be a differentiable vector-valued function representing a space curve. The velocity vector $\\mathbf v(t)$ is defined as its derivative, i.e., $\\mathbf v(t)=\\mathbf r'(t)=dx/dt\\,\\hat{\\imath}+dy/dt\\,\\hat\\jmath + dz/dt\\,\\hat{k}$. A unit tangent vector $\\mathbf T$ can then be obtained by normalizing the velocity vector: $\\mathbf T=\\mathbf v/\\|\\mathbf v\\|$.\n\nNow consider a scalar-valued function $f:\\mathbb{R}^3\\to\\mathbb{R}$, which assigns a real number to every point in three-dimensional space. Its gradient, denoted",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\frac{\\partial f}{\\partial \\mathbf{A}}',
                ' Compute \\( \\frac{\\partial f}{\\partial \\mathbf{A}}',
                ' derivative \\( \\frac{\\partial f}{\\partial \\mathbf{A}}',
                ' \\frac{\\partial f}{\\partial \\mathbf{A}} = ',
            ],
            correspondingSpans: [5, 8, 11, 34],
            index: '2950250684',
            relevanceScore: 342.90900811131485,
            snippets: [
                {
                    correspondingSpanText: '\\frac{\\partial f}{\\partial \\mathbf{A}}',
                    text: 'm}$, definimos o gradiente de $f$ com respeito a $\\mathbf{A}$ como:\n\n\\begin{equation*}\n\\nabla_{\\mathbf{A}}f = \\frac{\\partial f}{\\partial \\mathbf{A}} =  \\begin{bmatrix}\n\\frac{\\partial f}{\\partial \\mathbf{A}_{1,1}} & \\dots & \\frac{\\partial f}{\\partial \\mathbf{A}_{',
                },
                {
                    correspondingSpanText: '\\frac{\\partial f}{\\partial \\mathbf{A}} = ',
                    text: 'm}$, definimos o gradiente de $f$ com respeito a $\\mathbf{A}$ como:\n\n\\begin{equation*}\n\\nabla_{\\mathbf{A}}f = \\frac{\\partial f}{\\partial \\mathbf{A}} =  \\begin{bmatrix}\n\\frac{\\partial f}{\\partial \\mathbf{A}_{1,1}} & \\dots & \\frac{\\partial f}{\\partial \\mathbf{A}_{1,',
                },
            ],
            source: 'algebraic-stack',
            textLong:
                "vel) e com isso vamos associar um valor (o pre\u00e7o desse im\u00f3vel em $). Nossa tarefa \u00e9 construir um modelo que consiga predizer o valor dos im\u00f3veis.\n\n\n```python\nX, y = get_housing_prices_data(N=100)\n```\n\n### Plotando os dados\n\nAcima temos algumas informa\u00e7\u00f5es sobre os dados, podemos tamb\u00e9m visualizar cada ponto.\n\n\n```python\nplot_points_regression(X,\n                       y,\n                       title='Real estate prices prediction',\n                       xlabel=\"m\\u00b2\",\n                       ylabel='$')\n```\n\n### Equa\u00e7\u00f5es normais\n\nDados $f:\\mathbb{R}^{n\\times m} \\rightarrow \\mathbb{R}$ e $\\mathbf{A} \\in \\mathbb{R}^{n\\times m}$, definimos o gradiente de $f$ com respeito a $\\mathbf{A}$ como:\n\n\\begin{equation*}\n\\nabla_{\\mathbf{A}}f = \\frac{\\partial f}{\\partial \\mathbf{A}} =  \\begin{bmatrix}\n\\frac{\\partial f}{\\partial \\mathbf{A}_{1,1}} & \\dots & \\frac{\\partial f}{\\partial \\mathbf{A}_{1,m}} \\\\\n\\vdots &  \\ddots & \\vdots \\\\\n\\frac{\\partial f}{\\partial \\mathbf{A}_{n,1}} &  \\dots & \\frac{\\partial f}{\\partial \\mathbf{A}_{n,m}}\n\\end{bmatrix}\n\\end{equation*}\n\nSeja $\\mathbf{X} \\in \\mathbb{R}^{N\\times m}$ a matriz cujas linhas s\u00e3o as observa\u00e7\u00f5es do dataset (tamb\u00e9m chamada de *design matrix*) e seja $\\mathbf{y} \\in \\mathbb{R}^{N}$ o vetor contendo todos os valores de $y_{i}$ (i.e., $\\mathbf{X}_{i,:} = \\mathbf{x}_{i}$ e $\\mathbf{y}_{i} =y_{i}$). \u00c9 f\u00e1cil checar que: \n\n\n\\begin{equation}\nJ(\\mathbf{w}) = \\frac{",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['**Determinant**: The determinant of a square matrix'],
            correspondingSpans: [4],
            index: '3139247817',
            relevanceScore: 341.3623315365072,
            snippets: [
                {
                    correspondingSpanText: '**Determinant**: The determinant of a square matrix',
                    text: "ichever is smaller. Since multiplication by an invertible matrix doesn't change the dimensions of the spaces spanned by columns or rows, similar matrices always share the same rank.\n\n2. **Determinant**: The determinant of a square matrix measures its scaling factor when applied to vectors or areas/volumes; hence, det(B)=det(P^(-1)AP)=det(P)^(-1)det(A)",
                },
            ],
            source: 'dolmino',
            textLong:
                " Similar matrices are a fundamental concept in linear algebra, which deals with the study of vector spaces and linear mappings between them. Two matrices, A and B, are considered similar if there exists an invertible matrix P such that B = P^(-1)AP. This relationship has significant implications because similar matrices share several important properties, including rank, determinant, trace, eigenvalues, characteristic polynomials, minimal polynomials, and elementary divisors.\n\nBefore diving into the methods used to determine whether two matrices are similar, let's first explore these shared properties more closely:\n\n1. **Rank**: The rank of a matrix is the dimension of its column space or row space, whichever is smaller. Since multiplication by an invertible matrix doesn't change the dimensions of the spaces spanned by columns or rows, similar matrices always share the same rank.\n\n2. **Determinant**: The determinant of a square matrix measures its scaling factor when applied to vectors or areas/volumes; hence, det(B)=det(P^(-1)AP)=det(P)^(-1)det(A)det(P), meaning det(A)=det(B).\n\n3. **Trace**: The trace of a matrix is defined as the sum of its diagonal elements. Given the cyclical property of traces under matrix multiplication, Tr(B)=Tr(P^(-1)AP)=Tr(APP^(-1))=Tr(A). Thus, similar matrices have identical traces.\n\n4. **Eigenvalues**: Although corresponding eigenvectors differ, eigenvalues remain unchanged since det(A\u2212\u03bbI)=det(P^(-1)(B\u2212\u03bbI)P) implies that det(B\u2212\u03bbI)=det(A\u2212\u03bbI); therefore, both possess equal sets of eigenvalues.\n\n5. **Characteristic Polynomial**: As seen from their equality above, the roots of the characteristic polynomial p_A(t):=det(A\u2212tI) and p_B(t):=det(B\u2212tI) coincide due to sharing common eigenvalues",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                "To approach this problem, let's first recall some fundamental definitions and properties",
            ],
            correspondingSpans: [0],
            index: '3139855194',
            relevanceScore: 340.3786535620941,
            snippets: [
                {
                    correspondingSpanText:
                        "To approach this problem, let's first recall some fundamental definitions and properties",
                    text: "A + \\lambda B$ is invertible, given that $A$ is a $n xx n$ matrix with real coefficients and $B$ is an invertible matrix of the same size. To approach this problem, let's first recall some fundamental definitions and properties regarding matrices and their inverses. Then, we will build up to the main result using these concepts.\n\n**Definition:** A square matrix $A$ is said to be invertible",
                },
            ],
            source: 'dolmino',
            textLong:
                " The problem at hand involves showing that there exists a real number $\\lambda$ such that the matrix $A + \\lambda B$ is invertible, given that $A$ is a $n xx n$ matrix with real coefficients and $B$ is an invertible matrix of the same size. To approach this problem, let's first recall some fundamental definitions and properties regarding matrices and their inverses. Then, we will build up to the main result using these concepts.\n\n**Definition:** A square matrix $A$ is said to be invertible if there exists another square matrix $B$ such that $AB = BA = I$, where $I$ denotes the identity matrix. If such a $B$ exists, we call it the inverse of $A$ and denote it by $A^{-1}$.\n\n**Property 1:** The determinant of an invertible matrix is nonzero, i.e., if $A$ is invertible, then $|A| \\neq 0$. Conversely, if $|A|=0$, then $A$ is not invertible.\n\n**Property 2:** Let $A$ and $B$ be two square matrices of the same size. If both $A$ and $B$ are invertible, then their product $AB$ is also invertible. However, the sum $A+B$ does not necessarily yield an invertible matrix. Instead, we consider the expression $A + \\lambda B$ and look for values of $\\lambda$ that render the resulting matrix invertible",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\frac{\\partial f}{\\partial \\mathbf{A}}',
                ' Compute \\( \\frac{\\partial f}{\\partial \\mathbf{A}}',
                ' derivative \\( \\frac{\\partial f}{\\partial \\mathbf{A}}',
                ' \\frac{\\partial f}{\\partial \\mathbf{A}} = ',
            ],
            correspondingSpans: [5, 8, 11, 34],
            index: '3055551485',
            relevanceScore: 339.03634831120286,
            snippets: [
                {
                    correspondingSpanText: '\\frac{\\partial f}{\\partial \\mathbf{A}}',
                    text: 'imos o gradiente de $f$ com respeito a $\\mathbf{A}$ como:\n#\n# \\begin{equation*}\n# \\nabla_{\\mathbf{A}}f = \\frac{\\partial f}{\\partial \\mathbf{A}} =  \\begin{bmatrix}\n# \\frac{\\partial f}{\\partial \\mathbf{A}_{1,1}} & \\dots & \\frac{\\partial f}{\\partial \\mathbf{A',
                },
                {
                    correspondingSpanText: '\\frac{\\partial f}{\\partial \\mathbf{A}} = ',
                    text: 'imos o gradiente de $f$ com respeito a $\\mathbf{A}$ como:\n#\n# \\begin{equation*}\n# \\nabla_{\\mathbf{A}}f = \\frac{\\partial f}{\\partial \\mathbf{A}} =  \\begin{bmatrix}\n# \\frac{\\partial f}{\\partial \\mathbf{A}_{1,1}} & \\dots & \\frac{\\partial f}{\\partial \\mathbf{A}_{1',
                },
            ],
            source: 'starcoder',
            textLong:
                "metros quadrados de um im\u00f3vel, pre\u00e7o desse im\u00f3vel em $)*. Nossa tarefa \u00e9 construir um modelo que consiga predizer o valor dos im\u00f3veis, dadas as suas \u00e1reas.\n\nX, y = get_housing_prices_data(N=100)\n\n# ### Plotando os dados\n#\n# Acima temos algumas informa\u00e7\u00f5es sobre os dados. Podemos tamb\u00e9m visualizar cada ponto.\n\nplot_points_regression(X,\n                       y,\n                       title='Real estate prices prediction',\n                       xlabel=\"m\\u00b2\",\n                       ylabel='$')\n\n\n# ### Equa\u00e7\u00f5es normais\n#\n# Dados $f:\\mathbb{R}^{n\\times m} \\rightarrow \\mathbb{R}$ e $\\mathbf{A} \\in \\mathbb{R}^{n\\times m}$, definimos o gradiente de $f$ com respeito a $\\mathbf{A}$ como:\n#\n# \\begin{equation*}\n# \\nabla_{\\mathbf{A}}f = \\frac{\\partial f}{\\partial \\mathbf{A}} =  \\begin{bmatrix}\n# \\frac{\\partial f}{\\partial \\mathbf{A}_{1,1}} & \\dots & \\frac{\\partial f}{\\partial \\mathbf{A}_{1,m}} \\\\\n# \\vdots &  \\ddots & \\vdots \\\\\n# \\frac{\\partial f}{\\partial \\mathbf{A}_{n,1}} &  \\dots & \\frac{\\partial f}{\\partial \\mathbf{A}_{n,m}}\n# \\end{bmatrix}\n# \\end{equation*}\n#\n# Seja $\\mathbf{X} \\in \\mathbb{R}^{N\\times m}$ a matriz cujas linhas s\u00e3o as observa\u00e7\u00f5es do dataset (tamb\u00e9m chamada de *design matrix*) e seja $\\mathbf{y} \\in \\mathbb{R}^{N}$ o vetor contendo todos os valores de $y_{i}$ (i.e., $\\mathbf{X}_{i,:} = \\mathbf{x}_{i}$ e $\\mathbf{y}_{i} =y_{i}$). \u00c9 f\u00e1cil checar que: \n#\n#\n# \\begin{equation}\n",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '{A}^{-T} \\mathbf{A}^{-',
                '1}) = \\mathrm{tr}(\\mathbf{A}^{-T} \\mathbf{A}^{-',
            ],
            correspondingSpans: [14],
            index: '2950983770',
            relevanceScore: 338.092567498643,
            snippets: [
                {
                    correspondingSpanText: '{A}^{-T} \\mathbf{A}^{-',
                    text: '1}^{T} \\mathbf{A}^{-T} \\mathbf{A}^{-1} \\mathbf{h}_{2}&=0 \\\\\n\\mathbf{h}_{1}^{T} \\mathbf{A}^{-T} \\mathbf{A}^{-1} \\mathbf{h}_{1}&=\\mathbf{h}_{2}^{T} \\mathbf{A}^{-T} \\mathbf{A}^{-1} \\mathbf{h}_{2}\n',
                },
                {
                    correspondingSpanText: '{A}^{-T} \\mathbf{A}^{-',
                    text: 'for computing the intrinsic matrix A:\n\\begin{equation} \\label{equ:constraints}\n\\begin{split}\n\\mathbf{h}_{1}^{T} \\mathbf{A}^{-T} \\mathbf{A}^{-1} \\mathbf{h}_{2}&=0 \\\\\n\\mathbf{h}_{1}^{T} \\mathbf{A}^{-T} \\mathbf{A}^{-1} \\mathbf{h',
                },
                {
                    correspondingSpanText: '{A}^{-T} \\mathbf{A}^{-',
                    text: 'mathbf{h}_{1}^{T} \\mathbf{A}^{-T} \\mathbf{A}^{-1} \\mathbf{h}_{1}&=\\mathbf{h}_{2}^{T} \\mathbf{A}^{-T} \\mathbf{A}^{-1} \\mathbf{h}_{2}\n\\end{split}\n\\end{equation}\n\nThese are the two constraints needed for computing the intrinsic matrix $\\mathbf{A',
                },
            ],
            source: 'arxiv',
            textLong:
                '}_{3}\\end{array}\\right]$. From Equ. \\ref{equ:homography}, we can get:\n\\begin{equation}\n\\left[\\begin{array}{lll}\n\\mathbf{h}_{1} & \\mathbf{h}_{2} & \\mathbf{h}_{3}\n\\end{array}\\right]=\\lambda \\mathbf{A}\\left[\\begin{array}{lll}\n\\mathbf{r}_{1} & \\mathbf{r}_{2} & \\mathbf{t}\n\\end{array}\\right]  \\, \\text{ with } \\,  \\lambda = \\frac{1}{s}\n\\end{equation}\nBased on the knowledge that $\\mathbf{r}_{1}, \\mathbf{r}_{2}$ are orthonormal, we get the two constraints needed for computing the intrinsic matrix A:\n\\begin{equation} \\label{equ:constraints}\n\\begin{split}\n\\mathbf{h}_{1}^{T} \\mathbf{A}^{-T} \\mathbf{A}^{-1} \\mathbf{h}_{2}&=0 \\\\\n\\mathbf{h}_{1}^{T} \\mathbf{A}^{-T} \\mathbf{A}^{-1} \\mathbf{h}_{1}&=\\mathbf{h}_{2}^{T} \\mathbf{A}^{-T} \\mathbf{A}^{-1} \\mathbf{h}_{2}\n\\end{split}\n\\end{equation}\n\nThese are the two constraints needed for computing the intrinsic matrix $\\mathbf{A}$. \n\nThe methods of solving the camera calibration problem and obtaining the closed-form solution are thoroughly described in \\cite{zhang2000calibration}. We refer interested readers to that paper for more information.\n\nIn our system, assuming that the principal point is fixed at the center of the image plane, only the focal lengths $f_x$ and $f_y$ are computed and iteratively updated as shown in the next section. For chessboard calibration, we also enforce this assumption for the purpose of comparison.\n\nThe closed-form solution can be refined through maximum likelihood inference: The original calibration is used as the initial guess for the nonlinear optimization problem, which can be solved with the Levenberg-Marquardt Algorithm as implemented in \\cite{more1978levenberg',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\mathbf{A}^{-1} = -\\mathbf{',
                ' \\mathbf{A}^{-1} = -\\mathbf{A}^{-1} \\cdot \\mathbf{A}^{-1} = -\\mathbf{',
            ],
            correspondingSpans: [32],
            index: '3142389845',
            relevanceScore: 335.444397793603,
            snippets: [
                {
                    correspondingSpanText: '\\mathbf{A}^{-1} = -\\mathbf{',
                    text: '} + \\mathbf{A}^{-1} = \\mathbf{0},$\n\\[\\mathbf{A}^{-1} = -\\mathbf{A}.\\]Then\n\\[\\mathbf{A} \\mathbf{A}^{-1} = -\\mathbf{A}^2 = \\mathbf{I}.\\]Hence, $\\mathbf{A}$ is invertible, and $\\det \\mathbf{A} \\neq 0.$\n\nThen from $\\',
                },
            ],
            source: 'dolmino',
            textLong:
                'Let $\\mathbf{A} = \\begin{pmatrix} a & 1 \\\\ -2 & d \\end{pmatrix}$ for some real numbers $a$ and $d.$  If\n\\[\\mathbf{A} + \\mathbf{A}^{-1} = \\mathbf{0},\\]then find $\\det \\mathbf{A}.$\nFrom the equation $\\mathbf{A} + \\mathbf{A}^{-1} = \\mathbf{0},$\n\\[\\mathbf{A}^{-1} = -\\mathbf{A}.\\]Then\n\\[\\mathbf{A} \\mathbf{A}^{-1} = -\\mathbf{A}^2 = \\mathbf{I}.\\]Hence, $\\mathbf{A}$ is invertible, and $\\det \\mathbf{A} \\neq 0.$\n\nThen from $\\mathbf{A}^2 = -\\mathbf{I},$\n\\[\\det (\\mathbf{A}^2) = \\det (-\\mathbf{I}).\\]Since $\\det (\\mathbf{A}^2) = (\\det \\mathbf{A})^2,$\n\\[(\\det \\mathbf{A})^2 = (-1)^2 = 1.\\]Since $\\det \\mathbf{A} \\neq 0,$ $\\det \\mathbf{A} = \\boxed{1}.$\nThe answer is: 1',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '    \\frac{\\partial^2 f}{\\partial',
                '     \\frac{\\partial^2 f}{\\partial \\mathbf{',
            ],
            correspondingSpans: [18, 20],
            index: '2953275501',
            relevanceScore: 335.2062913177367,
            snippets: [
                {
                    correspondingSpanText: '    \\frac{\\partial^2 f}{\\partial',
                    text: 'stability \ncondition with respect to inhomogeneous perturbations is \n\\cite{myPRD} \n\\begin{equation} \\label{H13}\n\\frac{     \\frac{\\partial^2 f}{\\partial \\phi^2 }\\left.\\right|_0 \n-\\frac{d^2 V}{d\\phi^2}\\left.\\right|_0 \n+ \\frac{ R',
                },
            ],
            source: 'arxiv',
            textLong:
                '. The error in the conclusion of \\cite{SkeaBurd} \nseems to originate from incorrect signs in eqs.~(2.7)-(2.9) of \nthat paper, which rule the evolution of homogeneous \nperturbations. In fact, de Sitter spaces can be stable with \nrespect to more general inhomogeneous perturbations in more \ngeneral gravity theories described by an action of the form \n\\begin{equation}\\label{H12}\nS=\\frac{1}{2\\kappa}\\int d^4 x\\sqrt{-g} \\left[ f\\left( \\phi, R \n\\right) -\\omega(\\phi) g^{ab}\\nabla_a\\phi\\nabla_b \\phi -V(\\phi) \n\\right] \n\\end{equation} \nwhich contains both $f(R)$ and scalar-tensor \ngravity as special cases. The gauge-invariant linear stability \ncondition with respect to inhomogeneous perturbations is \n\\cite{myPRD} \n\\begin{equation} \\label{H13}\n\\frac{     \\frac{\\partial^2 f}{\\partial \\phi^2 }\\left.\\right|_0 \n-\\frac{d^2 V}{d\\phi^2}\\left.\\right|_0 \n+ \\frac{ R_0 f_{\\phi R}^2 }{F_0} \n}{\n\\omega_0 \\left( 1+\\frac{ 3f_{\\phi R}^2 }{ 2\\omega_0 F_0} \n\\right)\n}  \\leq 0 \\;,\n\\end{equation}\nwhere $F\\equiv \\partial f/\\partial R$ and $f_{\\phi R}\\equiv \n\\frac{ \n\\partial^2 f}{\\partial \\phi\\partial R}$.  Analogous stability \nconditions \nwith respect to various kinds of classical and semiclassical \ninstabilities were established in \nRefs.~\\cite{BarrowOttewill,instabilities}. \n\nIn our notations, the action of \\cite{SkeaBurd} is\n\\begin{equation}\\label{SkeaBurdaction}\nS=\\frac{1}{2\\kappa} \\int d^4x\\',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['{A}} \\mathrm{tr}(\\mathbf{'],
            correspondingSpans: [15],
            index: '2957744856',
            relevanceScore: 321.794739278011,
            snippets: [
                {
                    correspondingSpanText: '{A}} \\mathrm{tr}(\\mathbf{',
                    text: 'ariance matrix of $\\{\\mathbf{y}_i\\}$. Thus, we want to find \n\\begin{equation}\n\\mathbf{A}^*=\\arg\\max\\limits_{\\mathbf{A}} \\mathrm{tr}(\\mathbf{S_y}) , \n\\end{equation}\nwhere\n\\begin{equation}\n\\mathbf{S_y} = \\frac{1}{N} \\sum \\limits',
                },
            ],
            source: 'open-web-math',
            textLong:
                'technique for dimensionality reduction and feature extraction. PCA attempts to find a linear subspace of lower dimensionality than the original feature space, where the new features have the largest variance \\cite{PRbook}. \n\nConsider a dataset $\\{\\mathbf{x}_i\\}$ where $i=1,2,\\cdots,N$, and each $\\mathbf{x}_i$ is a $D$-dimensional vector. Now we want to project the data onto an $M$-dimensional subspace, where $M<D$. We assume the projection is denoted as $\\mathbf{y=Ax}$, where $\\mathbf{A}=[\\mathbf{u}_1^\\mathrm{T},\\cdots,\\mathbf{u}_M^\\mathrm{T}]$, and $\\mathbf{u}_k^\\mathrm{T}\\mathbf{u}_k=1$ for $k=1,2,\\cdots,M$. We want to maximize the variance of $\\{\\mathbf{y}_i\\}$, which is  the trace of the covariance matrix of $\\{\\mathbf{y}_i\\}$. Thus, we want to find \n\\begin{equation}\n\\mathbf{A}^*=\\arg\\max\\limits_{\\mathbf{A}} \\mathrm{tr}(\\mathbf{S_y}) , \n\\end{equation}\nwhere\n\\begin{equation}\n\\mathbf{S_y} = \\frac{1}{N} \\sum \\limits_{i=1}^N \n(\\mathbf{y}_i-\\bar{\\mathbf{y}})(\\mathbf{y}_i-\\bar{\\mathbf{y}}) ^\\mathrm{T} , \n\\end{equation}\nand\n\\begin{equation}\n\\bar{\\mathbf{y}}=\\frac{1}{N}\\sum\\limits_{i=1}^N \\mathbf{x}_i . \n\\end{equation}\nLet $ \\mathbf{S_x} $ be the covariance matrix of $ \\{\\mathbf{x}_i\\}$. \nSince $ \\mathrm{tr}(\\mathbf{S_y}) = \\mathrm{tr}(\\mathbf{AS_xA^\\mathrm{T}})$, by using the Lagrangian multiplier and taking the derivative, we get\n\\begin{equation}\n\\mathbf{S_xu}_k=\\lambda_k\\mathbf{u}_k, \n\\end{equation}\nwhich means that $ \\',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                "this problem, let's first recall some fundamental definitions and properties of",
            ],
            correspondingSpans: [0],
            index: '3139396501',
            relevanceScore: 314.6026334454619,
            snippets: [
                {
                    correspondingSpanText:
                        "this problem, let's first recall some fundamental definitions and properties of",
                    text: " To tackle this problem, let's first recall some fundamental definitions and properties of vectors and parallelograms. This will help us build a solid foundation to solve our main problem.\n\n1. Vectors and their operations: A vector is a mathematical entity possessing",
                },
            ],
            source: 'dolmino',
            textLong:
                " To tackle this problem, let's first recall some fundamental definitions and properties of vectors and parallelograms. This will help us build a solid foundation to solve our main problem.\n\n1. Vectors and their operations: A vector is a mathematical entity possessing both magnitude (length) and direction. Given two vectors $\\vec{a}=a_1\\hat{i}+a_2\\hat{j}+a_3\\hat{k}$ and $\\vec{b}=b_1\\hat{i}+b_2\\hat{j}+b_3\\hat{k}$, their sum is defined as $\\vec{a}+\\vec{b}=\\left(a_1+b_1\\right)\\hat{i}+\\left(a_2+b_2\\right)\\hat{j}+\\left(a_3+b_3\\right)\\hat{k}$. Additionally, the scalar multiplication of a vector by a real number $c$, denoted by $c\\vec{a}$, results in a new vector whose components are $ca_1, ca_2,$ and $ca_3$. The norm or length of a vector $\\vec{a}$ can be calculated using $||\\vec{a}||=\\sqrt{{a_1}^2",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                "this problem, let's first recall some fundamental definitions and properties of",
            ],
            correspondingSpans: [0],
            index: '3139479459',
            relevanceScore: 312.9113503691036,
            snippets: [
                {
                    correspondingSpanText:
                        "this problem, let's first recall some fundamental definitions and properties of",
                    text: " To tackle this problem, let's first recall some fundamental definitions and properties of equations of curves and lines. This approach does not require knowledge of calculus; instead, we will rely on geometric principles.\n\nAn equation of a curve represents a set of points (x, y",
                },
            ],
            source: 'dolmino',
            textLong:
                " To tackle this problem, let's first recall some fundamental definitions and properties of equations of curves and lines. This approach does not require knowledge of calculus; instead, we will rely on geometric principles.\n\nAn equation of a curve represents a set of points (x, y) that satisfy that relationship. Here, our given curve is a parabola defined by the equation x^2 = 2y. A tangent line to a curve is a straight line that intersects the curve at exactly one point, called the point of tangency. Our goal is to determine the equation of the tangent line to the parabola x^2 = 2y at the point (-3, 9/2).\n\nNow, imagine placing an isosceles triangle on top of the point of tangency such that the base lies along the x-axis while the other two sides touch the curve symmetrically. As per the definition of a tangent line, there should exist only one intersection point between the tangent line and the curve. Therefore, when we place our isosceles triangle, both symmetrical arms must gently graze the curve without penetrating inside it. By doing this, we create conditions under which we can derive the slope and eventually the equation of the tang",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\mathrm{tr}(\\mathbf{A}^{-',
                '{A}) = \\mathrm{tr}(\\mathbf{A}^{-',
                ' \\mathrm{tr}(\\mathbf{A}^{-',
                '1}) = \\mathrm{tr}(\\mathbf{A}^{-T} \\mathbf{A}^{-',
            ],
            correspondingSpans: [10, 12, 14],
            index: '3162180947',
            relevanceScore: 308.4867969126809,
            snippets: [
                {
                    correspondingSpanText: '\\mathrm{tr}(\\mathbf{A}^{-',
                    text: 'A}) + \\tfrac{1}{2}(\\mathrm{tr}(\\mathbf{A})^2-\\mathrm{tr}(\\mathbf{A}^2)) + \\mathrm{det}(\\mathbf{A}) \\mathrm{tr}(\\mathbf{A}^{-1}) + \\mathrm{tr}(\\mathbf{A}) + 1}$$\n\nCan we find a general expression for higher dimensions that builds on the ones above? Even obtaining the $5',
                },
                {
                    correspondingSpanText: '\\mathrm{tr}(\\mathbf{A}^{-',
                    text: 'big( \\mathrm{tr}(\\mathbf{A}) + 1 \\big) \\mathbf{I}}{\\mathrm{det}(\\mathbf{A}) + \\mathrm{det}(\\mathbf{A}) \\mathrm{tr}(\\mathbf{A}^{-1}) + \\mathrm{tr}(\\mathbf{A}) + 1}$$\n\n  \u2022 $4 \\times 4$:\n\n$$(\\mathbf{I} + \\mathbf{A',
                },
            ],
            source: 'dolmino',
            textLong:
                "A}^{-1} - \\mathbf{A} + \\big( \\mathrm{tr}(\\mathbf{A}) + 1 \\big) \\mathbf{I}}{\\mathrm{det}(\\mathbf{A}) + \\mathrm{det}(\\mathbf{A}) \\mathrm{tr}(\\mathbf{A}^{-1}) + \\mathrm{tr}(\\mathbf{A}) + 1}$$\n\n  \u2022 $4 \\times 4$:\n\n$$(\\mathbf{I} + \\mathbf{A})^{-1} = \\frac{\\mathrm{det}(\\mathbf{A}) \\mathbf{A}^{-1} + \\mathbf{A}^2 - \\mathrm{tr}(\\mathbf{A}) \\mathbf{A} - \\mathbf{A} + \\big( \\tfrac{1}{2}(\\mathrm{tr}(\\mathbf{A})^2-\\mathrm{tr}(\\mathbf{A}^2)) + \\mathrm{tr}(\\mathbf{A}) + 1 \\big) \\mathbf{I}}{\\mathrm{det}(\\mathbf{A}) + \\tfrac{1}{2}(\\mathrm{tr}(\\mathbf{A})^2-\\mathrm{tr}(\\mathbf{A}^2)) + \\mathrm{det}(\\mathbf{A}) \\mathrm{tr}(\\mathbf{A}^{-1}) + \\mathrm{tr}(\\mathbf{A}) + 1}$$\n\nCan we find a general expression for higher dimensions that builds on the ones above? Even obtaining the $5 \\times 5$ case is prohibitive, and so far I haven't been able to spot the pattern.\n\n\nLet $p(x)=\\sum_{k=0}^na_kx^k$ (with $a_n=1$) and $q(x)$ be the characteristic polynomials of $A$ and $B=I+A$ respectively. By Cayley-Hamilton theorem, $B^{-1}=g(B)$ where \\begin{align} g(x) &=\\frac{q(0)-q(x)}{xq(0)}\\\\ &= \\frac{p(-1)-p(x-1)}{xp(-1)}\\\\ &=\\frac{-\\sum_{j=0}^n a_j[(x-1)^j - (-1)^j]}{xp(-1)}\\\\ &=\\frac{-\\sum_{j=1}^n a_j \\sum_{k=0}^{j-1}(-1)^{j-1-k}(x",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\) and \\( \\frac{\\partial^2 f}{\\partial'],
            correspondingSpans: [9],
            index: '3163289861',
            relevanceScore: 304.86867073389516,
            snippets: [
                {
                    correspondingSpanText: '\\) and \\( \\frac{\\partial^2 f}{\\partial',
                    text: ', y) = e^{xy} \\sin(x + y) \\), we need to compute the mixed partial derivatives \\( \\frac{\\partial^2 f}{\\partial x \\partial y} \\) and \\( \\frac{\\partial^2 f}{\\partial y \\partial x} \\).\n\nFirst, we compute the first-order partial derivatives.\n\n#### Partial derivative with respect to \\( x \\):\n\n\\[ f(x',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                "partial x \\partial y} \\) and \\( \\frac{\\partial^2 f}{\\partial y \\partial x} \\). Verify that the mixed partial derivatives are equal, demonstrating the symmetry of second-order partial derivatives for this function.\n\n2. In addition, Alex asks the student to solve the following linear algebra problem: Given a 3x3 matrix \\( A \\) with eigenvalues \\( \\lambda_1 = 2 \\), \\( \\lambda_2 = -1 \\), and \\( \\lambda_3 = 4 \\), determine if the matrix \\( A \\) is diagonalizable. If it is, find a matrix \\( P \\) such that \\( P^{-1}AP \\) is a diagonal matrix. If it is not diagonalizable, explain why.\n<|assistant|>\nLet's break down and solve each part of the problem step-by-step.\n\n### Part 1: Compute the Mixed Partial Derivatives\n\nGiven the function \\( f(x, y) = e^{xy} \\sin(x + y) \\), we need to compute the mixed partial derivatives \\( \\frac{\\partial^2 f}{\\partial x \\partial y} \\) and \\( \\frac{\\partial^2 f}{\\partial y \\partial x} \\).\n\nFirst, we compute the first-order partial derivatives.\n\n#### Partial derivative with respect to \\( x \\):\n\n\\[ f(x, y) = e^{xy} \\sin(x + y) \\]\n\nUsing the product rule and chain rule:\n\n\\[ \\frac{\\partial f}{\\partial x} = \\frac{\\partial}{\\partial x} \\left( e^{xy} \\right) \\sin(x + y) + e^{xy} \\frac{\\partial}{\\partial x} \\left( \\sin(x + y) \\right) \\]\n\n\\[ \\frac{\\partial}{\\partial x} \\left( e^{xy} \\right) = y e^{xy} \\]\n\\[ \\frac{\\partial}{\\partial x} \\left( \\sin(x + y) \\right) = \\cos(x + y) \\]\n\nSo,\n\n\\[ \\frac{\\partial f}{\\partial x} = y e^{xy} \\sin(x + y) + e^{xy} \\cos(x + y) \\]\n\n#### Partial derivative with respect to \\( y \\):",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\( \\frac{\\partial^2 f}{\\partial',
                ' \\) and \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
            ],
            correspondingSpans: [6, 9],
            index: '3159742055',
            relevanceScore: 303.54127425783173,
            snippets: [
                {
                    correspondingSpanText: '\\( \\frac{\\partial^2 f}{\\partial',
                    text: 'Partial Derivatives\n\nGiven the function \\( f(x, y) = e^{xy} \\sin(x + y) \\), we need to compute the mixed partial derivatives \\( \\frac{\\partial^2 f}{\\partial x \\partial y} \\) and \\( \\frac{\\partial^2 f}{\\partial y \\partial x} \\).\n\nFirst, we compute the first-order partial derivatives.\n\n####',
                },
                {
                    correspondingSpanText: '\\) and \\( \\frac{\\partial^2 f}{\\partial',
                    text: ', y) = e^{xy} \\sin(x + y) \\). Compute the second-order partial derivatives \\( \\frac{\\partial^2 f}{\\partial x \\partial y} \\) and \\( \\frac{\\partial^2 f}{\\partial y \\partial x} \\). Verify that the mixed partial derivatives are equal, demonstrating the symmetry of second-order partial derivatives for this function.\n\n2. In addition, Alex asks',
                },
            ],
            source: 'dolmino',
            textLong:
                "+ y) \\). Compute the second-order partial derivatives \\( \\frac{\\partial^2 f}{\\partial x \\partial y} \\) and \\( \\frac{\\partial^2 f}{\\partial y \\partial x} \\). Verify that the mixed partial derivatives are equal, demonstrating the symmetry of second-order partial derivatives for this function.\n\n2. In addition, Alex asks the student to solve the following linear algebra problem: Given a 3x3 matrix \\( A \\) with eigenvalues \\( \\lambda_1 = 2 \\), \\( \\lambda_2 = -1 \\), and \\( \\lambda_3 = 4 \\), determine if the matrix \\( A \\) is diagonalizable. If it is, find a matrix \\( P \\) such that \\( P^{-1}AP \\) is a diagonal matrix. If it is not diagonalizable, explain why.\nLet's break down and solve each part of the problem step-by-step.\n\n### Part 1: Compute the Mixed Partial Derivatives\n\nGiven the function \\( f(x, y) = e^{xy} \\sin(x + y) \\), we need to compute the mixed partial derivatives \\( \\frac{\\partial^2 f}{\\partial x \\partial y} \\) and \\( \\frac{\\partial^2 f}{\\partial y \\partial x} \\).\n\nFirst, we compute the first-order partial derivatives.\n\n#### Partial derivative with respect to \\( x \\):\n\n\\[ f(x, y) = e^{xy} \\sin(x + y) \\]\n\nUsing the product rule and chain rule:\n\n\\[ \\frac{\\partial f}{\\partial x} = \\frac{\\partial}{\\partial x} \\left( e^{xy} \\right) \\sin(x + y) + e^{xy} \\frac{\\partial}{\\partial x} \\left( \\sin(x + y) \\right) \\]\n\n\\[ \\frac{\\partial}{\\partial x} \\left( e^{xy} \\right) = y e^{xy} \\]\n\\[ \\frac{\\partial}{\\partial x} \\left( \\sin(x + y) \\right) = \\cos(x + y) \\]\n\nSo,\n\n\\[ \\frac{\\partial f}{\\partial x} = y e^{xy} \\sin(x + y) + e^{xy} \\cos(x",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '    \\frac{\\partial^2 f}{\\partial',
                '     \\frac{\\partial^2 f}{\\partial \\mathbf{',
            ],
            correspondingSpans: [18, 20],
            index: '3054898433',
            relevanceScore: 302.3582927203938,
            snippets: [
                {
                    correspondingSpanText: '    \\frac{\\partial^2 f}{\\partial',
                    text: '\\frac{\\partial^2 f}{\\partial x_2 \\partial x_n} \\\\\n#     \\vdots & \\vdots & \\ddots & \\vdots \\\\\n#     \\frac{\\partial^2 f}{\\partial x_n \\partial x_1} & \\frac{\\partial^2 f}{\\partial x_n \\partial x_2} & \\dots  & \\frac{\\partial^2 f',
                },
            ],
            source: 'starcoder',
            textLong:
                'x_1, x_2, \\ldots, x_n]^\\top$\uff0c\u8f93\u51fa\u662f\u6807\u91cf\u3002\u5047\u5b9a\u51fd\u6570$f$\u6240\u6709\u7684\u4e8c\u9636\u504f\u5bfc\u6570\u90fd\u5b58\u5728\uff0c$f$\u7684\u6d77\u68ee\u77e9\u9635$\\boldsymbol{H}$\u662f\u4e00\u4e2a$n$\u884c$n$\u5217\u7684\u77e9\u9635\uff1a\n#\n# $$\n# \\boldsymbol{H} = \n# \\begin{bmatrix}\n#     \\frac{\\partial^2 f}{\\partial x_1^2} & \\frac{\\partial^2 f}{\\partial x_1 \\partial x_2} & \\dots  & \\frac{\\partial^2 f}{\\partial x_1 \\partial x_n} \\\\\n#     \\frac{\\partial^2 f}{\\partial x_2 \\partial x_1} & \\frac{\\partial^2 f}{\\partial x_2^2} & \\dots  & \\frac{\\partial^2 f}{\\partial x_2 \\partial x_n} \\\\\n#     \\vdots & \\vdots & \\ddots & \\vdots \\\\\n#     \\frac{\\partial^2 f}{\\partial x_n \\partial x_1} & \\frac{\\partial^2 f}{\\partial x_n \\partial x_2} & \\dots  & \\frac{\\partial^2 f}{\\partial x_n^2}\n# \\end{bmatrix},\n# $$\n#\n# \u5176\u4e2d\u4e8c\u9636\u504f\u5bfc\u6570\u4e3a\n#\n# $$\\frac{\\partial^2 f}{\\partial x_i \\partial x_j} = \\frac{\\partial }{\\partial x_j} \\left(\\frac{\\partial f}{ \\partial x_i}\\right).$$\n#\n#\n#\n# ## \u6982\u7387\n#\n# \u6700\u540e\uff0c\u6211\u4eec\u7b80\u8981\u4ecb\u7ecd\u6761\u4ef6\u6982\u7387\u3001\u671f\u671b\u548c\u5747\u5300\u5206\u5e03\u3002\n#\n# ### \u6761\u4ef6\u6982\u7387\n#\n# \u5047\u8bbe\u4e8b\u4ef6$A$\u548c\u4e8b\u4ef6$B$\u7684\u6982\u7387\u5206\u522b\u4e3a$P(A)$\u548c$P(B)$\uff0c\u4e24\u4e2a\u4e8b\u4ef6\u540c\u65f6\u53d1\u751f\u7684\ufffd\ufffd',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '= \\frac{\\partial}{\\partial \\mathbf{A}}',
                '2} = \\frac{\\partial}{\\partial \\mathbf{A}} \\left(',
                '     \\frac{\\partial}{\\partial \\mathbf{A}}',
                '2} = \\frac{\\partial}{\\partial \\mathbf{A}} (\\mathbf{A}^{-1})',
            ],
            correspondingSpans: [19, 21, 31, 33],
            index: '3163277635',
            relevanceScore: 297.2316243595557,
            snippets: [
                {
                    correspondingSpanText: '= \\frac{\\partial}{\\partial \\mathbf{A}}',
                    text: 'with the same period \\( T \\).\n\nThe Jacobian matrix \\( J \\) of the system at any point \\( \\mathbf{A}(t) \\) is given by:\n\\[ J = \\frac{\\partial}{\\partial \\mathbf{A}} \\left( -\\mathbf{A}(t) + \\mathbf{f}\\left(\\mathbf{W} \\mathbf{A}(t) + \\mathbf{I}(t)\\right) \\',
                },
                {
                    correspondingSpanText: '= \\frac{\\partial}{\\partial \\mathbf{A}} \\left(',
                    text: 'with the same period \\( T \\).\n\nThe Jacobian matrix \\( J \\) of the system at any point \\( \\mathbf{A}(t) \\) is given by:\n\\[ J = \\frac{\\partial}{\\partial \\mathbf{A}} \\left( -\\mathbf{A}(t) + \\mathbf{f}\\left(\\mathbf{W} \\mathbf{A}(t) + \\mathbf{I}(t)\\right) \\right) \\]',
                },
                {
                    correspondingSpanText: '\\frac{\\partial}{\\partial \\mathbf{A}}',
                    text: 'the same period \\( T \\).\n\nThe Jacobian matrix \\( J \\) of the system at any point \\( \\mathbf{A}(t) \\) is given by:\n\\[ J = \\frac{\\partial}{\\partial \\mathbf{A}} \\left( -\\mathbf{A}(t) + \\mathbf{f}\\left(\\mathbf{W} \\mathbf{A}(t) + \\mathbf{I}(t)\\right) \\',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                "frac{dA_v(t)}{dt} = -A_v(t) + \\frac{1}{1 + e^{-\\left(\\sum_{u \\in V} w_{uv} A_u(t) + I_v(t)\\right)}} \\]\n\nOr, in vector form:\n\\[ \\tau \\frac{d\\mathbf{A}(t)}{dt} = -\\mathbf{A}(t) + \\mathbf{f}\\left(\\mathbf{W} \\mathbf{A}(t) + \\mathbf{I}(t)\\right) \\]\n\nwhere \\( \\tau \\) is a vector of time constants, \\( \\mathbf{W} \\) is the weight matrix, and \\( \\mathbf{I}(t) \\) is the vector of external stimuli.\n\nTo analyze the stability and periodicity, we need to examine the fixed points and their stability using the Jacobian matrix of the system. Let \\( \\mathbf{A}^*(t) \\) be a periodic solution with the same period \\( T \\).\n\nThe Jacobian matrix \\( J \\) of the system at any point \\( \\mathbf{A}(t) \\) is given by:\n\\[ J = \\frac{\\partial}{\\partial \\mathbf{A}} \\left( -\\mathbf{A}(t) + \\mathbf{f}\\left(\\mathbf{W} \\mathbf{A}(t) + \\mathbf{I}(t)\\right) \\right) \\]\n\n\\[ J = -I + \\frac{\\partial \\mathbf{f}}{\\partial \\mathbf{A}} \\mathbf{W} \\]\n\nwhere \\( I \\) is the identity matrix and \\( \\frac{\\partial \\mathbf{f}}{\\partial \\mathbf{A}} \\) is the derivative of the activation function vector.\n\nFor the sigmoid function, the derivative is:\n\\[ f_v'(x) = f_v(x) (1 - f_v(x)) \\]\n\nThus, the Jacobian matrix elements are:\n\\[ J_{ij} = -\\delta_{ij} + f_v'(\\mathbf{W} \\mathbf{A}(t) + \\mathbf{I}(t)) W_{ij} \\]\n\nThe periodic solution \\( \\mathbf{A}(t) \\) is stable if all the eigenvalues of the monodromy matrix (obtained by integrating the Jacobian over one period \\( T \\)) have magn",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '= \\frac{\\partial}{\\partial \\mathbf{A}}',
                '2} = \\frac{\\partial}{\\partial \\mathbf{A}} \\left(',
                '     \\frac{\\partial}{\\partial \\mathbf{A}}',
                '2} = \\frac{\\partial}{\\partial \\mathbf{A}} (\\mathbf{A}^{-1})',
            ],
            correspondingSpans: [19, 21, 31, 33],
            index: '3159659718',
            relevanceScore: 297.2316243595557,
            snippets: [
                {
                    correspondingSpanText: '= \\frac{\\partial}{\\partial \\mathbf{A}}',
                    text: 'with the same period \\( T \\).\n\nThe Jacobian matrix \\( J \\) of the system at any point \\( \\mathbf{A}(t) \\) is given by:\n\\[ J = \\frac{\\partial}{\\partial \\mathbf{A}} \\left( -\\mathbf{A}(t) + \\mathbf{f}\\left(\\mathbf{W} \\mathbf{A}(t) + \\mathbf{I}(t)\\right) \\',
                },
                {
                    correspondingSpanText: '= \\frac{\\partial}{\\partial \\mathbf{A}} \\left(',
                    text: 'with the same period \\( T \\).\n\nThe Jacobian matrix \\( J \\) of the system at any point \\( \\mathbf{A}(t) \\) is given by:\n\\[ J = \\frac{\\partial}{\\partial \\mathbf{A}} \\left( -\\mathbf{A}(t) + \\mathbf{f}\\left(\\mathbf{W} \\mathbf{A}(t) + \\mathbf{I}(t)\\right) \\right) \\]',
                },
                {
                    correspondingSpanText: '\\frac{\\partial}{\\partial \\mathbf{A}}',
                    text: 'the same period \\( T \\).\n\nThe Jacobian matrix \\( J \\) of the system at any point \\( \\mathbf{A}(t) \\) is given by:\n\\[ J = \\frac{\\partial}{\\partial \\mathbf{A}} \\left( -\\mathbf{A}(t) + \\mathbf{f}\\left(\\mathbf{W} \\mathbf{A}(t) + \\mathbf{I}(t)\\right) \\',
                },
            ],
            source: 'dolmino',
            textLong:
                "frac{dA_v(t)}{dt} = -A_v(t) + \\frac{1}{1 + e^{-\\left(\\sum_{u \\in V} w_{uv} A_u(t) + I_v(t)\\right)}} \\]\n\nOr, in vector form:\n\\[ \\tau \\frac{d\\mathbf{A}(t)}{dt} = -\\mathbf{A}(t) + \\mathbf{f}\\left(\\mathbf{W} \\mathbf{A}(t) + \\mathbf{I}(t)\\right) \\]\n\nwhere \\( \\tau \\) is a vector of time constants, \\( \\mathbf{W} \\) is the weight matrix, and \\( \\mathbf{I}(t) \\) is the vector of external stimuli.\n\nTo analyze the stability and periodicity, we need to examine the fixed points and their stability using the Jacobian matrix of the system. Let \\( \\mathbf{A}^*(t) \\) be a periodic solution with the same period \\( T \\).\n\nThe Jacobian matrix \\( J \\) of the system at any point \\( \\mathbf{A}(t) \\) is given by:\n\\[ J = \\frac{\\partial}{\\partial \\mathbf{A}} \\left( -\\mathbf{A}(t) + \\mathbf{f}\\left(\\mathbf{W} \\mathbf{A}(t) + \\mathbf{I}(t)\\right) \\right) \\]\n\n\\[ J = -I + \\frac{\\partial \\mathbf{f}}{\\partial \\mathbf{A}} \\mathbf{W} \\]\n\nwhere \\( I \\) is the identity matrix and \\( \\frac{\\partial \\mathbf{f}}{\\partial \\mathbf{A}} \\) is the derivative of the activation function vector.\n\nFor the sigmoid function, the derivative is:\n\\[ f_v'(x) = f_v(x) (1 - f_v(x)) \\]\n\nThus, the Jacobian matrix elements are:\n\\[ J_{ij} = -\\delta_{ij} + f_v'(\\mathbf{W} \\mathbf{A}(t) + \\mathbf{I}(t)) W_{ij} \\]\n\nThe periodic solution \\( \\mathbf{A}(t) \\) is stable if all the eigenvalues of the monodromy matrix (obtained by integrating the Jacobian over one period \\( T \\)) have magn",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\( \\frac{\\partial^2 f}{\\partial'],
            correspondingSpans: [6],
            index: '3159719566',
            relevanceScore: 293.19411954596507,
            snippets: [
                {
                    correspondingSpanText: '\\( \\frac{\\partial^2 f}{\\partial',
                    text: 'x, y, z) = (1, 0, \\pi/4) \\). Determine the second partial derivative of \\( f \\) with respect to \\( z \\), denoted as \\( \\frac{\\partial^2 f}{\\partial z^2} \\), at this specific point. This will help the expert explain the curvature of the function in relation to \\( z \\).\nTo solve the given problem, we need to',
                },
            ],
            source: 'dolmino',
            textLong:
                "An industry expert is preparing a presentation to explain a complex mathematical model to a diverse audience. The model involves a multi-variable function \\( f(x, y, z) = e^{xy} \\sin(z) \\) which describes a certain technical phenomenon. The expert wants to illustrate how changes in the variables \\( x \\), \\( y \\), and \\( z \\) affect the function's output.\n\n1. Calculate the gradient vector \\( \\nabla f(x, y, z) \\) of the function \\( f(x, y, z) = e^{xy} \\sin(z) \\). The expert plans to use this gradient to discuss the direction of the steepest ascent in the context of the model.\n\n2. The expert also wants to demonstrate the sensitivity of the function to changes in the \\( z \\)-variable at the point \\( (x, y, z) = (1, 0, \\pi/4) \\). Determine the second partial derivative of \\( f \\) with respect to \\( z \\), denoted as \\( \\frac{\\partial^2 f}{\\partial z^2} \\), at this specific point. This will help the expert explain the curvature of the function in relation to \\( z \\).\nTo solve the given problem, we need to perform the following calculations:\n\n1. **Calculate the gradient vector \\( \\nabla f(x, y, z) \\):**\n\nThe gradient vector of a function \\( f(x, y, z) \\) is given by:\n\n\\[\n\\nabla f(x, y, z) = \\left( \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z} \\right)\n\\]\n\nLet's compute each component of the gradient:\n\n- **Partial derivative with respect to \\( x \\):**\n\n\\[\n\\frac{\\partial f}{\\partial x} = \\frac{\\partial}{\\partial x} \\left( e^{xy} \\sin(z) \\right) = y e^{xy} \\sin(z)\n\\]\n\n- **Partial derivative with respect to \\( y \\):**\n\n\\[\n\\frac{\\partial f}{\\partial y} =",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                'the rate of change of \\( f \\) with respect to \\(',
                ' the rate of change of \\( f \\) with respect to \\( \\mathbf{',
            ],
            correspondingSpans: [7],
            index: '3162883237',
            relevanceScore: 291.8407933893509,
            snippets: [
                {
                    correspondingSpanText: 'the rate of change of \\( f \\) with respect to \\(',
                    text: '). The time derivative of \\( f(x, y) \\) is given by the total derivative, which is the sum of the rate of change of \\( f \\) with respect to \\( x \\) and the rate of change of \\( f \\) with respect to \\( y \\), due to the differential rates of \\( x \\) and \\( y \\).\n\nIf you are familiar with finding the time derivative of a function with respect to time when its arguments change at',
                },
                {
                    correspondingSpanText: 'the rate of change of \\( f \\) with respect to \\(',
                    text: 'can find the rate of change of \\( f(x, y) \\). The time derivative of \\( f(x, y) \\) is given by the total derivative, which is the sum of the rate of change of \\( f \\) with respect to \\( x \\) and the rate of change of \\( f \\) with respect to \\( y \\), due to the differential rates of \\( x \\) and \\( y \\).\n\nIf you are familiar with finding',
                },
            ],
            source: 'olmo-2-1124-13b-preference-mix',
            textLong:
                ") - (x^2 y)(1)(x)}{(x + y)^2} \\)\n\nNow, we can find each of the partial derivatives:\n\n\\( \\frac{\\partial f}{\\partial x} = \\frac{(2xy)(x + y) - (x^2 y)(1)(x)}{(x + y)^2} \\)\n\\( \\frac{\\partial f}{\\partial y} = \\frac{(2xy)(1)(x + y) - (x^2 y)(2x)(y)}{(x + y)^2} \\)\n\nThis is quite involved, and we'll leave it to you to compute the partial derivatives. However, remember the interpretation of the partial derivatives is going to be in terms of the interaction dynamics between the reporter and the celebrity.\n\n2. Now, given the rate of change of \\( x \\) and \\( y \\) with respect to time, we can find the rate of change of \\( f(x, y) \\). The time derivative of \\( f(x, y) \\) is given by the total derivative, which is the sum of the rate of change of \\( f \\) with respect to \\( x \\) and the rate of change of \\( f \\) with respect to \\( y \\), due to the differential rates of \\( x \\) and \\( y \\).\n\nIf you are familiar with finding the time derivative of a function with respect to time when its arguments change at different rates, you can proceed directly. However, if you need more details, we can do this problem step by step.\n\nFirst, we find the differential rate of \\( f(x, y) \\) with respect to time for both \\( x \\) and \\( y \\). This is done using the chain rule and the product rule, and the result is:\n\n\\( df/dt = \\frac{df}{dx} \\frac{dx}{dt} + \\frac{df}{dy} \\frac{dy}{dt} \\)\n\nNow, we know the rate of change of \\( x \\) and \\( y \\) with respect to time:\n\n\\( \\frac{dx}{dt} = 0.1 \\) (since \\( x \\) is increasing at a rate of 0.1 units per interview)\n\\( \\frac{dy}{dt} = -0.05 \\) (since \\( y \\) is decreasing at a rate of 0.05 units per interview)\n",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\( \\mathbf{A}^{-1} \\).\n'],
            correspondingSpans: [28],
            index: '3163266817',
            relevanceScore: 288.9617975500774,
            snippets: [
                {
                    correspondingSpanText: '\\( \\mathbf{A}^{-1} \\).\n',
                    text: 'mathbf{v} \\) from sub-problem 1. Prove that the matrix \\( \\mathbf{A} \\) is invertible over \\( \\mathbb{F}_p \\) and find its inverse \\( \\mathbf{A}^{-1} \\).\n<|assistant|>\nTo solve this problem, we need to handle two main tasks: finding a vector \\(\\mathbf{v}\\) satisfying a specific condition and proving the invertibility of a',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                "mathbb{F}_p \\). She chooses a non-zero vector \\( \\mathbf{v} = (v_1, v_2, \\ldots, v_n) \\) over \\( \\mathbb{F}_p \\) such that the sum of the vector's elements is congruent to 1 modulo \\( p \\). Given that \\( n = 128 \\) and \\( p = 2^{257} - 1 \\), find a possible vector \\( \\mathbf{v} \\) that satisfies the condition \\( v_1 + v_2 + \\cdots + v_n \\equiv 1 \\pmod{p} \\).\n\n2. To ensure the security of her cryptographic algorithm, Dr. Ada constructs a \\( n \\times n \\) matrix \\( \\mathbf{A} \\) over \\( \\mathbb{F}_p \\) with \\( n = 128 \\), where \\( \\mathbf{A} \\) is a circulant matrix generated by the vector \\( \\mathbf{v} \\) from sub-problem 1. Prove that the matrix \\( \\mathbf{A} \\) is invertible over \\( \\mathbb{F}_p \\) and find its inverse \\( \\mathbf{A}^{-1} \\).\n<|assistant|>\nTo solve this problem, we need to handle two main tasks: finding a vector \\(\\mathbf{v}\\) satisfying a specific condition and proving the invertibility of a circulant matrix generated by this vector.\n\n### Step 1: Finding the Vector \\(\\mathbf{v}\\)\n\nWe need a non-zero vector \\(\\mathbf{v} = (v_1, v_2, \\ldots, v_{128})\\) over the finite field \\(\\mathbb{F}_p\\) where \\(p = 2^{257} - 1\\), such that\n\n\\[\nv_1 + v_2 + \\cdots + v_{128} \\equiv 1 \\pmod{p}.\n\\]\n\nA simple choice is to set \\(v_1 = 1\\) and \\(v_2 = v_3 = \\cdots = v_{128} = 0\\). Then the sum is:\n\n\\[\nv_1 + v_2 + \\cdots + v_{128} = 1 + 0 + 0 + \\cdots + 0 = 1.\n\\]\n\n",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\( \\mathbf{A}^{-1} \\).\n'],
            correspondingSpans: [28],
            index: '3159724156',
            relevanceScore: 288.8633885885478,
            snippets: [
                {
                    correspondingSpanText: '\\( \\mathbf{A}^{-1} \\).\n',
                    text: 'mathbf{v} \\) from sub-problem 1. Prove that the matrix \\( \\mathbf{A} \\) is invertible over \\( \\mathbb{F}_p \\) and find its inverse \\( \\mathbf{A}^{-1} \\).\nTo solve this problem, we need to handle two main tasks: finding a vector \\(\\mathbf{v}\\) satisfying a specific condition and proving the invertibility of a circulant matrix generated by this vector',
                },
            ],
            source: 'dolmino',
            textLong:
                "mathbb{F}_p \\). She chooses a non-zero vector \\( \\mathbf{v} = (v_1, v_2, \\ldots, v_n) \\) over \\( \\mathbb{F}_p \\) such that the sum of the vector's elements is congruent to 1 modulo \\( p \\). Given that \\( n = 128 \\) and \\( p = 2^{257} - 1 \\), find a possible vector \\( \\mathbf{v} \\) that satisfies the condition \\( v_1 + v_2 + \\cdots + v_n \\equiv 1 \\pmod{p} \\).\n\n2. To ensure the security of her cryptographic algorithm, Dr. Ada constructs a \\( n \\times n \\) matrix \\( \\mathbf{A} \\) over \\( \\mathbb{F}_p \\) with \\( n = 128 \\), where \\( \\mathbf{A} \\) is a circulant matrix generated by the vector \\( \\mathbf{v} \\) from sub-problem 1. Prove that the matrix \\( \\mathbf{A} \\) is invertible over \\( \\mathbb{F}_p \\) and find its inverse \\( \\mathbf{A}^{-1} \\).\nTo solve this problem, we need to handle two main tasks: finding a vector \\(\\mathbf{v}\\) satisfying a specific condition and proving the invertibility of a circulant matrix generated by this vector.\n\n### Step 1: Finding the Vector \\(\\mathbf{v}\\)\n\nWe need a non-zero vector \\(\\mathbf{v} = (v_1, v_2, \\ldots, v_{128})\\) over the finite field \\(\\mathbb{F}_p\\) where \\(p = 2^{257} - 1\\), such that\n\n\\[\nv_1 + v_2 + \\cdots + v_{128} \\equiv 1 \\pmod{p}.\n\\]\n\nA simple choice is to set \\(v_1 = 1\\) and \\(v_2 = v_3 = \\cdots = v_{128} = 0\\). Then the sum is:\n\n\\[\nv_1 + v_2 + \\cdots + v_{128} = 1 + 0 + 0 + \\cdots + 0 = 1.\n\\]\n\nClearly, this satisfies the condition",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                'derivative \\( \\frac{\\partial f}{\\partial',
                ' derivative \\( \\frac{\\partial f}{\\partial \\mathbf{A}}',
            ],
            correspondingSpans: [11],
            index: '3159674938',
            relevanceScore: 283.5551890655876,
            snippets: [
                {
                    correspondingSpanText: 'derivative \\( \\frac{\\partial f}{\\partial',
                    text: 't)) = t \\]\n\n### Part 2: Average Rate of Change\n\nThe average rate of change of the surface height due to erosion is represented by the partial derivative \\( \\frac{\\partial f}{\\partial t} \\).\n\nGiven the surface height function:\n\\[ f(x, y, t) = e^{-t} \\cdot \\sin(x + y) + W',
                },
                {
                    correspondingSpanText: 'derivative \\( \\frac{\\partial f}{\\partial',
                    text: "surface height due to erosion does not exceed a certain threshold \\( \\lambda \\). Determine the threshold \\( \\lambda \\), given that the average rate of change is represented by the partial derivative \\( \\frac{\\partial f}{\\partial t} \\).\nLet's solve each part of the problem step-by-step.\n\n### Part 1: Expected Value and Variance\n\nGiven the surface",
                },
            ],
            source: 'dolmino',
            textLong:
                'Var}(f(x_0, y_0, t)) = \\text{Var}(e^{-t} \\cdot \\sin(x_0 + y_0)) + \\text{Var}(W(x_0, y_0, t)) \\]\n\nSince \\( e^{-t} \\cdot \\sin(x_0 + y_0) \\) is a deterministic function (not random), its variance is zero:\n\\[ \\text{Var}(e^{-t} \\cdot \\sin(x_0 + y_0)) = 0 \\]\n\nThe variance of \\( W(x_0, y_0, t) \\) is, by definition of Brownian motion:\n\\[ \\text{Var}(W(x_0, y_0, t)) = t \\]\n\nTherefore, the variance of \\( f(x, y, t) \\) is:\n\\[ \\text{Var}(f(x_0, y_0, t)) = t \\]\n\n### Part 2: Average Rate of Change\n\nThe average rate of change of the surface height due to erosion is represented by the partial derivative \\( \\frac{\\partial f}{\\partial t} \\).\n\nGiven the surface height function:\n\\[ f(x, y, t) = e^{-t} \\cdot \\sin(x + y) + W(x, y, t) \\]\n\nThe partial derivative with respect to \\( t \\) is:\n\\[ \\frac{\\partial f}{\\partial t} = \\frac{\\partial}{\\partial t} \\left( e^{-t} \\cdot \\sin(x + y) \\right) + \\frac{\\partial}{\\partial t} W(x, y, t) \\]\n\nSince \\( W(x, y, t) \\) is a Brownian motion, its partial derivative with respect to \\( t \\) is zero in the sense of It\u00f4 calculus (it represents a stochastic process with independent increments):\n\\[ \\frac{\\partial W(x, y, t)}{\\partial t} = 0 \\]\n\nThus, we have:\n\\[ \\frac{\\partial f}{\\partial t} = \\frac{\\partial}{\\partial t} \\left( e^{-t} \\cdot \\sin(x + y) \\right) = -e^{-t} \\cdot \\sin(x',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['derivative \\( \\frac{\\partial f}{\\partial'],
            correspondingSpans: [11],
            index: '3163339100',
            relevanceScore: 283.5551890655876,
            snippets: [
                {
                    correspondingSpanText: 'derivative \\( \\frac{\\partial f}{\\partial',
                    text: 't)) = t \\]\n\n### Part 2: Average Rate of Change\n\nThe average rate of change of the surface height due to erosion is represented by the partial derivative \\( \\frac{\\partial f}{\\partial t} \\).\n\nGiven the surface height function:\n\\[ f(x, y, t) = e^{-t} \\cdot \\sin(x + y) + W',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                'Var}(f(x_0, y_0, t)) = \\text{Var}(e^{-t} \\cdot \\sin(x_0 + y_0)) + \\text{Var}(W(x_0, y_0, t)) \\]\n\nSince \\( e^{-t} \\cdot \\sin(x_0 + y_0) \\) is a deterministic function (not random), its variance is zero:\n\\[ \\text{Var}(e^{-t} \\cdot \\sin(x_0 + y_0)) = 0 \\]\n\nThe variance of \\( W(x_0, y_0, t) \\) is, by definition of Brownian motion:\n\\[ \\text{Var}(W(x_0, y_0, t)) = t \\]\n\nTherefore, the variance of \\( f(x, y, t) \\) is:\n\\[ \\text{Var}(f(x_0, y_0, t)) = t \\]\n\n### Part 2: Average Rate of Change\n\nThe average rate of change of the surface height due to erosion is represented by the partial derivative \\( \\frac{\\partial f}{\\partial t} \\).\n\nGiven the surface height function:\n\\[ f(x, y, t) = e^{-t} \\cdot \\sin(x + y) + W(x, y, t) \\]\n\nThe partial derivative with respect to \\( t \\) is:\n\\[ \\frac{\\partial f}{\\partial t} = \\frac{\\partial}{\\partial t} \\left( e^{-t} \\cdot \\sin(x + y) \\right) + \\frac{\\partial}{\\partial t} W(x, y, t) \\]\n\nSince \\( W(x, y, t) \\) is a Brownian motion, its partial derivative with respect to \\( t \\) is zero in the sense of It\u00f4 calculus (it represents a stochastic process with independent increments):\n\\[ \\frac{\\partial W(x, y, t)}{\\partial t} = 0 \\]\n\nThus, we have:\n\\[ \\frac{\\partial f}{\\partial t} = \\frac{\\partial}{\\partial t} \\left( e^{-t} \\cdot \\sin(x + y) \\right) = -e^{-t} \\cdot \\sin(x',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\mathbf{A}} = \\mathbf{A}^{-1'],
            correspondingSpans: [36],
            index: '2955402028',
            relevanceScore: 283.1341250556482,
            snippets: [
                {
                    correspondingSpanText: '\\mathbf{A}} = \\mathbf{A}^{-1',
                    text: ', we can use the following identity:\n\nIf $a$ is not a function of $\\mathbf{A}$, then $\\frac{\\partial \\ln \\det a\\mathbf{A}}{\\partial \\mathbf{A}} = \\mathbf{A}^{-1}$.\n\nThis takes care of the first part. Secondly, we use a property of the trace of a product:\n\nIf $\\mathbf{u}$ is a column vector, then $\\',
                },
            ],
            source: 'open-web-math',
            textLong:
                'left( \\frac{t_{nc}}{2} \\ln \\det{\\mathbf{\\Sigma}_c^{-1}} -\\frac{t_{nc}}{2} \\left( \\mathbf{x}_n - \\boldsymbol{\\mu}_c \\right)^\\intercal \\mathbf{\\Sigma}_c^{-1} \\left( \\mathbf{x}_n - \\boldsymbol{\\mu}_c \\right) \\right) &= 0 \\\\ \\sum_{n=1}^N \\frac{t_{nc}}{2} \\frac{\\partial}{\\partial \\mathbf{\\Sigma}_c} \\left( \\ln \\det{\\mathbf{\\Sigma}_c^{-1}} -\\left( \\mathbf{x}_n - \\boldsymbol{\\mu}_c \\right)^\\intercal \\mathbf{\\Sigma}_c^{-1} \\left( \\mathbf{x}_n - \\boldsymbol{\\mu}_c \\right) \\right) &= 0. \\end{aligned}\n\nThis derivative requires a bit more work. Firstly, we can use the following identity:\n\nIf $a$ is not a function of $\\mathbf{A}$, then $\\frac{\\partial \\ln \\det a\\mathbf{A}}{\\partial \\mathbf{A}} = \\mathbf{A}^{-1}$.\n\nThis takes care of the first part. Secondly, we use a property of the trace of a product:\n\nIf $\\mathbf{u}$ is a column vector, then $\\mathbf{u}^\\intercal \\mathbf{A} \\mathbf{u} = \\text{tr} \\left( \\mathbf{u}^\\intercal \\mathbf{u} \\mathbf{A} \\right)$.\n\nFinally, we use another matrix calculus identity:\n\nIf $\\mathbf{B}$ is not a function of $\\mathbf{A}$, then $\\frac{\\partial \\text{tr}\\left( \\mathbf{B} \\mathbf{A} \\right)}{\\partial \\mathbf{A}} = \\mathbf{B}^\\intercal$.\n\nThis now gives us\n\n\\begin{aligned} \\sum_{n=1}^N \\frac{t_{nc}}{2} \\frac{\\partial}{\\partial \\mathbf{\\Sigma}_c} \\left( \\ln \\det{\\mathbf{\\Sigma}_c^{-1}} -\\left( \\mathbf{x}_n - \\boldsymbol{\\mu}_c \\right)^\\intercal \\mathbf{\\Sigma}_c^{-1} \\left( \\mathbf',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\( \\frac{\\partial^2 f}{\\partial',
                ' \\) and \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
                ' derivative \\( \\frac{\\partial f}{\\partial \\mathbf{A}}',
            ],
            correspondingSpans: [6, 9, 11],
            index: '3159702507',
            relevanceScore: 279.8404816913962,
            snippets: [
                {
                    correspondingSpanText: '\\( \\frac{\\partial^2 f}{\\partial',
                    text: 'by-step.\n\n### Part 1:\n\nWe need to determine whether the mixed partial derivatives \\( \\frac{\\partial^2 f}{\\partial x \\partial y} \\) and \\( \\frac{\\partial^2 f}{\\partial y \\partial x} \\) are equal for the function \\( f(x, y) = \\int_0^x \\int_0^y e^{t^2 + s^2',
                },
                {
                    correspondingSpanText: '\\) and \\( \\frac{\\partial^2 f}{\\partial',
                    text: 'step-by-step.\n\n### Part 1:\n\nWe need to determine whether the mixed partial derivatives \\( \\frac{\\partial^2 f}{\\partial x \\partial y} \\) and \\( \\frac{\\partial^2 f}{\\partial y \\partial x} \\) are equal for the function \\( f(x, y) = \\int_0^x \\int_0^y e^{t^2 + s^2',
                },
                {
                    correspondingSpanText: '\\) and \\( \\frac{\\partial^2 f}{\\partial',
                    text: 'y e^{t^2 + s^2} \\, ds \\, dt \\). Determine whether the mixed partial derivatives \\( \\frac{\\partial^2 f}{\\partial x \\partial y} \\) and \\( \\frac{\\partial^2 f}{\\partial y \\partial x} \\) are equal everywhere in \\( \\mathbb{R}^2 \\). Justify your answer using appropriate theorems.\n\n2. Given a linear transformation \\( T:',
                },
                {
                    correspondingSpanText: 'derivative \\( \\frac{\\partial f}{\\partial',
                    text: 'int_0^y e^{x^2 + s^2} \\, ds \\right) = e^{x^2 + y^2}\n\\]\n\nNow, compute the partial derivative \\( \\frac{\\partial f}{\\partial y} \\):\n\\[\n\\frac{\\partial f}{\\partial y} = \\frac{\\partial}{\\partial y} \\left( \\int_0^x \\int_0^',
                },
                {
                    correspondingSpanText: 'derivative \\( \\frac{\\partial f}{\\partial',
                    text: "ut's Theorem (or the symmetry of second derivatives), which states that if the mixed partial derivatives of a function are continuous, then they are equal. \n\nFirst, we compute the partial derivative \\( \\frac{\\partial f}{\\partial x} \\):\n\\[\n\\frac{\\partial f}{\\partial x} = \\frac{\\partial}{\\partial x} \\left( \\int_0^x \\int_0^",
                },
            ],
            source: 'dolmino',
            textLong:
                "). Determine whether the mixed partial derivatives \\( \\frac{\\partial^2 f}{\\partial x \\partial y} \\) and \\( \\frac{\\partial^2 f}{\\partial y \\partial x} \\) are equal everywhere in \\( \\mathbb{R}^2 \\). Justify your answer using appropriate theorems.\n\n2. Given a linear transformation \\( T: \\mathbb{R}^n \\to \\mathbb{R}^n \\) represented by an \\( n \\times n \\) matrix \\( A \\), where \\( A \\) is known to be invertible. If \\( A \\) is decomposed into the form \\( A = LU \\) where \\( L \\) is a lower triangular matrix and \\( U \\) is an upper triangular matrix, prove that the eigenvalues of \\( A \\) are the same as the eigenvalues of \\( L \\) and \\( U \\), and discuss the implications of this result in relation to the invertibility of \\( A \\).\nTo solve the given problem, let's address each part step-by-step.\n\n### Part 1:\n\nWe need to determine whether the mixed partial derivatives \\( \\frac{\\partial^2 f}{\\partial x \\partial y} \\) and \\( \\frac{\\partial^2 f}{\\partial y \\partial x} \\) are equal for the function \\( f(x, y) = \\int_0^x \\int_0^y e^{t^2 + s^2} \\, ds \\, dt \\).\n\nTo do this, we apply Clairaut's Theorem (or the symmetry of second derivatives), which states that if the mixed partial derivatives of a function are continuous, then they are equal. \n\nFirst, we compute the partial derivative \\( \\frac{\\partial f}{\\partial x} \\):\n\\[\n\\frac{\\partial f}{\\partial x} = \\frac{\\partial}{\\partial x} \\left( \\int_0^x \\int_0^y e^{t^2 + s^2} \\, ds \\, dt \\right) = \\int_0^y e^{x^2 + s^2} \\, ds\n\\]\n\nNext, we compute the partial derivative of this result with respect to \\( y \\) to find \\( \\frac{\\partial^2 f}{\\partial y \\partial x} \\):\n\\[\n\\frac{\\partial^2 f}{\\partial y \\partial x} = \\frac{\\partial}{\\partial y} \\",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\mathbf{A} \\mathbf{A}^{-1} = \\mathbf{I}'],
            correspondingSpans: [2],
            index: '2955726913',
            relevanceScore: 275.4648305242948,
            snippets: [
                {
                    correspondingSpanText: '\\mathbf{A} \\mathbf{A}^{-1} = \\mathbf{I}',
                    text: 'mathbf{A}$ be a $n \\times n$ matrix. The inverse of $\\mathbf{A}$ is denoted by $\\mathbf{A}^{-1}$ and is defined such that\n\n${ \\mathbf{A} \\mathbf{A}^{-1} = \\mathbf{I} }$\n\nwhere $\\mathbf{I}$ is the $n \\times n$ identity matrix.\n\nThe inverse exists only if $\\det(\\mathbf{A}) \\ne 0$.',
                },
            ],
            source: 'open-web-math',
            textLong:
                'mathbf{A}$.\n\nSome useful identities involving the determinant are given below.\n\n\u2022 If $\\mathbf{A}$ is a $n \\times n$ matrix, then\n$\\det(\\mathbf{A}) = \\det(\\mathbf{A}^T)~.$\n\u2022 If $\\lambda$ is a constant and $\\mathbf{A}$ is a $n \\times n$ matrix, then\n$\\det(\\lambda\\mathbf{A}) = \\lambda^n\\det(\\mathbf{A}) \\implies \\det(-\\mathbf{A}) = (-1)^n\\det(\\mathbf{A}) ~.$\n\u2022 If $\\mathbf{A}$ and $\\mathbf{B}$ are two $n \\times n$ matrices, then\n$\\det(\\mathbf{A}\\mathbf{B}) = \\det(\\mathbf{A})\\det(\\mathbf{B})~.$\n\nIf you think you understand determinants, take the quiz.\n\n## Inverse of a matrix\n\nLet $\\mathbf{A}$ be a $n \\times n$ matrix. The inverse of $\\mathbf{A}$ is denoted by $\\mathbf{A}^{-1}$ and is defined such that\n\n${ \\mathbf{A} \\mathbf{A}^{-1} = \\mathbf{I} }$\n\nwhere $\\mathbf{I}$ is the $n \\times n$ identity matrix.\n\nThe inverse exists only if $\\det(\\mathbf{A}) \\ne 0$. A singular matrix does not have an inverse.\n\nAn important identity involving the inverse is\n\n${ (\\mathbf{A}\\mathbf{B})^{-1} = \\mathbf{B}^{-1} \\mathbf{A}^{-1}, }$\n\nsince this leads to: ${ (\\mathbf{A} \\mathbf{B})^{-1} (\\mathbf{A} \\mathbf{B}) = (\\mathbf{B}^{-1} \\mathbf{A}^{-1}) (\\mathbf{A} \\mathbf{B} ) = \\mathbf{B}^{-1} \\mathbf{A}^{-1} \\mathbf{A} \\mathbf{B} = \\mathbf{B}^{-1} (\\mathbf{A}^{-1} \\mathbf{A}) \\mathbf{B} = \\mathbf{B}^{-1} \\mathbf{I} \\mathbf{B} = \\mathbf{B}^{-1} \\mathbf{B} = \\mathbf{I}. }$\n\nSome other identities involving the inverse of a matrix are given',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\mathbf{A} \\mathbf{A}^{-1} = \\mathbf{I}'],
            correspondingSpans: [2],
            index: '2956549687',
            relevanceScore: 274.9776665421946,
            snippets: [
                {
                    correspondingSpanText: '\\mathbf{A} \\mathbf{A}^{-1} = \\mathbf{I}',
                    text: 'mathbf{A}$ be a $n \\times n$ matrix. The inverse of $\\mathbf{A}$ is denoted by $\\mathbf{A}^{-1}$ and is defined such that\n\n${ \\mathbf{A} \\mathbf{A}^{-1} = \\mathbf{I} }$\n\nwhere $\\mathbf{I}$ is the $n \\times n$ identity matrix.\n\nThe inverse exists only if $\\det(\\mathbf{A}) \\ne 0$.',
                },
            ],
            source: 'open-web-math',
            textLong:
                'of $\\mathbf{A}$ formed by eliminating row i and column j from $\\mathbf{A}$.\n\nSome useful identities involving the determinant are given below.\n\n\u2022 If $\\mathbf{A}$ is a $n \\times n$ matrix, then\n$\\det(\\mathbf{A}) = \\det(\\mathbf{A}^T)~.$\n\u2022 If \u03bb is a constant and $\\mathbf{A}$ is a $n \\times n$ matrix, then\n$\\det(\\lambda\\mathbf{A}) = \\lambda^n\\det(\\mathbf{A}) \\implies \\det(-\\mathbf{A}) = (-1)^n\\det(\\mathbf{A}) ~.$\n\u2022 If $\\mathbf{A}$ and $\\mathbf{B}$ are two $n \\times n$ matrices, then\n$\\det(\\mathbf{A}\\mathbf{B}) = \\det(\\mathbf{A})\\det(\\mathbf{B})~.$\n\nInverse of a matrix\n\nLet $\\mathbf{A}$ be a $n \\times n$ matrix. The inverse of $\\mathbf{A}$ is denoted by $\\mathbf{A}^{-1}$ and is defined such that\n\n${ \\mathbf{A} \\mathbf{A}^{-1} = \\mathbf{I} }$\n\nwhere $\\mathbf{I}$ is the $n \\times n$ identity matrix.\n\nThe inverse exists only if $\\det(\\mathbf{A}) \\ne 0$. A singular matrix does not have an inverse.\n\nAn important identity involving the inverse is\n\n${ (\\mathbf{A}\\mathbf{B})^{-1} = \\mathbf{B}^{-1} \\mathbf{A}^{-1}, }$\n\nsince this leads to: ${ (\\mathbf{A} \\mathbf{B})^{-1} (\\mathbf{A} \\mathbf{B}) = (\\mathbf{B}^{-1} \\mathbf{A}^{-1}) (\\mathbf{A} \\mathbf{B} ) = \\mathbf{B}^{-1} \\mathbf{A}^{-1} \\mathbf{A} \\mathbf{B} = \\mathbf{B}^{-1} (\\mathbf{A}^{-1} \\mathbf{A}) \\mathbf{B} = \\mathbf{B}^{-1} \\mathbf{I} \\mathbf{B} = \\mathbf{B}^{-1} \\mathbf{B} = \\mathbf{I}. }$\n\nSome other identities involving the inverse of a matrix are given',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\mathbf{A} \\mathbf{A}^{-1} = \\mathbf{I}'],
            correspondingSpans: [2],
            index: '2949593792',
            relevanceScore: 272.7842301148626,
            snippets: [
                {
                    correspondingSpanText: '\\mathbf{A} \\mathbf{A}^{-1} = \\mathbf{I}',
                    text: 'mathbf{A}$ be a $n \\times n$ matrix. The inverse of $\\mathbf{A}$ is denoted by $\\mathbf{A}^{-1}$ and is defined such that\n\n${ \\mathbf{A} \\mathbf{A}^{-1} = \\mathbf{I} }$\n\nwhere $\\mathbf{I}$ is the $n \\times n$ identity matrix.\n\nThe inverse exists only if $\\det(\\mathbf{A}) \\ne 0$.',
                },
            ],
            source: 'algebraic-stack',
            textLong:
                '$\\mathbf{A}$ formed by eliminating row i and column j from $\\mathbf{A}$.\n\nSome useful identities involving the determinant are given below.\n\n\u2022 If $\\mathbf{A}$ is a $n \\times n$ matrix, then\n$\\det(\\mathbf{A}) = \\det(\\mathbf{A}^T)~.$\n\u2022 If \u03bb is a constant and $\\mathbf{A}$ is a $n \\times n$ matrix, then\n$\\det(\\lambda\\mathbf{A}) = \\lambda^n\\det(\\mathbf{A}) \\implies \\det(-\\mathbf{A}) = (-1)^n\\det(\\mathbf{A}) ~.$\n\u2022 If $\\mathbf{A}$ and $\\mathbf{B}$ are two $n \\times n$ matrices, then\n$\\det(\\mathbf{A}\\mathbf{B}) = \\det(\\mathbf{A})\\det(\\mathbf{B})~.$\n\n## Inverse of a matrix\n\nLet $\\mathbf{A}$ be a $n \\times n$ matrix. The inverse of $\\mathbf{A}$ is denoted by $\\mathbf{A}^{-1}$ and is defined such that\n\n${ \\mathbf{A} \\mathbf{A}^{-1} = \\mathbf{I} }$\n\nwhere $\\mathbf{I}$ is the $n \\times n$ identity matrix.\n\nThe inverse exists only if $\\det(\\mathbf{A}) \\ne 0$. A singular matrix does not have an inverse.\n\nAn important identity involving the inverse is\n\n${ (\\mathbf{A}\\mathbf{B})^{-1} = \\mathbf{B}^{-1} \\mathbf{A}^{-1}, }$\n\nsince this leads to: ${ (\\mathbf{A} \\mathbf{B})^{-1} (\\mathbf{A} \\mathbf{B}) = (\\mathbf{B}^{-1} \\mathbf{A}^{-1}) (\\mathbf{A} \\mathbf{B} ) = \\mathbf{B}^{-1} \\mathbf{A}^{-1} \\mathbf{A} \\mathbf{B} = \\mathbf{B}^{-1} (\\mathbf{A}^{-1} \\mathbf{A}) \\mathbf{B} = \\mathbf{B}^{-1} \\mathbf{I} \\mathbf{B} = \\mathbf{B}^{-1} \\mathbf{B} = \\mathbf{I}. }$\n\nSome other identities involving the inverse of a matrix are given',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['{A}) = \\det(\\mathbf{A})'],
            correspondingSpans: [24],
            index: '2954580394',
            relevanceScore: 272.4931337340824,
            snippets: [
                {
                    correspondingSpanText: '{A}) = \\det(\\mathbf{A})',
                    text: 'as it is so that the product of A and its adjugate yields a diagonal matrix whose diagonal entries are det(A):\n\n$\\mathbf{A} \\, \\mathrm{adj}(\\mathbf{A}) = \\det(\\mathbf{A}) \\, \\mathbf{I} \\,$.\n\nA is invertible if and only if det(A) is an invertible element of R, and in that case the equation above yields:\n',
                },
                {
                    correspondingSpanText: '{A}) = \\det(\\mathbf{A})',
                    text: '$.\n\nA is invertible if and only if det(A) is an invertible element of R, and in that case the equation above yields:\n\n$\\mathrm{adj}(\\mathbf{A}) = \\det(\\mathbf{A}) \\mathbf{A}^{-1} \\,$,\n$\\mathbf{A}^{-1} = \\frac {1} {\\det(\\mathbf{A})} \\, \\mathrm{adj}(\\mathbf{A',
                },
            ],
            source: 'arxiv',
            textLong:
                'A}) = \\mathbf{C}^\\mathsf{T}$.\n\nIn more detail: suppose R is a commutative ring and A is an n\u00d7n matrix with entries from R.\n\n\u2022 The (i,j) minor of A, denoted Aij, is the determinant of the (n\u00a0\u2212\u00a01)\u00d7(n\u00a0\u2212\u00a01) matrix that results from deleting row i and column j of A.\n$\\mathbf{C}_{ij} = (-1)^{i+j} \\mathbf{M}_{ij} \\,$.\n\nwhere $\\mathbf{M}_{ij}$ is the (i,j) minor of A.\n\n\u2022 The adjugate of A is the transpose of C, that is, the n\u00d7n matrix whose (i,j) entry is the (j,i) cofactor of A:\n$\\mathrm{adj}(\\mathbf{A})_{ij} = \\mathbf{C}_{ji} \\,$.\n\nThe adjugate is defined as it is so that the product of A and its adjugate yields a diagonal matrix whose diagonal entries are det(A):\n\n$\\mathbf{A} \\, \\mathrm{adj}(\\mathbf{A}) = \\det(\\mathbf{A}) \\, \\mathbf{I} \\,$.\n\nA is invertible if and only if det(A) is an invertible element of R, and in that case the equation above yields:\n\n$\\mathrm{adj}(\\mathbf{A}) = \\det(\\mathbf{A}) \\mathbf{A}^{-1} \\,$,\n$\\mathbf{A}^{-1} = \\frac {1} {\\det(\\mathbf{A})} \\, \\mathrm{adj}(\\mathbf{A}) \\,$.\n\n## Examples\n\n### 2 \u00d7 2 generic matrix\n\nThe adjugate of the 2\u00a0\u00d7\u00a02 matrix\n\n$\\mathbf{A} = \\begin{pmatrix} {{a}} & {{b}}\\\\ {{c}} & {{d}} \\end{pmatrix}$\n\nis\n\n$\\operatorname{adj}(\\mathbf{A}) = \\begin{pmatrix} \\,\\,\\,{{d}} & \\!\\!{{-b}}\\\\ {{-c}} & {{a}} \\end{pmatrix}$.\n\n### 3 \u00d7 3 generic matrix\n\nConsider the $3\\times 3$ matrix\n\n$\\mathbf{A} = \\begin{pmatrix}',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\frac{\\partial}{\\partial \\mathbf{A}}'],
            correspondingSpans: [31],
            index: '2948288264',
            relevanceScore: 267.5994207194002,
            snippets: [
                {
                    correspondingSpanText: '\\frac{\\partial}{\\partial \\mathbf{A}}',
                    text: 'sgn ( a) to be a vector with elements sgn ( a i): g = ( I A T) sgn ( x A x) where I is the n n identity matrix. \\frac{\\partial}{\\partial \\mathbf{A}} Note that \\nabla(g)(U) is the transpose of the row matrix associated to Jac(g)(U). For the vector 2-norm, we have (x2) =',
                },
            ],
            source: 'algebraic-stack',
            textLong:
                "technique is to compute f(x+h) - f(x), find the terms which are linear in h, and call them the derivative. Laplace: Hessian: Answer. Inequality regarding norm of a positive definite matrix, derivative of the Euclidean norm of matrix and matrix product. has the finite dimension I'd like to take the derivative of the following function w.r.t to A: Notice that this is a l_2 norm not a matrix norm, since A \\times B is m \\times 1. EDIT 1. g ( y) = y T A y = x T A x + x T A + T A x + T A . Write with and as the real and imaginary part of , respectively. Also, you can't divide by epsilon, since it is a vector. Are the models of infinitesimal analysis (philosophically) circular? If you take this into account, you can write the derivative in vector/matrix notation if you define sgn ( a) to be a vector with elements sgn ( a i): g = ( I A T) sgn ( x A x) where I is the n n identity matrix. \\frac{\\partial}{\\partial \\mathbf{A}} Note that \\nabla(g)(U) is the transpose of the row matrix associated to Jac(g)(U). For the vector 2-norm, we have (x2) = (x x) = ( x) x+x ( x); What does it mean to take the derviative of a matrix?---Like, Subscribe, and Hit that Bell to get all the latest videos from ritvikmath ~---Check out my Medi. x, {x}] and you'll get more what you expect. I thought that D_y \\| y- x \\|^2 = D \\langle y- x, y- x \\rangle = \\langle y- x, 1 \\rangle + \\langle 1, y- x \\rangle = 2 (y - x) holds. This doesn't mean matrix derivatives always look just like scalar ones. Daredevil Comic Value, Consequence of the trace you learned in calculus 1, and compressed sensing fol-lowing de nition need in to. Use Lagrange multipliers at this step, with the condition that the norm of the vector we are using is x. So I tried to derive this myself,",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '    \\frac{\\partial}{\\partial \\mathbf{',
                '     \\frac{\\partial}{\\partial \\mathbf{A}} \\mathrm{tr}(\\mathbf{A}^{-1} \\mathbf{A}^{-',
                '     \\frac{\\partial}{\\partial \\mathbf{A}}',
            ],
            correspondingSpans: [15, 31],
            index: '2951475889',
            relevanceScore: 265.87566667536316,
            snippets: [
                {
                    correspondingSpanText: '    \\frac{\\partial}{\\partial \\mathbf{',
                    text: '}\n\\end{equation}\n\\Hence that\n\\begin{equation}\\label{lemma:half:zero}\n\\begin{split}\n    \\begin{cases}\n     \\frac{\\partial}{\\partial \\mathbf{a}} L(\\mathbf{a}, \\mathbf{b}, \\lambda,\\mathfrak{a})=0 \\\\\n     \\frac{\\partial}{\\partial \\mathbf{b}} L(\\mathbf{',
                },
                {
                    correspondingSpanText: '    \\frac{\\partial}{\\partial \\mathbf{',
                    text: '\\begin{cases}\n     \\frac{\\partial}{\\partial \\mathbf{a}} L(\\mathbf{a}, \\mathbf{b}, \\lambda,\\mathfrak{a})=0 \\\\\n     \\frac{\\partial}{\\partial \\mathbf{b}} L(\\mathbf{a}, \\mathbf{b}, \\lambda,\\mathfrak{a})=0 \\\\\n     \\frac{\\partial}{\\partial \\lambda} L(\\mathbf{a},',
                },
                {
                    correspondingSpanText: '    \\frac{\\partial}{\\partial \\mathbf{',
                    text: '\n\\end{equation}\n\\Hence that\n\\begin{equation}\\label{lemma:halfdx:zero}\n\\begin{split}\n    \\begin{cases}\n     \\frac{\\partial}{\\partial \\mathbf{a}} L(\\mathbf{a}, \\mathbf{b}, \\lambda,\\mathfrak{b})=0 \\\\\n     \\frac{\\partial}{\\partial \\mathbf{b}} L(\\mathbf{',
                },
                {
                    correspondingSpanText: '    \\frac{\\partial}{\\partial \\mathbf{',
                    text: '\\begin{cases}\n     \\frac{\\partial}{\\partial \\mathbf{a}} L(\\mathbf{a}, \\mathbf{b}, \\lambda,\\mathfrak{b})=0 \\\\\n     \\frac{\\partial}{\\partial \\mathbf{b}} L(\\mathbf{a}, \\mathbf{b}, \\lambda,\\mathfrak{b})=0 \\\\\n     \\frac{\\partial}{\\partial \\lambda} L(\\mathbf{a},',
                },
            ],
            source: 'arxiv',
            textLong:
                'a} \\Big(\\frac9{16}-\\mathfrak{a}^2\\Big)+2\\mathbf{b}\\Big(\\frac34-\\mathfrak{a}\\Big)-\\frac12- \\lambda,\\\\\n    \\frac{\\partial}{\\partial \\lambda} L(\\mathbf{a}, \\mathbf{b}, \\lambda, \\mathfrak{a})&=-\\mathbf{a}\\mathfrak{a}-\\mathbf{b}, \\qquad\\text{and} \\\\\n    \\frac{\\partial}{\\partial \\mathfrak{a}} L(\\mathbf{a}, \\mathbf{b}, \\lambda, \\mathfrak{a})&=\\frac{\\partial}{\\partial \\mathfrak{a}} \\Phi(\\mathbf{a},\\mathbf{b},\\mathfrak{a})-\\lambda \\mathbf{a}=-\\mathbf{a}^2 \\mathfrak{a}^2-2\\mathbf{a} \\mathbf{b} \\mathfrak{a} -\\mathbf{b}^2-\\lambda \\mathbf{a}.\n\\end{split}\n\\end{equation}\n\\Hence that\n\\begin{equation}\\label{lemma:half:zero}\n\\begin{split}\n    \\begin{cases}\n     \\frac{\\partial}{\\partial \\mathbf{a}} L(\\mathbf{a}, \\mathbf{b}, \\lambda,\\mathfrak{a})=0 \\\\\n     \\frac{\\partial}{\\partial \\mathbf{b}} L(\\mathbf{a}, \\mathbf{b}, \\lambda,\\mathfrak{a})=0 \\\\\n     \\frac{\\partial}{\\partial \\lambda} L(\\mathbf{a}, \\mathbf{b}, \\lambda,\\mathfrak{a})=0 \\\\\n     \\frac{\\partial}{\\partial \\mathfrak{a}} L(\\mathbf{a}, \\mathbf{b}, \\lambda,\\mathfrak{a})=0\n     \\end{cases}\n     &=\n     \\begin{cases}\n     \\frac{2\\mathbf{a}}{3}\\left(\\frac{27}{64}-\\mathfrak{a}^3\\right)+ \\mathbf{b} \\left(\\frac9{16}-\\mathfrak{a}^2\\right)-\\frac{5}{16}- \\lambda\\mathfrak{a}=0 \\\\\n      \\mathbf{a} \\left(\\frac9{16}-\\mathfrak{a}^2\\right)+2\\mathbf{b}\\left(\\frac34-\\mathfrak{a}\\right)-\\',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['**Transpose**: The transpose of a matrix'],
            correspondingSpans: [3],
            index: '3163206558',
            relevanceScore: 263.9678097231899,
            snippets: [
                {
                    correspondingSpanText: '**Transpose**: The transpose of a matrix',
                    text: "Identity matrix**: A diagonal matrix where all diagonal entries are 1. It's denoted as `I`.\n- **Zero matrix**: A matrix where all entries are zero.\n- **Transpose**: The transpose of a matrix A, denoted as `A^T`, is formed by turning rows into columns and columns into rows.\n- **Symmetric matrix**: A square matrix that is equal to its transpose (",
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                '\n\n### Size\n\nThe size of a matrix is defined by the number of rows and columns it has. It is denoted as "m x n," where "m" is the number of rows and "n" is the number of columns. For example, a 3 x 2 matrix has three rows and two columns.\n\n### Notation\n\nA matrix is often denoted by a capital letter, such as A, B, or C, and the elements are typically denoted by the corresponding lowercase letter with two subscripts. The first subscript indicates the row, and the second indicates the column. For example, `a_23` refers to the element in the second row and third column of matrix A.\n\n### Types of Matrices\n\n- **Square matrix**: A matrix with the same number of rows and columns (n x n).\n- **Diagonal matrix**: A square matrix where all off-diagonal entries are zero.\n- **Identity matrix**: A diagonal matrix where all diagonal entries are 1. It\'s denoted as `I`.\n- **Zero matrix**: A matrix where all entries are zero.\n- **Transpose**: The transpose of a matrix A, denoted as `A^T`, is formed by turning rows into columns and columns into rows.\n- **Symmetric matrix**: A square matrix that is equal to its transpose (A = A^T).\n\n### Matrix Operations\n\n- **Addition**: Two matrices with the same size can be added together by adding their corresponding elements.\n- **Subtraction**: Similar to addition, subtraction involves subtracting the corresponding elements of two matrices.\n- **Scalar multiplication**: Multiplying a matrix by a scalar (a single number) involves multiplying each element of the matrix by that scalar.\n- **Matrix multiplication**: Multiplying two matrices involves a more complex process where the row elements of the first matrix are multiplied by the corresponding column elements of the second matrix and summed up to create the elements of the resulting matrix. Note that matrix multiplication is not commutative (i.e., AB \u2260 BA in general).\n\n### Determinant and Inverse\n\n- **Determinant**: A determinant is a special scalar value that can be calculated from the elements of a square matrix. It provides important',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['**Determinant**: The determinant of a square matrix'],
            correspondingSpans: [4],
            index: '3140892006',
            relevanceScore: 260.6747807747001,
            snippets: [
                {
                    correspondingSpanText: '**Determinant**: The determinant of a square matrix',
                    text: 'k!},$$ where $X$ is a square matrix. This operation shares many properties with its scalar counterpart, including $(e^X)^{-1} = e^{-X}$.\n2. **Determinant**: The determinant of a square matrix $A$ is a special number associated with the matrix that helps determine various properties, such as whether the matrix is invertible or what kind of transformations it represents. Specifically, for an $n x',
                },
            ],
            source: 'dolmino',
            textLong:
                "depth of understanding and comprehensive exploration of the subject matter over breadth. Focus on:\n\n- Rigor: Ensure in-depth coverage of the concepts/sections.\n- Engagement: Write with an academic, professional and engaging tone that captivates interest.\n- Application: Incorporate specific, practical examples, such as proofs in calculus or critical dates and figures in history.\nDo not include a title or an introduction, simply write the content without headlines and introductory phrases. Do not use images. To begin, let us establish the necessary mathematical background required to understand the problem at hand. We will then proceed to analyze the issue with the initial proposition and explore potential solutions.\n\n### Mathematical Preliminaries\n\n1. **Matrix Exponential**: The matrix exponential, denoted by $e^X$, is defined as the infinite series $$e^X = \\sum\\_{k=0}^{\\infty} \\frac{X^k}{k!},$$ where $X$ is a square matrix. This operation shares many properties with its scalar counterpart, including $(e^X)^{-1} = e^{-X}$.\n2. **Determinant**: The determinant of a square matrix $A$ is a special number associated with the matrix that helps determine various properties, such as whether the matrix is invertible or what kind of transformations it represents. Specifically, for an $n x n$ matrix, the determinant is computed using Leibniz's formula $$\\text{det}(A) = \\sum\\_{\\sigma \\in S\\_n} (\\text{sgn}(\\sigma)) \\prod\\_{i=1}^{n} a\\_{i,\\sigma(i)},$$ where $S\\_n$ denotes the symmetric group of all permutations of $\\{1,...,n\\}$ and sgn($\\sigma$) gives +1 when $\\sigma$ is even and -1 when it is odd.\n3. **Trace**: The trace of a square matrix $A$ is the sum of its diagonal elements, i.e., $\\text{tr}(A) = \\sum\\_{i=1}^{n} a\\_{ii}.$ It satisfies several useful properties, among which are $\\text{tr}(AB)=\\text{tr}(BA)$, and more importantly for our discussion, $\\text{tr}(e^X)=e^x,$ where $x$ is the sum",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\( \\frac{\\partial g}{\\partial \\mathbf{',
                ' Compute \\( \\frac{\\partial g}{\\partial \\mathbf{',
                ' derivative \\( \\frac{\\partial g}{\\partial \\mathbf{',
                ' \\( \\frac{\\partial g}{\\partial \\mathbf{A}} = \\mathbf{A}^{-1',
            ],
            correspondingSpans: [22, 25, 36],
            index: '3163341706',
            relevanceScore: 259.6182852360936,
            snippets: [
                {
                    correspondingSpanText: '\\( \\frac{\\partial g}{\\partial \\mathbf{',
                    text: "}) \\), we have:\n\\[ \\sigma'(\\mathbf{z}) = \\sigma(\\mathbf{z}) (1 - \\sigma(\\mathbf{z})) \\]\n\nThe gradient \\( \\frac{\\partial g}{\\partial \\mathbf{z}} \\) w.r.t. \\( W_{jk} \\):\n\\[ \\frac{\\partial}{\\partial W_{jk}} \\left( \\sigma(\\mathbf{z}) (",
                },
                {
                    correspondingSpanText: '\\( \\frac{\\partial g}{\\partial \\mathbf{',
                    text: "{\\partial}{\\partial W_{jk}} \\left( \\frac{\\partial g}{\\partial \\mathbf{z}} \\mathbf{W}_{:,i} \\right) \\]\n\nGiven \\( \\frac{\\partial g}{\\partial \\mathbf{z}} = \\sigma'(\\mathbf{z}) \\), we have:\n\\[ \\sigma'(\\mathbf{z}) = \\sigma(\\mathbf{z}) (1 - \\sigma",
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                "Given \\( \\mathbf{z} = \\mathbf{W} \\mathbf{x} + \\mathbf{b} \\), we have:\n\\[ \\frac{\\partial \\mathbf{z}}{\\partial x_i} = \\mathbf{W}_{:,i} \\]\n\nThus:\n\\[ \\frac{\\partial F}{\\partial x_i} = \\frac{\\partial g}{\\partial \\mathbf{z}} \\mathbf{W}_{:,i} \\]\n\nNow we need to take the derivative of this expression w.r.t. \\( W_{jk} \\):\n\\[ \\frac{\\partial^2 F}{\\partial x_i \\partial W_{jk}} = \\frac{\\partial}{\\partial W_{jk}} \\left( \\frac{\\partial g}{\\partial \\mathbf{z}} \\mathbf{W}_{:,i} \\right) \\]\n\nGiven \\( \\frac{\\partial g}{\\partial \\mathbf{z}} = \\sigma'(\\mathbf{z}) \\), we have:\n\\[ \\sigma'(\\mathbf{z}) = \\sigma(\\mathbf{z}) (1 - \\sigma(\\mathbf{z})) \\]\n\nThe gradient \\( \\frac{\\partial g}{\\partial \\mathbf{z}} \\) w.r.t. \\( W_{jk} \\):\n\\[ \\frac{\\partial}{\\partial W_{jk}} \\left( \\sigma(\\mathbf{z}) (1 - \\sigma(\\mathbf{z})) \\mathbf{W}_{:,i} \\right) \\]\n\nThe derivative of \\( \\mathbf{W}_{:,i} \\) w.r.t. \\( W_{jk} \\) is 1 if \\( j = k \\) and 0 otherwise. Hence:\n\\[ \\frac{\\partial^2 F}{\\partial x_i \\partial W_{jk}} = \\sigma'(\\mathbf{z}) \\delta_{ji} \\]\n\nWhere \\( \\delta_{ji} \\) is the Kronecker delta.\n\nThus:\n\\[ \\frac{\\partial^2 F}{\\partial x_i \\partial W_{jk}} = \\sigma(\\mathbf{z}) (1 - \\sigma(\\mathbf{z})) \\delta_{ji} \\]\n\n### Final Answer:\nThe final answer is \\( \\sigma(\\mathbf{z}) (1 - \\sigma(\\mathbf{z})) \\delta_{ji} \\). I hope it is",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\( \\frac{\\partial g}{\\partial \\mathbf{',
                ' Compute \\( \\frac{\\partial g}{\\partial \\mathbf{',
                ' derivative \\( \\frac{\\partial g}{\\partial \\mathbf{',
                ' \\( \\frac{\\partial g}{\\partial \\mathbf{A}} = \\mathbf{A}^{-1',
            ],
            correspondingSpans: [22, 25, 36],
            index: '3159741519',
            relevanceScore: 259.6182852360936,
            snippets: [
                {
                    correspondingSpanText: '\\( \\frac{\\partial g}{\\partial \\mathbf{',
                    text: "}) \\), we have:\n\\[ \\sigma'(\\mathbf{z}) = \\sigma(\\mathbf{z}) (1 - \\sigma(\\mathbf{z})) \\]\n\nThe gradient \\( \\frac{\\partial g}{\\partial \\mathbf{z}} \\) w.r.t. \\( W_{jk} \\):\n\\[ \\frac{\\partial}{\\partial W_{jk}} \\left( \\sigma(\\mathbf{z}) (",
                },
                {
                    correspondingSpanText: '\\( \\frac{\\partial g}{\\partial \\mathbf{',
                    text: "{\\partial}{\\partial W_{jk}} \\left( \\frac{\\partial g}{\\partial \\mathbf{z}} \\mathbf{W}_{:,i} \\right) \\]\n\nGiven \\( \\frac{\\partial g}{\\partial \\mathbf{z}} = \\sigma'(\\mathbf{z}) \\), we have:\n\\[ \\sigma'(\\mathbf{z}) = \\sigma(\\mathbf{z}) (1 - \\sigma",
                },
            ],
            source: 'dolmino',
            textLong:
                "Given \\( \\mathbf{z} = \\mathbf{W} \\mathbf{x} + \\mathbf{b} \\), we have:\n\\[ \\frac{\\partial \\mathbf{z}}{\\partial x_i} = \\mathbf{W}_{:,i} \\]\n\nThus:\n\\[ \\frac{\\partial F}{\\partial x_i} = \\frac{\\partial g}{\\partial \\mathbf{z}} \\mathbf{W}_{:,i} \\]\n\nNow we need to take the derivative of this expression w.r.t. \\( W_{jk} \\):\n\\[ \\frac{\\partial^2 F}{\\partial x_i \\partial W_{jk}} = \\frac{\\partial}{\\partial W_{jk}} \\left( \\frac{\\partial g}{\\partial \\mathbf{z}} \\mathbf{W}_{:,i} \\right) \\]\n\nGiven \\( \\frac{\\partial g}{\\partial \\mathbf{z}} = \\sigma'(\\mathbf{z}) \\), we have:\n\\[ \\sigma'(\\mathbf{z}) = \\sigma(\\mathbf{z}) (1 - \\sigma(\\mathbf{z})) \\]\n\nThe gradient \\( \\frac{\\partial g}{\\partial \\mathbf{z}} \\) w.r.t. \\( W_{jk} \\):\n\\[ \\frac{\\partial}{\\partial W_{jk}} \\left( \\sigma(\\mathbf{z}) (1 - \\sigma(\\mathbf{z})) \\mathbf{W}_{:,i} \\right) \\]\n\nThe derivative of \\( \\mathbf{W}_{:,i} \\) w.r.t. \\( W_{jk} \\) is 1 if \\( j = k \\) and 0 otherwise. Hence:\n\\[ \\frac{\\partial^2 F}{\\partial x_i \\partial W_{jk}} = \\sigma'(\\mathbf{z}) \\delta_{ji} \\]\n\nWhere \\( \\delta_{ji} \\) is the Kronecker delta.\n\nThus:\n\\[ \\frac{\\partial^2 F}{\\partial x_i \\partial W_{jk}} = \\sigma(\\mathbf{z}) (1 - \\sigma(\\mathbf{z})) \\delta_{ji} \\]\n\n### Final Answer:\nThe final answer is \\( \\sigma(\\mathbf{z}) (1 - \\sigma(\\mathbf{z})) \\delta_{ji} \\). I hope it is",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\( \\mathbf{A} \\), \\( \\mathbf{'],
            correspondingSpans: [1],
            index: '3162808421',
            relevanceScore: 259.4700519867241,
            snippets: [
                {
                    correspondingSpanText: '\\( \\mathbf{A} \\), \\( \\mathbf{',
                    text: ', the ranks must not increase.\n\nIf these conditions are satisfied, the tensor decomposition is unique, and the extracted features represented by the core tensor \\( \\mathbf{G} \\) and factor matrices \\( \\mathbf{A} \\), \\( \\mathbf{B} \\), and \\( \\mathbf{C} \\) are meaningful.\n\n2. To apply a regularization term that minimizes the sum of squares of the Frobenius norms',
                },
            ],
            source: 'olmo-2-1124-13b-preference-mix',
            textLong:
                '<|user|>\nExplain how the bed and breakfast contributes to the local economy and environment in no more than 4 sentences. Use JSON format and repeat the prompt in your response.\n<|assistant|>\n1. The tensor decomposition is unique if and only if the ranks \\( r_1 \\), \\( r_2 \\), and \\( r_3 \\) satisfy the uniqueness conditions for the CP decomposition. These conditions are:\n\n- The ranks must be less than or equal to the mininal ranks, which are the number of nonzero singular values of the tensor.\n- The ranks must satisfy the so-called "CP rank deflation" property, which states that for any rank-1 update to the CP approximation, the ranks must not increase.\n\nIf these conditions are satisfied, the tensor decomposition is unique, and the extracted features represented by the core tensor \\( \\mathbf{G} \\) and factor matrices \\( \\mathbf{A} \\), \\( \\mathbf{B} \\), and \\( \\mathbf{C} \\) are meaningful.\n\n2. To apply a regularization term that minimizes the sum of squares of the Frobenius norms of the differences between the original tensor \\( \\mathbf{X} \\) and its approximation, while ensuring that each factor matrix remains orthogonal, we can use the following formulation:\n\nLet \\( \\mathbf{E}_i = \\mathbf{X} - \\sum_{j=1}^{i-1} \\mathbf{G}_{ij} \\mathbf{a}_i \\otimes \\mathbf{b}_i \\otimes \\mathbf{c}_i \\) for \\( i = 1, 2, \\dots, r_1 \\), and similarly let \\( \\mathbf{F}_j = \\mathbf{X} - \\sum_{i=1}^{j-1} \\mathbf{G}_{ij} \\mathbf{a}_i \\otimes \\mathbf{b}_j \\otimes \\mathbf{c}_j \\) for \\( j = 1, 2, \\dots, r_2 \\), and \\( \\mathbf{G}_k = \\mathbf{X} - \\sum_{i=1}^{',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['derivative \\( \\frac{\\partial f}{\\partial'],
            correspondingSpans: [11],
            index: '3159705239',
            relevanceScore: 258.3384315804817,
            snippets: [
                {
                    correspondingSpanText: 'derivative \\( \\frac{\\partial f}{\\partial',
                    text: 'ical value.\n\n2. The student is also tasked with analyzing the sensitivity of the ethical decision-making process to changes in the factor \\( x \\). Compute the partial derivative \\( \\frac{\\partial f}{\\partial x} \\) and interpret its significance in the context of ethical decision-making, specifically focusing on how changes in the parameter \\( x \\) (social impact) influence the ethical value of a',
                },
            ],
            source: 'dolmino',
            textLong:
                "A non-traditional student with significant real-world experience is taking a course in advanced calculus and ethics. One of the unique projects involves analyzing a mathematical model of decision-making in ethical dilemmas. The model is based on a function \\( f(x, y) \\) that represents the ethical value of a decision, where \\( x \\) and \\( y \\) are parameters that depend on various real-world factors.\n\n1. Given the function \\( f(x, y) = \\frac{xy}{\\sqrt{x^2 + y^2}} \\), where \\( x \\) and \\( y \\) are variables representing real-world factors such as social impact and personal gain, determine the critical points of \\( f(x, y) \\). Analyze these critical points to identify which scenarios (i.e., values of \\( x \\) and \\( y \\)) lead to optimal ethical decisions, assuming the objective is to maximize the ethical value.\n\n2. The student is also tasked with analyzing the sensitivity of the ethical decision-making process to changes in the factor \\( x \\). Compute the partial derivative \\( \\frac{\\partial f}{\\partial x} \\) and interpret its significance in the context of ethical decision-making, specifically focusing on how changes in the parameter \\( x \\) (social impact) influence the ethical value of a decision.\nTo solve the given problem step-by-step, let's break it down into the two parts requested.\n\n### Part 1: Finding Critical Points\n\nThe function given is:\n\\[ f(x, y) = \\frac{xy}{\\sqrt{x^2 + y^2}}. \\]\n\nTo find the critical points, we need to compute the partial derivatives \\( \\frac{\\partial f}{\\partial x} \\) and \\( \\frac{\\partial f}{\\partial y} \\), and set them equal to zero.\n\n#### Step 1.1: Compute the Partial Derivative with Respect to \\( x \\)\n\nUsing the quotient rule for derivatives, we have:\n\\[ \\frac{\\partial f}{\\partial x} = \\frac{(\\sqrt{x^2 + y^2})(y) - (xy)\\left(\\frac{x}{\\sqrt{x^2 + y^2}}\\right)}{x^",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['derivative \\( \\frac{\\partial f}{\\partial'],
            correspondingSpans: [11],
            index: '3163281826',
            relevanceScore: 258.3384315804817,
            snippets: [
                {
                    correspondingSpanText: 'derivative \\( \\frac{\\partial f}{\\partial',
                    text: 'ical value.\n\n2. The student is also tasked with analyzing the sensitivity of the ethical decision-making process to changes in the factor \\( x \\). Compute the partial derivative \\( \\frac{\\partial f}{\\partial x} \\) and interpret its significance in the context of ethical decision-making, specifically focusing on how changes in the parameter \\( x \\) (social impact) influence the ethical value of a',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                "<|user|>\nA non-traditional student with significant real-world experience is taking a course in advanced calculus and ethics. One of the unique projects involves analyzing a mathematical model of decision-making in ethical dilemmas. The model is based on a function \\( f(x, y) \\) that represents the ethical value of a decision, where \\( x \\) and \\( y \\) are parameters that depend on various real-world factors.\n\n1. Given the function \\( f(x, y) = \\frac{xy}{\\sqrt{x^2 + y^2}} \\), where \\( x \\) and \\( y \\) are variables representing real-world factors such as social impact and personal gain, determine the critical points of \\( f(x, y) \\). Analyze these critical points to identify which scenarios (i.e., values of \\( x \\) and \\( y \\)) lead to optimal ethical decisions, assuming the objective is to maximize the ethical value.\n\n2. The student is also tasked with analyzing the sensitivity of the ethical decision-making process to changes in the factor \\( x \\). Compute the partial derivative \\( \\frac{\\partial f}{\\partial x} \\) and interpret its significance in the context of ethical decision-making, specifically focusing on how changes in the parameter \\( x \\) (social impact) influence the ethical value of a decision.\n<|assistant|>\nTo solve the given problem step-by-step, let's break it down into the two parts requested.\n\n### Part 1: Finding Critical Points\n\nThe function given is:\n\\[ f(x, y) = \\frac{xy}{\\sqrt{x^2 + y^2}}. \\]\n\nTo find the critical points, we need to compute the partial derivatives \\( \\frac{\\partial f}{\\partial x} \\) and \\( \\frac{\\partial f}{\\partial y} \\), and set them equal to zero.\n\n#### Step 1.1: Compute the Partial Derivative with Respect to \\( x \\)\n\nUsing the quotient rule for derivatives, we have:\n\\[ \\frac{\\partial f}{\\partial x} = \\frac{(\\sqrt{x^2 + y^2})(y) - (xy)\\left(\\frac{x}{\\sqrt{x^2 + y",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\( \\frac{\\partial^2 f}{\\partial',
                ' \\( \\frac{\\partial^2 g}{\\partial',
                '-order derivative \\( \\frac{\\partial^2 g}{\\partial',
            ],
            correspondingSpans: [6, 23, 29, 37],
            index: '3159779016',
            relevanceScore: 257.7362687558513,
            snippets: [
                {
                    correspondingSpanText: '\\( \\frac{\\partial^2 f}{\\partial',
                    text: 'differential equation (PDE) that the transformed wave function \\( g(x, t) \\) must satisfy, assuming the original wave function \\( f(x, t) \\) satisfies the standard wave equation \\( \\frac{\\partial^2 f}{\\partial t^2} = c^2 \\frac{\\partial^2 f}{\\partial x^2} \\).\n\n2. Analyze the stability of the transformed wave function \\( g(',
                },
                {
                    correspondingSpanText: '\\( \\frac{\\partial^2 g}{\\partial',
                    text: ').\n\nTherefore, the conditions for \\( g(x, t) \\) to remain bounded are:\n\\[ \\sigma > 0 \\]\n\nFinal Answer: The final answer is \\( \\frac{\\partial^2 g}{\\partial t^2} = c^2 \\frac{\\partial^2 g}{\\partial x^2} + \\left( \\frac{\\partial^2 T}{\\partial t^2} f +',
                },
            ],
            source: 'dolmino',
            textLong:
                "hip travels through a wormhole. The wormhole distorts sound waves in a specific manner described by a transformation function that combines elements of wave mechanics and relativistic effects. The function \\( T(x, t) \\) describes the transformation of a sound wave \\( f(x, t) \\) as it travels through the wormhole, where \\( x \\) is the spatial coordinate and \\( t \\) is time.\n\nGiven the transformed wave function \\( g(x, t) = T(x, t) \\cdot f(x, t) \\), the transformation function \\( T(x, t) \\) is defined as:\n\\[ T(x, t) = e^{-(x^2 + t^2) / \\sigma^2} \\cos(\\alpha x - \\beta t) \\]\nwhere \\( \\sigma \\), \\( \\alpha \\), and \\( \\beta \\) are constants.\n\nSub-problems:\n\n1. Derive the partial differential equation (PDE) that the transformed wave function \\( g(x, t) \\) must satisfy, assuming the original wave function \\( f(x, t) \\) satisfies the standard wave equation \\( \\frac{\\partial^2 f}{\\partial t^2} = c^2 \\frac{\\partial^2 f}{\\partial x^2} \\).\n\n2. Analyze the stability of the transformed wave function \\( g(x, t) \\) by determining the conditions on \\( \\sigma \\), \\( \\alpha \\), and \\( \\beta \\) that ensure \\( g(x, t) \\) remains bounded for all \\( x \\) and \\( t \\).\nLet's solve the given sub-problems one by one.\n\n### Sub-problem 1: Derive the Partial Differential Equation (PDE) for \\( g(x, t) \\)\n\nGiven:\n\\[ g(x, t) = T(x, t) \\cdot f(x, t) \\]\nwhere\n\\[ T(x, t) = e^{-(x^2 + t^2) / \\sigma^2} \\cos(\\alpha x - \\beta t) \\]\nand\n\\[ \\frac{\\partial^2 f}{\\partial t^2} = c^2 \\frac{\\partial^2 f}{\\partial x^2} \\]\n\nFirst, we need to find",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['} \\cdot \\mathbf{A}^{-1} ='],
            correspondingSpans: [32],
            index: '3142393807',
            relevanceScore: 257.0245758890991,
            snippets: [
                {
                    correspondingSpanText: '} \\cdot \\mathbf{A}^{-1} =',
                    text: 'that $\\mathbf{A}^{-1} = \\begin{pmatrix} -4 & 1 \\\\ X & 2 \\end{pmatrix},$ we can set up the equation $\\mathbf{A} \\cdot \\mathbf{A}^{-1} = \\mathbf{I},$ where $\\mathbf{I}$ is the identity matrix.\n\n$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\cdot \\begin',
                },
            ],
            source: 'dolmino',
            textLong:
                'If $\\mathbf{A}^{-1} = \\begin{pmatrix} -4 & 1 \\\\ X & 2 \\end{pmatrix},$ then find the inverse of $\\mathbf{A}^2. The answer is 4. What is the value of unknown variable X?\n\nTo find the inverse of $\\mathbf{A}^2,$ we need to first find the inverse of $\\mathbf{A}.$\n\nGiven that $\\mathbf{A}^{-1} = \\begin{pmatrix} -4 & 1 \\\\ X & 2 \\end{pmatrix},$ we can set up the equation $\\mathbf{A} \\cdot \\mathbf{A}^{-1} = \\mathbf{I},$ where $\\mathbf{I}$ is the identity matrix.\n\n$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\cdot \\begin{pmatrix} -4 & 1 \\\\ X & 2 \\end{pmatrix} = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix},$\n\nExpanding the product, we get\n\n$\\begin{pmatrix} -4a + Xc & a + 2b \\\\ -4c + Xd & c + 2d \\end{pmatrix} = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}.$\n\nComparing the corresponding entries, we get the following equations:\n\n$-4a + Xc = 1,$\n\n$a + 2b = 0,$\n\n$-4c + Xd = 0,$\n\n$c + 2d = 1.$\n\nFrom the second equation, we can express $a$ in terms of $b$ as $a = -2b.$\n\nNow, substituting $a =',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\( \\mathbf{A}^{-1} \\).\n'],
            correspondingSpans: [28],
            index: '3163314227',
            relevanceScore: 255.11698484524672,
            snippets: [
                {
                    correspondingSpanText: '\\( \\mathbf{A}^{-1} \\).\n',
                    text: 'mathbf{x} = \\mathbf{A}^{-1} \\mathbf{b} \\).\n\nFirst, we need to find the inverse of \\( \\mathbf{A} \\), denoted as \\( \\mathbf{A}^{-1} \\).\n\n#### Finding \\( \\mathbf{A}^{-1} \\)\n\nUsing a computational tool or manual calculation, we find:\n\\[\n\\mathbf{A}^{-1} = \\begin',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                'form each element of the vector \\( \\mathbf{x} \\) using the function \\( f(x) = x^2 - 2x + 1 \\).\n\n### Step 1: Solve the Matrix Equation\n\nWe have the matrix equation:\n\\[\n\\mathbf{A}\\mathbf{x} = \\mathbf{b}\n\\]\nGiven:\n\\[\n\\mathbf{A} = \\begin{pmatrix}\n2 & -1 & 3 & 1 \\\\\n-1 & 4 & 2 & -2 \\\\\n3 & 2 & -1 & 3 \\\\\n1 & -2 & 3 & 2\n\\end{pmatrix}\n\\]\nand\n\\[\n\\mathbf{b} = \\begin{pmatrix}\n19 \\\\\n42 \\\\\n23 \\\\\n16\n\\end{pmatrix}\n\\]\n\nTo find \\( \\mathbf{x} \\), we need to compute \\( \\mathbf{x} = \\mathbf{A}^{-1} \\mathbf{b} \\).\n\nFirst, we need to find the inverse of \\( \\mathbf{A} \\), denoted as \\( \\mathbf{A}^{-1} \\).\n\n#### Finding \\( \\mathbf{A}^{-1} \\)\n\nUsing a computational tool or manual calculation, we find:\n\\[\n\\mathbf{A}^{-1} = \\begin{pmatrix}\n\\frac{77}{96} & \\frac{5}{96} & -\\frac{1}{32} & -\\frac{17}{96} \\\\\n\\frac{5}{96} & \\frac{19}{96} & \\frac{1}{32} & -\\frac{7}{96} \\\\\n-\\frac{1}{32} & \\frac{1}{32} & \\frac{1}{16} & \\frac{1}{32} \\\\\n-\\frac{17}{96} & -\\frac{7}{96} & \\frac{1}{32} & \\frac{25}{96}\n\\end{pmatrix}\n\\]\n\nNow, we calculate \\( \\mathbf{x} = \\mathbf{A}^{-1} \\mathbf{b} \\):\n\n\\[\n\\mathbf{x} = \\begin{pmatrix}\n\\frac{',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\( \\mathbf{A}^{-1} \\).\n'],
            correspondingSpans: [28],
            index: '3159750342',
            relevanceScore: 255.11698484524672,
            snippets: [
                {
                    correspondingSpanText: '\\( \\mathbf{A}^{-1} \\).\n',
                    text: 'mathbf{x} = \\mathbf{A}^{-1} \\mathbf{b} \\).\n\nFirst, we need to find the inverse of \\( \\mathbf{A} \\), denoted as \\( \\mathbf{A}^{-1} \\).\n\n#### Finding \\( \\mathbf{A}^{-1} \\)\n\nUsing a computational tool or manual calculation, we find:\n\\[\n\\mathbf{A}^{-1} = \\begin',
                },
            ],
            source: 'dolmino',
            textLong:
                'form each element of the vector \\( \\mathbf{x} \\) using the function \\( f(x) = x^2 - 2x + 1 \\).\n\n### Step 1: Solve the Matrix Equation\n\nWe have the matrix equation:\n\\[\n\\mathbf{A}\\mathbf{x} = \\mathbf{b}\n\\]\nGiven:\n\\[\n\\mathbf{A} = \\begin{pmatrix}\n2 & -1 & 3 & 1 \\\\\n-1 & 4 & 2 & -2 \\\\\n3 & 2 & -1 & 3 \\\\\n1 & -2 & 3 & 2\n\\end{pmatrix}\n\\]\nand\n\\[\n\\mathbf{b} = \\begin{pmatrix}\n19 \\\\\n42 \\\\\n23 \\\\\n16\n\\end{pmatrix}\n\\]\n\nTo find \\( \\mathbf{x} \\), we need to compute \\( \\mathbf{x} = \\mathbf{A}^{-1} \\mathbf{b} \\).\n\nFirst, we need to find the inverse of \\( \\mathbf{A} \\), denoted as \\( \\mathbf{A}^{-1} \\).\n\n#### Finding \\( \\mathbf{A}^{-1} \\)\n\nUsing a computational tool or manual calculation, we find:\n\\[\n\\mathbf{A}^{-1} = \\begin{pmatrix}\n\\frac{77}{96} & \\frac{5}{96} & -\\frac{1}{32} & -\\frac{17}{96} \\\\\n\\frac{5}{96} & \\frac{19}{96} & \\frac{1}{32} & -\\frac{7}{96} \\\\\n-\\frac{1}{32} & \\frac{1}{32} & \\frac{1}{16} & \\frac{1}{32} \\\\\n-\\frac{17}{96} & -\\frac{7}{96} & \\frac{1}{32} & \\frac{25}{96}\n\\end{pmatrix}\n\\]\n\nNow, we calculate \\( \\mathbf{x} = \\mathbf{A}^{-1} \\mathbf{b} \\):\n\n\\[\n\\mathbf{x} = \\begin{pmatrix}\n\\frac{',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\( \\frac{\\partial^2 f}{\\partial'],
            correspondingSpans: [6],
            index: '2510819705',
            relevanceScore: 253.1689534427989,
            snippets: [
                {
                    correspondingSpanText: '\\( \\frac{\\partial^2 f}{\\partial',
                    text: 'n^2} = 0 \\label{eq:laplace} \\end{equation}\n\nWhich for a 2D function \\( f(x,y) \\) would be \\( \\frac{\\partial^2 f}{\\partial x^2} + \\frac{\\partial^2 f}{\\partial y^2} = 0 \\) or \\(f_{xx} + f_{yy} = 0\\) depending on how',
                },
            ],
            source: 'dclm-hero-run-fasttext_for_HF',
            textLong:
                "Harmonic function: definitions and properties\n\n\nHarmonic function definition and notations\n\nIn this section I will introduce the vocabulary and notions needed for the rest of the post.\n\nSo what is an harmonic function? It's a function \\( f: \\mathbb R^n \\rightarrow \\mathbb R\\) which second derivatives sum to zero. So it must satisfy the equation:\n\n\\begin{equation} \\frac{\\partial^2f}{\\partial x_1^2} + \\frac{\\partial^2f}{\\partial x_2^2} + \\cdots + \\frac{\\partial^2f}{\\partial x_n^2} = 0 \\label{eq:laplace} \\end{equation}\n\nWhich for a 2D function \\( f(x,y) \\) would be \\( \\frac{\\partial^2 f}{\\partial x^2} + \\frac{\\partial^2 f}{\\partial y^2} = 0 \\) or \\(f_{xx} + f_{yy} = 0\\) depending on how you like to write your derivatives. This equation is a differential equation.\u00a0 However it is a special type of differential equation. Because \\( f \\) has multiples variables it is called a partial differential equation (PDE). Among the numerous PDEs the above equation is also named the Laplace equation.\n\nI showed earlier how to compute with a diffusion process discrete harmonic functions. In these examples if you pick any point \\( (x, y) \\) then \\( f(x,y) \\) has to verify the laplace equation\u00a0\\(f_{xx} + f_{yy} = 0\\). We'll see every points do, even if for some it is not so obvious, but we'll get back on that.\n\nWhat we have done using the diffusion process is: solving numerically the laplace equation \\(f_{xx} + f_{yy} = 0\\) (a PDE) for every points of the grid. It is a numerical solution since the solution \\( f \\) is represented",

            url: 'http://rodolphe-vaillant.fr/?e=53',
            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\( \\frac{\\partial^2 f}{\\partial'],
            correspondingSpans: [6],
            index: '604306870',
            relevanceScore: 252.4990147349684,
            snippets: [
                {
                    correspondingSpanText: '\\( \\frac{\\partial^2 f}{\\partial',
                    text: 'n^2} = 0 \\label{eq:laplace} \\end{equation}\n\nWhich for a 2D function \\( f(x,y) \\) would be \\( \\frac{\\partial^2 f}{\\partial x^2} + \\frac{\\partial^2 f}{\\partial y^2} = 0 \\) or \\(f_{xx} + f_{yy} = 0\\) depending on how',
                },
            ],
            source: 'dclm-hero-run-fasttext_for_HF',
            textLong:
                "and their properties. This is the hard part with a lot of mathematics. But it's a mandatory step to understand how harmonic functions work. This will allow you to apply them in a broader context and understand many scientific papers relying on these. In addition this will be my entry point to introduce Finite Element Method in future posts. So hang on it's worth it!\n\nHarmonic function definition and notations\n\nIn this section I will introduce the vocabulary and notions needed for the rest of the post.\n\nSo what is an harmonic function? It's a function \\( f: \\mathbb R^n \\rightarrow \\mathbb R\\) which second derivatives sum to zero. So it must satisfy the equation:\n\n\\begin{equation} \\frac{\\partial^2f}{\\partial x_1^2} + \\frac{\\partial^2f}{\\partial x_2^2} + \\cdots + \\frac{\\partial^2f}{\\partial x_n^2} = 0 \\label{eq:laplace} \\end{equation}\n\nWhich for a 2D function \\( f(x,y) \\) would be \\( \\frac{\\partial^2 f}{\\partial x^2} + \\frac{\\partial^2 f}{\\partial y^2} = 0 \\) or \\(f_{xx} + f_{yy} = 0\\) depending on how you like to write your derivatives. This equation is a differential equation.\u00a0 However it is a special type of differential equation. Because \\( f \\) has multiples variables it is called a partial differential equation (PDE). Among the numerous PDEs the above equation is also named the Laplace equation.\n\nI showed earlier how to compute with a diffusion process discrete harmonic functions. In these examples if you pick any point \\( (x, y) \\) then \\( f(x,y) \\) has to verify the Laplace equation\u00a0\\(f_{xx} + f_{yy} = 0\\). We'll see every points do, even if for some it is not so obvious, but we'll get back on that.\n\nWhat we have done using the diffusion process is: solving numerically the Laplace equation \\(f_{xx} + f_{yy} = 0\\) (a PDE) for every points of the grid. It is a numerical solution since the solution \\( f \\) is represented",

            url: 'http://rodolphe-vaillant.fr/entry/53/harmonic-function-definitions-and-properties',
            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\( \\mathbf{A} \\), \\( \\mathbf{'],
            correspondingSpans: [1],
            index: '3159669130',
            relevanceScore: 251.86144619456743,
            snippets: [
                {
                    correspondingSpanText: '\\( \\mathbf{A} \\), \\( \\mathbf{',
                    text: ', 2, 4, 6, 7, 3, 4, 5, 6, 7, 8] \\), find a linear combination of the vectors \\( \\mathbf{A} \\), \\( \\mathbf{B} \\), and \\( \\mathbf{C} \\) that minimizes the Euclidean distance to the vector \\( \\mathbf{D} = [2, 3, 4, 5',
                },
            ],
            source: 'dolmino',
            textLong:
                "a former rowing teammate who is proud of his friends' success, decides to analyze the performance data of his team over the past rowing season. The team participated in 12 different races, and John wants to model their performance using advanced calculus and linear algebra. \n\n1. John represents the performance of the team in each race as a vector in a 12-dimensional space, where each coordinate corresponds to their rank in a particular race. Given the performance vectors of three of his friends' teams, \\( \\mathbf{A} = [2, 4, 1, 3, 5, 6, 2, 3, 4, 5, 6, 7] \\), \\( \\mathbf{B} = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6] \\), and \\( \\mathbf{C} = [3, 5, 2, 4, 6, 7, 3, 4, 5, 6, 7, 8] \\), find a linear combination of the vectors \\( \\mathbf{A} \\), \\( \\mathbf{B} \\), and \\( \\mathbf{C} \\) that minimizes the Euclidean distance to the vector \\( \\mathbf{D} = [2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 7] \\). Determine the coefficients of the linear combination.\n\n2. Assuming the team's performance can be modeled by the function \\( f(x) = ax^3 + bx^2 + cx + d \\), where \\( x \\) represents the race number (from 1 to 12), and the function \\( f(x) \\) represents their rank in that race, use the data given by the vector \\( \\mathbf{A} \\) to find the coefficients \\( a \\), \\( b \\), \\( c \\), and \\( d \\) using polynomial regression.\nLet's solve each part of the problem step-by-step:\n\n### Part 1: Minimizing the Euclidean Distance\n\nWe need to find the coefficients \\( \\alpha \\), \\( \\beta \\), and \\( \\gamma \\) such that the linear combination \\( \\alpha \\mathbf",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\) and \\( \\frac{\\partial^2 f}{\\partial'],
            correspondingSpans: [9],
            index: '3163375833',
            relevanceScore: 250.6619538270109,
            snippets: [
                {
                    correspondingSpanText: '\\) and \\( \\frac{\\partial^2 f}{\\partial',
                    text: 'y e^{t^2 + s^2} \\, ds \\, dt \\). Determine whether the mixed partial derivatives \\( \\frac{\\partial^2 f}{\\partial x \\partial y} \\) and \\( \\frac{\\partial^2 f}{\\partial y \\partial x} \\) are equal everywhere in \\( \\mathbb{R}^2 \\). Justify your answer using appropriate theorems.\n\n2. Given a linear transformation \\( T:',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                "<|user|>\nAs a knowledgeable peer offering guidance in difficult subjects, you decide to create a challenging problem to help your fellow students deepen their understanding of calculus and linear algebra.\n\n1. Consider a function \\( f: \\mathbb{R}^2 \\to \\mathbb{R} \\) defined by \\( f(x, y) = \\int_0^x \\int_0^y e^{t^2 + s^2} \\, ds \\, dt \\). Determine whether the mixed partial derivatives \\( \\frac{\\partial^2 f}{\\partial x \\partial y} \\) and \\( \\frac{\\partial^2 f}{\\partial y \\partial x} \\) are equal everywhere in \\( \\mathbb{R}^2 \\). Justify your answer using appropriate theorems.\n\n2. Given a linear transformation \\( T: \\mathbb{R}^n \\to \\mathbb{R}^n \\) represented by an \\( n \\times n \\) matrix \\( A \\), where \\( A \\) is known to be invertible. If \\( A \\) is decomposed into the form \\( A = LU \\) where \\( L \\) is a lower triangular matrix and \\( U \\) is an upper triangular matrix, prove that the eigenvalues of \\( A \\) are the same as the eigenvalues of \\( L \\) and \\( U \\), and discuss the implications of this result in relation to the invertibility of \\( A \\).\n<|assistant|>\nTo solve the given problem, let's address each part step-by-step.\n\n### Part 1:\n\nWe need to determine whether the mixed partial derivatives \\( \\frac{\\partial^2 f}{\\partial x \\partial y} \\) and \\( \\frac{\\partial^2 f}{\\partial y \\partial x} \\) are equal for the function \\( f(x, y) =",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\( \\mathbf{A} \\), \\( \\mathbf{'],
            correspondingSpans: [1],
            index: '3163277435',
            relevanceScore: 247.6893769176404,
            snippets: [
                {
                    correspondingSpanText: '\\( \\mathbf{A} \\), \\( \\mathbf{',
                    text: 'connected to the end of \\( \\mathbf{B} \\) such that it can rotate in the XY-plane relative to \\( \\mathbf{B} \\). If the angles of rotation for segments \\( \\mathbf{A} \\), \\( \\mathbf{B} \\), and \\( \\mathbf{C} \\) are \\( \\theta_1 \\), \\( \\theta_2 \\), and \\( \\theta_3 \\) respectively, express the coordinates of',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                "<|user|>\nA tech blogger has recently published a series of posts about a new robotic arm that operates with a combination of linear actuators and rotational joints. The robotic arm's motion can be modeled using a combination of linear algebra and calculus.\n\n1. The robotic arm consists of three segments. The first segment \\( \\mathbf{A} \\) is 2 units long and can rotate around the origin in the XY-plane. The second segment \\( \\mathbf{B} \\) is 3 units long and is connected to the end of \\( \\mathbf{A} \\) such that it can rotate in the XY-plane relative to \\( \\mathbf{A} \\). The third segment \\( \\mathbf{C} \\) is 1 unit long and is connected to the end of \\( \\mathbf{B} \\) such that it can rotate in the XY-plane relative to \\( \\mathbf{B} \\). If the angles of rotation for segments \\( \\mathbf{A} \\), \\( \\mathbf{B} \\), and \\( \\mathbf{C} \\) are \\( \\theta_1 \\), \\( \\theta_2 \\), and \\( \\theta_3 \\) respectively, express the coordinates of the end effector (the tip of segment \\( \\mathbf{C} \\)) as a function of \\( \\theta_1 \\), \\( \\theta_2 \\), and \\( \\theta_3 \\).\n\n2. Suppose the end effector must trace a circular path of radius 2 units centered at the point (4, 3) in the XY-plane. Derive the equations that \\( \\theta_1 \\), \\( \\theta_2 \\), and \\( \\theta_3 \\) must satisfy to achieve this motion.\n<|assistant|>\nLet's solve the problem step-by-step.\n\n### Problem 1: Express Coordinates of the End Effector\n\nThe robotic arm's configuration consists of three segments, each with specific lengths and rotational capabilities. To find the coordinates of the end effector, we need to calculate the position after each segment's rotation.\n\n1. **Segment \\( \\mathbf{A} \\):",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\( \\frac{\\partial^2 g}{\\partial',
                '-order derivative \\( \\frac{\\partial^2 g}{\\partial',
                ' \\( \\frac{\\partial^2 g}{\\partial',
            ],
            correspondingSpans: [23, 29, 37],
            index: '3139378054',
            relevanceScore: 246.81498624542186,
            snippets: [
                {
                    correspondingSpanText: '\\( \\frac{\\partial^2 g}{\\partial',
                    text: '\\frac{\\partial }{\\partial y}(\\sqrt{y}) = \\frac{1}{2\\sqrt{y}} = \\frac{1}{2\\sqrt{z}}\\)\n* \\( \\frac{\\partial^2 g}{\\partial y^2} = -\\frac{1}{(2y)^{3/2}} = -\\frac{1}{(2\\sqrt{z})^{3}}\\)\n\nSubstituting these',
                },
            ],
            source: 'dolmino',
            textLong:
                '{\\partial^2 g}{\\partial y^2} $$\n\nRecall that \\( dy = (\\alpha - \\beta y)dt + \\delta dW \\); substituting this into our expression gives:\n\n$$ dz = [(\\alpha - \\beta y)dt + \\delta dW]\\cdot\\frac{\\partial g}{\\partial y} + \\frac{1}{2}(dW)^2 \\cdot \\frac{\\partial^2 g}{\\partial y^2} $$\n\nNow, since \\( dW^2 = dt \\), and by assuming \\( y = \\sqrt{z} \\), we obtain:\n\n$$ dz = [\\dots]dt + [\\dots]dW + \\frac{1}{2}dt \\cdot \\frac{\\partial^2 g}{\\partial y^2} $$\n\nOur goal now is to calculate the required partial derivatives of \\(g\\) with respect to \\(y\\):\n\n* \\( \\frac{\\partial g}{\\partial y} = \\frac{\\partial }{\\partial y}(\\sqrt{y}) = \\frac{1}{2\\sqrt{y}} = \\frac{1}{2\\sqrt{z}}\\)\n* \\( \\frac{\\partial^2 g}{\\partial y^2} = -\\frac{1}{(2y)^{3/2}} = -\\frac{1}{(2\\sqrt{z})^{3}}\\)\n\nSubstituting these expressions back yields:\n\n$$ dz = [\\dots]dt + [\\dots]dW + \\frac{1}{2}dt \\cdot \\left(-\\frac{1}{(2\\sqrt{z})^{3}}\\right)$$\n\nCalculate the remaining terms inside the brackets and collect like terms. After some algebraic manipulation, you will arrive at the desired result:\n\n$$ dz = (\\delta^2 + 2\\alpha\\sqrt{z} - 2\\beta z)dt + 2\\delta\\sqrt{z}dW $$',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\( \\frac{\\partial^2 g}{\\partial',
                '-order derivative \\( \\frac{\\partial^2 g}{\\partial',
                ' \\( \\frac{\\partial^2 g}{\\partial',
            ],
            correspondingSpans: [23, 29, 37],
            index: '3141576421',
            relevanceScore: 246.81498624542186,
            snippets: [
                {
                    correspondingSpanText: '\\( \\frac{\\partial^2 g}{\\partial',
                    text: '\\frac{\\partial }{\\partial y}(\\sqrt{y}) = \\frac{1}{2\\sqrt{y}} = \\frac{1}{2\\sqrt{z}}\\)\n* \\( \\frac{\\partial^2 g}{\\partial y^2} = -\\frac{1}{(2y)^{3/2}} = -\\frac{1}{(2\\sqrt{z})^{3}}\\)\n\nSubstituting these',
                },
            ],
            source: 'dolmino',
            textLong:
                '{\\partial^2 g}{\\partial y^2} $$\n\nRecall that \\( dy = (\\alpha - \\beta y)dt + \\delta dW \\); substituting this into our expression gives:\n\n$$ dz = [(\\alpha - \\beta y)dt + \\delta dW]\\cdot\\frac{\\partial g}{\\partial y} + \\frac{1}{2}(dW)^2 \\cdot \\frac{\\partial^2 g}{\\partial y^2} $$\n\nNow, since \\( dW^2 = dt \\), and by assuming \\( y = \\sqrt{z} \\), we obtain:\n\n$$ dz = [\\dots]dt + [\\dots]dW + \\frac{1}{2}dt \\cdot \\frac{\\partial^2 g}{\\partial y^2} $$\n\nOur goal now is to calculate the required partial derivatives of \\(g\\) with respect to \\(y\\):\n\n* \\( \\frac{\\partial g}{\\partial y} = \\frac{\\partial }{\\partial y}(\\sqrt{y}) = \\frac{1}{2\\sqrt{y}} = \\frac{1}{2\\sqrt{z}}\\)\n* \\( \\frac{\\partial^2 g}{\\partial y^2} = -\\frac{1}{(2y)^{3/2}} = -\\frac{1}{(2\\sqrt{z})^{3}}\\)\n\nSubstituting these expressions back yields:\n\n$$ dz = [\\dots]dt + [\\dots]dW + \\frac{1}{2}dt \\cdot \\left(-\\frac{1}{(2\\sqrt{z})^{3}}\\right)$$\n\nCalculate the remaining terms inside the brackets and collect like terms. After some algebraic manipulation, you will arrive at the desired result:\n\n$$ dz = (\\delta^2 + 2\\alpha\\sqrt{z} - 2\\beta z)dt + 2\\delta\\sqrt{z}dW $$',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\mathrm{tr}(\\mathbf{A}^{-',
                ' \\mathrm{tr}(\\mathbf{A}^{-',
                '1}) = \\mathrm{tr}(\\mathbf{A}^{-T} \\mathbf{A}^{-',
            ],
            correspondingSpans: [10, 12, 14],
            index: '2950826682',
            relevanceScore: 243.24687317556823,
            snippets: [
                {
                    correspondingSpanText: '\\mathrm{tr}(\\mathbf{A}^{-',
                    text: 'expression in (\\ref{eqn:MSE-orthogonal-approx}) can be written as\r\n\\begin{align}\r\nJ(\\mathbf{V}_\\mathrm{RF}) &\\approx \\mathrm{tr}(\\mathbf{A}^{-1}_{m})-\\frac{\\mathrm{tr}\\left( \\frac{1}{{\\sigma^2wN_\\mathrm{t}}}\\mathbf{A}^{-1}_{m}\\mathbf{H',
                },
            ],
            source: 'algebraic-stack',
            textLong:
                'by-column. Specifically, define $\\overline{\\mathbf{V}}_m$ as the remaining sub-matrix of $\\mathbf{V}_\\mathrm{RF}$ after removing the $m$th column $\\mathbf{v}_m$. Further define $\\mathbf{A}_{m} \\triangleq  \\mathbf{I}_{{N}_{\\mathrm{s}}}+\\frac{1}{{\\sigma^2wN_\\mathrm{t}}}\\mathbf{H}_\\mathrm{1}^H \\overline{\\mathbf{V}}_m\\overline{\\mathbf{V}}_m^H\\mathbf{H}_\\mathrm{1}$. Then, using the fact that $(\\mathbf{A}+\\mathbf{B})^{-1}=\\mathbf{A}^{-1}-\\frac{\\mathbf{A}^{-1}\\mathbf{B}\\mathbf{A}^{-1}}{1+\\mathrm{tr} (\\mathbf{A}^{-1}\\mathbf{B})}$ for a full-rank matrix $\\mathbf{A}$ and a rank-one matrix $\\mathbf{B}$, the MSE expression in (\\ref{eqn:MSE-orthogonal-approx}) can be written as\r\n\\begin{align}\r\nJ(\\mathbf{V}_\\mathrm{RF}) &\\approx \\mathrm{tr}(\\mathbf{A}^{-1}_{m})-\\frac{\\mathrm{tr}\\left( \\frac{1}{{\\sigma^2wN_\\mathrm{t}}}\\mathbf{A}^{-1}_{m}\\mathbf{H}_\\mathrm{1}^H\\mathbf{v}_m {}\\mathbf{v}_m^{H}\\mathbf{H}_\\mathrm{1}\\mathbf{A}^{-1}_{m}\\right)}{1+\\mathrm{tr}\\left( \\frac{1}{{\\sigma^2wN_\\mathrm{t}}}\\mathbf{A}^{-1}_{m}\\mathbf{H}_\\mathrm{1}^H\\mathbf{v}_m \\mathbf{v}_m^{H}\\mathbf{H}_\\mathrm{1}\\right)} \\nonumber\\\\\r\n&=\\mathrm{tr}(\\mathbf{A}^{-1}_{m})-\\frac{\\mathbf{v}_m^{H} \\mathbf{U}_{{m}} \\mathbf{v}_m}{\\mathbf{v}_{m}^{H}\\mathbf{W}_{m}\\mathbf{v}_m}, \\label{eqn:GEVD-each-step}\r\n\\end{align}\r\n\r\nwhere $\\mathbf{U}_{m} \\triangleq\\frac{1}{{\\sigma',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['} \\cdot \\mathbf{A}^{-1} ='],
            correspondingSpans: [32],
            index: '2952500489',
            relevanceScore: 242.04689394726387,
            snippets: [
                {
                    correspondingSpanText: '} \\cdot \\mathbf{A}^{-1} =',
                    text: 'let\u2019s really buy into this metonymy and try that again:\n\n$\\mathbf{T}(\\mathbf{T^{-1}}(\\mathbf{x})) \\leadsto \\mathbf{A} \\cdot \\mathbf{A}^{-1} = \\mathbf{I}.$\n\nHm. That\u2019s slightly wrong. And, as I\u2019m sure any of you who teach linear algebra will immediately recognize, lots of students do this',
                },
            ],
            source: 'arxiv',
            textLong:
                'represents such a transformation. For mathematically sophisticated people, this little bit of playing fast and loose is not really problematic, and in fact it enables fluency that is a mark of mathematical sophistication. (If I need to calculate the composition of two transformations, I can\u00a0quickly and fluently pass into thinking about multiplying the two matrices, and then quickly and fluently pass back into thinking about the resulting matrix as representing the resulting transformation.)\u00a0However, for our students, it can cause trouble, as I\u2019ll detail below.\n\nLet\u2019s think about composing a transformation with its inverse: $\\mathbf{T}(\\mathbf{T^{-1}}(\\mathbf{x})) = \\mathbf{A}\\cdot(\\mathbf{A}^{-1}\\cdot\\mathbf{x}) = \\mathbf{I}\\cdot\\mathbf{x} = \\mathbf{x}.$ (Note that this calculation sort of implicitly invoked the isomorphism discussed above.) Not so bad, right?\n\nBut now let\u2019s really buy into this metonymy and try that again:\n\n$\\mathbf{T}(\\mathbf{T^{-1}}(\\mathbf{x})) \\leadsto \\mathbf{A} \\cdot \\mathbf{A}^{-1} = \\mathbf{I}.$\n\nHm. That\u2019s slightly wrong. And, as I\u2019m sure any of you who teach linear algebra will immediately recognize, lots of students do this. It\u2019s not a big deal as long as you remember to \u201cun-metonymize\u201d and stick that $\\mathbf{x}$ back on the end, and mathematically sophisticated people do this fluently. However, if you\u2019re not super aware that this is a metonymy, and you just think that the matrix\u00a0is the transformation, then this could lead to problems.\n\nIn particular, it could lead you to say something like, \u201cif I compose a linear transformation with its inverse, I ought to get the identity matrix,\u201d which is indeed something that a lot of people in our interviews said. And again, this is wrong, but maybe only\u00a0slightly wrong. If you compose a linear transformation with its inverse, you get a transformation that is\u00a0represented by the identity matrix, i.e., the identity transformation $\\mathbf{T}(\\mathbf{x}) = \\mathbf{x}$.\n\nSo I think this is another example of a productive borrowing from',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\frac{\\partial^2 f}{\\partial \\mathbf{',
                ' \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
                ' \\) and \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
                '-order derivative \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
                '     \\frac{\\partial^2 f}{\\partial \\mathbf{',
                '- \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
            ],
            correspondingSpans: [6, 9, 17, 18, 20, 35],
            index: '2951250929',
            relevanceScore: 240.72897473901378,
            snippets: [
                {
                    correspondingSpanText: '\\frac{\\partial^2 f}{\\partial \\mathbf{',
                    text: '{\\partial^2 f}{\\partial \\mathbf{x} \\partial \\mathbf{y}}\\right)^\\top\\mathbf{p}_t,\\mathbf{p}_{t-1}=\\left( \\frac{\\partial^2 f}{\\partial \\mathbf{y}^2}\\right)^\\top  \\mathbf{p}_{t}$}&\\multirow{2}{*}{$O(cT)$}&\\multirow{2}{*}{$O',
                },
                {
                    correspondingSpanText: '\\frac{\\partial^2 f}{\\partial \\mathbf{',
                    text: '}{$ \\mathbf{Z}_{T}^\\top \\frac{\\partial F(\\mathbf{x},\\mathbf{y}_T)}{\\partial \\mathbf{y}}$ with $\\mathbf{Z}_{t}= \\frac{\\partial^2 f}{\\partial \\mathbf{y}^2}\\mathbf{Z}_{t-1} +  \\frac{\\partial^2 f}{\\partial \\mathbf{y}\\partial \\mathbf{x} }$}&\\multirow{2',
                },
                {
                    correspondingSpanText: '\\frac{\\partial^2 f}{\\partial \\mathbf{',
                    text: '{dynamic}, is gradient descent. \n\tIn practice, it has been shown in~\\cite{rajeswaran2019meta} that the time and space cost for computing $ \\frac{\\partial^2 f}{\\partial \\mathbf{y}^2} \\mathbf{q}$ and $\\frac{\\partial^2 f}{\\partial \\mathbf{x} \\partial \\mathbf{y}}\\mathbf{q}$ via AD is no more',
                },
            ],
            source: 'arxiv',
            textLong:
                'Space\\\\\n\t\t\t\t\\midrule\n\t\t\t\t\\multirow{2}{*}{FHG}&\\multirow{2}{*}{$ \\mathbf{Z}_{T}^\\top \\frac{\\partial F(\\mathbf{x},\\mathbf{y}_T)}{\\partial \\mathbf{y}}$ with $\\mathbf{Z}_{t}= \\frac{\\partial^2 f}{\\partial \\mathbf{y}^2}\\mathbf{Z}_{t-1} +  \\frac{\\partial^2 f}{\\partial \\mathbf{y}\\partial \\mathbf{x} }$}&\\multirow{2}{*}{$O(cmT)$}&\\multirow{2}{*}{$O(mn)$}\\\\\n\t\t\t\t&&&\\\\\n\t\t\t\t\\multirow{2}{*}{RHG}&\\multirow{2}{*}{$\\mathbf{q}_{-1}${ with }$ \\mathbf{q}_{t-1}=\\mathbf{q}_{t}+ \\left( \\frac{\\partial^2 f}{\\partial \\mathbf{x} \\partial \\mathbf{y}}\\right)^\\top\\mathbf{p}_t,\\mathbf{p}_{t-1}=\\left( \\frac{\\partial^2 f}{\\partial \\mathbf{y}^2}\\right)^\\top  \\mathbf{p}_{t}$}&\\multirow{2}{*}{$O(cT)$}&\\multirow{2}{*}{$O(m+nT)$}\\\\\n\t\t\t\t&&&\\\\\n\t\t\t\t\\multirow{2}{*}{CG}&\\multirow{2}{*}{$-\\left( \\frac{\\partial^2  f(\\mathbf{x},\\mathbf{y}_T)}{ \\partial \\mathbf{y} \\partial \\mathbf{x}}\\right)^\\top\\mathbf{q} $ with $ \\frac{\\partial^2 f}{\\partial \\mathbf{y}^2} \\mathbf{q}=\\frac{\\partial F}{\\partial \\mathbf{y}} $}&\\multirow{2}{*}{$O(c(T+J))$}&\\multirow{2}{*}{$O(m+n)$}\\\\\n\t\t\t\t&&&\\\\\n\t\t\t\t\\multirow{2}{*}{Neumann}&\\multirow{2}{*}{$-\\left( \\frac{\\partial^2  f(\\mathbf{x},\\mathbf{y}_T)}{ \\partial \\mathbf{y',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\) and \\( \\frac{\\partial^2 f}{\\partial'],
            correspondingSpans: [9],
            index: '3162924020',
            relevanceScore: 240.36971160339957,
            snippets: [
                {
                    correspondingSpanText: '\\) and \\( \\frac{\\partial^2 f}{\\partial',
                    text: '^2} \\right)_0 - \\left( \\frac{\\partial^2 f}{\\partial x \\partial y} \\right)_0^2 \\]\n\nIf \\( D > 0 \\) and \\( \\frac{\\partial^2 f}{\\partial x^2} > 0 \\), then the critical point is a local minimum. If \\( D > 0 \\) and \\( \\frac{\\partial^2 f}{\\partial x^2}',
                },
            ],
            source: 'olmo-2-1124-13b-preference-mix',
            textLong:
                '2 f}{\\partial x^2} = \\frac{\\partial}{\\partial x} (ye^{xy} + \\cos(x)) = y^2e^{xy} - \\sin(x) \\]\n\\[ \\frac{\\partial^2 f}{\\partial y^2} = \\frac{\\partial}{\\partial y} (xe^{xy} - \\frac{1}{y}) = x^2e^{xy} + \\frac{1}{y^2} \\]\n\\[ \\frac{\\partial^2 f}{\\partial x \\partial y} = \\frac{\\partial}{\\partial y} (ye^{xy} + \\cos(x)) = xe^{xy} + yxe^{xy} \\]\n\nEvaluate these at the critical points \\((x_0, y_0)\\):\n\n\\[ D = \\left( \\frac{\\partial^2 f}{\\partial x^2} \\right)_0 \\left( \\frac{\\partial^2 f}{\\partial y^2} \\right)_0 - \\left( \\frac{\\partial^2 f}{\\partial x \\partial y} \\right)_0^2 \\]\n\nIf \\( D > 0 \\) and \\( \\frac{\\partial^2 f}{\\partial x^2} > 0 \\), then the critical point is a local minimum. If \\( D > 0 \\) and \\( \\frac{\\partial^2 f}{\\partial x^2} < 0 \\), then the critical point is a local maximum. If \\( D < 0 \\), then the critical point is a saddle point.\n\n### 2. Eigenvalues and Eigenvectors of the Transformation Matrix \\(\\mathbf{T}\\)\n\nThe matrix \\(\\mathbf{T}\\) is given by:\n\n\\[ \\mathbf{T} = \\begin{pmatrix} 3 & -1 \\\\ 2 & 4 \\end{pmatrix} \\]\n\nTo find the eigenvalues, we solve the characteristic equation:\n\n\\[ \\det(\\mathbf{T} - \\lambda \\mathbf{I}) = 0 \\]\n\\[ \\det \\begin{pmatrix} 3 - \\lambda & -1 \\\\ 2 & 4 - \\lambda \\end{pmatrix} = (3 - \\lambda)(4 - \\lambda) - (-1)(2) = 0 \\]\n\\[ (3 - \\lambda)(4 - \\lambda) + 2 =',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\( \\mathbf{A} \\), \\( \\mathbf{'],
            correspondingSpans: [1],
            index: '3159799783',
            relevanceScore: 236.78552756235723,
            snippets: [
                {
                    correspondingSpanText: '\\( \\mathbf{A} \\), \\( \\mathbf{',
                    text: '2} = \\sqrt{49 + 576} = \\sqrt{625} = 25\n\\]\n\nFinally, sum the distances traveled along \\( \\mathbf{A} \\), \\( \\mathbf{B} \\), and \\( \\mathbf{C} \\):\n\n\\[\n\\text{Total Distance} = | \\mathbf{A} | + | \\mathbf{B}',
                },
            ],
            source: 'dolmino',
            textLong:
                '= \\frac{\\mathbf{A} \\cdot \\mathbf{B}}{| \\mathbf{A} | | \\mathbf{B} |} = \\frac{7}{5 \\sqrt{29}}\n\\]\n\n\\[\n\\theta = \\cos^{-1} \\left( \\frac{7}{5 \\sqrt{29}} \\right)\n\\]\n\n### Step 3: Total Distance Traveled\n\nTo find the total distance, we first need to calculate the magnitude of \\( \\mathbf{R} \\):\n\n\\[\n| \\mathbf{R} | = \\sqrt{8^2 + 2^2} = \\sqrt{64 + 4} = \\sqrt{68} = 2\\sqrt{17}\n\\]\n\nNext, calculate the magnitude of \\( \\mathbf{C} \\):\n\n\\[\n| \\mathbf{C} | = \\sqrt{(-7)^2 + 24^2} = \\sqrt{49 + 576} = \\sqrt{625} = 25\n\\]\n\nFinally, sum the distances traveled along \\( \\mathbf{A} \\), \\( \\mathbf{B} \\), and \\( \\mathbf{C} \\):\n\n\\[\n\\text{Total Distance} = | \\mathbf{A} | + | \\mathbf{B} | + | \\mathbf{C} | = 5 + \\sqrt{29} + 25\n\\]\n\n### Final Answer\n\n\\[\n\\text{The final answer is } 5 + \\sqrt{29} + 25 \\approx 36 + \\sqrt{29}. \\text{ I hope it is correct.}\n\\]',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\( \\mathbf{A} \\), \\( \\mathbf{'],
            correspondingSpans: [1],
            index: '3163247685',
            relevanceScore: 236.78552756235723,
            snippets: [
                {
                    correspondingSpanText: '\\( \\mathbf{A} \\), \\( \\mathbf{',
                    text: '2} = \\sqrt{49 + 576} = \\sqrt{625} = 25\n\\]\n\nFinally, sum the distances traveled along \\( \\mathbf{A} \\), \\( \\mathbf{B} \\), and \\( \\mathbf{C} \\):\n\n\\[\n\\text{Total Distance} = | \\mathbf{A} | + | \\mathbf{B}',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                '= \\frac{\\mathbf{A} \\cdot \\mathbf{B}}{| \\mathbf{A} | | \\mathbf{B} |} = \\frac{7}{5 \\sqrt{29}}\n\\]\n\n\\[\n\\theta = \\cos^{-1} \\left( \\frac{7}{5 \\sqrt{29}} \\right)\n\\]\n\n### Step 3: Total Distance Traveled\n\nTo find the total distance, we first need to calculate the magnitude of \\( \\mathbf{R} \\):\n\n\\[\n| \\mathbf{R} | = \\sqrt{8^2 + 2^2} = \\sqrt{64 + 4} = \\sqrt{68} = 2\\sqrt{17}\n\\]\n\nNext, calculate the magnitude of \\( \\mathbf{C} \\):\n\n\\[\n| \\mathbf{C} | = \\sqrt{(-7)^2 + 24^2} = \\sqrt{49 + 576} = \\sqrt{625} = 25\n\\]\n\nFinally, sum the distances traveled along \\( \\mathbf{A} \\), \\( \\mathbf{B} \\), and \\( \\mathbf{C} \\):\n\n\\[\n\\text{Total Distance} = | \\mathbf{A} | + | \\mathbf{B} | + | \\mathbf{C} | = 5 + \\sqrt{29} + 25\n\\]\n\n### Final Answer\n\n\\[\n\\text{The final answer is } 5 + \\sqrt{29} + 25 \\approx 36 + \\sqrt{29}. \\text{ I hope it is correct.}\n\\]',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['**Determinant**: The determinant of a square matrix'],
            correspondingSpans: [4],
            index: '3140582719',
            relevanceScore: 236.61711039945178,
            snippets: [
                {
                    correspondingSpanText: '**Determinant**: The determinant of a square matrix',
                    text: "ichever is smaller. Since multiplication by an invertible matrix doesn't change the dimensions of the spaces spanned by columns or rows, similar matrices always share the same rank.\n\n2. **Determinant**: The determinant of a square matrix measures its scaling factor when applied to vectors or areas/volumes; hence, det(B)=det(P^(-1)AP)=det(P)^(-1)det(A)",
                },
            ],
            source: 'dolmino',
            textLong:
                "professional and engaging tone that captivates interest.\n- Application: Incorporate specific, practical examples, such as proofs in calculus or critical dates and figures in history.\nDo not include a title or an introduction, simply write the content without headlines and introductory phrases. Do not use images. Similar matrices are a fundamental concept in linear algebra, which deals with the study of vector spaces and linear mappings between them. Two matrices, A and B, are considered similar if there exists an invertible matrix P such that B = P^(-1)AP. This relationship has significant implications because similar matrices share several important properties, including rank, determinant, trace, eigenvalues, characteristic polynomials, minimal polynomials, and elementary divisors.\n\nBefore diving into the methods used to determine whether two matrices are similar, let's first explore these shared properties more closely:\n\n1. **Rank**: The rank of a matrix is the dimension of its column space or row space, whichever is smaller. Since multiplication by an invertible matrix doesn't change the dimensions of the spaces spanned by columns or rows, similar matrices always share the same rank.\n\n2. **Determinant**: The determinant of a square matrix measures its scaling factor when applied to vectors or areas/volumes; hence, det(B)=det(P^(-1)AP)=det(P)^(-1)det(A)det(P), meaning det(A)=det(B).\n\n3. **Trace**: The trace of a matrix is defined as the sum of its diagonal elements. Given the cyclical property of traces under matrix multiplication, Tr(B)=Tr(P^(-1)AP)=Tr(APP^(-1))=Tr(A). Thus, similar matrices have identical traces.\n\n4. **Eigenvalues**: Although corresponding eigenvectors differ, eigenvalues remain unchanged since det(A\u2212\u03bbI)=det(P^(-1)(B\u2212\u03bbI)P) implies that det(B\u2212\u03bbI)=det(A\u2212\u03bbI); therefore, both possess equal sets of eigenvalues.\n\n5. **Characteristic Polynomial**: As seen from their equality above, the roots of the characteristic polynomial p_A(t):=det(A\u2212tI) and p_B(t):=det(B\u2212tI) coincide due to sharing common eigenvalues",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['{A}) = \\det(\\mathbf{A})'],
            correspondingSpans: [24],
            index: '2953232468',
            relevanceScore: 234.83330623272485,
            snippets: [
                {
                    correspondingSpanText: '{A}) = \\det(\\mathbf{A})',
                    text: '\\in[n]$. A basic fact about $\\adj(\\mathbf{A})$ is that if $\\det(\\mathbf{A})$ is a unit of $\\mathcal{R}$, then $\\adj(\\mathbf{A}) = \\det(\\mathbf{A}) \\cdot \\mathbf{A}^{-1}$.\n\nThere is a close relationship between the distances in the graph $G$ and the entries in the adjoint of $\\mathsf{SA}(G)$.',
                },
            ],
            source: 'arxiv',
            textLong:
                '$\\mathsf{SA}_{\\mathbf{Z}}(G)$ is a polynomial matrix where every entry is a polynomial over $x$ with degree at most $M$.\n\nWe recall the definition of \\emph{adjoint} matrix that will be crucial to our algorithm. Let $\\mathbf{A}$ be an $n\\times n$ matrix over a commutative ring $\\mathcal{R}$, and $i, j\\in [n]$. We denote by $\\mathbf{A}^{i, j}$ the matrix $\\mathbf{A}$ with every element in the $i$-th row and the $j$-th column set to zero, except that $(\\mathbf{A}^{i, j})_{i, j} = 1$. The adjoint matrix of $\\mathbf{A}$, denoted as $\\adj(\\mathbf{A})$, is an $n\\times n$ matrix such that $\\adj(\\mathbf{A})_{i, j} = \\det(\\mathbf{A}^{j, i})$ for every $i, j\\in[n]$. A basic fact about $\\adj(\\mathbf{A})$ is that if $\\det(\\mathbf{A})$ is a unit of $\\mathcal{R}$, then $\\adj(\\mathbf{A}) = \\det(\\mathbf{A}) \\cdot \\mathbf{A}^{-1}$.\n\nThere is a close relationship between the distances in the graph $G$ and the entries in the adjoint of $\\mathsf{SA}(G)$. Let $p$ be a multivariate polynomial, we define $\\deg^*_x(p)$ as the lowest degree of the variable $x$ in any monomial of $p$. If $p=0$, then we define $\\deg^*_x(p):=+\\infty$. We have:\n\n\\begin{theorem}[{\\cite[Lemma 4]{Sankowski05}}]\\label{thm:Sankowski-adjoint}\n\tLet $G$ be a directed graph with positive integer weights, $i,j$ be two vertices. Then the distance from $i$ to $j$ in $G$ is $\\deg^*_x(\\adj(\\mathsf{SA}(G))_{i, j})$.\n\\end{theorem}\n\n\nWe need the following theorem that allows us to maintain the adjoint of a matrix under \\emph{rank-$1$} queries. (This theorem is a special case of \\cite[Lemma 1.6]{',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                "this problem, let's first recall some fundamental definitions and properties of",
            ],
            correspondingSpans: [0],
            index: '3141551621',
            relevanceScore: 234.5823806487247,
            snippets: [
                {
                    correspondingSpanText:
                        "this problem, let's first recall some fundamental definitions and properties of",
                    text: "calculus or critical dates and figures in history.\nDo not include a title or an introduction, simply write the content without headlines and introductory phrases. Do not use images. To solve this problem, let's first recall some fundamental definitions and properties of vectors and vector-valued functions. Then, we will apply these concepts to derive the equation of the tangent plane to a parametric surface at a specified point. This approach should help clarify any",
                },
            ],
            source: 'dolmino',
            textLong:
                "^3: (u, v) \\mapsto (u+v, 3u^2, u-v)$$\n$$\\begin{bmatrix} x - x_0 \\\\ x - y_0 \\\\ z - z_0 \\end{bmatrix} \\cdot \\mathbf w = 0$$ where $$\\mathbf w = \\frac{\\partial f}{\\partial u} (u_0, v_0) \\times \\frac{\\partial f}{\\partial v} (u_0, v_0).$$\"\n\nDo not just list concepts, but develop each one in detail before moving to the next, as we prioritize depth of understanding and comprehensive exploration of the subject matter over breadth. Focus on:\n\n- Rigor: Ensure in-depth coverage of the concepts/sections.\n- Engagement: Write with an academic, professional and engaging tone that captivates interest.\n- Application: Incorporate specific, practical examples, such as proofs in calculus or critical dates and figures in history.\nDo not include a title or an introduction, simply write the content without headlines and introductory phrases. Do not use images. To solve this problem, let's first recall some fundamental definitions and properties of vectors and vector-valued functions. Then, we will apply these concepts to derive the equation of the tangent plane to a parametric surface at a specified point. This approach should help clarify any confusion regarding determining partial derivatives ($f_x$ and $f_y$) when dealing with coordinate systems other than Cartesian ones.\n\nLet $\\mathbf r(t) = x(t)\\hat{\\imath}+y(t)\\hat\\jmath + z(t)\\hat{k}$ be a differentiable vector-valued function representing a space curve. The velocity vector $\\mathbf v(t)$ is defined as its derivative, i.e., $\\mathbf v(t)=\\mathbf r'(t)=dx/dt\\,\\hat{\\imath}+dy/dt\\,\\hat\\jmath + dz/dt\\,\\hat{k}$. A unit tangent vector $\\mathbf T$ can then be obtained by normalizing the velocity vector: $\\mathbf T=\\mathbf v/\\|\\mathbf v\\|$.\n\nNow consider a scalar-valued function $f:\\mathbb{R}^3\\to\\mathbb{R}$, which assigns a real number to every point in three-dimensional space. Its gradient, denoted",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['derivative \\( \\frac{\\partial g}{\\partial'],
            correspondingSpans: [25],
            index: '2904620294',
            relevanceScore: 233.3150416456064,
            snippets: [
                {
                    correspondingSpanText: 'derivative \\( \\frac{\\partial g}{\\partial',
                    text: 's very little change in the optimum value of \\( x \\).\n\n(Mathematically, if \\( x_{opt}=g(\\zeta) \\), we\u2019re talking about the partial derivative \\( \\frac{\\partial g}{\\partial\\zeta} \\)\u2026 and strictly speaking, sensitivity is usually expressed in fractional terms, so we might be interested in\n\n$$S = \\frac{\\zeta}{g(\\zeta)}\\cdot',
                },
            ],
            source: 'dclm-hero-run-fasttext_for_HF',
            textLong:
                '- 0.5 \\cr b &= \\frac{1}{6}\\zeta(1 - \\zeta) \\end{align}$$\n\nWith precise knowledge, we can figure out exactly what value \\( x \\) is optimum.\n\nUnfortunately that\u2019s rarely the case. Maybe I don\u2019t know exactly what \\( \\zeta \\) is, all I know is that it\u2019s likely to be between 0.45 and 0.65. Or maybe my equations for \\( a \\) and \\( b \\) are estimates, and they might be wrong. In this case, I need to deal with uncertainty in the problem parameters, and one way to look at this is the sensitivity of my optimization to these parameters.\n\nIn this particular case, the optimum value of \\( x \\) is very sensitive to \\( \\zeta \\) when \\( \\zeta \\) is near 0.5. Whereas if \\( \\zeta \\) is less than 0.4 or greater than 0.6, there\u2019s very little change in the optimum value of \\( x \\).\n\n(Mathematically, if \\( x_{opt}=g(\\zeta) \\), we\u2019re talking about the partial derivative \\( \\frac{\\partial g}{\\partial\\zeta} \\)\u2026 and strictly speaking, sensitivity is usually expressed in fractional terms, so we might be interested in\n\n$$S = \\frac{\\zeta}{g(\\zeta)}\\cdot \\frac{\\partial g}{\\partial \\zeta} \\approx \\frac{\\frac{\\Delta g(\\zeta)}{g(\\zeta)}}{\\frac{\\Delta \\zeta}{\\zeta}}$$\n\nwhich is the fractional change in \\( x \\) with respect to the fractional change in \\( \\zeta \\).)\n\nOne of the important points for strategic optimizations is to know which factors your system is or is not sensitive to. For example, if I\u2019m processing audio, as long as my system is fast enough to keep up with incoming data, I don\u2019t really care about the CPU rate. For CD-quality sound this is 44100 samples per second. Maybe I can\u2019t do this with a Commodore 64 or pre-Pentium PCs, but simple audio processing has been within the realm of modern PCs and smartphones, and which processor I use doesn\u2019t matter as long as it\u2019s fast enough. Latency, on the other hand',

            url: 'https://www.embeddedrelated.com/showarticle/1044.php',
            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['derivative \\( \\frac{\\partial g}{\\partial'],
            correspondingSpans: [25],
            index: '273131267',
            relevanceScore: 233.3150416456064,
            snippets: [
                {
                    correspondingSpanText: 'derivative \\( \\frac{\\partial g}{\\partial',
                    text: 's very little change in the optimum value of \\( x \\).\n\n(Mathematically, if \\( x_{opt}=g(\\zeta) \\), we\u2019re talking about the partial derivative \\( \\frac{\\partial g}{\\partial\\zeta} \\)\u2026 and strictly speaking, sensitivity is usually expressed in fractional terms, so we might be interested in\n\n$$S = \\frac{\\zeta}{g(\\zeta)}\\cdot',
                },
            ],
            source: 'dclm-hero-run-fasttext_for_HF',
            textLong:
                '- 0.5 \\cr b &= \\frac{1}{6}\\zeta(1 - \\zeta) \\end{align}$$\n\nWith precise knowledge, we can figure out exactly what value \\( x \\) is optimum.\n\nUnfortunately that\u2019s rarely the case. Maybe I don\u2019t know exactly what \\( \\zeta \\) is, all I know is that it\u2019s likely to be between 0.45 and 0.65. Or maybe my equations for \\( a \\) and \\( b \\) are estimates, and they might be wrong. In this case, I need to deal with uncertainty in the problem parameters, and one way to look at this is the sensitivity of my optimization to these parameters.\n\nIn this particular case, the optimum value of \\( x \\) is very sensitive to \\( \\zeta \\) when \\( \\zeta \\) is near 0.5. Whereas if \\( \\zeta \\) is less than 0.4 or greater than 0.6, there\u2019s very little change in the optimum value of \\( x \\).\n\n(Mathematically, if \\( x_{opt}=g(\\zeta) \\), we\u2019re talking about the partial derivative \\( \\frac{\\partial g}{\\partial\\zeta} \\)\u2026 and strictly speaking, sensitivity is usually expressed in fractional terms, so we might be interested in\n\n$$S = \\frac{\\zeta}{g(\\zeta)}\\cdot \\frac{\\partial g}{\\partial \\zeta} \\approx \\frac{\\frac{\\Delta g(\\zeta)}{g(\\zeta)}}{\\frac{\\Delta \\zeta}{\\zeta}}$$\n\nwhich is the fractional change in \\( x \\) with respect to the fractional change in \\( \\zeta \\).)\n\nOne of the important points for strategic optimizations is to know which factors your system is or is not sensitive to. For example, if I\u2019m processing audio, as long as my system is fast enough to keep up with incoming data, I don\u2019t really care about the CPU rate. For CD-quality sound this is 44100 samples per second. Maybe I can\u2019t do this with a Commodore 64 or pre-Pentium PCs, but simple audio processing has been within the realm of modern PCs and smartphones, and which processor I use doesn\u2019t matter as long as it\u2019s fast enough. Latency, on the other hand',

            url: 'https://www.embeddedrelated.com/showarticle/1044.php',
            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['derivative \\( \\frac{\\partial g}{\\partial'],
            correspondingSpans: [25],
            index: '103323118',
            relevanceScore: 233.3150416456064,
            snippets: [
                {
                    correspondingSpanText: 'derivative \\( \\frac{\\partial g}{\\partial',
                    text: 's very little change in the optimum value of \\( x \\).\n\n(Mathematically, if \\( x_{opt}=g(\\zeta) \\), we\u2019re talking about the partial derivative \\( \\frac{\\partial g}{\\partial\\zeta} \\)\u2026 and strictly speaking, sensitivity is usually expressed in fractional terms, so we might be interested in\n\n$$S = \\frac{\\zeta}{g(\\zeta)}\\cdot',
                },
            ],
            source: 'dclm-hero-run-fasttext_for_HF',
            textLong:
                '- 0.5 \\cr b &= \\frac{1}{6}\\zeta(1 - \\zeta) \\end{align}$$\n\nWith precise knowledge, we can figure out exactly what value \\( x \\) is optimum.\n\nUnfortunately that\u2019s rarely the case. Maybe I don\u2019t know exactly what \\( \\zeta \\) is, all I know is that it\u2019s likely to be between 0.45 and 0.65. Or maybe my equations for \\( a \\) and \\( b \\) are estimates, and they might be wrong. In this case, I need to deal with uncertainty in the problem parameters, and one way to look at this is the sensitivity of my optimization to these parameters.\n\nIn this particular case, the optimum value of \\( x \\) is very sensitive to \\( \\zeta \\) when \\( \\zeta \\) is near 0.5. Whereas if \\( \\zeta \\) is less than 0.4 or greater than 0.6, there\u2019s very little change in the optimum value of \\( x \\).\n\n(Mathematically, if \\( x_{opt}=g(\\zeta) \\), we\u2019re talking about the partial derivative \\( \\frac{\\partial g}{\\partial\\zeta} \\)\u2026 and strictly speaking, sensitivity is usually expressed in fractional terms, so we might be interested in\n\n$$S = \\frac{\\zeta}{g(\\zeta)}\\cdot \\frac{\\partial g}{\\partial \\zeta} \\approx \\frac{\\frac{\\Delta g(\\zeta)}{g(\\zeta)}}{\\frac{\\Delta \\zeta}{\\zeta}}$$\n\nwhich is the fractional change in \\( x \\) with respect to the fractional change in \\( \\zeta \\).)\n\nOne of the important points for strategic optimizations is to know which factors your system is or is not sensitive to. For example, if I\u2019m processing audio, as long as my system is fast enough to keep up with incoming data, I don\u2019t really care about the CPU rate. For CD-quality sound this is 44100 samples per second. Maybe I can\u2019t do this with a Commodore 64 or pre-Pentium PCs, but simple audio processing has been within the realm of modern PCs and smartphones, and which processor I use doesn\u2019t matter as long as it\u2019s fast enough. Latency, on the other hand',

            url: 'https://www.embeddedrelated.com/showarticle/1044.php',
            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['derivative \\( \\frac{\\partial g}{\\partial'],
            correspondingSpans: [25],
            index: '843909836',
            relevanceScore: 233.3150416456064,
            snippets: [
                {
                    correspondingSpanText: 'derivative \\( \\frac{\\partial g}{\\partial',
                    text: 's very little change in the optimum value of \\( x \\).\n\n(Mathematically, if \\( x_{opt}=g(\\zeta) \\), we\u2019re talking about the partial derivative \\( \\frac{\\partial g}{\\partial\\zeta} \\)\u2026 and strictly speaking, sensitivity is usually expressed in fractional terms, so we might be interested in\n\n$$S = \\frac{\\zeta}{g(\\zeta)}\\cdot',
                },
            ],
            source: 'dclm-hero-run-fasttext_for_HF',
            textLong:
                '- 0.5 \\cr b &= \\frac{1}{6}\\zeta(1 - \\zeta) \\end{align}$$\n\nWith precise knowledge, we can figure out exactly what value \\( x \\) is optimum.\n\nUnfortunately that\u2019s rarely the case. Maybe I don\u2019t know exactly what \\( \\zeta \\) is, all I know is that it\u2019s likely to be between 0.45 and 0.65. Or maybe my equations for \\( a \\) and \\( b \\) are estimates, and they might be wrong. In this case, I need to deal with uncertainty in the problem parameters, and one way to look at this is the sensitivity of my optimization to these parameters.\n\nIn this particular case, the optimum value of \\( x \\) is very sensitive to \\( \\zeta \\) when \\( \\zeta \\) is near 0.5. Whereas if \\( \\zeta \\) is less than 0.4 or greater than 0.6, there\u2019s very little change in the optimum value of \\( x \\).\n\n(Mathematically, if \\( x_{opt}=g(\\zeta) \\), we\u2019re talking about the partial derivative \\( \\frac{\\partial g}{\\partial\\zeta} \\)\u2026 and strictly speaking, sensitivity is usually expressed in fractional terms, so we might be interested in\n\n$$S = \\frac{\\zeta}{g(\\zeta)}\\cdot \\frac{\\partial g}{\\partial \\zeta} \\approx \\frac{\\frac{\\Delta g(\\zeta)}{g(\\zeta)}}{\\frac{\\Delta \\zeta}{\\zeta}}$$\n\nwhich is the fractional change in \\( x \\) with respect to the fractional change in \\( \\zeta \\).)\n\nOne of the important points for strategic optimizations is to know which factors your system is or is not sensitive to. For example, if I\u2019m processing audio, as long as my system is fast enough to keep up with incoming data, I don\u2019t really care about the CPU rate. For CD-quality sound this is 44100 samples per second. Maybe I can\u2019t do this with a Commodore 64 or pre-Pentium PCs, but simple audio processing has been within the realm of modern PCs and smartphones, and which processor I use doesn\u2019t matter as long as it\u2019s fast enough. Latency, on the other hand',

            url: 'https://www.embeddedrelated.com/showarticle/1044.php',
            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['derivative \\( \\frac{\\partial g}{\\partial'],
            correspondingSpans: [25],
            index: '826431178',
            relevanceScore: 233.3150416456064,
            snippets: [
                {
                    correspondingSpanText: 'derivative \\( \\frac{\\partial g}{\\partial',
                    text: 's very little change in the optimum value of \\( x \\).\n\n(Mathematically, if \\( x_{opt}=g(\\zeta) \\), we\u2019re talking about the partial derivative \\( \\frac{\\partial g}{\\partial\\zeta} \\)\u2026 and strictly speaking, sensitivity is usually expressed in fractional terms, so we might be interested in\n\n$$S = \\frac{\\zeta}{g(\\zeta)}\\cdot',
                },
            ],
            source: 'dclm-hero-run-fasttext_for_HF',
            textLong:
                '- 0.5 \\cr b &= \\frac{1}{6}\\zeta(1 - \\zeta) \\end{align}$$\n\nWith precise knowledge, we can figure out exactly what value \\( x \\) is optimum.\n\nUnfortunately that\u2019s rarely the case. Maybe I don\u2019t know exactly what \\( \\zeta \\) is, all I know is that it\u2019s likely to be between 0.45 and 0.65. Or maybe my equations for \\( a \\) and \\( b \\) are estimates, and they might be wrong. In this case, I need to deal with uncertainty in the problem parameters, and one way to look at this is the sensitivity of my optimization to these parameters.\n\nIn this particular case, the optimum value of \\( x \\) is very sensitive to \\( \\zeta \\) when \\( \\zeta \\) is near 0.5. Whereas if \\( \\zeta \\) is less than 0.4 or greater than 0.6, there\u2019s very little change in the optimum value of \\( x \\).\n\n(Mathematically, if \\( x_{opt}=g(\\zeta) \\), we\u2019re talking about the partial derivative \\( \\frac{\\partial g}{\\partial\\zeta} \\)\u2026 and strictly speaking, sensitivity is usually expressed in fractional terms, so we might be interested in\n\n$$S = \\frac{\\zeta}{g(\\zeta)}\\cdot \\frac{\\partial g}{\\partial \\zeta} \\approx \\frac{\\frac{\\Delta g(\\zeta)}{g(\\zeta)}}{\\frac{\\Delta \\zeta}{\\zeta}}$$\n\nwhich is the fractional change in \\( x \\) with respect to the fractional change in \\( \\zeta \\).)\n\nOne of the important points for strategic optimizations is to know which factors your system is or is not sensitive to. For example, if I\u2019m processing audio, as long as my system is fast enough to keep up with incoming data, I don\u2019t really care about the CPU rate. For CD-quality sound this is 44100 samples per second. Maybe I can\u2019t do this with a Commodore 64 or pre-Pentium PCs, but simple audio processing has been within the realm of modern PCs and smartphones, and which processor I use doesn\u2019t matter as long as it\u2019s fast enough. Latency, on the other hand',

            url: 'https://www.embeddedrelated.com/showarticle/1044.php',
            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['derivative \\( \\frac{\\partial g}{\\partial'],
            correspondingSpans: [25],
            index: '1906417435',
            relevanceScore: 233.3150416456064,
            snippets: [
                {
                    correspondingSpanText: 'derivative \\( \\frac{\\partial g}{\\partial',
                    text: 's very little change in the optimum value of \\( x \\).\n\n(Mathematically, if \\( x_{opt}=g(\\zeta) \\), we\u2019re talking about the partial derivative \\( \\frac{\\partial g}{\\partial\\zeta} \\)\u2026 and strictly speaking, sensitivity is usually expressed in fractional terms, so we might be interested in\n\n$$S = \\frac{\\zeta}{g(\\zeta)}\\cdot',
                },
            ],
            source: 'dclm-hero-run-fasttext_for_HF',
            textLong:
                '- 0.5 \\cr b &= \\frac{1}{6}\\zeta(1 - \\zeta) \\end{align}$$\n\nWith precise knowledge, we can figure out exactly what value \\( x \\) is optimum.\n\nUnfortunately that\u2019s rarely the case. Maybe I don\u2019t know exactly what \\( \\zeta \\) is, all I know is that it\u2019s likely to be between 0.45 and 0.65. Or maybe my equations for \\( a \\) and \\( b \\) are estimates, and they might be wrong. In this case, I need to deal with uncertainty in the problem parameters, and one way to look at this is the sensitivity of my optimization to these parameters.\n\nIn this particular case, the optimum value of \\( x \\) is very sensitive to \\( \\zeta \\) when \\( \\zeta \\) is near 0.5. Whereas if \\( \\zeta \\) is less than 0.4 or greater than 0.6, there\u2019s very little change in the optimum value of \\( x \\).\n\n(Mathematically, if \\( x_{opt}=g(\\zeta) \\), we\u2019re talking about the partial derivative \\( \\frac{\\partial g}{\\partial\\zeta} \\)\u2026 and strictly speaking, sensitivity is usually expressed in fractional terms, so we might be interested in\n\n$$S = \\frac{\\zeta}{g(\\zeta)}\\cdot \\frac{\\partial g}{\\partial \\zeta} \\approx \\frac{\\frac{\\Delta g(\\zeta)}{g(\\zeta)}}{\\frac{\\Delta \\zeta}{\\zeta}}$$\n\nwhich is the fractional change in \\( x \\) with respect to the fractional change in \\( \\zeta \\).)\n\nOne of the important points for strategic optimizations is to know which factors your system is or is not sensitive to. For example, if I\u2019m processing audio, as long as my system is fast enough to keep up with incoming data, I don\u2019t really care about the CPU rate. For CD-quality sound this is 44100 samples per second. Maybe I can\u2019t do this with a Commodore 64 or pre-Pentium PCs, but simple audio processing has been within the realm of modern PCs and smartphones, and which processor I use doesn\u2019t matter as long as it\u2019s fast enough. Latency, on the other hand',

            url: 'https://www.embeddedrelated.com/showarticle/1044.php',
            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['derivative \\( \\frac{\\partial g}{\\partial'],
            correspondingSpans: [25],
            index: '283872991',
            relevanceScore: 233.3150416456064,
            snippets: [
                {
                    correspondingSpanText: 'derivative \\( \\frac{\\partial g}{\\partial',
                    text: 's very little change in the optimum value of \\( x \\).\n\n(Mathematically, if \\( x_{opt}=g(\\zeta) \\), we\u2019re talking about the partial derivative \\( \\frac{\\partial g}{\\partial\\zeta} \\)\u2026 and strictly speaking, sensitivity is usually expressed in fractional terms, so we might be interested in\n\n$$S = \\frac{\\zeta}{g(\\zeta)}\\cdot',
                },
            ],
            source: 'dclm-hero-run-fasttext_for_HF',
            textLong:
                '- 0.5 \\cr b &= \\frac{1}{6}\\zeta(1 - \\zeta) \\end{align}$$\n\nWith precise knowledge, we can figure out exactly what value \\( x \\) is optimum.\n\nUnfortunately that\u2019s rarely the case. Maybe I don\u2019t know exactly what \\( \\zeta \\) is, all I know is that it\u2019s likely to be between 0.45 and 0.65. Or maybe my equations for \\( a \\) and \\( b \\) are estimates, and they might be wrong. In this case, I need to deal with uncertainty in the problem parameters, and one way to look at this is the sensitivity of my optimization to these parameters.\n\nIn this particular case, the optimum value of \\( x \\) is very sensitive to \\( \\zeta \\) when \\( \\zeta \\) is near 0.5. Whereas if \\( \\zeta \\) is less than 0.4 or greater than 0.6, there\u2019s very little change in the optimum value of \\( x \\).\n\n(Mathematically, if \\( x_{opt}=g(\\zeta) \\), we\u2019re talking about the partial derivative \\( \\frac{\\partial g}{\\partial\\zeta} \\)\u2026 and strictly speaking, sensitivity is usually expressed in fractional terms, so we might be interested in\n\n$$S = \\frac{\\zeta}{g(\\zeta)}\\cdot \\frac{\\partial g}{\\partial \\zeta} \\approx \\frac{\\frac{\\Delta g(\\zeta)}{g(\\zeta)}}{\\frac{\\Delta \\zeta}{\\zeta}}$$\n\nwhich is the fractional change in \\( x \\) with respect to the fractional change in \\( \\zeta \\).)\n\nOne of the important points for strategic optimizations is to know which factors your system is or is not sensitive to. For example, if I\u2019m processing audio, as long as my system is fast enough to keep up with incoming data, I don\u2019t really care about the CPU rate. For CD-quality sound this is 44100 samples per second. Maybe I can\u2019t do this with a Commodore 64 or pre-Pentium PCs, but simple audio processing has been within the realm of modern PCs and smartphones, and which processor I use doesn\u2019t matter as long as it\u2019s fast enough. Latency, on the other hand',

            url: 'https://www.embeddedrelated.com/showarticle/1044.php',
            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['derivative \\( \\frac{\\partial g}{\\partial'],
            correspondingSpans: [25],
            index: '1760174807',
            relevanceScore: 233.3150416456064,
            snippets: [
                {
                    correspondingSpanText: 'derivative \\( \\frac{\\partial g}{\\partial',
                    text: 's very little change in the optimum value of \\( x \\).\n\n(Mathematically, if \\( x_{opt}=g(\\zeta) \\), we\u2019re talking about the partial derivative \\( \\frac{\\partial g}{\\partial\\zeta} \\)\u2026 and strictly speaking, sensitivity is usually expressed in fractional terms, so we might be interested in\n\n$$S = \\frac{\\zeta}{g(\\zeta)}\\cdot',
                },
            ],
            source: 'dclm-hero-run-fasttext_for_HF',
            textLong:
                '- 0.5 \\cr b &= \\frac{1}{6}\\zeta(1 - \\zeta) \\end{align}$$\n\nWith precise knowledge, we can figure out exactly what value \\( x \\) is optimum.\n\nUnfortunately that\u2019s rarely the case. Maybe I don\u2019t know exactly what \\( \\zeta \\) is, all I know is that it\u2019s likely to be between 0.45 and 0.65. Or maybe my equations for \\( a \\) and \\( b \\) are estimates, and they might be wrong. In this case, I need to deal with uncertainty in the problem parameters, and one way to look at this is the sensitivity of my optimization to these parameters.\n\nIn this particular case, the optimum value of \\( x \\) is very sensitive to \\( \\zeta \\) when \\( \\zeta \\) is near 0.5. Whereas if \\( \\zeta \\) is less than 0.4 or greater than 0.6, there\u2019s very little change in the optimum value of \\( x \\).\n\n(Mathematically, if \\( x_{opt}=g(\\zeta) \\), we\u2019re talking about the partial derivative \\( \\frac{\\partial g}{\\partial\\zeta} \\)\u2026 and strictly speaking, sensitivity is usually expressed in fractional terms, so we might be interested in\n\n$$S = \\frac{\\zeta}{g(\\zeta)}\\cdot \\frac{\\partial g}{\\partial \\zeta} \\approx \\frac{\\frac{\\Delta g(\\zeta)}{g(\\zeta)}}{\\frac{\\Delta \\zeta}{\\zeta}}$$\n\nwhich is the fractional change in \\( x \\) with respect to the fractional change in \\( \\zeta \\).)\n\nOne of the important points for strategic optimizations is to know which factors your system is or is not sensitive to. For example, if I\u2019m processing audio, as long as my system is fast enough to keep up with incoming data, I don\u2019t really care about the CPU rate. For CD-quality sound this is 44100 samples per second. Maybe I can\u2019t do this with a Commodore 64 or pre-Pentium PCs, but simple audio processing has been within the realm of modern PCs and smartphones, and which processor I use doesn\u2019t matter as long as it\u2019s fast enough. Latency, on the other hand',

            url: 'https://www.embeddedrelated.com/showarticle/1044.php',
            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['derivative \\( \\frac{\\partial g}{\\partial'],
            correspondingSpans: [25],
            index: '3492805',
            relevanceScore: 233.3150416456064,
            snippets: [
                {
                    correspondingSpanText: 'derivative \\( \\frac{\\partial g}{\\partial',
                    text: 's very little change in the optimum value of \\( x \\).\n\n(Mathematically, if \\( x_{opt}=g(\\zeta) \\), we\u2019re talking about the partial derivative \\( \\frac{\\partial g}{\\partial\\zeta} \\)\u2026 and strictly speaking, sensitivity is usually expressed in fractional terms, so we might be interested in\n\n$$S = \\frac{\\zeta}{g(\\zeta)}\\cdot',
                },
            ],
            source: 'dclm-hero-run-fasttext_for_HF',
            textLong:
                '- 0.5 \\cr b &= \\frac{1}{6}\\zeta(1 - \\zeta) \\end{align}$$\n\nWith precise knowledge, we can figure out exactly what value \\( x \\) is optimum.\n\nUnfortunately that\u2019s rarely the case. Maybe I don\u2019t know exactly what \\( \\zeta \\) is, all I know is that it\u2019s likely to be between 0.45 and 0.65. Or maybe my equations for \\( a \\) and \\( b \\) are estimates, and they might be wrong. In this case, I need to deal with uncertainty in the problem parameters, and one way to look at this is the sensitivity of my optimization to these parameters.\n\nIn this particular case, the optimum value of \\( x \\) is very sensitive to \\( \\zeta \\) when \\( \\zeta \\) is near 0.5. Whereas if \\( \\zeta \\) is less than 0.4 or greater than 0.6, there\u2019s very little change in the optimum value of \\( x \\).\n\n(Mathematically, if \\( x_{opt}=g(\\zeta) \\), we\u2019re talking about the partial derivative \\( \\frac{\\partial g}{\\partial\\zeta} \\)\u2026 and strictly speaking, sensitivity is usually expressed in fractional terms, so we might be interested in\n\n$$S = \\frac{\\zeta}{g(\\zeta)}\\cdot \\frac{\\partial g}{\\partial \\zeta} \\approx \\frac{\\frac{\\Delta g(\\zeta)}{g(\\zeta)}}{\\frac{\\Delta \\zeta}{\\zeta}}$$\n\nwhich is the fractional change in \\( x \\) with respect to the fractional change in \\( \\zeta \\).)\n\nOne of the important points for strategic optimizations is to know which factors your system is or is not sensitive to. For example, if I\u2019m processing audio, as long as my system is fast enough to keep up with incoming data, I don\u2019t really care about the CPU rate. For CD-quality sound this is 44100 samples per second. Maybe I can\u2019t do this with a Commodore 64 or pre-Pentium PCs, but simple audio processing has been within the realm of modern PCs and smartphones, and which processor I use doesn\u2019t matter as long as it\u2019s fast enough. Latency, on the other hand',

            url: 'https://www.embeddedrelated.com/showarticle/1044.php',
            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['derivative \\( \\frac{\\partial g}{\\partial'],
            correspondingSpans: [25],
            index: '902238976',
            relevanceScore: 233.3150416456064,
            snippets: [
                {
                    correspondingSpanText: 'derivative \\( \\frac{\\partial g}{\\partial',
                    text: 's very little change in the optimum value of \\( x \\).\n\n(Mathematically, if \\( x_{opt}=g(\\zeta) \\), we\u2019re talking about the partial derivative \\( \\frac{\\partial g}{\\partial\\zeta} \\)\u2026 and strictly speaking, sensitivity is usually expressed in fractional terms, so we might be interested in\n\n$$S = \\frac{\\zeta}{g(\\zeta)}\\cdot',
                },
            ],
            source: 'dclm-hero-run-fasttext_for_HF',
            textLong:
                '- 0.5 \\cr b &= \\frac{1}{6}\\zeta(1 - \\zeta) \\end{align}$$\n\nWith precise knowledge, we can figure out exactly what value \\( x \\) is optimum.\n\nUnfortunately that\u2019s rarely the case. Maybe I don\u2019t know exactly what \\( \\zeta \\) is, all I know is that it\u2019s likely to be between 0.45 and 0.65. Or maybe my equations for \\( a \\) and \\( b \\) are estimates, and they might be wrong. In this case, I need to deal with uncertainty in the problem parameters, and one way to look at this is the sensitivity of my optimization to these parameters.\n\nIn this particular case, the optimum value of \\( x \\) is very sensitive to \\( \\zeta \\) when \\( \\zeta \\) is near 0.5. Whereas if \\( \\zeta \\) is less than 0.4 or greater than 0.6, there\u2019s very little change in the optimum value of \\( x \\).\n\n(Mathematically, if \\( x_{opt}=g(\\zeta) \\), we\u2019re talking about the partial derivative \\( \\frac{\\partial g}{\\partial\\zeta} \\)\u2026 and strictly speaking, sensitivity is usually expressed in fractional terms, so we might be interested in\n\n$$S = \\frac{\\zeta}{g(\\zeta)}\\cdot \\frac{\\partial g}{\\partial \\zeta} \\approx \\frac{\\frac{\\Delta g(\\zeta)}{g(\\zeta)}}{\\frac{\\Delta \\zeta}{\\zeta}}$$\n\nwhich is the fractional change in \\( x \\) with respect to the fractional change in \\( \\zeta \\).)\n\nOne of the important points for strategic optimizations is to know which factors your system is or is not sensitive to. For example, if I\u2019m processing audio, as long as my system is fast enough to keep up with incoming data, I don\u2019t really care about the CPU rate. For CD-quality sound this is 44100 samples per second. Maybe I can\u2019t do this with a Commodore 64 or pre-Pentium PCs, but simple audio processing has been within the realm of modern PCs and smartphones, and which processor I use doesn\u2019t matter as long as it\u2019s fast enough. Latency, on the other hand',

            url: 'https://www.embeddedrelated.com/showarticle/1044.php',
            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\mathrm{tr}(\\mathbf{A}^{-',
                '{A}) = \\mathrm{tr}(\\mathbf{A}^{-',
                ' \\mathrm{tr}(\\mathbf{A}^{-',
                '1}) = \\mathrm{tr}(\\mathbf{A}^{-T} \\mathbf{A}^{-',
            ],
            correspondingSpans: [10, 12, 14],
            index: '2949239511',
            relevanceScore: 230.8521368952727,
            snippets: [
                {
                    correspondingSpanText: '\\mathrm{tr}(\\mathbf{A}^{-',
                    text: 'A}) + \\tfrac{1}{2}(\\mathrm{tr}(\\mathbf{A})^2-\\mathrm{tr}(\\mathbf{A}^2)) + \\mathrm{det}(\\mathbf{A}) \\mathrm{tr}(\\mathbf{A}^{-1}) + \\mathrm{tr}(\\mathbf{A}) + 1}$$\n\nCan we find a general expression for higher dimensions that builds on the ones above? Even obtaining the $5',
                },
                {
                    correspondingSpanText: '\\mathrm{tr}(\\mathbf{A}^{-',
                    text: 'big( \\mathrm{tr}(\\mathbf{A}) + 1 \\big) \\mathbf{I}}{\\mathrm{det}(\\mathbf{A}) + \\mathrm{det}(\\mathbf{A}) \\mathrm{tr}(\\mathbf{A}^{-1}) + \\mathrm{tr}(\\mathbf{A}) + 1}$$\n\n\u2022 $4 \\times 4$:\n\n$$(\\mathbf{I} + \\mathbf{A})',
                },
            ],
            source: 'algebraic-stack',
            textLong:
                "{A}^{-1} - \\mathbf{A} + \\big( \\mathrm{tr}(\\mathbf{A}) + 1 \\big) \\mathbf{I}}{\\mathrm{det}(\\mathbf{A}) + \\mathrm{det}(\\mathbf{A}) \\mathrm{tr}(\\mathbf{A}^{-1}) + \\mathrm{tr}(\\mathbf{A}) + 1}$$\n\n\u2022 $4 \\times 4$:\n\n$$(\\mathbf{I} + \\mathbf{A})^{-1} = \\frac{\\mathrm{det}(\\mathbf{A}) \\mathbf{A}^{-1} + \\mathbf{A}^2 - \\mathrm{tr}(\\mathbf{A}) \\mathbf{A} - \\mathbf{A} + \\big( \\tfrac{1}{2}(\\mathrm{tr}(\\mathbf{A})^2-\\mathrm{tr}(\\mathbf{A}^2)) + \\mathrm{tr}(\\mathbf{A}) + 1 \\big) \\mathbf{I}}{\\mathrm{det}(\\mathbf{A}) + \\tfrac{1}{2}(\\mathrm{tr}(\\mathbf{A})^2-\\mathrm{tr}(\\mathbf{A}^2)) + \\mathrm{det}(\\mathbf{A}) \\mathrm{tr}(\\mathbf{A}^{-1}) + \\mathrm{tr}(\\mathbf{A}) + 1}$$\n\nCan we find a general expression for higher dimensions that builds on the ones above? Even obtaining the $5 \\times 5$ case is prohibitive, and so far I haven't been able to spot the pattern.\n\n\u2022 I think the next case ($4\\times 4$) is the crucial one. If you replace $A$ by $tA$ to keep track of the terms the middle term, the $t^2$ one of the denominator, is the trace of the matrix of $2\\times 2$ cofactors, $\\mathrm{tr}(A^{(2)})$ and I can't see how to get this in the form you want. \u2013\u00a0ancientmathematician Mar 7 '18 at 16:40\n\u2022 By the way I think that if you can do the case of $A$ diagonal you can do the general case by a change of basis. \u2013\u00a0ancientmathematician Mar 7 '18 at 16:41\n\u2022 Well, if $\\mathbf{A}$ is diagonal, then the inverse",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\( \\mathbf{A} \\), \\( \\mathbf{'],
            correspondingSpans: [1],
            index: '3162868971',
            relevanceScore: 228.61940633932807,
            snippets: [
                {
                    correspondingSpanText: '\\( \\mathbf{A} \\), \\( \\mathbf{',
                    text: 'under which the tensor decomposition is unique, given the constraints on the ranks \\( r_1 \\), \\( r_2 \\), and \\( r_3 \\), and the properties of the factor matrices \\( \\mathbf{A} \\), \\( \\mathbf{B} \\), and \\( \\mathbf{C} \\).\n\n2. The computer scientist wishes to apply a regularization term to the factor matrices to prevent overfitting. Define a',
                },
            ],
            source: 'olmo-2-1124-13b-preference-mix',
            textLong:
                'mathbf{G} \\) and factor matrices \\( \\mathbf{A} \\), \\( \\mathbf{B} \\), and \\( \\mathbf{C} \\). The decomposition follows the form:\n\n\\[ \\mathbf{X} \\approx \\sum_{i=1}^{r_1} \\sum_{j=1}^{r_2} \\sum_{k=1}^{r_3} \\mathbf{G}_{ijk} \\mathbf{a}_i \\otimes \\mathbf{b}_j \\otimes \\mathbf{c}_k \\]\n\nwhere \\( \\otimes \\) denotes the outer product, \\( \\mathbf{a}_i \\in \\mathbb{R}^n \\), \\( \\mathbf{b}_j \\in \\mathbb{R}^m \\), \\( \\mathbf{c}_k \\in \\mathbb{R}^p \\), and \\( r_1 \\), \\( r_2 \\), \\( r_3 \\) are the ranks of the decomposition.\n\n1. Determine the conditions under which the tensor decomposition is unique, given the constraints on the ranks \\( r_1 \\), \\( r_2 \\), and \\( r_3 \\), and the properties of the factor matrices \\( \\mathbf{A} \\), \\( \\mathbf{B} \\), and \\( \\mathbf{C} \\).\n\n2. The computer scientist wishes to apply a regularization term to the factor matrices to prevent overfitting. Define a regularization term that minimizes the sum of squares of the Frobenius norms of the differences between the original tensor \\( \\mathbf{X} \\) and its approximation, while ensuring that each factor matrix remains orthogonal. Provide a mathematical formulation of this regularization term.\n<|assistant|>\nIntroducing the Vintage Coffee and Flower Design series! This collection of artwork brings together the classic florals and bold coffee illustrations, perfect for a variety of applications. The artwork is a high-quality digital illustration, measuring at 1080x1080 resolution with three image variations to choose from.\n\nThe Vintage Coffee and Flower Design series is perfect for entrepreneurs and creatives looking for versatile artwork for their business. This collection can be applied to a range of products such as mugs, t-shirts, paintings, and more. The design is perfect for coffee shops, flower sh',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                "this problem, let's first recall some fundamental definitions and properties of",
            ],
            correspondingSpans: [0],
            index: '3141278740',
            relevanceScore: 225.66752803629706,
            snippets: [
                {
                    correspondingSpanText:
                        "this problem, let's first recall some fundamental definitions and properties of",
                    text: ")^m(1+t)^{n-2m}\\$ and extract the coefficient of \\(t^r\\), which will give us the desired count.\n\nTo understand how to tackle this problem, let's first recall some fundamental definitions and properties of generating functions. A generating function for a sequence \\(\\{a\\_n\\}\\) is defined as the power series \\(\\displaystyle G(x)=\\sum\\_{n=0}^{\\infty} a\\_nx",
                },
            ],
            source: 'dolmino',
            textLong:
                "concepts, but develop each one in detail before moving to the next, as we prioritize depth of understanding and comprehensive exploration of the subject matter over breadth. Focus on:\n\n- Rigor: Ensure in-depth coverage of the concepts/sections.\n- Engagement: Write with an academic, professional and engaging tone that captivates interest.\n- Application: Incorporate specific, practical examples, such as proofs in calculus or critical dates and figures in history.\nDo not include a title or an introduction, simply write the content without headlines and introductory phrases. Do not use images. Generating functions are a powerful tool in combinatorics, allowing us to translate complex counting problems into algebraic manipulations. In this problem, we are asked to find the number of r-combinations of a set with a certain specification, and we have been provided with a generating function. Specifically, we want to expand the expression \\$(1+t+t^2)^m(1+t)^{n-2m}\\$ and extract the coefficient of \\(t^r\\), which will give us the desired count.\n\nTo understand how to tackle this problem, let's first recall some fundamental definitions and properties of generating functions. A generating function for a sequence \\(\\{a\\_n\\}\\) is defined as the power series \\(\\displaystyle G(x)=\\sum\\_{n=0}^{\\infty} a\\_nx^n\\). These functions can encode various types of sequences arising from discrete structures. For example, if \\(a\\_n = {n \\choose k}\\), then the generating function \\(\\displaystyle G(x) = \\sum\\_{n=0}^{\\infty}{n \\choose k} x^n\\) has a closed form solution obtained through the binomial theorem: \\(\\displaystyle G(x)=(1-x)^{-(k+1)}\\). This result can be used to derive other useful identities involving combinations.\n\nIn our case, we need to deal with a product of two generating functions, namely \\((1+t+t^2)^m\\) and \\((1+t)^{n-2m}\\). Recall that when multiplying two generating functions together, say \\(\\displaystyle F(x) = \\sum\\_{n=0}^{\\infty}f\\_nx^n\\) and \\(\\displaystyle G(x) = \\sum\\_{n=0}^{\\infty}g\\_nx^n\\),",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                "To approach this problem, let's first recall some fundamental definitions and properties",
            ],
            correspondingSpans: [0],
            index: '3141603066',
            relevanceScore: 224.44585824104328,
            snippets: [
                {
                    correspondingSpanText:
                        "To approach this problem, let's first recall some fundamental definitions and properties",
                    text: "A + \\lambda B$ is invertible, given that $A$ is a $n xx n$ matrix with real coefficients and $B$ is an invertible matrix of the same size. To approach this problem, let's first recall some fundamental definitions and properties regarding matrices and their inverses. Then, we will build up to the main result using these concepts.\n\n**Definition:** A square matrix $A$ is said to be invertible",
                },
            ],
            source: 'dolmino',
            textLong:
                "31 '12 at 2:50 3 Answers Consider$$\\det(A + \\lambda B)$$This will be a polynomial of finite degree in \\lambda. Unless the polynomial is uniformly zero, there will exist o\"\n\nDo not just list concepts, but develop each one in detail before moving to the next, as we prioritize depth of understanding and comprehensive exploration of the subject matter over breadth. Focus on:\n\n- Rigor: Ensure in-depth coverage of the concepts/sections.\n- Engagement: Write with an academic, professional and engaging tone that captivates interest.\n- Application: Incorporate specific, practical examples, such as proofs in calculus or critical dates and figures in history.\nDo not include a title or an introduction, simply write the content without headlines and introductory phrases. Do not use images. The problem at hand involves showing that there exists a real number $\\lambda$ such that the matrix $A + \\lambda B$ is invertible, given that $A$ is a $n xx n$ matrix with real coefficients and $B$ is an invertible matrix of the same size. To approach this problem, let's first recall some fundamental definitions and properties regarding matrices and their inverses. Then, we will build up to the main result using these concepts.\n\n**Definition:** A square matrix $A$ is said to be invertible if there exists another square matrix $B$ such that $AB = BA = I$, where $I$ denotes the identity matrix. If such a $B$ exists, we call it the inverse of $A$ and denote it by $A^{-1}$.\n\n**Property 1:** The determinant of an invertible matrix is nonzero, i.e., if $A$ is invertible, then $|A| \\neq 0$. Conversely, if $|A|=0$, then $A$ is not invertible.\n\n**Property 2:** Let $A$ and $B$ be two square matrices of the same size. If both $A$ and $B$ are invertible, then their product $AB$ is also invertible. However, the sum $A+B$ does not necessarily yield an invertible matrix. Instead, we consider the expression $A + \\lambda B$ and look for values of $\\lambda$ that render the resulting matrix invertible",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                "this problem, let's first recall some fundamental definitions and properties of",
            ],
            correspondingSpans: [0],
            index: '3140898795',
            relevanceScore: 224.05825489022706,
            snippets: [
                {
                    correspondingSpanText:
                        "this problem, let's first recall some fundamental definitions and properties of",
                    text: "calculus or critical dates and figures in history.\nDo not include a title or an introduction, simply write the content without headlines and introductory phrases. Do not use images. To solve this problem, let's first recall some fundamental definitions and properties of cumulative distribution functions (CDFs) and expected values. Then, we will apply these concepts step by step to compute the expected value E(X) for the given CDF F(x",
                },
            ],
            source: 'dolmino',
            textLong:
                "says the CDF of $$X$$ can be defined in terms of the probability density function $$f$$ as follows:\n\n$$F(x) = \\int_{-\\infty}^x f(t)\\,dt$$\n\nThis is as far as I got. Where do I go from here?\n\nEDIT: I meant to put $$x\\ge1$$.\n\nEdited for the comment from probabilityislogic\n\nNote that $F(1)=0$ in this case so the distribution has p\"\n\nDo not just list concepts, but develop each one in detail before moving to the next, as we prioritize depth of understanding and comprehensive exploration of the subject matter over breadth. Focus on:\n\n- Rigor: Ensure in-depth coverage of the concepts/sections.\n- Engagement: Write with an academic, professional and engaging tone that captivates interest.\n- Application: Incorporate specific, practical examples, such as proofs in calculus or critical dates and figures in history.\nDo not include a title or an introduction, simply write the content without headlines and introductory phrases. Do not use images. To solve this problem, let's first recall some fundamental definitions and properties of cumulative distribution functions (CDFs) and expected values. Then, we will apply these concepts step by step to compute the expected value E(X) for the given CDF F(x) = 1 - x^(-\u03b1), x \u2265 1, and identify the values of \u03b1 for which E(X) exists.\n\n**Cumulative Distribution Functions (CDFs)**\n\nA cumulative distribution function F(x) of a random variable X is defined as the probability that X takes on a value less than or equal to x:\n\nF(x) := P(X \u2264 x)\n\nSome important properties of CDFs include:\n\n1. F(x) is non-decreasing; i.e., if x1 < x2, then F(x1) \u2264 F(x2).\n2. F(x) is right-continuous; i.e., lim{x' \u2192 x+} F(x') = F(x).\n3. F(\u2212\u221e) = 0 and F(+\u221e) = 1.\n4. If f(x) is the probability density",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                "this problem, let's first recall some fundamental definitions and properties of",
            ],
            correspondingSpans: [0],
            index: '3140235511',
            relevanceScore: 223.0057117096824,
            snippets: [
                {
                    correspondingSpanText:
                        "this problem, let's first recall some fundamental definitions and properties of",
                    text: "or critical dates and figures in history.\nDo not include a title or an introduction, simply write the content without headlines and introductory phrases. Do not use images. To tackle this problem, let's first recall some fundamental definitions and properties of Abelian groups, followed by exploring methods to classify finitely presented Abelian groups. We will then apply these techniques to solve the posed problem.\n\nAn Abelian group $(G",
                },
            ],
            source: 'dolmino',
            textLong:
                "7d =-18a \\rangle.$$\n\nNow how do I proceed from here, I thought of calculating the order but I don't know how to do so for a given presentation. In particular, is there some algorithm\\formula to calculate\\classify finitely presented abelian groups?\n\nMaybe it can be done by using techniques for finitely generated abelian groups (invariant forms etc??) Please provide hints. Thank you.\n\nLet $$g=2a-3b$\"\n\nDo not just list concepts, but develop each one in detail before moving to the next, as we prioritize depth of understanding and comprehensive exploration of the subject matter over breadth. Focus on:\n\n- Rigor: Ensure in-depth coverage of the concepts/sections.\n- Engagement: Write with an academic, professional and engaging tone that captivates interest.\n- Application: Incorporate specific, practical examples, such as proofs in calculus or critical dates and figures in history.\nDo not include a title or an introduction, simply write the content without headlines and introductory phrases. Do not use images. To tackle this problem, let's first recall some fundamental definitions and properties of Abelian groups, followed by exploring methods to classify finitely presented Abelian groups. We will then apply these techniques to solve the posed problem.\n\nAn Abelian group $(G, +)$ is a set $G$ equipped with binary operation '+' that satisfies commutativity ($a + b = b + a$), associativity ($(a + b) + c = a + (b + c)$), existence of identity element (there exists an element $e$ such that $a + e = a$), and existence of inverse elements (for every element $a$, there exists $-a$ such that $a + (-a) = e$). A crucial property of Abelian groups is their decomposition into cyclic subgroups via the structure theorem for finitely generated Abelian groups. Before discussing this, however, let us discuss presentations of groups briefly.\n\nA presentation of a group $G$ is an expression $\\langle X | R \\rangle$ where $X$ is a set of generators and $R$ is a set of relators, i.e., words formed by elements of $X$ and their inverses. The group $G$ has this presentation if",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\mathrm{tr}(\\mathbf{A}^{-',
                ' \\mathrm{tr}(\\mathbf{A}^{-',
                '1}) = \\mathrm{tr}(\\mathbf{A}^{-T} \\mathbf{A}^{-',
            ],
            correspondingSpans: [10, 12, 14],
            index: '3140994362',
            relevanceScore: 220.84516065864958,
            snippets: [
                {
                    correspondingSpanText: '\\mathrm{tr}(\\mathbf{A}^{-',
                    text: 'big( \\mathrm{tr}(\\mathbf{A}) + 1 \\big) \\mathbf{I}}{\\mathrm{det}(\\mathbf{A}) + \\mathrm{det}(\\mathbf{A}) \\mathrm{tr}(\\mathbf{A}^{-1}) + \\mathrm{tr}(\\mathbf{A}) + 1}$$\n\n\u2022 $4 \\times 4$:\n\n$$(\\mathbf{I} + \\mathbf{A})',
                },
            ],
            source: 'dolmino',
            textLong:
                'mathbf{I} + \\mathbf{A})^{-1}$$\n\nthat only involves $\\mathbf{A}^{-1}$, i.e., no other inverse appears in the solution (as, for instance, in the Woodbury matrix identity).\n\nI\'ve tried to derive the inverse by hand but I could only obtain a result up to he $4 \\times 4$ case as follows.\n\n\u2022 $2 \\times 2$:\n\n$$(\\mathbf{I} + \\mathbf{A})^{-1} = \\frac{\\mathrm{det}(\\mathbf{A}) \\mathbf{A}^{-1} + \\mathbf{I}}{\\mathrm{det}(\\mathbf{A}) + \\mathrm{tr}(\\mathbf{A}) + 1}$$\n\n\u2022 $3 \\times 3$:\n\n$$(\\mathbf{I} + \\mathbf{A})^{-1} = \\frac{\\mathrm{det}(\\mathbf{A}) \\mathbf{A}^{-1} - \\mathbf{A} + \\big( \\mathrm{tr}(\\mathbf{A}) + 1 \\big) \\mathbf{I}}{\\mathrm{det}(\\mathbf{A}) + \\mathrm{det}(\\mathbf{A}) \\mathrm{tr}(\\mathbf{A}^{-1}) + \\mathrm{tr}(\\mathbf{A}) + 1}$$\n\n\u2022 $4 \\times 4$:\n\n$$(\\mathbf{I} + \\mathbf{A})^{-1} = \\frac{\\mathrm{det}(\\mathbf{A}) \\mathbf{A}^{-1} + \\math"\n\nDo not just list concepts, but develop each one in detail before moving to the next, as we prioritize depth of understanding and comprehensive exploration of the subject matter over breadth. Focus on:\n\n- Rigor: Ensure in-depth coverage of the concepts/sections.\n- Engagement: Write with an academic, professional and engaging tone that captivates interest.\n- Application: Incorporate specific, practical examples, such as proofs in calculus or critical dates and figures in history.\nDo not include a title or an introduction, simply write the content without headlines and introductory phrases. Do not use images. The problem at hand is finding a general formula for the inverse of a sum of a symmetric, positive definite matrix A and the identity matrix I, expressed solely in terms of A^(-1), without any other matrix',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['} \\cdot \\mathbf{A}^{-1} ='],
            correspondingSpans: [32],
            index: '3141446944',
            relevanceScore: 220.6756342686641,
            snippets: [
                {
                    correspondingSpanText: '} \\cdot \\mathbf{A}^{-1} =',
                    text: '0$. Consequently, since both $\\mathbf{A}$ and its inverse share identical dimensions, their product yields the identity matrix ($\\mathbf{I}$). Expressed mathematically, $\\mathbf{A} \\cdot \\mathbf{A}^{-1} = \\mathbf{I}$. As previously stated, the unique solution can then be found via standard matrix operations\u2014multiplying $\\mathbf{A}^{-1}$ by another matrix formed from our original problem.\n',
                },
            ],
            source: 'dolmino',
            textLong:
                "begin by ensuring you are familiar with some fundamental prerequisites. Afterward, I will present Theorem 2.6.18, followed by its proof, after which I shall provide an example using Cramer's Rule.\n\nFirst, recall that a linear system consisting of $n$ equations in $n$ variables has a unique solution for all values of these variables if and only if the determinant of its coefficient matrix, denoted hereafter as $\\mathbf{A}$, does not equal zero; i.e., $|\\mathbf{A}| \\neq 0$. This condition guarantees that the inverse of the coefficient matrix also exists, allowing us to calculate the unique solution through matrix multiplication involving the inverse of $\\mathbf{A}$ and a matrix containing constants derived from our initial set of equations.\n\nNext, note that a square matrix possessing an inverse must have nonzero determinant, implying that $|\\mathbf{A}^{-1}| \\neq 0$, provided $|\\mathbf{A}| \\neq 0$. Consequently, since both $\\mathbf{A}$ and its inverse share identical dimensions, their product yields the identity matrix ($\\mathbf{I}$). Expressed mathematically, $\\mathbf{A} \\cdot \\mathbf{A}^{-1} = \\mathbf{I}$. As previously stated, the unique solution can then be found via standard matrix operations\u2014multiplying $\\mathbf{A}^{-1}$ by another matrix formed from our original problem.\n\nNow enters Cramer's Rule, offering another technique to ascertain the solution directly instead of computing the inverse explicitly. Specifically, consider a linear system composed of $n$ equations in $n$ unknowns ($x\\_1, x\\_2,\\ldots,x\\_n$). For simplicity, represent said system as follows:\n\n$\\begin{cases}\\begin{align*}a\\_{11}x\\_1 + a\\_{12}x\\_2 +\\cdots+ a\\_{1n}x\\_n &= b\\_1 \\\\a\\_{21}x\\_1 + a\\_{22}x\\_2 +\\cdots+ a\\_{2n}x\\_n &= b\\_2\\\\&\\vdots \\\\a\\_{n1}x\\_1 + a\\_{n2}x\\_2 +\\cdots+ a\\_{nn}x\\_n &= b\\_n\\end{align*}\\end{cases}$\n\nWe may express this compactly using matrices:",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['} \\cdot \\mathbf{A}^{-1} ='],
            correspondingSpans: [32],
            index: '3139350182',
            relevanceScore: 220.6756342686641,
            snippets: [
                {
                    correspondingSpanText: '} \\cdot \\mathbf{A}^{-1} =',
                    text: '0$. Consequently, since both $\\mathbf{A}$ and its inverse share identical dimensions, their product yields the identity matrix ($\\mathbf{I}$). Expressed mathematically, $\\mathbf{A} \\cdot \\mathbf{A}^{-1} = \\mathbf{I}$. As previously stated, the unique solution can then be found via standard matrix operations\u2014multiplying $\\mathbf{A}^{-1}$ by another matrix formed from our original problem.\n',
                },
            ],
            source: 'dolmino',
            textLong:
                "begin by ensuring you are familiar with some fundamental prerequisites. Afterward, I will present Theorem 2.6.18, followed by its proof, after which I shall provide an example using Cramer's Rule.\n\nFirst, recall that a linear system consisting of $n$ equations in $n$ variables has a unique solution for all values of these variables if and only if the determinant of its coefficient matrix, denoted hereafter as $\\mathbf{A}$, does not equal zero; i.e., $|\\mathbf{A}| \\neq 0$. This condition guarantees that the inverse of the coefficient matrix also exists, allowing us to calculate the unique solution through matrix multiplication involving the inverse of $\\mathbf{A}$ and a matrix containing constants derived from our initial set of equations.\n\nNext, note that a square matrix possessing an inverse must have nonzero determinant, implying that $|\\mathbf{A}^{-1}| \\neq 0$, provided $|\\mathbf{A}| \\neq 0$. Consequently, since both $\\mathbf{A}$ and its inverse share identical dimensions, their product yields the identity matrix ($\\mathbf{I}$). Expressed mathematically, $\\mathbf{A} \\cdot \\mathbf{A}^{-1} = \\mathbf{I}$. As previously stated, the unique solution can then be found via standard matrix operations\u2014multiplying $\\mathbf{A}^{-1}$ by another matrix formed from our original problem.\n\nNow enters Cramer's Rule, offering another technique to ascertain the solution directly instead of computing the inverse explicitly. Specifically, consider a linear system composed of $n$ equations in $n$ unknowns ($x\\_1, x\\_2,\\ldots,x\\_n$). For simplicity, represent said system as follows:\n\n$\\begin{cases}\\begin{align*}a\\_{11}x\\_1 + a\\_{12}x\\_2 +\\cdots+ a\\_{1n}x\\_n &= b\\_1 \\\\a\\_{21}x\\_1 + a\\_{22}x\\_2 +\\cdots+ a\\_{2n}x\\_n &= b\\_2\\\\&\\vdots \\\\a\\_{n1}x\\_1 + a\\_{n2}x\\_2 +\\cdots+ a\\_{nn}x\\_n &= b\\_n\\end{align*}\\end{cases}$\n\nWe may express this compactly using matrices:",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['= -\\mathbf{A}^{-1} \\cdot'],
            correspondingSpans: [32],
            index: '2957108324',
            relevanceScore: 219.6632201132083,
            snippets: [
                {
                    correspondingSpanText: '= -\\mathbf{A}^{-1} \\cdot',
                    text: 'matrix, so that condition $(i)$ is always satisfied.\n\nThe advantage of using GLV dynamics is that we have an analytical solution for the stationary state $\\mathbf{x^{*} = -\\mathbf{A}^{-1} \\cdot \\boldsymbol{\\alpha}}$ as a function of the interaction network $\\mathbf{A}$.\nMoreover, this solution is globally stable in the positive orthant if $\\mathbf{A}$ is negative',
                },
            ],
            source: 'open-web-math',
            textLong:
                '}\\label{GLVsec}\n\nIn order to better understand the relevance of conditions $(i)$ and $(ii)$ on the validity of the results of Gao et al, we consider a simplified setting where both conditions $(i)$ and $(ii)$ are satisfied.\nBy considering $F(x) = \\alpha x$ and $G(x,y) = x y$, the condition $(ii)$ is valid by definition.\nIn this case the dynamics is defined by the generalized Lotka-Volterra (GLV) equations:\n\\begin{equation}\\label{eq:GLVDyn}\n\\centering\n\\dot{x}_i = \\alpha x_i + x_i \\sum_{j=1}^S A_{ij}x_j ,\n\\end{equation}\nwhere $\\alpha$ is the intrinsic growth rate, and $S$ is the number of species in the community.\nThe interaction matrix $\\mathbf{A}$ is taken to be a random matrix, so that condition $(i)$ is always satisfied.\n\nThe advantage of using GLV dynamics is that we have an analytical solution for the stationary state $\\mathbf{x^{*} = -\\mathbf{A}^{-1} \\cdot \\boldsymbol{\\alpha}}$ as a function of the interaction network $\\mathbf{A}$.\nMoreover, this solution is globally stable in the positive orthant if $\\mathbf{A}$ is negative definite \\cite{volterra1936leccons,grilli2017feasibility}.\nFinally the corresponding one-dimensional analytical effective equation for GLV dynamics reads as $\\frac{dx}{dt} = \\alpha x + \\beta x^2$, whose feasible ($x(\\beta)>0$) and stationary solution is:\n\\begin{equation}\\label{eq:GLVSol}\n\\centering\nx (\\beta)= - \\alpha/ \\beta,\n\\end{equation}\nwith $\\alpha/ \\beta <0$. For values of $\\alpha/ \\beta>0$, the solution exists, but is not meaningful.\n\nFor each realization of the stochastic interaction matrix, we can define two errors (see Figure \\ref{fig:Diagram}) measuring the vertical and horizontal distance from the point ($x_{eff}$, $\\beta_{eff}$) and the stationary solution of the one-dimensional resilience function $x(\\beta',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '2} = \\frac{\\partial}{\\partial \\mathbf{',
                '2} = \\frac{\\partial}{\\partial \\mathbf{A}} \\left(',
                '2} = \\frac{\\partial}{\\partial \\mathbf{A}} (\\mathbf{A}^{-1})',
            ],
            correspondingSpans: [19, 21, 33],
            index: '2950879694',
            relevanceScore: 218.67777585590144,
            snippets: [
                {
                    correspondingSpanText: '2} = \\frac{\\partial}{\\partial \\mathbf{',
                    text: 'of a particle for the 3D case is:\n\\begin{equation}\\label{eq:eff_mot}\n\\frac{\\partial ^2\\mathbf{r}}{\\partial t^2} = \\frac{\\partial}{\\partial \\mathbf{r}}\n\\left(\\Phi_{\\text{smbh}} + \\Phi_{\\text{torus}}^{\\text{inner}}\\right),\n\\end{equation} \nwhere $\\',
                },
            ],
            source: 'algebraic-stack',
            textLong:
                '_{10} &= -0.39217, \\quad a_{20} &= - 0.31843 \\\\\na_{30} &= \\phantom{-}0.02316, \\quad a_{02} &= \\phantom{-} 0.36887, \\quad a_{12} &= \\phantom{-} 0.05674 \n\\end{align*}\nfor parameters of the central region of the torus cross-section approximately corresponding to the equilibrium state of the torus from $N$-body simulations: $r_0=0.5$, $\\alpha = 1.2$. As it can be seen, the significant coefficients of the power series are in general limited by the 2nd order terms; this reflects the property that the inner potential of the torus consists of the potential of a cylinder \\citep{Bannikova2011}.\nThe equation of motion of a particle for the 3D case is:\n\\begin{equation}\\label{eq:eff_mot}\n\\frac{\\partial ^2\\mathbf{r}}{\\partial t^2} = \\frac{\\partial}{\\partial \\mathbf{r}}\n\\left(\\Phi_{\\text{smbh}} + \\Phi_{\\text{torus}}^{\\text{inner}}\\right),\n\\end{equation} \nwhere $\\Phi_{\\text{smbh}} = G M_\\text{smbh}/r$ is the gravitational field of the central mass (SMBH). \n\n\\begin{figure}\n\\centering\n\\includegraphics[width = 50mm]{fig9a.pdf}\\\\\n\\includegraphics[width = 43mm]{fig9b.pdf}\n\\includegraphics[width = 40mm]{fig9c.pdf}\n\\caption{An example of an orbit in a co-moving reference system ({\\it top}) and of the coordinates evolution ({\\it bottom}) of a particle in the gravitational field of the central mass and in the torus inner potential during 200 periods.}\n\\label{fig:box-orbit}\n\\end{figure}\n\nThe numerical solution of the equations (\\ref{eq:eff_mot}) allows us to obtain the coordinates of a particle in the inner potential of the torus (\\ref{eq_',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '{A}^{-T} \\mathbf{A}^{-',
                '1}) = \\mathrm{tr}(\\mathbf{A}^{-T} \\mathbf{A}^{-',
            ],
            correspondingSpans: [14],
            index: '2212230827',
            relevanceScore: 218.38771888355078,
            snippets: [
                {
                    correspondingSpanText: '{A}^{-T} \\mathbf{A}^{-',
                    text: '^T \\mathbf{n} + d = 0 \\label{eq_cal_quad} \\tag{14}\\]\n\n\n\\[\\mathbf{M} = \\mathbf{A}^{-T} \\mathbf{A}^{-1} \\label{eq_cal_M} \\tag{15a}\\] \\[\\mathbf{n} = -2 \\mathbf{A}^{-T} \\mathbf{A}^{-1',
                },
                {
                    correspondingSpanText: '{A}^{-T} \\mathbf{A}^{-',
                    text: '{b})\\]\n\nwhich combined with \\(\\eqref{eq_h_const}\\) leads to:\n\n\\[\\begin{align} & \\mathbf{h}_m^T \\mathbf{A}^{-T} \\mathbf{A}^{-1} \\mathbf{h}_m - \\\\ & 2 \\mathbf{h}_m^T \\mathbf{A}^{-T} \\mathbf{A}^{-1} \\mathbf{b}',
                },
                {
                    correspondingSpanText: '{A}^{-T} \\mathbf{A}^{-',
                    text: 'mathbf{A}^{-T} \\mathbf{A}^{-1} \\label{eq_cal_M} \\tag{15a}\\] \\[\\mathbf{n} = -2 \\mathbf{A}^{-T} \\mathbf{A}^{-1} \\mathbf{b} \\label{eq_cal_n} \\tag{15b}\\] \\[d = \\mathbf{b}^T \\mathbf{A}^{-T}',
                },
                {
                    correspondingSpanText: '{A}^{-T} \\mathbf{A}^{-',
                    text: '2 \\mathbf{h}_m^T \\mathbf{A}^{-T} \\mathbf{A}^{-1} \\mathbf{b} + \\\\ & \\mathbf{b}^T \\mathbf{A}^{-T} \\mathbf{A}^{-1} \\mathbf{b} - \\mathcal{F}^2 = 0. \\end{align} \\label{eq_cal_quad_ns} \\tag{13}\\',
                },
                {
                    correspondingSpanText: '{A}^{-T} \\mathbf{A}^{-',
                    text: '\\mathbf{A}^{-1} \\mathbf{b} \\label{eq_cal_n} \\tag{15b}\\] \\[d = \\mathbf{b}^T \\mathbf{A}^{-T} \\mathbf{A}^{-1} \\mathbf{b} - \\mathcal{F}^2. \\label{eq_cal_d} \\tag{15c}\\]\n\nAs we noted in the previous',
                },
                {
                    correspondingSpanText: '{A}^{-T} \\mathbf{A}^{-',
                    text: 'h}_m^T \\mathbf{A}^{-T} \\mathbf{A}^{-1} \\mathbf{h}_m - \\\\ & 2 \\mathbf{h}_m^T \\mathbf{A}^{-T} \\mathbf{A}^{-1} \\mathbf{b} + \\\\ & \\mathbf{b}^T \\mathbf{A}^{-T} \\mathbf{A}^{-1} \\mathbf{b} - \\mathcal{F',
                },
            ],
            source: 'dclm-hero-run-fasttext_for_HF',
            textLong:
                '\\mathbf{b})\\]\n\nwhich combined with \\(\\eqref{eq_h_const}\\) leads to:\n\n\\[\\begin{align} & \\mathbf{h}_m^T \\mathbf{A}^{-T} \\mathbf{A}^{-1} \\mathbf{h}_m - \\\\ & 2 \\mathbf{h}_m^T \\mathbf{A}^{-T} \\mathbf{A}^{-1} \\mathbf{b} + \\\\ & \\mathbf{b}^T \\mathbf{A}^{-T} \\mathbf{A}^{-1} \\mathbf{b} - \\mathcal{F}^2 = 0. \\end{align} \\label{eq_cal_quad_ns} \\tag{13}\\]\n\nEq. \\(\\eqref{eq_cal_quad_ns}\\) can be re-written in the familiar quadric form:\n\n\\[\\mathbf{h}_m^T \\mathbf{M} \\mathbf{h}_m + \\mathbf{h}_m^T \\mathbf{n} + d = 0 \\label{eq_cal_quad} \\tag{14}\\]\n\n\n\\[\\mathbf{M} = \\mathbf{A}^{-T} \\mathbf{A}^{-1} \\label{eq_cal_M} \\tag{15a}\\] \\[\\mathbf{n} = -2 \\mathbf{A}^{-T} \\mathbf{A}^{-1} \\mathbf{b} \\label{eq_cal_n} \\tag{15b}\\] \\[d = \\mathbf{b}^T \\mathbf{A}^{-T} \\mathbf{A}^{-1} \\mathbf{b} - \\mathcal{F}^2. \\label{eq_cal_d} \\tag{15c}\\]\n\nAs we noted in the previous section our quadric surface will be an ellipsoid. Thus, we need to use an ellipsoid fitting algorithm which provides us with estimates of the quadric surface parameters, \\(\\mathbf{\\hat{M}}\\), \\(\\mathbf{\\hat{n}}\\) and \\(\\hat{d}\\). Multiple algorithms have been developed to fit a set of points to an ellipsoid surface. We will use the LS fitting method described in this paper by Q. Li et al. This method is easy to implement and there is also a MATLAB version readily available. Even though presented as an iterative method, a single step',

            url: 'https://teslabs.com/articles/magnetometer-calibration/',
            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['} \\cdot \\mathbf{A}^{-1} ='],
            correspondingSpans: [32],
            index: '3142370581',
            relevanceScore: 218.22200064999709,
            snippets: [
                {
                    correspondingSpanText: '} \\cdot \\mathbf{A}^{-1} =',
                    text: '} = \\mathbf{0}$.\nMultiplying both sides by $\\mathbf{A}^{-1}$ (assuming it exists), we get $\\mathbf{A}^2 = \\mathbf{0} \\cdot \\mathbf{A}^{-1} = \\mathbf{0}$.\nTherefore, $\\mathbf{A}^2$ can only be the zero matrix, $\\mathbf{0}$.\nSo, there is only $\\boxed{1}$',
                },
            ],
            source: 'dolmino',
            textLong:
                'If $\\mathbf{A}$ is a $2 \\times 2$ matrix with real entries and $\\mathbf{A}^3 = \\mathbf{0}$, how many different possible matrices can $\\mathbf{A}^2$ be? If the answer is infinite, enter "infinite".\nWe have $\\mathbf{A}^3 = \\mathbf{A} \\cdot \\mathbf{A} \\cdot \\mathbf{A} = \\mathbf{0}$.\nMultiplying both sides by $\\mathbf{A}^{-1}$ (assuming it exists), we get $\\mathbf{A}^2 = \\mathbf{0} \\cdot \\mathbf{A}^{-1} = \\mathbf{0}$.\nTherefore, $\\mathbf{A}^2$ can only be the zero matrix, $\\mathbf{0}$.\nSo, there is only $\\boxed{1}$ possible matrix for $\\mathbf{A}^2$.\nThe answer is: 1',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\( \\frac{\\partial^2 f}{\\partial',
                '- \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
            ],
            correspondingSpans: [6, 35],
            index: '3163378230',
            relevanceScore: 211.1343455694829,
            snippets: [
                {
                    correspondingSpanText: '\\( \\frac{\\partial^2 f}{\\partial',
                    text: "\n\n- \\( \\frac{\\partial f}{\\partial S} = \\frac{1}{S} \\)\n- \\( \\frac{\\partial f}{\\partial t} = 0 \\)\n- \\( \\frac{\\partial^2 f}{\\partial S^2} = -\\frac{1}{S^2} \\)\n\nSubstituting these into Ito's lemma, and since \\( (dW)^2 = dt \\",
                },
                {
                    correspondingSpanText: '- \\( \\frac{\\partial^2 f}{\\partial',
                    text: "):\n\n- \\( \\frac{\\partial f}{\\partial S} = \\frac{1}{S} \\)\n- \\( \\frac{\\partial f}{\\partial t} = 0 \\)\n- \\( \\frac{\\partial^2 f}{\\partial S^2} = -\\frac{1}{S^2} \\)\n\nSubstituting these into Ito's lemma, and since \\( (dW)^2 = dt \\",
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                "\n<|assistant|>\nTo solve the problem, we will address each part step-by-step.\n\n### Part 1: Derive the Expected Stock Price \\( E[S(t)] \\)\n\nThe stock price \\( S(t) \\) follows the Geometric Brownian Motion given by:\n\n\\[ dS(t) = \\mu S(t) dt + \\sigma S(t) dW(t) \\]\n\nUsing Ito's lemma for a function of the form \\( f(S, t) = \\ln(S) \\), we have:\n\n\\[ df = \\left( \\frac{\\partial f}{\\partial S} dS + \\frac{\\partial f}{\\partial t} dt + \\frac{1}{2} \\frac{\\partial^2 f}{\\partial S^2} (dS)^2 \\right) \\]\n\nFor \\( f(S, t) = \\ln(S) \\):\n\n- \\( \\frac{\\partial f}{\\partial S} = \\frac{1}{S} \\)\n- \\( \\frac{\\partial f}{\\partial t} = 0 \\)\n- \\( \\frac{\\partial^2 f}{\\partial S^2} = -\\frac{1}{S^2} \\)\n\nSubstituting these into Ito's lemma, and since \\( (dW)^2 = dt \\), we get:\n\n\\[ d(\\ln(S)) = \\frac{1}{S}(\\mu S dt + \\sigma S dW) - \\frac{1}{2} \\frac{1}{S^2} (\\sigma^2 S^2 dt) \\]\n\n\\[ = (\\mu - \\frac{1}{2} \\sigma^2) dt + \\sigma dW \\]\n\nIntegrating both sides from 0 to \\( t \\):\n\n\\[ \\ln(S(t)) - \\ln(S(0)) = \\left(\\mu - \\frac{1}{2} \\sigma^2\\right)t + \\sigma W(t) \\]\n\nExponentiating both sides:\n\n\\[ S(t) = S(0) \\exp \\left( \\left(\\mu - \\frac{1}{2} \\sigma^2\\right)t + \\sigma W(t) \\right) \\]\n\nTaking",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['- \\( \\frac{\\partial^2 f}{\\partial'],
            correspondingSpans: [35],
            index: '3159715210',
            relevanceScore: 210.59184687858567,
            snippets: [
                {
                    correspondingSpanText: '- \\( \\frac{\\partial^2 f}{\\partial',
                    text: "):\n\n- \\( \\frac{\\partial f}{\\partial S} = \\frac{1}{S} \\)\n- \\( \\frac{\\partial f}{\\partial t} = 0 \\)\n- \\( \\frac{\\partial^2 f}{\\partial S^2} = -\\frac{1}{S^2} \\)\n\nSubstituting these into Ito's lemma, and since \\( (dW)^2 = dt \\",
                },
            ],
            source: 'dolmino',
            textLong:
                "50% in each stock.\nTo solve the problem, we will address each part step-by-step.\n\n### Part 1: Derive the Expected Stock Price \\( E[S(t)] \\)\n\nThe stock price \\( S(t) \\) follows the Geometric Brownian Motion given by:\n\n\\[ dS(t) = \\mu S(t) dt + \\sigma S(t) dW(t) \\]\n\nUsing Ito's lemma for a function of the form \\( f(S, t) = \\ln(S) \\), we have:\n\n\\[ df = \\left( \\frac{\\partial f}{\\partial S} dS + \\frac{\\partial f}{\\partial t} dt + \\frac{1}{2} \\frac{\\partial^2 f}{\\partial S^2} (dS)^2 \\right) \\]\n\nFor \\( f(S, t) = \\ln(S) \\):\n\n- \\( \\frac{\\partial f}{\\partial S} = \\frac{1}{S} \\)\n- \\( \\frac{\\partial f}{\\partial t} = 0 \\)\n- \\( \\frac{\\partial^2 f}{\\partial S^2} = -\\frac{1}{S^2} \\)\n\nSubstituting these into Ito's lemma, and since \\( (dW)^2 = dt \\), we get:\n\n\\[ d(\\ln(S)) = \\frac{1}{S}(\\mu S dt + \\sigma S dW) - \\frac{1}{2} \\frac{1}{S^2} (\\sigma^2 S^2 dt) \\]\n\n\\[ = (\\mu - \\frac{1}{2} \\sigma^2) dt + \\sigma dW \\]\n\nIntegrating both sides from 0 to \\( t \\):\n\n\\[ \\ln(S(t)) - \\ln(S(0)) = \\left(\\mu - \\frac{1}{2} \\sigma^2\\right)t + \\sigma W(t) \\]\n\nExponentiating both sides:\n\n\\[ S(t) = S(0) \\exp \\left( \\left(\\mu - \\frac{1}{2} \\sigma^2\\right)t + \\sigma W(t) \\right) \\]\n\nTaking",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                "this problem, let's first recall some fundamental definitions and properties of",
            ],
            correspondingSpans: [0],
            index: '3141295820',
            relevanceScore: 207.66479864524047,
            snippets: [
                {
                    correspondingSpanText:
                        "this problem, let's first recall some fundamental definitions and properties of",
                    text: "or critical dates and figures in history.\nDo not include a title or an introduction, simply write the content without headlines and introductory phrases. Do not use images. To tackle this problem, let's first recall some fundamental definitions and properties of equations of curves and lines. This approach does not require knowledge of calculus; instead, we will rely on geometric principles.\n\nAn equation of a curve represents a set of points (x, y",
                },
            ],
            source: 'dolmino',
            textLong:
                "solve the problem yourself. That way we won't repeat your efforts. \u2013\u00a0 vadim123 May 2 '13 at 20:41\nThanks, I updated my post \u2013\u00a0 Steven May 2 '13 at 20:45\nDo you know calculus? \u2013\u00a0 John Marty May 2 '13 at 20:50\nNo sir I do not, I am in PreCalculus. I have looked up the problem and I keep\"\n\nDo not just list concepts, but develop each one in detail before moving to the next, as we prioritize depth of understanding and comprehensive exploration of the subject matter over breadth. Focus on:\n\n- Rigor: Ensure in-depth coverage of the concepts/sections.\n- Engagement: Write with an academic, professional and engaging tone that captivates interest.\n- Application: Incorporate specific, practical examples, such as proofs in calculus or critical dates and figures in history.\nDo not include a title or an introduction, simply write the content without headlines and introductory phrases. Do not use images. To tackle this problem, let's first recall some fundamental definitions and properties of equations of curves and lines. This approach does not require knowledge of calculus; instead, we will rely on geometric principles.\n\nAn equation of a curve represents a set of points (x, y) that satisfy that relationship. Here, our given curve is a parabola defined by the equation x^2 = 2y. A tangent line to a curve is a straight line that intersects the curve at exactly one point, called the point of tangency. Our goal is to determine the equation of the tangent line to the parabola x^2 = 2y at the point (-3, 9/2).\n\nNow, imagine placing an isosceles triangle on top of the point of tangency such that the base lies along the x-axis while the other two sides touch the curve symmetrically. As per the definition of a tangent line, there should exist only one intersection point between the tangent line and the curve. Therefore, when we place our isosceles triangle, both symmetrical arms must gently graze the curve without penetrating inside it. By doing this, we create conditions under which we can derive the slope and eventually the equation of the tang",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['**Determinant**: The determinant of a square matrix'],
            correspondingSpans: [4],
            index: '3139625089',
            relevanceScore: 205.1097384323812,
            snippets: [
                {
                    correspondingSpanText: '**Determinant**: The determinant of a square matrix',
                    text: 'monic polynomial (lead coefficient equals 1) of least degree that annihilates $A$ ($p(A)=0$). It always divides the characteristic polynomial.\n4. **Determinant**: The determinant of a square matrix $A$ measures the scaling factor when applying the corresponding linear transformation represented by $A$ to vectors. If the determinant is nonzero, the mapping is invertible.\n5. **Nil',
                },
            ],
            source: 'dolmino',
            textLong:
                "we will delve into the provided problems and prove theorems step-by-step while providing insightful explanations. This rigorous approach aims to enhance your understanding of these complex topics.\n\nFirstly, let's define a few terms:\n\n1. **Module**: A module is an algebraic structure similar to a vector space but defined over a ring instead of a field. Given a ring $R$ and an abelian group $(M, +)$, $M$ is called a left $R$-module if there exists a scalar multiplication operation $\\cdot : R \\times M \\rightarrow M$ satisfying certain conditions analogous to those satisfied by vector spaces.\n2. **Cayley-Hamilton Theorem**: For any square matrix $A$, the theorem states that $p(A) = 0$, where $p(\\lambda)$ is the characteristic polynomial of $A$.\n3. **Minimal Polynomial**: The minimal polynomial of a square matrix $A$ is the unique monic polynomial (lead coefficient equals 1) of least degree that annihilates $A$ ($p(A)=0$). It always divides the characteristic polynomial.\n4. **Determinant**: The determinant of a square matrix $A$ measures the scaling factor when applying the corresponding linear transformation represented by $A$ to vectors. If the determinant is nonzero, the mapping is invertible.\n5. **Nilpotent Operator**: An operator T is said to be nilpotent if there exists a positive integer k such that T^k=0.\n6. **Diagonalizability**: A square matrix $A$ is diagonalizable if it can be written as $P^{-1}DP$ for some invertible matrix P and a diagonal matrix D. Equivalently, a linear transformation is diagonalizable if it has a basis consisting of eigenvectors.\n7. **Simultaneously Diagonalizable**: Two matrices $A$ and $B$ are simultaneously diagonalizable if they share a common eigenbasis. That is, both operators have bases composed entirely of their respective eigenvectors.\n8. **Eigenvalue**, **Eigenvector**, **Eigenspace**: These terms refer to special scalars ($\\lambda$), vectors ($\\textbf{v}$), and subspaces associated with linear transformations $T$ satisfying $T(\\textbf{v})=\\lambda \\textbf",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['**Determinant**: The determinant of a square matrix'],
            correspondingSpans: [4],
            index: '3140612680',
            relevanceScore: 205.1097384323812,
            snippets: [
                {
                    correspondingSpanText: '**Determinant**: The determinant of a square matrix',
                    text: 'monic polynomial (lead coefficient equals 1) of least degree that annihilates $A$ ($p(A)=0$). It always divides the characteristic polynomial.\n4. **Determinant**: The determinant of a square matrix $A$ measures the scaling factor when applying the corresponding linear transformation represented by $A$ to vectors. If the determinant is nonzero, the mapping is invertible.\n5. **Nil',
                },
            ],
            source: 'dolmino',
            textLong:
                "we will delve into the provided problems and prove theorems step-by-step while providing insightful explanations. This rigorous approach aims to enhance your understanding of these complex topics.\n\nFirstly, let's define a few terms:\n\n1. **Module**: A module is an algebraic structure similar to a vector space but defined over a ring instead of a field. Given a ring $R$ and an abelian group $(M, +)$, $M$ is called a left $R$-module if there exists a scalar multiplication operation $\\cdot : R \\times M \\rightarrow M$ satisfying certain conditions analogous to those satisfied by vector spaces.\n2. **Cayley-Hamilton Theorem**: For any square matrix $A$, the theorem states that $p(A) = 0$, where $p(\\lambda)$ is the characteristic polynomial of $A$.\n3. **Minimal Polynomial**: The minimal polynomial of a square matrix $A$ is the unique monic polynomial (lead coefficient equals 1) of least degree that annihilates $A$ ($p(A)=0$). It always divides the characteristic polynomial.\n4. **Determinant**: The determinant of a square matrix $A$ measures the scaling factor when applying the corresponding linear transformation represented by $A$ to vectors. If the determinant is nonzero, the mapping is invertible.\n5. **Nilpotent Operator**: An operator T is said to be nilpotent if there exists a positive integer k such that T^k=0.\n6. **Diagonalizability**: A square matrix $A$ is diagonalizable if it can be written as $P^{-1}DP$ for some invertible matrix P and a diagonal matrix D. Equivalently, a linear transformation is diagonalizable if it has a basis consisting of eigenvectors.\n7. **Simultaneously Diagonalizable**: Two matrices $A$ and $B$ are simultaneously diagonalizable if they share a common eigenbasis. That is, both operators have bases composed entirely of their respective eigenvectors.\n8. **Eigenvalue**, **Eigenvector**, **Eigenspace**: These terms refer to special scalars ($\\lambda$), vectors ($\\textbf{v}$), and subspaces associated with linear transformations $T$ satisfying $T(\\textbf{v})=\\lambda \\textbf",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '{A}) = \\mathrm{tr}(\\mathbf{',
                '{A}) = \\mathrm{tr}(\\mathbf{A}^{-',
            ],
            correspondingSpans: [10],
            index: '2956831572',
            relevanceScore: 202.9642367369213,
            snippets: [
                {
                    correspondingSpanText: '{A}) = \\mathrm{tr}(\\mathbf{',
                    text: 'A}:\\bold{B} = \\sum_i\\sum_j A_{ij}B_{ij} = \\mathrm{tr}(\\mathbf{B}^\\mathrm{T} \\mathbf{A}) = \\mathrm{tr}(\\mathbf{A} \\mathbf{B}^\\mathrm{T}) = \\mathrm{tr}(\\mathbf{A}^\\mathrm{T} \\mathbf{B}) = \\mathrm{tr}(\\mathbf{B}',
                },
                {
                    correspondingSpanText: '{A}) = \\mathrm{tr}(\\mathbf{',
                    text: ':\\bold{B} = \\sum_i\\sum_j A_{ij}\\overline{B_{ij}} = \\mathrm{tr}(\\mathbf{B}^\\mathrm{H} \\mathbf{A}) = \\mathrm{tr}(\\mathbf{A} \\mathbf{B}^\\mathrm{H}).$\n$\\bold{A}:\\bold{B} = \\sum_i\\sum_j A_{ij}B_{ij}',
                },
            ],
            source: 'open-web-math',
            textLong:
                '(x) and \u03c7(x), by analogy with the complex inner product above, gives[1]\n\n$\\langle \\psi , \\chi \\rangle = \\int_a^b \\psi(x)\\overline{\\chi(x)}dx.$\n\n### Weight function\n\nInner products can have a weight function, i.e. a function which weight each term of the inner product with a value.\n\nMatrices have the Frobenius inner product, which is analogous to the vector inner product. It is defined as the sum of the products of the corresponding components of two matrices A and B having the same size:\n\n$\\bold{A}:\\bold{B} = \\sum_i\\sum_j A_{ij}\\overline{B_{ij}} = \\mathrm{tr}(\\mathbf{B}^\\mathrm{H} \\mathbf{A}) = \\mathrm{tr}(\\mathbf{A} \\mathbf{B}^\\mathrm{H}).$\n$\\bold{A}:\\bold{B} = \\sum_i\\sum_j A_{ij}B_{ij} = \\mathrm{tr}(\\mathbf{B}^\\mathrm{T} \\mathbf{A}) = \\mathrm{tr}(\\mathbf{A} \\mathbf{B}^\\mathrm{T}) = \\mathrm{tr}(\\mathbf{A}^\\mathrm{T} \\mathbf{B}) = \\mathrm{tr}(\\mathbf{B} \\mathbf{A}^\\mathrm{T}) .$ (For real matrices)\n\n### Tensors\n\nThe inner product between a tensor of order n and a tensor of order m is a tensor of order n + m \u2212 2, see tensor contraction for details.',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['- \\( \\frac{\\partial^2 f}{\\partial'],
            correspondingSpans: [35],
            index: '3159682886',
            relevanceScore: 199.77215397307003,
            snippets: [
                {
                    correspondingSpanText: '- \\( \\frac{\\partial^2 f}{\\partial',
                    text: 'sigma S \\, dW(t).\n\\]\n\nCalculating the derivatives:\n- \\( \\frac{\\partial f}{\\partial S} = \\frac{1}{S} \\),\n- \\( \\frac{\\partial^2 f}{\\partial S^2} = -\\frac{1}{S^2} \\),\n- \\( \\frac{\\partial f}{\\partial t} = 0 \\).\n\nSubstituting into',
                },
            ],
            source: 'dolmino',
            textLong:
                "t) \\):\n\n\\[ dS(t) = \\mu S(t) \\, dt + \\sigma S(t) \\, dW(t). \\]\n\nSince the portfolio is fully invested in the stock, the portfolio value \\( V(t) = S(t) \\). We want to find \\( E[\\log V(T)] = E[\\log S(T)] \\).\n\n**Applying It\u00f4's Lemma:**\n\nFor a function \\( f(S(t), t) = \\log S(t) \\), It\u00f4's Lemma gives:\n\n\\[\ndf = \\left(\\frac{\\partial f}{\\partial S} \\cdot \\mu S + \\frac{\\partial f}{\\partial t} + \\frac{1}{2} \\frac{\\partial^2 f}{\\partial S^2} \\cdot \\sigma^2 S^2 \\right) dt + \\frac{\\partial f}{\\partial S} \\cdot \\sigma S \\, dW(t).\n\\]\n\nCalculating the derivatives:\n- \\( \\frac{\\partial f}{\\partial S} = \\frac{1}{S} \\),\n- \\( \\frac{\\partial^2 f}{\\partial S^2} = -\\frac{1}{S^2} \\),\n- \\( \\frac{\\partial f}{\\partial t} = 0 \\).\n\nSubstituting into It\u00f4's Lemma:\n\n\\[\nd(\\log S(t)) = \\left(\\frac{1}{S} \\cdot \\mu S + \\frac{1}{2} \\left(-\\frac{1}{S^2}\\right) \\sigma^2 S^2 \\right) dt + \\frac{1}{S} \\cdot \\sigma S \\, dW(t).\n\\]\n\nSimplifying:\n\n\\[\nd(\\log S(t)) = \\left(\\mu - \\frac{1}{2} \\sigma^2\\right) dt + \\sigma \\, dW(t).\n\\]\n\nIntegrating from \\( t = 0 \\) to \\( t = T \\):\n\n\\[\n\\log S(T) = \\log S(0) + \\left(\\mu - \\frac{1}{2} \\sigma^2\\right) T + \\sigma W(T).\n\\]\n\nTaking expectation, \\(",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['- \\( \\frac{\\partial^2 f}{\\partial'],
            correspondingSpans: [35],
            index: '3163356554',
            relevanceScore: 199.77215397307003,
            snippets: [
                {
                    correspondingSpanText: '- \\( \\frac{\\partial^2 f}{\\partial',
                    text: 'sigma S \\, dW(t).\n\\]\n\nCalculating the derivatives:\n- \\( \\frac{\\partial f}{\\partial S} = \\frac{1}{S} \\),\n- \\( \\frac{\\partial^2 f}{\\partial S^2} = -\\frac{1}{S^2} \\),\n- \\( \\frac{\\partial f}{\\partial t} = 0 \\).\n\nSubstituting into',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                "t) \\):\n\n\\[ dS(t) = \\mu S(t) \\, dt + \\sigma S(t) \\, dW(t). \\]\n\nSince the portfolio is fully invested in the stock, the portfolio value \\( V(t) = S(t) \\). We want to find \\( E[\\log V(T)] = E[\\log S(T)] \\).\n\n**Applying It\u00f4's Lemma:**\n\nFor a function \\( f(S(t), t) = \\log S(t) \\), It\u00f4's Lemma gives:\n\n\\[\ndf = \\left(\\frac{\\partial f}{\\partial S} \\cdot \\mu S + \\frac{\\partial f}{\\partial t} + \\frac{1}{2} \\frac{\\partial^2 f}{\\partial S^2} \\cdot \\sigma^2 S^2 \\right) dt + \\frac{\\partial f}{\\partial S} \\cdot \\sigma S \\, dW(t).\n\\]\n\nCalculating the derivatives:\n- \\( \\frac{\\partial f}{\\partial S} = \\frac{1}{S} \\),\n- \\( \\frac{\\partial^2 f}{\\partial S^2} = -\\frac{1}{S^2} \\),\n- \\( \\frac{\\partial f}{\\partial t} = 0 \\).\n\nSubstituting into It\u00f4's Lemma:\n\n\\[\nd(\\log S(t)) = \\left(\\frac{1}{S} \\cdot \\mu S + \\frac{1}{2} \\left(-\\frac{1}{S^2}\\right) \\sigma^2 S^2 \\right) dt + \\frac{1}{S} \\cdot \\sigma S \\, dW(t).\n\\]\n\nSimplifying:\n\n\\[\nd(\\log S(t)) = \\left(\\mu - \\frac{1}{2} \\sigma^2\\right) dt + \\sigma \\, dW(t).\n\\]\n\nIntegrating from \\( t = 0 \\) to \\( t = T \\):\n\n\\[\n\\log S(T) = \\log S(0) + \\left(\\mu - \\frac{1}{2} \\sigma^2\\right) T + \\sigma W(T).\n\\]\n\nTaking expectation, \\(",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['} \\cdot \\mathbf{A}^{-1} ='],
            correspondingSpans: [32],
            index: '3142360885',
            relevanceScore: 198.69063339439538,
            snippets: [
                {
                    correspondingSpanText: '} \\cdot \\mathbf{A}^{-1} =',
                    text: '-4 & 0 & -3 \\end{pmatrix}\\]\n\nFinally, we can find $\\mathbf{M}$:\n\\[\\mathbf{M} = \\mathbf{I} \\cdot \\mathbf{A}^{-1} = \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} \\cdot \\begin',
                },
            ],
            source: 'dolmino',
            textLong:
                '0 & -0 & 0 \\\\ 0 & 5 & -3 \\end{pmatrix}\\]\n\nThe adjugate of $\\mathbf{A}$ is the transpose of the cofactor matrix:\n\\[\\text{adj}(\\mathbf{A}) = \\begin{pmatrix} -7 & 0 & 0 \\\\ 0 & -0 & 5 \\\\ -4 & 0 & -3 \\end{pmatrix}\\]\n\nNow, we can find $\\mathbf{A}^{-1}$:\n\\[\\mathbf{A}^{-1} = \\frac{1}{\\text{det}(\\mathbf{A})} \\text{adj}(\\mathbf{A}) = \\frac{1}{1} \\begin{pmatrix} -7 & 0 & 0 \\\\ 0 & -0 & 5 \\\\ -4 & 0 & -3 \\end{pmatrix} = \\begin{pmatrix} -7 & 0 & 0 \\\\ 0 & 0 & 5 \\\\ -4 & 0 & -3 \\end{pmatrix}\\]\n\nFinally, we can find $\\mathbf{M}$:\n\\[\\mathbf{M} = \\mathbf{I} \\cdot \\mathbf{A}^{-1} = \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} \\cdot \\begin{pmatrix} -7 & 0 & 0 \\\\ 0 & 0 & 5 \\\\ -4 & 0 & -3 \\end{pmatrix} = \\begin{pmatrix} -7 & 0 & 0 \\\\ 0 & 0 & 5 \\\\ -4 & 0 & -3 \\end{pmatrix}\\]\n\nTherefore, the value of the unknown variable $x$ is 0.\nThe answer is: 0',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '-order derivative \\( \\frac{\\partial^2',
                '-order derivative \\( \\frac{\\partial^2 g}{\\partial',
            ],
            correspondingSpans: [17, 29],
            index: '85404658',
            relevanceScore: 198.0927253933827,
            snippets: [
                {
                    correspondingSpanText: '-order derivative \\( \\frac{\\partial^2',
                    text: '}\\left(\\mathrm{x},\\upsigma \\right)\\end{array}\\right] $$\n\nIn (6), Lxx(x,\u2009\u03c3) is the convolution of the Gaussian second-order derivative \\( \\frac{\\partial^2}{\\partial {x}^2}g\\left(\\sigma \\right) \\) with the image I in point x; Lxy(x,\u2009\u03c3) and Lyy(x,\u2009\u03c3',
                },
            ],
            source: 'dclm-hero-run-fasttext_for_HF',
            textLong:
                'image. c E channel image\n\n\nSURF is a robust local feature point detection and description algorithm [31] that includes the construction of a Hessian matrix and scale space, the location of feature points, assignment of the main direction of feature points and the generation of feature descriptors. The Hessian matrix is the core of the SURF algorithm.\n\nGiven a point x\u2009=\u2009(x,\u2009y) in an image I, the Hessian matrix \\( \\mathcal{H}\\left(\\mathrm{x},\\upsigma \\right) \\) in x at scale \u03c3 is defined as follows:\n$$ \\mathcal{H}\\left(\\mathrm{x},\\upsigma \\right)=\\left[\\begin{array}{cc}{L}_{xx}\\left(\\mathrm{x},\\upsigma \\right)& {L}_{xy}\\left(\\mathrm{x},\\upsigma \\right)\\\\ {}{L}_{xy}\\left(\\mathrm{x},\\upsigma \\right)& {L}_{yy}\\left(\\mathrm{x},\\upsigma \\right)\\end{array}\\right] $$\n\nIn (6), Lxx(x,\u2009\u03c3) is the convolution of the Gaussian second-order derivative \\( \\frac{\\partial^2}{\\partial {x}^2}g\\left(\\sigma \\right) \\) with the image I in point x; Lxy(x,\u2009\u03c3) and Lyy(x,\u2009\u03c3) are derived in a similar manner.\n\nIn the main direction, a square region round the feature point is split up regularly into smaller 4\u00d74 square sub-regions. For each sub-region, we compute Haar wavelet responses at 5\u00d75 regularly spaced sample points. Each sub-region has a four-dimensional descriptor vector V, V\u2009=\u2009(\u2211dx,\u2009\u2211dy,\u2009\u2009\u2211\u2009|\u2009dx|\u2009,\u2009\u2009\u2211\u2009|\u2009dy|\u2009), which represents the sum of the responses in the horizontal and vertical directions and the sum of the absolute values of the responses in the horizontal and vertical directions, resulting in 64 features. The 64 features of multiple interest points of each image are summed so that each image has SURF features with the same dimension.\n\n\nGLCM [32] is often used to represent image texture features. A GLCM is a matrix in which the number of rows and columns is equal to',

            url: 'https://link.springer.com/article/10.1007%2Fs11042-019-7468-9',
            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['{A}) = \\mathrm{tr}(\\mathbf{'],
            correspondingSpans: [10],
            index: '2951157854',
            relevanceScore: 197.91770129389926,
            snippets: [
                {
                    correspondingSpanText: '{A}) = \\mathrm{tr}(\\mathbf{',
                    text: 'gence of Equation \\eqref{eq:kl-divergence} as follows:\n\\begin{equation}\n\tl_\\mathrm{GMRF}(\\mathbf{E}, \\mathbf{A}) = \\mathrm{tr}(\\mathbf{E}^\\top \\mathbf{K} \\mathbf{E}) - \\alpha \\log|\\mathbf{I} + \\beta^{-1}\\mathbf{E}^\\top \\mathbf{E}|,',
                },
            ],
            source: 'arxiv',
            textLong:
                '\n\\begin{lemma}\n\tLet $\\mathbf{K} \\in \\mathbb{R}^{n \\times n}$, $\\mathbf{E} \\in \\mathbb{R}^{n \\times d}$, and $\\Sigma = \\beta \\mathbf{I} + \\mathbf{E} \\mathbf{E}^\\top$.\n\tThen, $\\mathrm{tr}(\\mathbf{K} \\Sigma) = \\mathrm{tr}(\\mathbf{E}^\\top \\mathbf{K} \\mathbf{E}) + C$, where $C$ is a constant unrelated to $E$.\n\\label{lemma:equivalence}\n\\end{lemma}\n\n\\begin{proof}\n\t\\vspace{-1mm}\n\tSee Appendix \\ref{appendix:proof-equivalence}.\n\t\\vspace{-1mm}\n\\end{proof}\n\nThen, we propose our regularizer function used in Algorithm \\ref{alg:overview} by rewriting the KL divergence of Equation \\eqref{eq:kl-divergence} as follows:\n\\begin{equation}\n\tl_\\mathrm{GMRF}(\\mathbf{E}, \\mathbf{A}) = \\mathrm{tr}(\\mathbf{E}^\\top \\mathbf{K} \\mathbf{E}) - \\alpha \\log|\\mathbf{I} + \\beta^{-1}\\mathbf{E}^\\top \\mathbf{E}|,\n\\label{eq:kl-divergence-2}\n\\end{equation}\nwhere $\\alpha > 0$ is a hyperparameter that controls the effect of the log determinant term.\nWe set $\\alpha = 1/2$ is all of our experiments. \n\nThe first term of $l_\\mathrm{GMRF}$ is called the graph Laplacian regularizer and has been widely used in graph learning \\cite{Ando06, Pang2017}.\nIts minimization makes adjacent nodes have similar representations in $\\mathbf{E}$, and the symmetric normalization of $\\mathbf{K}$ alleviates the effect of node degrees in the regularization.\nThe second term of $l_\\mathrm{GMRF}$ can be considered as measuring the amount of space occupied by $\\mathbf{E}$.\nIn other words, its maximization makes $\\mathbf{e}_1, \\cdots, \\mathbf{e}_n$ distributed sparsely',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\( \\frac{\\partial^2 f}{\\partial',
                ' \\) and \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
            ],
            correspondingSpans: [6, 9],
            index: '3163253106',
            relevanceScore: 196.474587273633,
            snippets: [
                {
                    correspondingSpanText: '\\( \\frac{\\partial^2 f}{\\partial',
                    text: '[ \\frac{\\partial^2 f}{\\partial z^2} = 2c \\]\n\n4. \\( \\frac{\\partial^2 f}{\\partial x \\partial y} \\) and \\( \\frac{\\partial^2 f}{\\partial y \\partial x} \\):\n\\[ \\frac{\\partial^2 f}{\\partial x \\partial y} = d \\]\n\\[ \\frac{\\partial^2 f}{\\partial y',
                },
                {
                    correspondingSpanText: '\\) and \\( \\frac{\\partial^2 f}{\\partial',
                    text: '\\]\n\\[ \\frac{\\partial^2 f}{\\partial y \\partial x} = d \\]\n\n5. \\( \\frac{\\partial^2 f}{\\partial x \\partial z} \\) and \\( \\frac{\\partial^2 f}{\\partial z \\partial x} \\):\n\\[ \\frac{\\partial^2 f}{\\partial x \\partial z} = e \\]\n\\[ \\frac{\\partial^2 f}{\\partial z',
                },
                {
                    correspondingSpanText: '\\) and \\( \\frac{\\partial^2 f}{\\partial',
                    text: '\n\\[ \\frac{\\partial^2 f}{\\partial z^2} = 2c \\]\n\n4. \\( \\frac{\\partial^2 f}{\\partial x \\partial y} \\) and \\( \\frac{\\partial^2 f}{\\partial y \\partial x} \\):\n\\[ \\frac{\\partial^2 f}{\\partial x \\partial y} = d \\]\n\\[ \\frac{\\partial^2 f}{\\partial y',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                'cz + ex + fy \\]\n\nThus, the gradient vector \\( \\nabla f \\) is:\n\\[ \\nabla f = \\left( \\begin{array}{c}\n2ax + dy + ez \\\\\n2by + dx + fz \\\\\n2cz + ex + fy \\\\\n\\end{array} \\right) \\]\n\n#### Hessian Matrix \\( H \\)\n\nThe Hessian matrix \\( H \\) consists of the second partial derivatives of \\( f \\):\n\n1. \\( \\frac{\\partial^2 f}{\\partial x^2} \\):\n\\[ \\frac{\\partial^2 f}{\\partial x^2} = 2a \\]\n\n2. \\( \\frac{\\partial^2 f}{\\partial y^2} \\):\n\\[ \\frac{\\partial^2 f}{\\partial y^2} = 2b \\]\n\n3. \\( \\frac{\\partial^2 f}{\\partial z^2} \\):\n\\[ \\frac{\\partial^2 f}{\\partial z^2} = 2c \\]\n\n4. \\( \\frac{\\partial^2 f}{\\partial x \\partial y} \\) and \\( \\frac{\\partial^2 f}{\\partial y \\partial x} \\):\n\\[ \\frac{\\partial^2 f}{\\partial x \\partial y} = d \\]\n\\[ \\frac{\\partial^2 f}{\\partial y \\partial x} = d \\]\n\n5. \\( \\frac{\\partial^2 f}{\\partial x \\partial z} \\) and \\( \\frac{\\partial^2 f}{\\partial z \\partial x} \\):\n\\[ \\frac{\\partial^2 f}{\\partial x \\partial z} = e \\]\n\\[ \\frac{\\partial^2 f}{\\partial z \\partial x} = e \\]\n\n6. \\( \\frac{\\partial^2 f}{\\partial y \\partial z} \\) and \\( \\frac{\\partial^2 f}{\\partial z \\partial y} \\):\n\\[ \\frac{\\partial^2 f}{\\partial y \\partial z} = f \\]\n\\[ \\frac{\\partial^2 f}{\\partial z \\partial y} = f \\]\n\nThus, the Hessian matrix \\( H \\) is:\n\\[ H = \\left( \\begin{array}{ccc}\n2a & d & e \\\\\nd & 2b & f \\\\',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '{A}) = \\mathrm{tr}(\\mathbf{',
                '{A}) = \\mathrm{tr}(\\mathbf{A}^{-',
            ],
            correspondingSpans: [10],
            index: '2950928723',
            relevanceScore: 195.29067629027486,
            snippets: [
                {
                    correspondingSpanText: '{A}) = \\mathrm{tr}(\\mathbf{',
                    text: '14sparse}\n\\begin{align*}\ns(\\mathbf{A})= \\sum_{i \\neq j} A_{ij} = N - \\mathrm{tr}(\\mathbf{A}) = \\mathrm{tr}(\\mathbf{I}_N - \\mathbf{A}) = \\mathrm{tr}(\\mathbf{L}).\n\\end{align*}\nThe optimization problem \\eqref{eq:g_s_optimization',
                },
                {
                    correspondingSpanText: '{A}) = \\mathrm{tr}(\\mathbf{',
                    text: '})= \\sum_{i \\neq j} A_{ij} = N - \\mathrm{tr}(\\mathbf{A}) = \\mathrm{tr}(\\mathbf{I}_N - \\mathbf{A}) = \\mathrm{tr}(\\mathbf{L}).\n\\end{align*}\nThe optimization problem \\eqref{eq:g_s_optimization} then becomes \\cite{gnecco2014sparse}:\n',
                },
            ],
            source: 'arxiv',
            textLong:
                "0,1,2,\\dots ,\n\\end{align*}\nwhere $A_{ij} \\geq 0$ and $x_j(t)$ denotes the value at the $j$'th node at the $t$'th iteration. The iterations converge to the mean as $t \\to \\infty$ when $\\mathbf{A1 = 1}$ and $\\mu(\\mathbf{A}) = \\max\\{ \\lambda_2(\\mathbf{A}),-\\lambda_N(\\mathbf{A})\\} < 1$ \\cite{boyd2004fastest}. Smaller $\\mu(\\mathbf{A})$ leads to faster (worst case) convergence. \n\n\nIn some scenarios, for example when the number of communication links is limited, it is desirable to obtain a sparse graph \\cite{gnecco2014sparse,lin2012identification}. \nThis can be done by setting \\cite{gnecco2014sparse}\n\\begin{align*}\ns(\\mathbf{A})= \\sum_{i \\neq j} A_{ij} = N - \\mathrm{tr}(\\mathbf{A}) = \\mathrm{tr}(\\mathbf{I}_N - \\mathbf{A}) = \\mathrm{tr}(\\mathbf{L}).\n\\end{align*}\nThe optimization problem \\eqref{eq:g_s_optimization} then becomes \\cite{gnecco2014sparse}:\n\\begin{align}\n\\label{eq:consensus_optimization}\n\\begin{aligned}\n\\min & \\,\\, \\mu(\\mathbf{A}) + \\eta \\mathrm{tr}(\\mathbf{I}_N - \\mathbf{A}),\\\\\n\\text{subject to} & \\,\\, \\mathbf{A1 = 1}, \\,\\, \\mathbf{A} \\geq \\mathbf{0},\\,\\, \\mathbf{A^\\top = A}\\\\\n& \\,\\, A_{kl} = 0 \\text{, for all } (k,l) \\notin \\mathcal{E}.\n\\end{aligned}\n\\end{align}\nThe optimization problem \\eqref{eq:consensus_optimization} does not ensure that the graph is connected. In fact, we now prove that the solution to \\eqref{eq:consensus_optimization} is guaranteed to be disconnected for",

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                "this problem, let's first recall some fundamental definitions and properties of",
            ],
            correspondingSpans: [0],
            index: '3141599850',
            relevanceScore: 190.4270086696662,
            snippets: [
                {
                    correspondingSpanText:
                        "this problem, let's first recall some fundamental definitions and properties of",
                    text: "or critical dates and figures in history.\nDo not include a title or an introduction, simply write the content without headlines and introductory phrases. Do not use images. To tackle this problem, let's first recall some fundamental definitions and properties of vectors and parallelograms. This will help us build a solid foundation to solve our main problem.\n\n1. Vectors and their operations: A vector is a mathematical entity possessing",
                },
            ],
            source: 'dolmino',
            textLong:
                'of a parallelogram are given. Find the unit vector parallel to its diagonal. Also, find its area.\n\nThe two adjacent sides of a parallelogram are\n$$2\\overrightarrow{i} \u2212 4\\overrightarrow{j}+ 5\\overrightarrow{k}$$ and\n$$\\overrightarrow{i}i \u2212 2\\overrightarrow{j} \u2212 3\\overrightarrow{k}$$\nFind the unit vector parallel to its diagonal. Also, find its area."\n\nDo not just list concepts, but develop each one in detail before moving to the next, as we prioritize depth of understanding and comprehensive exploration of the subject matter over breadth. Focus on:\n\n- Rigor: Ensure in-depth coverage of the concepts/sections.\n- Engagement: Write with an academic, professional and engaging tone that captivates interest.\n- Application: Incorporate specific, practical examples, such as proofs in calculus or critical dates and figures in history.\nDo not include a title or an introduction, simply write the content without headlines and introductory phrases. Do not use images. To tackle this problem, let\'s first recall some fundamental definitions and properties of vectors and parallelograms. This will help us build a solid foundation to solve our main problem.\n\n1. Vectors and their operations: A vector is a mathematical entity possessing both magnitude (length) and direction. Given two vectors $\\vec{a}=a_1\\hat{i}+a_2\\hat{j}+a_3\\hat{k}$ and $\\vec{b}=b_1\\hat{i}+b_2\\hat{j}+b_3\\hat{k}$, their sum is defined as $\\vec{a}+\\vec{b}=\\left(a_1+b_1\\right)\\hat{i}+\\left(a_2+b_2\\right)\\hat{j}+\\left(a_3+b_3\\right)\\hat{k}$. Additionally, the scalar multiplication of a vector by a real number $c$, denoted by $c\\vec{a}$, results in a new vector whose components are $ca_1, ca_2,$ and $ca_3$. The norm or length of a vector $\\vec{a}$ can be calculated using $||\\vec{a}||=\\sqrt{{a_1}^2',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['{A}^{-1} \\cdot \\mathbf{A}^{-1'],
            correspondingSpans: [32],
            index: '3142195973',
            relevanceScore: 189.68152781340694,
            snippets: [
                {
                    correspondingSpanText: '{A}^{-1} \\cdot \\mathbf{A}^{-1',
                    text: '1 & 2 \\end{pmatrix}$.\nThen $(\\mathbf{A}^2)^{-1} = (\\mathbf{A} \\cdot \\mathbf{A})^{-1} = \\mathbf{A}^{-1} \\cdot \\mathbf{A}^{-1}$\nby the property of inverses.\nSubstituting the given value of $\\mathbf{A}^{-1}$, we have \\[\n(\\mathbf{A}^2)^{-1} =',
                },
            ],
            source: 'dolmino',
            textLong:
                'If $\\mathbf{A}^{-1} = \\begin{pmatrix} 2 & 5 \\\\ -1 & -3 \\end{pmatrix},$ then find the inverse of $\\mathbf{A}^2.$\nWe know that $(\\mathbf{A}^{-1})^{-1} = \\mathbf{A}$.\nSince $\\mathbf{A}^{-1} = \\begin{pmatrix} 2 & 5 \\\\ -1 & -3 \\end{pmatrix}$,\nwe have $\\mathbf{A} = \\begin{pmatrix} -3 & -5 \\\\ 1 & 2 \\end{pmatrix}$.\nThen $(\\mathbf{A}^2)^{-1} = (\\mathbf{A} \\cdot \\mathbf{A})^{-1} = \\mathbf{A}^{-1} \\cdot \\mathbf{A}^{-1}$\nby the property of inverses.\nSubstituting the given value of $\\mathbf{A}^{-1}$, we have \\[\n(\\mathbf{A}^2)^{-1} = \\begin{pmatrix} 2 & 5 \\\\ -1 & -3 \\end{pmatrix} \\cdot\n\\begin{pmatrix} 2 & 5 \\\\ -1 & -3 \\end{pmatrix} = \\boxed{\\begin{pmatrix} -1 & -5 \\\\ 1 & 4 \\end{pmatrix}}.\n\\] The answer is: \\begin{pmatrix}-1&-5\\1&4\\end{pmatrix}',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                'Compute \\( \\frac{\\partial f}{\\partial',
                ' Compute \\( \\frac{\\partial f}{\\partial \\mathbf{A}}',
                ' Compute \\( \\frac{\\partial g}{\\partial \\mathbf{',
            ],
            correspondingSpans: [8, 22],
            index: '3163386630',
            relevanceScore: 183.74894094202148,
            snippets: [
                {
                    correspondingSpanText: 'Compute \\( \\frac{\\partial f}{\\partial',
                    text: '{\\partial E}{\\partial Q} = \\frac{\\frac{\\partial f}{\\partial Q} g - f \\frac{\\partial g}{\\partial Q}}{g^2} \\]\n\n1. Compute \\( \\frac{\\partial f}{\\partial Q} \\):\n\n\\[ \\frac{\\partial f}{\\partial Q} = 1000V^{0.5} \\cdot 0.3Q^{-0.7',
                },
                {
                    correspondingSpanText: 'Compute \\( \\frac{\\partial f}{\\partial',
                    text: '1000V^{0.5}Q^{0.3} \\) and \\( g(V, Q) = V + 2Q + 5 \\).\n\n1. Compute \\( \\frac{\\partial f}{\\partial V} \\):\n\n\\[ \\frac{\\partial f}{\\partial V} = 1000 \\cdot 0.5V^{-0.5}Q^{0.3',
                },
                {
                    correspondingSpanText: 'Compute \\( \\frac{\\partial g}{\\partial',
                    text: 'V^{0.5} \\cdot 0.3Q^{-0.7} = 300V^{0.5}Q^{-0.7} \\]\n\n2. Compute \\( \\frac{\\partial g}{\\partial Q} \\):\n\n\\[ \\frac{\\partial g}{\\partial Q} = 2 \\]\n\nNow, substitute into the quotient rule:\n\n\\[ \\frac{\\partial',
                },
                {
                    correspondingSpanText: 'Compute \\( \\frac{\\partial g}{\\partial',
                    text: '\\cdot 0.5V^{-0.5}Q^{0.3} = 500V^{-0.5}Q^{0.3} \\]\n\n2. Compute \\( \\frac{\\partial g}{\\partial V} \\):\n\n\\[ \\frac{\\partial g}{\\partial V} = 1 \\]\n\nNow, substitute into the quotient rule:\n\n\\[ \\frac{\\partial',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                '0.3} + 1000V^{-0.5}Q^{1.3} + 2500V^{-0.5}Q^{0.3} - 1000V^{0.5}Q^{0.3}}{(V + 2Q + 5)^2} \\]\n\n\\[ \\frac{\\partial E}{\\partial V} = \\frac{-500V^{0.5}Q^{0.3} + 1000V^{-0.5}Q^{1.3} + 2500V^{-0.5}Q^{0.3}}{(V + 2Q + 5)^2} \\]\n\n#### Finding \\( \\frac{\\partial E}{\\partial Q} \\):\n\nWe use the quotient rule for differentiation, which states for \\( E = \\frac{f(V, Q)}{g(V, Q)} \\):\n\n\\[ \\frac{\\partial E}{\\partial Q} = \\frac{\\frac{\\partial f}{\\partial Q} g - f \\frac{\\partial g}{\\partial Q}}{g^2} \\]\n\n1. Compute \\( \\frac{\\partial f}{\\partial Q} \\):\n\n\\[ \\frac{\\partial f}{\\partial Q} = 1000V^{0.5} \\cdot 0.3Q^{-0.7} = 300V^{0.5}Q^{-0.7} \\]\n\n2. Compute \\( \\frac{\\partial g}{\\partial Q} \\):\n\n\\[ \\frac{\\partial g}{\\partial Q} = 2 \\]\n\nNow, substitute into the quotient rule:\n\n\\[ \\frac{\\partial E}{\\partial Q} = \\frac{(300V^{0.5}Q^{-0.7})(V + 2Q + 5) - (1000V^{0.5}Q^{0.3})(2)}{(V + 2Q + 5)^2} \\]\n\nSimplify the numerator:\n\n\\[ \\frac{\\partial E}{\\partial Q} = \\frac{300V^{0.5}Q^{-0.7}(V + 2Q + 5) - 2000V^{0.5}Q^{0.3}}{(',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                'Compute \\( \\frac{\\partial f}{\\partial',
                ' Compute \\( \\frac{\\partial f}{\\partial \\mathbf{A}}',
                ' Compute \\( \\frac{\\partial g}{\\partial \\mathbf{',
            ],
            correspondingSpans: [8, 22],
            index: '3159795613',
            relevanceScore: 183.74894094202148,
            snippets: [
                {
                    correspondingSpanText: 'Compute \\( \\frac{\\partial f}{\\partial',
                    text: '{\\partial E}{\\partial Q} = \\frac{\\frac{\\partial f}{\\partial Q} g - f \\frac{\\partial g}{\\partial Q}}{g^2} \\]\n\n1. Compute \\( \\frac{\\partial f}{\\partial Q} \\):\n\n\\[ \\frac{\\partial f}{\\partial Q} = 1000V^{0.5} \\cdot 0.3Q^{-0.7',
                },
                {
                    correspondingSpanText: 'Compute \\( \\frac{\\partial f}{\\partial',
                    text: '1000V^{0.5}Q^{0.3} \\) and \\( g(V, Q) = V + 2Q + 5 \\).\n\n1. Compute \\( \\frac{\\partial f}{\\partial V} \\):\n\n\\[ \\frac{\\partial f}{\\partial V} = 1000 \\cdot 0.5V^{-0.5}Q^{0.3',
                },
                {
                    correspondingSpanText: 'Compute \\( \\frac{\\partial g}{\\partial',
                    text: 'V^{0.5} \\cdot 0.3Q^{-0.7} = 300V^{0.5}Q^{-0.7} \\]\n\n2. Compute \\( \\frac{\\partial g}{\\partial Q} \\):\n\n\\[ \\frac{\\partial g}{\\partial Q} = 2 \\]\n\nNow, substitute into the quotient rule:\n\n\\[ \\frac{\\partial',
                },
                {
                    correspondingSpanText: 'Compute \\( \\frac{\\partial g}{\\partial',
                    text: '\\cdot 0.5V^{-0.5}Q^{0.3} = 500V^{-0.5}Q^{0.3} \\]\n\n2. Compute \\( \\frac{\\partial g}{\\partial V} \\):\n\n\\[ \\frac{\\partial g}{\\partial V} = 1 \\]\n\nNow, substitute into the quotient rule:\n\n\\[ \\frac{\\partial',
                },
            ],
            source: 'dolmino',
            textLong:
                '0.3} + 1000V^{-0.5}Q^{1.3} + 2500V^{-0.5}Q^{0.3} - 1000V^{0.5}Q^{0.3}}{(V + 2Q + 5)^2} \\]\n\n\\[ \\frac{\\partial E}{\\partial V} = \\frac{-500V^{0.5}Q^{0.3} + 1000V^{-0.5}Q^{1.3} + 2500V^{-0.5}Q^{0.3}}{(V + 2Q + 5)^2} \\]\n\n#### Finding \\( \\frac{\\partial E}{\\partial Q} \\):\n\nWe use the quotient rule for differentiation, which states for \\( E = \\frac{f(V, Q)}{g(V, Q)} \\):\n\n\\[ \\frac{\\partial E}{\\partial Q} = \\frac{\\frac{\\partial f}{\\partial Q} g - f \\frac{\\partial g}{\\partial Q}}{g^2} \\]\n\n1. Compute \\( \\frac{\\partial f}{\\partial Q} \\):\n\n\\[ \\frac{\\partial f}{\\partial Q} = 1000V^{0.5} \\cdot 0.3Q^{-0.7} = 300V^{0.5}Q^{-0.7} \\]\n\n2. Compute \\( \\frac{\\partial g}{\\partial Q} \\):\n\n\\[ \\frac{\\partial g}{\\partial Q} = 2 \\]\n\nNow, substitute into the quotient rule:\n\n\\[ \\frac{\\partial E}{\\partial Q} = \\frac{(300V^{0.5}Q^{-0.7})(V + 2Q + 5) - (1000V^{0.5}Q^{0.3})(2)}{(V + 2Q + 5)^2} \\]\n\nSimplify the numerator:\n\n\\[ \\frac{\\partial E}{\\partial Q} = \\frac{300V^{0.5}Q^{-0.7}(V + 2Q + 5) - 2000V^{0.5}Q^{0.3}}{(',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\frac{\\partial^2 f}{\\partial \\mathbf{',
                ' \\) and \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
                '-order derivative \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
                '     \\frac{\\partial^2 f}{\\partial \\mathbf{',
                '- \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
            ],
            correspondingSpans: [6, 9, 17, 18, 20, 35],
            index: '3141447689',
            relevanceScore: 183.57817637022094,
            snippets: [
                {
                    correspondingSpanText: '\\frac{\\partial^2 f}{\\partial \\mathbf{',
                    text: "_{ij} \\partial x\\ _{kl}}\\right] = \\left[\\frac{\\partial^2 f}{\\partial x\\_{lk} \\partial y\\_{ji}}\\right] = \\frac{\\partial^2 f}{\\partial \\mathbf{X} \\partial \\mathbf{Y}}.$\n\nNow, let's explore vector-valued functions, specifically those mapping from $M(n,m)$ to $M(p",
                },
            ],
            source: 'dolmino',
            textLong:
                'ms. Thus, we introduce two types of second-order derivatives \u2013 "pure" and "mixed":\n\n* Pure Second Order Derivative: $\\frac{\\partial^2 f}{\\partial \\mathbf{X}^2} := \\left[\\frac{\\partial^2 f}{\\partial x\\_{ij} \\partial x\\_{kl}}\\right],$\n* Mixed Second Order Derivative: $\\frac{\\partial^2 f}{\\partial \\mathbf{Y} \\partial \\mathbf{X}} := \\left[\\frac{\\partial^2 f}{\\partial y\\_{ij} \\partial x\\_{kl}}\\right].$\n\nTo ensure consistency between pure and mixed second-order derivatives, we require equality under interchangeability of their respective indices ($\\mathbf{X}$ and $\\mathbf{Y}$):\n\n$\\frac{\\partial^2 f}{\\partial \\mathbf{Y} \\partial \\mathbf{X}} = \\left[\\frac{\\partial^2 f}{\\partial y\\_{ij} \\partial x\\ _{kl}}\\right] = \\left[\\frac{\\partial^2 f}{\\partial x\\_{lk} \\partial y\\_{ji}}\\right] = \\frac{\\partial^2 f}{\\partial \\mathbf{X} \\partial \\mathbf{Y}}.$\n\nNow, let\'s explore vector-valued functions, specifically those mapping from $M(n,m)$ to $M(p,q)$. Denote such a function as $\\mathbf{F}(\\cdot): M(n,m) \\rightarrow M(p,q)$. As previously mentioned, any matrix can be expressed as a collection of column vectors stacked side-by-side. Therefore, writing out $\\mathbf{F}$ explicitly yields:\n\n$\\mathbf{F}(\\mathbf{X}) = [\\mathbf{f}_1(\\mathbf{X}), \\ldots, \\mathbf{f}_q(\\mathbf{X})],$\n\nwhere each $\\mathbf{f}_i(\\cdot): M(n,m)\\rightarrow M(p,1)$ represents a column vector-valued function. Taking the derivative of $\\mathbf{F}$ leads to the Jacobian matrix, defined as follows:\n\n$\\frac{\\partial \\mathbf{F}}{\\partial \\mathbf{X}} := \\left[\\begin{array}{ccc}\\frac{\\partial \\mathbf{f}_1}{\\partial \\mathbf{X}} & \\cdots & \\frac{\\',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\frac{\\partial^2 f}{\\partial \\mathbf{',
                ' \\) and \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
                '-order derivative \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
                '     \\frac{\\partial^2 f}{\\partial \\mathbf{',
                '- \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
            ],
            correspondingSpans: [6, 9, 17, 18, 20, 35],
            index: '3139534407',
            relevanceScore: 183.57817637022094,
            snippets: [
                {
                    correspondingSpanText: '\\frac{\\partial^2 f}{\\partial \\mathbf{',
                    text: "_{ij} \\partial x\\ _{kl}}\\right] = \\left[\\frac{\\partial^2 f}{\\partial x\\_{lk} \\partial y\\_{ji}}\\right] = \\frac{\\partial^2 f}{\\partial \\mathbf{X} \\partial \\mathbf{Y}}.$\n\nNow, let's explore vector-valued functions, specifically those mapping from $M(n,m)$ to $M(p",
                },
            ],
            source: 'dolmino',
            textLong:
                'ms. Thus, we introduce two types of second-order derivatives \u2013 "pure" and "mixed":\n\n* Pure Second Order Derivative: $\\frac{\\partial^2 f}{\\partial \\mathbf{X}^2} := \\left[\\frac{\\partial^2 f}{\\partial x\\_{ij} \\partial x\\_{kl}}\\right],$\n* Mixed Second Order Derivative: $\\frac{\\partial^2 f}{\\partial \\mathbf{Y} \\partial \\mathbf{X}} := \\left[\\frac{\\partial^2 f}{\\partial y\\_{ij} \\partial x\\_{kl}}\\right].$\n\nTo ensure consistency between pure and mixed second-order derivatives, we require equality under interchangeability of their respective indices ($\\mathbf{X}$ and $\\mathbf{Y}$):\n\n$\\frac{\\partial^2 f}{\\partial \\mathbf{Y} \\partial \\mathbf{X}} = \\left[\\frac{\\partial^2 f}{\\partial y\\_{ij} \\partial x\\ _{kl}}\\right] = \\left[\\frac{\\partial^2 f}{\\partial x\\_{lk} \\partial y\\_{ji}}\\right] = \\frac{\\partial^2 f}{\\partial \\mathbf{X} \\partial \\mathbf{Y}}.$\n\nNow, let\'s explore vector-valued functions, specifically those mapping from $M(n,m)$ to $M(p,q)$. Denote such a function as $\\mathbf{F}(\\cdot): M(n,m) \\rightarrow M(p,q)$. As previously mentioned, any matrix can be expressed as a collection of column vectors stacked side-by-side. Therefore, writing out $\\mathbf{F}$ explicitly yields:\n\n$\\mathbf{F}(\\mathbf{X}) = [\\mathbf{f}_1(\\mathbf{X}), \\ldots, \\mathbf{f}_q(\\mathbf{X})],$\n\nwhere each $\\mathbf{f}_i(\\cdot): M(n,m)\\rightarrow M(p,1)$ represents a column vector-valued function. Taking the derivative of $\\mathbf{F}$ leads to the Jacobian matrix, defined as follows:\n\n$\\frac{\\partial \\mathbf{F}}{\\partial \\mathbf{X}} := \\left[\\begin{array}{ccc}\\frac{\\partial \\mathbf{f}_1}{\\partial \\mathbf{X}} & \\cdots & \\frac{\\',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\( \\frac{\\partial^2 f}{\\partial'],
            correspondingSpans: [6],
            index: '3159733849',
            relevanceScore: 174.6594223462431,
            snippets: [
                {
                    correspondingSpanText: '\\( \\frac{\\partial^2 f}{\\partial',
                    text: 'partial f}{\\partial v}(u, h) \\) for all \\( u \\) in \\([0, l]\\)\n\n#### Continuous Second Partial Derivatives:\n1. \\( \\frac{\\partial^2 f}{\\partial u^2}(0, v) = \\frac{\\partial^2 f}{\\partial u^2}(l, v) \\) for all \\( v \\) in \\([0, h]\\)',
                },
            ],
            source: 'dolmino',
            textLong:
                '(u,v) \\) is continuous and has continuous first and second partial derivatives across the edges.\n\nThe conditions \\( f(u,v) \\) must satisfy at the edges \\( u = 0, u = l, v = 0, v = h \\) are as follows:\n\n#### Continuity:\n1. \\( f(0, v) = f(l, v) \\) for all \\( v \\) in \\([0, h]\\)\n2. \\( f(u, 0) = f(u, h) \\) for all \\( u \\) in \\([0, l]\\)\n\n#### Continuous First Partial Derivatives:\n1. \\( \\frac{\\partial f}{\\partial u}(0, v) = \\frac{\\partial f}{\\partial u}(l, v) \\) for all \\( v \\) in \\([0, h]\\)\n2. \\( \\frac{\\partial f}{\\partial v}(u, 0) = \\frac{\\partial f}{\\partial v}(u, h) \\) for all \\( u \\) in \\([0, l]\\)\n\n#### Continuous Second Partial Derivatives:\n1. \\( \\frac{\\partial^2 f}{\\partial u^2}(0, v) = \\frac{\\partial^2 f}{\\partial u^2}(l, v) \\) for all \\( v \\) in \\([0, h]\\)\n2. \\( \\frac{\\partial^2 f}{\\partial v^2}(u, 0) = \\frac{\\partial^2 f}{\\partial v^2}(u, h) \\) for all \\( u \\) in \\([0, l]\\)\n\n### Final Answer\n\nThe transformation matrices are:\n- \\( \\mathbf{T}_1 = \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} \\)\n- \\( \\mathbf{T}_2 = \\begin{pmatrix} 0 & -1 & l \\\\ 1 & 0 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} \\)\n- \\( \\mathbf{T}_3 = \\begin{pmatrix} -1 & 0 & l \\\\ 0 & -1 & h \\\\ 0 & 0 & 1 \\end{pmatrix} \\)\n- \\( \\mathbf',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\frac{\\partial^2 f}{\\partial \\mathbf{',
                ' \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
                ' \\) and \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
                '-order derivative \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
                '     \\frac{\\partial^2 f}{\\partial \\mathbf{',
                '- \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
            ],
            correspondingSpans: [6, 9, 17, 18, 20, 35],
            index: '2957064757',
            relevanceScore: 172.56188710452784,
            snippets: [
                {
                    correspondingSpanText: '\\frac{\\partial^2 f}{\\partial \\mathbf{',
                    text: '\\frac{d \\mathbf{x}}{d \\mathbf{p}}^T \\frac{\\partial^2 f}{\\partial \\mathbf{p} \\partial \\mathbf{x}} \n + \\frac{\\partial^2 f}{\\partial \\mathbf{p}^2} \\\\\n& + \\sum_i \\frac{\\partial f}{\\partial \\mathbf{x}_i} \\frac{d^2 \\mathbf{x}_i}{d',
                },
                {
                    correspondingSpanText: '\\frac{\\partial^2 f}{\\partial \\mathbf{',
                    text: '} \\partial \\mathbf{p}} \\frac{d \\mathbf{x}}{d \\mathbf{p}} + \\frac{d \\mathbf{x}}{d \\mathbf{p}}^T \\frac{\\partial^2 f}{\\partial \\mathbf{p} \\partial \\mathbf{x}} \n + \\frac{\\partial^2 f}{\\partial \\mathbf{p}^2} \\\\\n& + \\sum_i \\frac{\\partial',
                },
            ],
            source: 'open-web-math',
            textLong:
                'to so called reduced SQP methods when using a particular definition for the Lagrange multipliers; see \\cite{Reyes15Numerical} and our derivations in Appendix \\ref{sec:app}.\n\n\\paragraph{Generalization to Arbitrary Objectives}\nOur construction can be extended to general objectives $f(\\mathbf{x}(\\mathbf{p}),\\mathbf{p})$ for which the Hessian reads\n\\begin{equation}\n\\begin{split}\n\\frac{d^2 f}{d \\mathbf{p}^2} = &\\frac{d \\mathbf{x}}{d \\mathbf{p}}^T \\frac{\\partial^2 f}{\\partial \\mathbf{x}^2} \\frac{d \\mathbf{x}}{d \\mathbf{p}} + \\frac{\\partial^2 f}{\\partial \\mathbf{x} \\partial \\mathbf{p}} \\frac{d \\mathbf{x}}{d \\mathbf{p}} + \\frac{d \\mathbf{x}}{d \\mathbf{p}}^T \\frac{\\partial^2 f}{\\partial \\mathbf{p} \\partial \\mathbf{x}} \n + \\frac{\\partial^2 f}{\\partial \\mathbf{p}^2} \\\\\n& + \\sum_i \\frac{\\partial f}{\\partial \\mathbf{x}_i} \\frac{d^2 \\mathbf{x}_i}{d \\mathbf{p}^2} \\ .\n\\end{split}\n\\label{eq:totalHessian}\n\\end{equation}\nIn particular, when dropping only second-order sensitivities to obtain the Generalized Gauss-Newton approximation \\cite{Zimmermann19Puppetmaster}, our formulation applies directly with blocks defined as $A=\\frac{\\partial^2 f}{\\partial \\mathbf{x}^2}$, $B=\\frac{\\partial^2 f}{\\partial \\mathbf{x} \\partial \\mathbf{p}}$, and $C=\\frac{\\partial^2 f}{\\partial \\mathbf{p}^2}$. The extension to the full-Hessian case and its relation to nonlinear programming is described in Appendix \\ref{sec:app}.\nIt should be noted, however, that neither Generalized Gauss-Newton nor full Newton offer any guarantees on the positive-definiteness of the blocks. In our experiments, the additional',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\frac{\\partial}{\\partial \\mathbf{A}}'],
            correspondingSpans: [31],
            index: '3054973907',
            relevanceScore: 161.19003692099173,
            snippets: [
                {
                    correspondingSpanText: '\\frac{\\partial}{\\partial \\mathbf{A}}',
                    text: 'operatorname{Tr}\\left(\\mathbf{X} \\mathbf{X}^{T}\\right)=2 \\mathbf{X}\n# $$\n# Use this to calculate,\n# $$\n# \\frac{\\partial}{\\partial \\mathbf{A}} \\|A\\|_{F}^2\n# $$\n\n# + [markdown] id="HfqNY8tXseDI"\n# ### Q6 [10 Points',
                },
            ],
            source: 'starcoder',
            textLong:
                '\n# (P3) $(A G)^{T}=A G$\n#\n# (P4) $(G A)^{T}=G A$\n#\n# Furthermore, $A^{+}$ always exists and is unique. \n#\n# Using this Theorem, prove that:\n# $$\n# A^{+}=V D^{+} U^{\\top}\n# $$\n\n# + [markdown] id="EdXr-6bHH1O-"\n# ## 2.10 The Trace Operator\n\n# + [markdown] id="yOklD60FFkaL"\n# ### Q5 [10 Points, S]\n# Another advantage of using Trace operator is having simple derivatives. Consider this matrix derivative,\n# $$\n# \\frac{\\partial}{\\partial \\mathbf{X}} \\operatorname{Tr}\\left(\\mathbf{X}^{T} \\mathbf{X}\\right)=\\frac{\\partial}{\\partial \\mathbf{X}} \\operatorname{Tr}\\left(\\mathbf{X} \\mathbf{X}^{T}\\right)=2 \\mathbf{X}\n# $$\n# Use this to calculate,\n# $$\n# \\frac{\\partial}{\\partial \\mathbf{A}} \\|A\\|_{F}^2\n# $$\n\n# + [markdown] id="HfqNY8tXseDI"\n# ### Q6 [10 Points, M]\n# Let $\\mathbf{v}$ and $\\mathbf{w}$ be two $n \\times 1$ column vectors.\n# Prove that $\\operatorname{Tr}\\left(\\mathbf{v} \\mathbf{w}^{\\mathrm{T}}\\right)=\\mathbf{v}^{\\mathrm{T}} \\mathbf{w}$\n\n# + [markdown] id="X_MUDAQd34aM"\n# ## 2.11 The Determinant\n\n# + [markdown] id="uw7gN6YQ3MAE"\n# ### Q7 [15 Points, H]\n# Show that the products of singular values in $A=U \\Sigma V^{T}$ is equal to the absolute value of the determinant,\n#\n# $$\n# |\\operatorname{det}(A)|=\\prod_{i} \\operatorname{diag}(\\Sigma)_{i}\n# $$\n',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\( \\mathbf{A}^{-1} \\) with'],
            correspondingSpans: [30],
            index: '3162861377',
            relevanceScore: 152.17522413566158,
            snippets: [
                {
                    correspondingSpanText: '\\( \\mathbf{A}^{-1} \\) with',
                    text: '0 & 0 & -1 & 3\n\\end{pmatrix}^{-1}\n\\]\n\nNow, we can find the vector \\( \\mathbf{x} \\) by multiplying \\( \\mathbf{A}^{-1} \\) with \\( \\mathbf{b} \\):\n\n\\[\n\\mathbf{x} = \\mathbf{A}^{-1} \\mathbf{b} = \\frac{1}{48}',
                },
            ],
            source: 'olmo-2-1124-13b-preference-mix',
            textLong:
                'text{det}(\\mathbf{A})} \\begin{pmatrix}\n3 & -1 & 0 & 0 & 0 \\\\\n-1 & 4 & -1 & 0 & 0 \\\\\n0 & -1 & 4 & -1 & 0 \\\\\n0 & 0 & -1 & 4 & -1 \\\\\n0 & 0 & 0 & -1 & 3\n\\end{pmatrix}^{-1}\n\\]\n\nwhere \\( \\text{det}(\\mathbf{A}) = 48 \\). Therefore,\n\n\\[\n\\mathbf{A}^{-1} = \\frac{1}{48} \\begin{pmatrix}\n3 & -1 & 0 & 0 & 0 \\\\\n-1 & 4 & -1 & 0 & 0 \\\\\n0 & -1 & 4 & -1 & 0 \\\\\n0 & 0 & -1 & 4 & -1 \\\\\n0 & 0 & 0 & -1 & 3\n\\end{pmatrix}^{-1}\n\\]\n\nNow, we can find the vector \\( \\mathbf{x} \\) by multiplying \\( \\mathbf{A}^{-1} \\) with \\( \\mathbf{b} \\):\n\n\\[\n\\mathbf{x} = \\mathbf{A}^{-1} \\mathbf{b} = \\frac{1}{48} \\begin{pmatrix}\n3 & -1 & 0 & 0 & 0 \\\\\n-1 & 4 & -1 & 0 & 0 \\\\\n0 & -1 & 4 & -1 & 0 \\\\\n0 & 0 & -1 & 4 & -1 \\\\\n0 & 0 & 0 & -1 & 3\n\\end{pmatrix}^{-1} \\begin{pmatrix}\n2 \\\\\n1 \\\\\n0 \\\\\n1 \\\\\n2\n\\end{pmatrix}\n\\]\n\nAfter calculating the matrix inverse and multiplying it with vector \\( \\mathbf{b} \\), we get:\n\n\\[\n\\mathbf{x} = \\frac{1}{48} \\begin{pmatrix}\n1 \\\\\n-\\frac{3}{4} \\\\\n\\frac{1}{2} \\\\\n\\frac{5}{4} \\\\\n1\n\\end{pmatrix}\n\\]\n\n2. To calculate the',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['{A}^{-T} \\mathbf{A}^{-'],
            correspondingSpans: [14],
            index: '2953725270',
            relevanceScore: 123.8710015174543,
            snippets: [
                {
                    correspondingSpanText: '{A}^{-T} \\mathbf{A}^{-',
                    text: 'frac{n}{2}}} \\sqrt{\\det(\\mathbf{C})}} \\exp \\left\\{-\\frac{1}{2} (\\mathbf{x}-\\mathbf{m})^T\\mathbf{A}^{-T} \\mathbf{A}^{-1}(\\mathbf{x}-\\mathbf{m}) \\right\\}\\\\ &=\\frac{1}{(2\\pi)^{\\large{\\frac{n}{2}}} \\sqrt{\\det(\\mathbf{C})',
                },
            ],
            source: 'arxiv',
            textLong:
                '& (\\textrm{since } C_Z=\\mathbf{I})\\\\ &=\\mathbf{C}. \\end{align} Thus, we have shown that X is a random vector with mean $\\mathbf{m}$ and covariance matrix C. Now we can use Example 6.15 to find the PDF of X. We have \\begin{align} f_{\\mathbf{X}}(\\mathbf{x})&=\\frac{1}{|\\det(\\mathbf{A})|}f_{\\mathbf{Z}}\\big(\\mathbf{A}^{-1}(\\mathbf{x}-\\mathbf{m}) \\big) \\\\ &=\\frac{1}{(2\\pi)^{\\large{\\frac{n}{2}}} |\\det(\\mathbf{A})|} \\exp \\left\\{-\\frac{1}{2} (\\mathbf{A}^{-1}(\\mathbf{x}-\\mathbf{m}))^T(\\mathbf{A}^{-1}(\\mathbf{x}-\\mathbf{m})) \\right\\}\\\\ &=\\frac{1}{(2\\pi)^{\\large{\\frac{n}{2}}} \\sqrt{\\det(\\mathbf{C})}} \\exp \\left\\{-\\frac{1}{2} (\\mathbf{x}-\\mathbf{m})^T\\mathbf{A}^{-T} \\mathbf{A}^{-1}(\\mathbf{x}-\\mathbf{m}) \\right\\}\\\\ &=\\frac{1}{(2\\pi)^{\\large{\\frac{n}{2}}} \\sqrt{\\det(\\mathbf{C})}} \\exp \\left\\{-\\frac{1}{2} (\\mathbf{x}-\\mathbf{m})^T \\mathbf{C}^{-1}(\\mathbf{x}-\\mathbf{m}) \\right\\}. \\end{align}\n\nFor a normal random vector $\\mathbf{X}$ with mean $\\mathbf{m}$ and covariance matrix $\\mathbf{C}$, the PDF is given by \\begin{align}\\label{eq:pdf-normal-vec} f_{\\mathbf{X}}(\\mathbf{x})=\\frac{1}{(2\\pi)^{\\large{\\frac{n}{2}}} \\sqrt{\\det\\textbf{C}}} \\exp \\left\\{-\\frac{1}{2} (\\textbf{x}-\\textbf{m})^T \\mathbf{C}^{-1}(\\textbf{x}-\\textbf{m}) \\right\\} \\hspace{20pt} (6.1) \\end{align}\n\nExample\nLet $X$ and $Y$ be two jointly normal random variables with $',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['{A}) = \\det(\\mathbf{A})'],
            correspondingSpans: [24],
            index: '3142199052',
            relevanceScore: 116.75504239485986,
            snippets: [
                {
                    correspondingSpanText: '{A}) = \\det(\\mathbf{A})',
                    text: ',$ then find $\\det (\\mathbf{A^3}).$\nWe have $\\det (\\mathbf{A^3}) = \\det (\\mathbf{A} \\mathbf{A} \\mathbf{A}) = \\det(\\mathbf{A}) \\det(\\mathbf{A}) \\det(\\mathbf{A}) = \\det(\\mathbf{A})^3 = 5^3 = \\boxed{125}.$\nThe',
                },
            ],
            source: 'dolmino',
            textLong:
                'If $\\det \\mathbf{A} = 5,$ then find $\\det (\\mathbf{A^3}).$\nWe have $\\det (\\mathbf{A^3}) = \\det (\\mathbf{A} \\mathbf{A} \\mathbf{A}) = \\det(\\mathbf{A}) \\det(\\mathbf{A}) \\det(\\mathbf{A}) = \\det(\\mathbf{A})^3 = 5^3 = \\boxed{125}.$\nThe answer is: 125',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['\\( \\frac{\\partial^2 f}{\\partial'],
            correspondingSpans: [6],
            index: '3163368593',
            relevanceScore: 112.918405969133,
            snippets: [
                {
                    correspondingSpanText: '\\( \\frac{\\partial^2 f}{\\partial',
                    text: '^2 + z^2} + \\sec^2(zx) + 2xz \\sec^2(zx) \\tan(zx) \\]\n\n6. \\( \\frac{\\partial^2 f}{\\partial y \\partial z} \\):\n\\[ \\frac{\\partial}{\\partial z} \\left( 2y e^{x^2 + y^2 + z^2} + x',
                },
            ],
            source: 'tulu-3-sft-olmo-2-mixture',
            textLong:
                '(zx) \\tan(zx) \\]\n\n4. \\( \\frac{\\partial^2 f}{\\partial x \\partial y} \\):\n\\[ \\frac{\\partial}{\\partial y} \\left( 2x e^{x^2 + y^2 + z^2} + y \\cos(xy) + z \\sec^2(zx) \\right) \\]\n\\[ = 4xy e^{x^2 + y^2 + z^2} - y^2 x \\sin(xy) + \\cos(xy) \\]\n\n5. \\( \\frac{\\partial^2 f}{\\partial x \\partial z} \\):\n\\[ \\frac{\\partial}{\\partial z} \\left( 2x e^{x^2 + y^2 + z^2} + y \\cos(xy) + z \\sec^2(zx) \\right) \\]\n\\[ = 4xz e^{x^2 + y^2 + z^2} + \\sec^2(zx) + 2xz \\sec^2(zx) \\tan(zx) \\]\n\n6. \\( \\frac{\\partial^2 f}{\\partial y \\partial z} \\):\n\\[ \\frac{\\partial}{\\partial z} \\left( 2y e^{x^2 + y^2 + z^2} + x \\cos(xy) - z \\sin(yz) \\right) \\]\n\\[ = 4yz e^{x^2 + y^2 + z^2} - y^2 z \\cos(yz) - \\sin(yz) \\]\n\nThe Hessian matrix \\( H(x, y, z) \\) is:\n\\[ H(x, y, z) = \\begin{bmatrix}\n\\frac{\\partial^2 f}{\\partial x^2} & \\frac{\\partial^2 f}{\\partial x \\partial y} & \\frac{\\partial^2 f}{\\partial x \\partial z} \\\\\n\\frac{\\partial^2 f}{\\partial y \\partial x} & \\frac{\\partial^2 f}{\\partial y^2} & \\frac{\\partial^2 f}{\\partial y \\partial z} \\\\\n\\frac{\\partial^2 f}{\\partial z \\partial x} & \\frac{\\partial^2 f}{\\partial z \\partial y}',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: [
                '\\frac{\\partial^2 f}{\\partial \\mathbf{',
                ' \\) and \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
                '-order derivative \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
                '     \\frac{\\partial^2 f}{\\partial \\mathbf{',
                '- \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
            ],
            correspondingSpans: [6, 9, 17, 18, 20, 35],
            index: '3055083849',
            relevanceScore: 112.41612884436067,
            snippets: [
                {
                    correspondingSpanText: '\\frac{\\partial^2 f}{\\partial \\mathbf{',
                    text: 'down] tags=["HST"]\n# Write an expression for the Hessian of $f$,\n#\n# $$\n# H_f(\\mathbf{x}) =\n# \\frac{\\partial^2 f}{\\partial \\mathbf{x} \\partial \\mathbf{x}^T} =\n# \\left[\\begin{array}{cc}\n# \\frac{\\partial^2 f}{\\partial x^2} &\n',
                },
            ],
            source: 'starcoder',
            textLong:
                '\n# \\left[\\begin{array}{c}\n# \\frac{\\partial f}{\\partial x} \\\\\n# \\frac{\\partial f}{\\partial y} \\end{array} \\right]\\;.\n# $$\n\n# + [markdown] tags=["ST"]\n# ### Answer\n# -\n\n# $$\n# \\frac{\\partial f}{\\partial x} = 3x^2 - 6x \\\\\n# \\frac{\\partial f}{\\partial y} = 3y^2 - 6y\n# $$\n# Therefore,\n# $$\n# \\nabla f(\\mathbf{x}) = \n# \\left[\\begin{array}{c}\n# 3x^2 - 6x \\\\\n# 3y^2 - 6y \\end{array}\\right]\\;.\n# $$\n\n# + [markdown] tags=["HST"]\n# ### Problem 1.2\n\n# + [markdown] tags=["HST"]\n# Write an expression for the Hessian of $f$,\n#\n# $$\n# H_f(\\mathbf{x}) =\n# \\frac{\\partial^2 f}{\\partial \\mathbf{x} \\partial \\mathbf{x}^T} =\n# \\left[\\begin{array}{cc}\n# \\frac{\\partial^2 f}{\\partial x^2} &\n# \\frac{\\partial^2 f}{\\partial x \\partial y}\\\\\n# \\frac{\\partial^2 f}{\\partial y \\partial x} &\n# \\frac{\\partial^2 f}{\\partial y^2} \\end{array} \\right]\\;.\n# $$\n\n# + [markdown] tags=["ST"]\n# ### Answer\n# -\n\n# $$\n# \\frac{\\partial^2 f}{\\partial x^2} = 6x - 6\\\\\n# \\frac{\\partial^2 f}{\\partial x\\partial y} = 0\\\\\n# \\frac{\\partial^2 f}{\\partial y\\partial x} = 0\\\\\n# \\frac{\\partial^2 f}{\\partial y^2} = 6y - 6\\\\\n# $$\n# Therefore,\n# $$\n# H_f(\\mathbf{x}) = \\left[\\begin{array}{cc}\n# 6x-6 &\n#',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
        {
            correspondingSpanTexts: ['{A}} (\\mathbf{A}^{-1})'],
            correspondingSpans: [33],
            index: '2957066061',
            relevanceScore: 97.91621827470622,
            snippets: [
                {
                    correspondingSpanText: '{A}} (\\mathbf{A}^{-1})',
                    text: 'a(\\xi)&=&\\frac{\\delta S}{\\delta\n\\partial_0 A_a(\\xi)}\n=-\\frac{e^{-\\Phi}}{2}\\sqrt{-\\det\\mathbf{A}} (\\mathbf{A}^{-1})^{[a0]} \\ , a, b =\n1, \\dots, p \\ , \\cr & \\cr \\pi^0(\\xi)&=& \\frac{\\delta S}{\\',
                },
            ],
            source: 'open-web-math',
            textLong:
                '_\\nu - \\partial_\\nu A_\\mu \\ .\n\\end{eqnarray}\nWhere $g_{MN}(X(\\xi)) \\ , b_{MN}(X(\\xi)) \\ , M,N=0,\\dots,9$\n are metric and NS-NS two\nform field that are in general functions of the embedding\ncoordinates $X^M(\\xi)$. Let us now calculate the conjugate momenta\nfrom (\\ref{actL})\n\\begin{eqnarray}\nP_M(\\xi)&=& \\frac{\\delta S}{\\delta \\partial_0 X^M(\\xi)}\n=-\\frac{e^{-\\Phi}} {2}\\sqrt{-\\det\\mathbf{A}}\\partial_\\nu X^N\n\\left(g_{MN}(\\mathbf{A}^{-1})^{(\\nu 0)} +b_{MN}(\\mathbf{A}^{-1})^{[\\nu\n0]}\\right) \\ , \\cr & \\cr \\pi^a(\\xi)&=&\\frac{\\delta S}{\\delta\n\\partial_0 A_a(\\xi)}\n=-\\frac{e^{-\\Phi}}{2}\\sqrt{-\\det\\mathbf{A}} (\\mathbf{A}^{-1})^{[a0]} \\ , a, b =\n1, \\dots, p \\ , \\cr & \\cr \\pi^0(\\xi)&=& \\frac{\\delta S}{\\delta\n\\partial_0 A_0(\\xi)}=\n-\\frac{e^{-\\Phi}}{2} \\left((\\mathbf{A}^{-1})^{00}- (\\mathbf{A}^{-1})^{00}\\right)\n\\sqrt{-\\det\\mathbf{A}}=0 \\ ,\n\\nonumber \\\\\n\\end{eqnarray}\nwhere we have introduced the symmetric and antisymmetric form of\nany (p+1)$\\times$(p+1) matrix ${\\rm A}$ as\n\\begin{equation}\n{\\rm A}^{(\\mu\\nu)}={\\rm A}^{\\mu\\nu}+{\\rm A}^{\\nu\\mu} \\ , {\\rm\nA}^{[\\mu\\nu]}={\\rm A}^{\\mu\\nu}-{\\rm A}^{\\nu\\mu} \\ .\n\\end{equation}\nFor our purpose it is useful to define the conjugate momenta\n$\\Pi_M$ as\n\\begin{equation}\n\\Pi_M=',

            usage: null,
            displayName: null,
            sourceUrl: null,
        },
    ],
    index: 'olmo-2-1124-13b',
    spans: [
        {
            documents: [
                3139855194, 3141603066, 3141599850, 3141551621, 3140235511, 3141278740, 3140898795,
                3139396501, 3139479459, 3139447230, 3141295820, 3139352090,
            ],
            nestedSpans: [
                {
                    documents: [3139855194, 3141603066],
                    startIndex: 0,
                    text: "To approach this problem, let's first recall some fundamental definitions and properties",
                },
                {
                    documents: [
                        3141599850, 3141551621, 3140235511, 3141278740, 3140898795, 3139396501,
                        3139479459, 3139447230, 3141295820, 3139352090,
                    ],
                    startIndex: 2,
                    text: "this problem, let's first recall some fundamental definitions and properties of",
                },
            ],
            startIndex: 0,
            text: "To approach this problem, let's first recall some fundamental definitions and properties of",
        },
        {
            documents: [
                3163246288, 3159768176, 3159764740, 3159721334, 3162868971, 3159799783, 3163247685,
                3162808421, 3163277435, 3159757927, 3163380458, 3159669130,
            ],
            nestedSpans: [
                {
                    documents: [3163246288, 3159768176],
                    startIndex: 84,
                    text: 'a square matrix \\( \\mathbf{A} \\), \\(',
                },
                {
                    documents: [
                        3159764740, 3159721334, 3162868971, 3159799783, 3163247685, 3162808421,
                        3163277435, 3159757927, 3163380458, 3159669130,
                    ],
                    startIndex: 87,
                    text: '\\( \\mathbf{A} \\), \\( \\mathbf{',
                },
            ],
            startIndex: 84,
            text: ' a square matrix \\( \\mathbf{A} \\), \\( \\mathbf{',
        },
        {
            documents: [2956549687, 2949593792, 2955726913],
            nestedSpans: [
                {
                    documents: [2956549687, 2949593792, 2955726913],
                    startIndex: 109,
                    text: '\\mathbf{A} \\mathbf{A}^{-1} = \\mathbf{I}',
                },
            ],
            startIndex: 109,
            text: ' \\mathbf{A} \\mathbf{A}^{-1} = \\mathbf{I}',
        },
        {
            documents: [3163206558],
            nestedSpans: [
                {
                    documents: [3163206558],
                    startIndex: 133,
                    text: '**Transpose**: The transpose of a matrix',
                },
            ],
            startIndex: 133,
            text: ' **Transpose**: The transpose of a matrix',
        },
        {
            documents: [
                3140582719, 3139247817, 3140575208, 3139452663, 3139625089, 3140612680, 3140892006,
                3139548323, 3163246288, 3159768176,
            ],
            nestedSpans: [
                {
                    documents: [
                        3140582719, 3139247817, 3140575208, 3139452663, 3139625089, 3140612680,
                        3140892006, 3139548323,
                    ],
                    startIndex: 177,
                    text: '**Determinant**: The determinant of a square matrix',
                },
                {
                    documents: [3163246288, 3159768176],
                    startIndex: 188,
                    text: 'a square matrix \\( \\mathbf{A} \\),',
                },
            ],
            startIndex: 177,
            text: ' **Determinant**: The determinant of a square matrix \\( \\mathbf{A} \\),',
        },
        {
            documents: [
                2950233806, 2950250684, 2950241447, 2950234654, 3055551485, 3055216540, 3055938160,
            ],
            nestedSpans: [
                {
                    documents: [
                        2950233806, 2950250684, 2950241447, 2950234654, 3055551485, 3055216540,
                        3055938160,
                    ],
                    startIndex: 253,
                    text: '\\frac{\\partial f}{\\partial \\mathbf{A}}',
                },
            ],
            startIndex: 253,
            text: ' \\frac{\\partial f}{\\partial \\mathbf{A}}',
        },
        {
            documents: [
                3163378230, 604306870, 3163368593, 3163253106, 3159702507, 3159733849, 3159779016,
                3159719566, 2510819705, 3159742055, 3055083849, 2957140970, 2957064757, 2951250929,
                3141447689, 3139534407, 2956125906,
            ],
            nestedSpans: [
                {
                    documents: [
                        3163378230, 604306870, 3163368593, 3163253106, 3159702507, 3159733849,
                        3159779016, 3159719566, 2510819705, 3159742055,
                    ],
                    startIndex: 339,
                    text: '\\( \\frac{\\partial^2 f}{\\partial',
                },
                {
                    documents: [
                        3055083849, 2957140970, 2957064757, 2951250929, 2951250929, 3141447689,
                        2951250929, 3139534407, 2957064757, 2956125906,
                    ],
                    startIndex: 340,
                    text: '\\frac{\\partial^2 f}{\\partial \\mathbf{',
                },
            ],
            startIndex: 339,
            text: ' \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
        },
        {
            documents: [3162883237, 3162503913, 3163266946, 3159697586],
            nestedSpans: [
                {
                    documents: [3162883237, 3162883237, 3162503913],
                    startIndex: 363,
                    text: 'the rate of change of \\( f \\) with respect to \\(',
                },
                {
                    documents: [3163266946, 3159697586],
                    startIndex: 367,
                    text: 'of \\( f \\) with respect to \\( \\mathbf{',
                },
            ],
            startIndex: 363,
            text: ' the rate of change of \\( f \\) with respect to \\( \\mathbf{',
        },
        {
            documents: [
                3163313521, 3159683551, 3163386630, 3159795613, 2950233806, 2950250684, 2950241447,
                2950234654, 3055551485, 3055216540, 3055938160,
            ],
            nestedSpans: [
                {
                    documents: [
                        3163313521, 3159683551, 3163386630, 3159795613, 3163313521, 3159683551,
                        3163386630, 3159795613, 3163313521, 3159683551,
                    ],
                    startIndex: 399,
                    text: 'Compute \\( \\frac{\\partial f}{\\partial',
                },
                {
                    documents: [
                        2950233806, 2950250684, 2950241447, 2950234654, 3055551485, 3055216540,
                        3055938160,
                    ],
                    startIndex: 402,
                    text: '\\frac{\\partial f}{\\partial \\mathbf{A}}',
                },
            ],
            startIndex: 399,
            text: ' Compute \\( \\frac{\\partial f}{\\partial \\mathbf{A}}',
        },
        {
            documents: [
                3163253106, 3159702507, 3163375833, 3163289861, 3159742055, 3162924020, 3162905377,
                3055083849, 2957140970, 2957064757, 2951250929, 3141447689, 3139534407, 2956125906,
            ],
            nestedSpans: [
                {
                    documents: [
                        3163253106, 3159702507, 3163375833, 3163289861, 3159742055, 3162924020,
                        3163253106, 3162905377, 3159702507, 3162905377,
                    ],
                    startIndex: 414,
                    text: '\\) and \\( \\frac{\\partial^2 f}{\\partial',
                },
                {
                    documents: [
                        3055083849, 2957140970, 2957064757, 2951250929, 2951250929, 3141447689,
                        2951250929, 3139534407, 2957064757, 2956125906,
                    ],
                    startIndex: 417,
                    text: '\\frac{\\partial^2 f}{\\partial \\mathbf{',
                },
            ],
            startIndex: 414,
            text: ' \\) and \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
        },
        {
            documents: [
                2950928723, 2951409260, 2956831572, 2951157854, 2949239511, 2950826682, 2951463167,
                3162180947, 3140994362,
            ],
            nestedSpans: [
                {
                    documents: [
                        2950928723, 2951409260, 2956831572, 2956831572, 2951157854, 2950928723,
                    ],
                    startIndex: 443,
                    text: '{A}) = \\mathrm{tr}(\\mathbf{',
                },
                {
                    documents: [
                        2949239511, 2949239511, 2950826682, 2951463167, 3162180947, 3140994362,
                        3162180947,
                    ],
                    startIndex: 447,
                    text: '\\mathrm{tr}(\\mathbf{A}^{-',
                },
            ],
            startIndex: 443,
            text: '{A}) = \\mathrm{tr}(\\mathbf{A}^{-',
        },
        {
            documents: [
                3159674938, 3159702507, 3162872703, 3159705239, 3163339100, 2951421201, 3163281826,
                2950233806, 2950250684, 2950241447, 2950234654, 3055551485, 3055216540, 3055938160,
            ],
            nestedSpans: [
                {
                    documents: [
                        3159674938, 3159702507, 3162872703, 3159702507, 3159705239, 3163339100,
                        2951421201, 3159674938, 3163281826,
                    ],
                    startIndex: 475,
                    text: 'derivative \\( \\frac{\\partial f}{\\partial',
                },
                {
                    documents: [
                        2950233806, 2950250684, 2950241447, 2950234654, 3055551485, 3055216540,
                        3055938160,
                    ],
                    startIndex: 477,
                    text: '\\frac{\\partial f}{\\partial \\mathbf{A}}',
                },
            ],
            startIndex: 475,
            text: ' derivative \\( \\frac{\\partial f}{\\partial \\mathbf{A}}',
        },
        {
            documents: [2949239511, 2950826682, 2951463167, 3162180947, 3140994362],
            nestedSpans: [
                {
                    documents: [
                        2949239511, 2949239511, 2950826682, 2951463167, 3162180947, 3140994362,
                        3162180947,
                    ],
                    startIndex: 500,
                    text: '\\mathrm{tr}(\\mathbf{A}^{-',
                },
            ],
            startIndex: 500,
            text: ' \\mathrm{tr}(\\mathbf{A}^{-',
        },
        {
            documents: [2951463167, 2956169109, 3163511811, 3163531477],
            nestedSpans: [
                {
                    documents: [2951463167],
                    startIndex: 533,
                    text: '\\mathrm{tr}(\\mathbf{A}^{-1}',
                },
                {
                    documents: [2956169109, 3163511811, 3163531477, 3163511811, 3163511811],
                    startIndex: 539,
                    text: '{A}^{-1} \\mathbf{A}^{-',
                },
            ],
            startIndex: 533,
            text: ' \\mathrm{tr}(\\mathbf{A}^{-1} \\mathbf{A}^{-',
        },
        {
            documents: [
                2948220685, 2949239511, 2950826682, 2951463167, 3162180947, 3140994362, 2212230827,
                2953725270, 2950983770,
            ],
            nestedSpans: [
                {
                    documents: [2948220685],
                    startIndex: 570,
                    text: '1}) = \\mathrm{tr}(\\mathbf{',
                },
                {
                    documents: [
                        2949239511, 2949239511, 2950826682, 2951463167, 3162180947, 3140994362,
                        3162180947,
                    ],
                    startIndex: 573,
                    text: '\\mathrm{tr}(\\mathbf{A}^{-',
                },
                {
                    documents: [
                        2212230827, 2212230827, 2212230827, 2212230827, 2212230827, 2212230827,
                        2953725270, 2950983770, 2950983770, 2950983770,
                    ],
                    startIndex: 579,
                    text: '{A}^{-T} \\mathbf{A}^{-',
                },
            ],
            startIndex: 570,
            text: '1}) = \\mathrm{tr}(\\mathbf{A}^{-T} \\mathbf{A}^{-',
        },
        {
            documents: [
                3159798745, 2951475889, 2950899765, 3163343661, 2957065543, 3055454185, 2957744856,
                2951463167, 2956169109, 3163511811, 3163531477,
            ],
            nestedSpans: [
                {
                    documents: [
                        3159798745, 2951475889, 2950899765, 3163343661, 2951475889, 2957065543,
                        3163343661, 2951475889, 2951475889, 3159798745,
                    ],
                    startIndex: 617,
                    text: '    \\frac{\\partial}{\\partial \\mathbf{',
                },
                {
                    documents: [3055454185],
                    startIndex: 618,
                    text: '\\frac{\\partial}{\\partial \\mathbf{A}} \\mathrm',
                },
                {
                    documents: [2957744856],
                    startIndex: 626,
                    text: '{A}} \\mathrm{tr}(\\mathbf{',
                },
                {
                    documents: [2951463167],
                    startIndex: 629,
                    text: '\\mathrm{tr}(\\mathbf{A}^{-1}',
                },
                {
                    documents: [2956169109, 3163511811, 3163531477, 3163511811, 3163511811],
                    startIndex: 635,
                    text: '{A}^{-1} \\mathbf{A}^{-',
                },
            ],
            startIndex: 617,
            text: '     \\frac{\\partial}{\\partial \\mathbf{A}} \\mathrm{tr}(\\mathbf{A}^{-1} \\mathbf{A}^{-',
        },
        {
            documents: [2951450144, 3163364944, 3159766779, 3163248023, 3159773493],
            nestedSpans: [
                {
                    documents: [
                        2951450144, 3163364944, 3159766779, 3163248023, 3159773493, 3163364944,
                        3159766779,
                    ],
                    startIndex: 657,
                    text: '1} \\cdot \\frac{\\partial \\mathbf{',
                },
            ],
            startIndex: 657,
            text: '1} \\cdot \\frac{\\partial \\mathbf{',
        },
        {
            documents: [
                85404658, 3163325039, 3159760942, 3055083849, 2957140970, 2957064757, 2951250929,
                3141447689, 3139534407, 2956125906,
            ],
            nestedSpans: [
                {
                    documents: [85404658],
                    startIndex: 722,
                    text: '-order derivative \\( \\frac{\\partial^2',
                },
                {
                    documents: [3163325039, 3159760942, 3163325039, 3159760942],
                    startIndex: 724,
                    text: 'derivative \\( \\frac{\\partial^2 f}{\\partial',
                },
                {
                    documents: [
                        3055083849, 2957140970, 2957064757, 2951250929, 2951250929, 3141447689,
                        2951250929, 3139534407, 2957064757, 2956125906,
                    ],
                    startIndex: 726,
                    text: '\\frac{\\partial^2 f}{\\partial \\mathbf{',
                },
            ],
            startIndex: 722,
            text: '-order derivative \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
        },
        {
            documents: [
                2957111856, 2957063877, 1674400691, 3159719177, 2953275501, 2950948565, 3163287500,
                2948224399, 3163300131, 3054898433, 3055083849, 2957140970, 2957064757, 2951250929,
                3141447689, 3139534407, 2956125906,
            ],
            nestedSpans: [
                {
                    documents: [
                        2957111856, 2957063877, 1674400691, 3159719177, 2953275501, 2950948565,
                        3163287500, 2948224399, 3163300131, 3054898433,
                    ],
                    startIndex: 763,
                    text: '    \\frac{\\partial^2 f}{\\partial',
                },
                {
                    documents: [
                        3055083849, 2957140970, 2957064757, 2951250929, 2951250929, 3141447689,
                        2951250929, 3139534407, 2957064757, 2956125906,
                    ],
                    startIndex: 764,
                    text: '\\frac{\\partial^2 f}{\\partial \\mathbf{',
                },
            ],
            startIndex: 763,
            text: '     \\frac{\\partial^2 f}{\\partial \\mathbf{',
        },
        {
            documents: [2950879694, 3163277635, 3159659718],
            nestedSpans: [
                {
                    documents: [2950879694],
                    startIndex: 778,
                    text: '2} = \\frac{\\partial}{\\partial \\mathbf{',
                },
                {
                    documents: [3163277635, 3159659718],
                    startIndex: 780,
                    text: '= \\frac{\\partial}{\\partial \\mathbf{A}}',
                },
            ],
            startIndex: 778,
            text: '2} = \\frac{\\partial}{\\partial \\mathbf{A}}',
        },
        {
            documents: [
                2957111856, 2957063877, 1674400691, 3159719177, 2953275501, 2950948565, 3163287500,
                2948224399, 3163300131, 3054898433, 3055083849, 2957140970, 2957064757, 2951250929,
                3141447689, 3139534407, 2956125906,
            ],
            nestedSpans: [
                {
                    documents: [
                        2957111856, 2957063877, 1674400691, 3159719177, 2953275501, 2950948565,
                        3163287500, 2948224399, 3163300131, 3054898433,
                    ],
                    startIndex: 875,
                    text: '    \\frac{\\partial^2 f}{\\partial',
                },
                {
                    documents: [
                        3055083849, 2957140970, 2957064757, 2951250929, 2951250929, 3141447689,
                        2951250929, 3139534407, 2957064757, 2956125906,
                    ],
                    startIndex: 876,
                    text: '\\frac{\\partial^2 f}{\\partial \\mathbf{',
                },
            ],
            startIndex: 875,
            text: '     \\frac{\\partial^2 f}{\\partial \\mathbf{',
        },
        {
            documents: [2950879694, 3163277635, 3159659718],
            nestedSpans: [
                {
                    documents: [2950879694],
                    startIndex: 890,
                    text: '2} = \\frac{\\partial}{\\partial \\mathbf{',
                },
                {
                    documents: [3163277635, 3159659718],
                    startIndex: 892,
                    text: '= \\frac{\\partial}{\\partial \\mathbf{A}} \\left(',
                },
            ],
            startIndex: 890,
            text: '2} = \\frac{\\partial}{\\partial \\mathbf{A}} \\left(',
        },
        {
            documents: [3163386630, 3159795613, 3163341706, 3159741519],
            nestedSpans: [
                {
                    documents: [3163386630, 3159795613, 3163386630, 3159795613],
                    startIndex: 985,
                    text: 'Compute \\( \\frac{\\partial g}{\\partial',
                },
                {
                    documents: [3163341706, 3159741519, 3163341706, 3159741519],
                    startIndex: 987,
                    text: '\\( \\frac{\\partial g}{\\partial \\mathbf{',
                },
            ],
            startIndex: 985,
            text: ' Compute \\( \\frac{\\partial g}{\\partial \\mathbf{',
        },
        {
            documents: [
                3163252136, 3159779016, 3163313215, 3139378054, 3159713458, 3159698350, 3163258313,
                3141576421,
            ],
            nestedSpans: [
                {
                    documents: [
                        3163252136, 3159779016, 3163313215, 3139378054, 3159713458, 3159698350,
                        3163258313, 3141576421, 3159698350, 3159713458,
                    ],
                    startIndex: 1002,
                    text: '\\( \\frac{\\partial^2 g}{\\partial',
                },
            ],
            startIndex: 1002,
            text: ' \\( \\frac{\\partial^2 g}{\\partial',
        },
        {
            documents: [2951491635, 2954580394, 2953232468, 3142199052],
            nestedSpans: [
                {
                    documents: [2951491635, 2954580394, 2954580394, 2953232468, 3142199052],
                    startIndex: 1025,
                    text: '{A}) = \\det(\\mathbf{A})',
                },
            ],
            startIndex: 1025,
            text: '{A}) = \\det(\\mathbf{A})',
        },
        {
            documents: [
                2904620294, 273131267, 103323118, 843909836, 826431178, 1906417435, 283872991,
                1760174807, 3492805, 902238976, 3163341706, 3159741519,
            ],
            nestedSpans: [
                {
                    documents: [
                        2904620294, 273131267, 103323118, 843909836, 826431178, 1906417435,
                        283872991, 1760174807, 3492805, 902238976,
                    ],
                    startIndex: 1046,
                    text: 'derivative \\( \\frac{\\partial g}{\\partial',
                },
                {
                    documents: [3163341706, 3159741519, 3163341706, 3159741519],
                    startIndex: 1047,
                    text: '\\( \\frac{\\partial g}{\\partial \\mathbf{',
                },
            ],
            startIndex: 1046,
            text: ' derivative \\( \\frac{\\partial g}{\\partial \\mathbf{',
        },
        {
            documents: [3163350958, 3159703933],
            nestedSpans: [
                {
                    documents: [3163350958, 3159703933],
                    startIndex: 1071,
                    text: '\\( \\det(\\mathbf{A}) \\)',
                },
            ],
            startIndex: 1071,
            text: ' \\( \\det(\\mathbf{A}) \\)',
        },
        {
            documents: [3163350958, 3159703933],
            nestedSpans: [
                {
                    documents: [3163350958, 3159703933],
                    startIndex: 1098,
                    text: '\\( \\det(\\mathbf{A}) \\)',
                },
            ],
            startIndex: 1098,
            text: ' \\( \\det(\\mathbf{A}) \\)',
        },
        {
            documents: [3163314227, 3159750342, 3163266817, 3159724156],
            nestedSpans: [
                {
                    documents: [3163314227, 3159750342, 3163266817, 3159724156],
                    startIndex: 1118,
                    text: '\\( \\mathbf{A}^{-1} \\).\n',
                },
            ],
            startIndex: 1118,
            text: ' \\( \\mathbf{A}^{-1} \\).\n',
        },
        {
            documents: [
                85404658, 3163252136, 3159779016, 3163313215, 3139378054, 3159713458, 3159698350,
                3163258313, 3141576421,
            ],
            nestedSpans: [
                {
                    documents: [85404658],
                    startIndex: 1135,
                    text: '-order derivative \\( \\frac{\\partial^2',
                },
                {
                    documents: [
                        3163252136, 3159779016, 3163313215, 3139378054, 3159713458, 3159698350,
                        3163258313, 3141576421, 3159698350, 3159713458,
                    ],
                    startIndex: 1138,
                    text: '\\( \\frac{\\partial^2 g}{\\partial',
                },
            ],
            startIndex: 1135,
            text: '-order derivative \\( \\frac{\\partial^2 g}{\\partial',
        },
        {
            documents: [3162861377],
            nestedSpans: [
                {
                    documents: [3162861377],
                    startIndex: 1166,
                    text: '\\( \\mathbf{A}^{-1} \\) with',
                },
            ],
            startIndex: 1166,
            text: ' \\( \\mathbf{A}^{-1} \\) with',
        },
        {
            documents: [
                3159798745, 2951475889, 2950899765, 3163343661, 2957065543, 2957064517, 3055454185,
                2948288264, 3054973907, 3163277635, 3159659718,
            ],
            nestedSpans: [
                {
                    documents: [
                        3159798745, 2951475889, 2950899765, 3163343661, 2951475889, 2957065543,
                        3163343661, 2951475889, 2951475889, 3159798745,
                    ],
                    startIndex: 1190,
                    text: '    \\frac{\\partial}{\\partial \\mathbf{',
                },
                {
                    documents: [
                        2957064517, 3055454185, 3055454185, 2948288264, 3054973907, 2957064517,
                        3163277635, 3159659718,
                    ],
                    startIndex: 1191,
                    text: '\\frac{\\partial}{\\partial \\mathbf{A}}',
                },
            ],
            startIndex: 1190,
            text: '     \\frac{\\partial}{\\partial \\mathbf{A}}',
        },
        {
            documents: [
                3142049006, 3142122507, 3142389845, 2957108324, 3142195973, 2952962479, 2952500489,
                3142370581, 3142393807, 3141446944, 3139350182, 3142360885,
            ],
            nestedSpans: [
                {
                    documents: [3142049006, 3142122507, 3142389845],
                    startIndex: 1202,
                    text: '\\mathbf{A}^{-1} = -\\mathbf{',
                },
                {
                    documents: [2957108324],
                    startIndex: 1209,
                    text: '= -\\mathbf{A}^{-1} \\cdot',
                },
                {
                    documents: [3142195973],
                    startIndex: 1212,
                    text: '{A}^{-1} \\cdot \\mathbf{A}^{-1',
                },
                {
                    documents: [2952962479],
                    startIndex: 1215,
                    text: '1} \\cdot \\mathbf{A}^{-1}',
                },
                {
                    documents: [
                        2952500489, 3142370581, 3142393807, 3141446944, 3139350182, 3142360885,
                    ],
                    startIndex: 1216,
                    text: '} \\cdot \\mathbf{A}^{-1} =',
                },
                {
                    documents: [3142049006, 3142122507, 3142389845],
                    startIndex: 1219,
                    text: '\\mathbf{A}^{-1} = -\\mathbf{',
                },
            ],
            startIndex: 1202,
            text: ' \\mathbf{A}^{-1} = -\\mathbf{A}^{-1} \\cdot \\mathbf{A}^{-1} = -\\mathbf{',
        },
        {
            documents: [2950879694, 3163277635, 3159659718, 2957066061],
            nestedSpans: [
                {
                    documents: [2950879694],
                    startIndex: 1268,
                    text: '2} = \\frac{\\partial}{\\partial \\mathbf{',
                },
                {
                    documents: [3163277635, 3159659718],
                    startIndex: 1270,
                    text: '= \\frac{\\partial}{\\partial \\mathbf{A}}',
                },
                {
                    documents: [2957066061],
                    startIndex: 1279,
                    text: '{A}} (\\mathbf{A}^{-1})',
                },
            ],
            startIndex: 1268,
            text: '2} = \\frac{\\partial}{\\partial \\mathbf{A}} (\\mathbf{A}^{-1})',
        },
        {
            documents: [
                2950233806, 2950250684, 2950241447, 2950234654, 3055551485, 3055216540, 3055938160,
            ],
            nestedSpans: [
                {
                    documents: [
                        2950233806, 2950250684, 2950241447, 2950234654, 3055551485, 3055216540,
                        3055938160,
                    ],
                    startIndex: 1309,
                    text: '\\frac{\\partial f}{\\partial \\mathbf{A}} = ',
                },
            ],
            startIndex: 1309,
            text: ' \\frac{\\partial f}{\\partial \\mathbf{A}} = ',
        },
        {
            documents: [
                3159682886, 3163378230, 3159683551, 3163313521, 3163356554, 3159715210, 3055083849,
                2957140970, 2957064757, 2951250929, 3141447689, 3139534407, 2956125906,
            ],
            nestedSpans: [
                {
                    documents: [
                        3159682886, 3163378230, 3159683551, 3163313521, 3159683551, 3159683551,
                        3163356554, 3159715210, 3163313521, 3163313521,
                    ],
                    startIndex: 1337,
                    text: '- \\( \\frac{\\partial^2 f}{\\partial',
                },
                {
                    documents: [
                        3055083849, 2957140970, 2957064757, 2951250929, 2951250929, 3141447689,
                        2951250929, 3139534407, 2957064757, 2956125906,
                    ],
                    startIndex: 1339,
                    text: '\\frac{\\partial^2 f}{\\partial \\mathbf{',
                },
            ],
            startIndex: 1337,
            text: '- \\( \\frac{\\partial^2 f}{\\partial \\mathbf{',
        },
        {
            documents: [3163341706, 3159741519, 2955402028],
            nestedSpans: [
                {
                    documents: [3163341706, 3159741519, 3163341706, 3159741519],
                    startIndex: 1379,
                    text: '\\( \\frac{\\partial g}{\\partial \\mathbf{',
                },
                {
                    documents: [2955402028],
                    startIndex: 1387,
                    text: '\\mathbf{A}} = \\mathbf{A}^{-1',
                },
            ],
            startIndex: 1379,
            text: ' \\( \\frac{\\partial g}{\\partial \\mathbf{A}} = \\mathbf{A}^{-1',
        },
        {
            documents: [
                3163252136, 3159779016, 3163313215, 3139378054, 3159713458, 3159698350, 3163258313,
                3141576421,
            ],
            nestedSpans: [
                {
                    documents: [
                        3163252136, 3159779016, 3163313215, 3139378054, 3159713458, 3159698350,
                        3163258313, 3141576421, 3159698350, 3159713458,
                    ],
                    startIndex: 1403,
                    text: '\\( \\frac{\\partial^2 g}{\\partial',
                },
            ],
            startIndex: 1403,
            text: ' \\( \\frac{\\partial^2 g}{\\partial',
        },
    ],
} satisfies SchemaAttributionResponse;
