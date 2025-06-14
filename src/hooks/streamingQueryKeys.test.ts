import { StreamingKeyMatchers, StreamingKeys, StreamingQueryUtils } from './streamingQueryKeys';

describe('StreamingKeys', () => {
    test('root key structure is correct', () => {
        expect(StreamingKeys.root).toEqual(['streamMessage']);
    });

    test('model stream key is formatted correctly', () => {
        const key = StreamingKeys.models.stream('model123', 'req456');
        expect(key).toEqual(['streamMessage', 'model', 'model123', 'req456']);
    });

    test('batch key is formatted correctly', () => {
        const key = StreamingKeys.models.batch('batch789');
        expect(key).toEqual(['streamMessage', 'batch', 'batch789']);
    });

    test('message stream key is formatted correctly', () => {
        const key = StreamingKeys.messages.stream('msg123');
        expect(key).toEqual(['streamMessage', 'message', 'msg123']);
    });

    test('thread stream key is formatted correctly', () => {
        const key = StreamingKeys.threads.stream('thread123');
        expect(key).toEqual(['streamMessage', 'thread', 'thread123']);
    });
});

describe('StreamingKeyMatchers', () => {
    test('isModelStream correctly identifies model streams', () => {
        const modelKey = StreamingKeys.models.stream('model123', 'req456');
        const messageKey = StreamingKeys.messages.stream('msg123');

        expect(StreamingKeyMatchers.isModelStream(modelKey)).toBe(true);
        expect(StreamingKeyMatchers.isModelStream(messageKey)).toBe(false);
    });

    test('isModelStreamForModel correctly identifies specific model streams', () => {
        const modelKey = StreamingKeys.models.stream('model123', 'req456');
        const otherModelKey = StreamingKeys.models.stream('model456', 'req789');

        expect(StreamingKeyMatchers.isModelStreamForModel(modelKey, 'model123')).toBe(true);
        expect(StreamingKeyMatchers.isModelStreamForModel(modelKey, 'model456')).toBe(false);
        expect(StreamingKeyMatchers.isModelStreamForModel(otherModelKey, 'model123')).toBe(false);
    });

    test('isMessageStream correctly identifies message streams', () => {
        const messageKey = StreamingKeys.messages.stream('msg123');
        const modelKey = StreamingKeys.models.stream('model123', 'req456');

        expect(StreamingKeyMatchers.isMessageStream(messageKey)).toBe(true);
        expect(StreamingKeyMatchers.isMessageStream(modelKey)).toBe(false);
    });

    test('isThreadStream correctly identifies thread streams', () => {
        const threadKey = StreamingKeys.threads.stream('thread123');
        const messageKey = StreamingKeys.messages.stream('msg123');

        expect(StreamingKeyMatchers.isThreadStream(threadKey)).toBe(true);
        expect(StreamingKeyMatchers.isThreadStream(messageKey)).toBe(false);
    });

    test('isBatchStream correctly identifies batch streams', () => {
        const batchKey = StreamingKeys.models.batch('batch123');
        const modelKey = StreamingKeys.models.stream('model123', 'req456');

        expect(StreamingKeyMatchers.isBatchStream(batchKey)).toBe(true);
        expect(StreamingKeyMatchers.isBatchStream(modelKey)).toBe(false);
    });

    test('isStreamingKey correctly identifies any streaming key', () => {
        const modelKey = StreamingKeys.models.stream('model123', 'req456');
        const messageKey = StreamingKeys.messages.stream('msg123');
        const nonStreamingKey = ['otherKey', 'value'];

        expect(StreamingKeyMatchers.isStreamingKey(modelKey)).toBe(true);
        expect(StreamingKeyMatchers.isStreamingKey(messageKey)).toBe(true);
        expect(StreamingKeyMatchers.isStreamingKey(nonStreamingKey)).toBe(false);
    });
});

describe('StreamingQueryUtils', () => {
    test('getModelId extracts model ID correctly', () => {
        const modelKey = StreamingKeys.models.stream('model123', 'req456');
        const messageKey = StreamingKeys.messages.stream('msg123');

        expect(StreamingQueryUtils.getModelId(modelKey)).toBe('model123');
        expect(StreamingQueryUtils.getModelId(messageKey)).toBeUndefined();
    });

    test('getRequestId extracts request ID correctly', () => {
        const modelKey = StreamingKeys.models.stream('model123', 'req456');
        const messageKey = StreamingKeys.messages.stream('msg123');

        expect(StreamingQueryUtils.getRequestId(modelKey)).toBe('req456');
        expect(StreamingQueryUtils.getRequestId(messageKey)).toBeUndefined();
    });

    test('getMessageId extracts message ID correctly', () => {
        const messageKey = StreamingKeys.messages.stream('msg123');
        const modelKey = StreamingKeys.models.stream('model123', 'req456');

        expect(StreamingQueryUtils.getMessageId(messageKey)).toBe('msg123');
        expect(StreamingQueryUtils.getMessageId(modelKey)).toBeUndefined();
    });

    test('getThreadId extracts thread ID correctly', () => {
        const threadKey = StreamingKeys.threads.stream('thread123');
        const messageKey = StreamingKeys.messages.stream('msg123');

        expect(StreamingQueryUtils.getThreadId(threadKey)).toBe('thread123');
        expect(StreamingQueryUtils.getThreadId(messageKey)).toBeUndefined();
    });
});
