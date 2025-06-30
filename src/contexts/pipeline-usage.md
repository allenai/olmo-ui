# Pipeline Proposal for Modularity of Submission and Streaming Features

This is psuedocode at this point, but hopefully it demonstrates the idea.

## Basic Concept

This is just a way to decompose QueryForm submission and response streaming into smaller pieces. All logic involved can be either a:
1. Pipeline Step
2. Even-driven callback

The pipeline builder composes a series of steps that transform data sequentially. Each step receives data, can modify it, and passes it to the next step. All steps are potentially asynchronous (return values wrapped in a promise, even if there is no async involved) and may have side effects (navigation, analytics tracking, cache updates). 

Steps take dependencies as a first argument, following our DI approach. This will make unit testing easy and new feature development straightforward, while reducing risk of regression bugs.

In terms of design patterns, this is a "Pipeline" pattern, composed by a "Builder", where the Builder has a "Fluent interface".

There are two levels of pipelines:
- **Submission Pipeline**: High-level orchestration (validate, execute all streams, finalize)
    - This is probably just sequential steps, composed together
- **Stream Pipeline**: Individual stream processing (initialize, process chunks, complete)
    - For streams, there is a type of Step that can register event-driven callbacks

## Submission Pipeline

### Composing Pipelines

Pipelines for single and multi-thread scenarios will be defined seperately, but will be able to share common steps easily. It is likely that the process itself is slightly different between the scenarios. Most of the actual step implementations will be different.

```typescript
// For comparison scenarios
const comparisonSubmissionPipeline = PipelineBuilder
    .create<SubmissionDependencies, SubmissionData>()
    .step(validateCompatibility)
    .step(executeStreamsWithEvents(comparisonEventHandlers))
    .build();

// For single thread scenarios
const singleThreadSubmissionPipeline = PipelineBuilder
    .create<SubmissionDependencies, SubmissionData>()
    .step(validateCompatibility)
    .step(executeStreamsWithEvents(singleThreadEventHandlers))
    .build();
```

### Event-Driven Stream Execution

One of the trickiest parts of modularizing the submissions is the differences in side-effects, like the differences in navigation and model compatibility behaviors. This approach has the flexibility to handle those differences. The `onFirstMessage` callback below shows how Comparison can navigate to the right URL as soon as it receives all of the first messages of multiple streams.

```typescript
// Event handler creation for comparison scenarios
const comparisonEventHandlers = (deps: SubmissionDependencies, data: SubmissionData) => {
    const firstMessageTracker = new Set<ThreadViewId>();
    const expectedStreams = new Set(data.models.map(m => m.threadViewId));
    const threadIds: string[] = [];
    
    return {
        onFirstMessage: ({ threadId, threadViewId }) => {
            firstMessageTracker.add(threadViewId);
            threadIds.push(threadId);
            
            // Navigate when ALL first messages received
            if (firstMessageTracker.size === expectedStreams.size) {
                deps.navigate(deps.buildComparisonUrl(threadIds));
            }
        },
        onStreamError: ({ error, threadViewId }) => {
            console.error(`Stream error for ${threadViewId}:`, error);
        },
        onStreamComplete: ({ threadId, threadViewId }) => {
            console.log(`Stream completed for ${threadViewId}: ${threadId}`);
        }
    };
};

// Event handler creation for single thread scenarios  
const singleThreadEventHandlers = (deps: SubmissionDependencies, data: SubmissionData) => ({
    onFirstMessage: ({ threadId }) => {
        // Navigate immediately on first message
        deps.navigate(`/thread/${threadId}`);
    },
    onStreamError: ({ error, threadViewId }) => {
        console.error(`Stream error for ${threadViewId}:`, error);
    }
});

// Event-driven step that uses the event handler creator
const executeStreamsWithEvents: EventDrivenStep<SubmissionDependencies, SubmissionData> = 
    (createEventHandlers) => async (deps, data) => {
        const eventHandlers = createEventHandlers(deps, data);
        
        const streamPromises = data.models.map(model => 
            executeStreamWithEvents(eventHandlers, model, data.formData)
        );
        
        const results = await Promise.all(streamPromises);
        return { ...data, streamResults: results };
    };
```

### Example Simple Submission Step

```typescript
const validateCompatibility: Step<SubmissionDependencies, SubmissionData> = async (deps, data) => {
    if (data.models.length > 1 && !deps.checkCompatibility(data.models)) {
        throw new Error('Incompatible models selected');
    }
    return data;
};
```

## Use in React Context Provider

```typescript
// In ComparisonProvider
const onSubmit = async (formData: QueryFormValues) => {
    const submissionData: SubmissionData = {
        formData,
        models: selectedModels
    };
    
    const dependencies: SubmissionDependencies = {
        checkCompatibility,
        streamManager,
        analytics,
        navigate,
        buildComparisonUrl
    };
    
    await comparisonSubmissionPipeline(dependencies, submissionData);
};

// In SingleThreadProvider  
const onSubmit = async (formData: QueryFormValues) => {
    const submissionData: SubmissionData = {
        formData,
        models: [selectedModel] // Single model array
    };
    
    const dependencies: SubmissionDependencies = {
        checkCompatibility,
        streamManager,
        analytics,
        navigate,
        buildComparisonUrl
    };
    
    await singleThreadSubmissionPipeline(dependencies, submissionData);
};
```
