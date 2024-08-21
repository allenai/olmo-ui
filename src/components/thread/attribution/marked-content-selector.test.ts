import { createSpanReplacementRegex } from './span-replacement-regex';

describe('useSpanHighlighting', () => {
    it('should be able to match strings with parentheses in them', () => {
        const text = 'by the International Olympic Committee (IOC), with the';
        const regex = createSpanReplacementRegex(text);

        expect(text.match(regex)).toHaveLength(1);
    });

    it.each([
        ['.'],
        ['*'],
        ['+'],
        ['?'],
        ['^'],
        ['$'],
        ['{'],
        ['}'],
        ['('],
        [')'],
        ['|'],
        ['['],
        ['\\'],
        [']'],
    ])('should be able to match strings with %s in them', (character) => {
        const result = character.replace(createSpanReplacementRegex(character));
    });
});
