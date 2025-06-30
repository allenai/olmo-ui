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
    onFirstMessage?: (threadId: string) => void;
}

// Pipeline type aliases for clarity
export type SubmissionPipeline = Pipeline<SubmissionDependencies, SubmissionData>;
export type StreamPipeline = Pipeline<StreamDependencies, StreamData>;
