import { describe, expect, it } from 'vitest';

import { prepareRequest, setupRecaptcha, validateSubmission } from './single-thread-submission';

// Mock recaptcha hook
const mockExecuteRecaptcha = vi.fn();
vi.mock('@wojtekmaj/react-recaptcha-v3', () => ({
    useReCaptcha: () => ({
        executeRecaptcha: mockExecuteRecaptcha,
    }),
}));

describe('SingleThreadSubmission', () => {
    describe('validateSubmission', () => {
        it('should return false when user cannot submit', () => {
            const [canSubmit, isLoading] = [false, false];
            expect(validateSubmission(canSubmit, isLoading)).toBe(false);
        });

        it('should return false when system is loading', () => {
            const [canSubmit, isLoading] = [true, true];
            expect(validateSubmission(canSubmit, isLoading)).toBe(false);
        });

        it('should return false when user cannot submit and system is loading', () => {
            const [canSubmit, isLoading] = [false, true];
            expect(validateSubmission(canSubmit, isLoading)).toBe(false);
        });

        it('should return true when user can submit and system is not loading', () => {
            const [canSubmit, isLoading] = [true, false];
            expect(validateSubmission(canSubmit, isLoading)).toBe(true);
        });
    });

    describe('setupRecaptcha', () => {
        beforeEach(() => {
            vi.clearAllMocks();
            delete process.env.IS_RECAPTCHA_ENABLED;
        });

        it('executes recaptcha when enabled', async () => {
            process.env.IS_RECAPTCHA_ENABLED = 'true';
            mockExecuteRecaptcha.mockResolvedValue('token');

            const result = await setupRecaptcha(mockExecuteRecaptcha);

            expect(mockExecuteRecaptcha).toHaveBeenCalledWith('prompt_submission');
            expect(result).toBe('token');
        });

        it('returns undefined when disabled', async () => {
            process.env.IS_RECAPTCHA_ENABLED = 'false';

            expect(await setupRecaptcha(mockExecuteRecaptcha)).toBeUndefined();
            expect(mockExecuteRecaptcha).not.toHaveBeenCalled();
        });

        it('returns undefined when not configured', async () => {
            expect(await setupRecaptcha(mockExecuteRecaptcha)).toBeUndefined();
            expect(mockExecuteRecaptcha).not.toHaveBeenCalled();
        });

        it('returns undefined when executeRecaptcha is null', async () => {
            process.env.IS_RECAPTCHA_ENABLED = 'true';

            expect(await setupRecaptcha(null)).toBeUndefined();
        });

        it('propagates execution errors', async () => {
            process.env.IS_RECAPTCHA_ENABLED = 'true';
            mockExecuteRecaptcha.mockRejectedValue(new Error('Failed'));

            await expect(setupRecaptcha(mockExecuteRecaptcha)).rejects.toThrow('Failed');
        });
    });

    describe('prepareRequest', () => {
        const formData = { content: 'Test', private: false, files: undefined };

        it('should combine form data with captcha token', () => {
            const result = prepareRequest(formData, 'token');
            expect(result).toEqual({ ...formData, captchaToken: 'token' });
        });

        it('should add parent when lastMessageId provided', () => {
            const result = prepareRequest(formData, 'token', 'msg-123');
            expect(result).toEqual({ ...formData, captchaToken: 'token', parent: 'msg-123' });
        });

        it('should handle undefined captcha token', () => {
            const result = prepareRequest(formData, undefined);
            expect(result).toEqual({ ...formData, captchaToken: undefined });
        });

        it('should not add parent for empty lastMessageId', () => {
            const result = prepareRequest(formData, 'token', '');
            expect(result).not.toHaveProperty('parent');
        });
    });

    describe('executeStreamPrompt', () => {
        // TODO: Add tests when function is implemented
    });

    describe('handleSubmissionError', () => {
        // TODO: Add tests when function is implemented
    });
});
