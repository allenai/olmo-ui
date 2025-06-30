// Core pipeline types for submission functionality

import type { MessageChunk, MessageStreamErrorType } from '@/api/Message';
import type { Model } from '@/api/playgroundApi/additionalTypes';
import type { Thread } from '@/api/playgroundApi/thread';
import type { QueryFormValues } from '@/components/thread/QueryForm/QueryFormController';
import type { CompareModelState, ThreadViewId } from '@/slices/CompareModelSlice';

// These types probably aren't exactly right, but hopefully close enough to communicate the approach.

// Generic step function that takes dependencies first, then transforms data
export type Step<TDeps, TData> = (deps: TDeps, data: TData) => Promise<TData>;

// Generic pipeline builder for composing steps
export class PipelineBuilder<TDeps, TData> {
    private steps: Step<TDeps, TData>[] = [];

    static create<TDeps, TData>() {
        return new PipelineBuilder<TDeps, TData>();
    }

    step(stepFunction: Step<TDeps, TData>) {
        this.steps.push(stepFunction);
        return this;
    }

    build() {
        return async (dependencies: TDeps, initialData: TData): Promise<TData> => {
            let data = initialData;
            for (const step of this.steps) {
                data = await step(dependencies, data);
            }
            return data;
        };
    }
}

// Type for the built pipeline function
export type Pipeline<TDeps, TData> = (deps: TDeps, data: TData) => Promise<TData>;

// Streaming message types
export type StreamingMessageResponse = Thread | MessageChunk | MessageStreamErrorType;

// Result from processing a single stream
export interface StreamResult {
    threadId: string | null;
    threadViewId: ThreadViewId;
    success: boolean;
    error?: Error;
}

// Submission-level pipeline data (high-level orchestration)
export interface SubmissionData {
    formData: QueryFormValues;
    models: CompareModelState[];
    streamResults?: StreamResult[];
}

// Stream-level pipeline data (individual stream processing)
export interface StreamData {
    model: Model;
    formData: QueryFormValues;
    threadId?: string;
    threadViewId: ThreadViewId;
    existingThread?: Thread;
    abortController?: AbortController;
    response?: Response;
    currentMessage?: StreamingMessageResponse;
}

// Dependency types for pipelines
export interface SubmissionDependencies {
    checkCompatibility: (models: CompareModelState[]) => boolean;
    streamManager: {
        mutateAsync: (params: {
            request: QueryFormValues;
            threadViewId: ThreadViewId;
            model: Model;
            thread?: Thread;
        }) => Promise<{ response: Response; abortController: AbortController }>;
        completeStream: (threadViewId: ThreadViewId) => void;
    };
    analytics: {
        trackQueryFormSubmission: (modelId: string, hasThread: boolean) => void;
    };
    navigate: (path: string) => void;
    buildComparisonUrl: (threadIds: string[]) => string;
}

// Stream events that can occur during processing
export type StreamEvent =
    | { type: 'firstMessage'; threadId: string; threadViewId: ThreadViewId }
    | { type: 'messageChunk'; content: string; threadViewId: ThreadViewId }
    | { type: 'streamError'; error: Error; threadViewId: ThreadViewId }
    | { type: 'streamComplete'; threadId: string; threadViewId: ThreadViewId }
    | { type: 'modelOverloaded'; threadViewId: ThreadViewId };

export interface StreamDependencies {
    streamManager: SubmissionDependencies['streamManager'];
    updateCacheWithMessagePart: (
        message: StreamingMessageResponse,
        threadId?: string
    ) => Promise<string | undefined>;
    readStream: (
        response: Response,
        signal?: AbortSignal
    ) => AsyncIterable<StreamingMessageResponse>;
    emitEvent?: (event: StreamEvent) => void;
}

// Event handler functions for different stream events
export interface StreamEventHandlers {
    onFirstMessage?: (event: { threadId: string; threadViewId: ThreadViewId }) => void;
    onMessageChunk?: (event: { content: string; threadViewId: ThreadViewId }) => void;
    onStreamError?: (event: { error: Error; threadViewId: ThreadViewId }) => void;
    onStreamComplete?: (event: { threadId: string; threadViewId: ThreadViewId }) => void;
    onModelOverloaded?: (event: { threadViewId: ThreadViewId }) => void;
}

// Enhanced step type that can accept event handler creation strategy
export type EventDrivenStep<TDeps, TData> = (
    createEventHandlers: (deps: TDeps, data: TData) => StreamEventHandlers
) => Step<TDeps, TData>;

// Pipeline type aliases for clarity
export type SubmissionPipeline = Pipeline<SubmissionDependencies, SubmissionData>;
export type StreamPipeline = Pipeline<StreamDependencies, StreamData>;
