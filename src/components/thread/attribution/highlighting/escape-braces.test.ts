import { escapeBraces } from './escape-braces';

describe('escapeBraces', () => {
    it('should escape if there are unbalanced braces', () => {
        expect.soft(escapeBraces('][')).toEqual('\\]\\[');
        expect.soft(escapeBraces(']')).toEqual('\\]');
        expect.soft(escapeBraces('[')).toEqual('\\[');
    });

    it('should not escape if the braces are balanced', () => {
        expect.soft(escapeBraces('[[]]')).toEqual('[[]]');
    });
});
