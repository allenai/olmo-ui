# Pipeline Proposal for Modularity of Submission and Streaming Features

This is psuedocode at this point, but hopefully it demonstrates the idea.

## Basic Concept

The pipeline builder composes a series of steps that transform data sequentially. Each step receives data, can modify it, and passes it to the next step. All steps are potentially asynchronous (return values wrapped in a promise, even if there is no async involved) and may have side effects (navigation, analytics tracking, cache updates). 

Steps take dependencies as a first argument, following our DI approach. This will make unit testing easy and new feature development straightforward, while reducing risk of regression bugs.

In terms of design patterns, this is a "Pipeline" pattern, composed by a "Builder", where the Builder has a "Fluent interface".

There are two levels of pipelines:
- **Submission Pipeline**: High-level orchestration (validate, execute all streams, finalize)
- **Stream Pipeline**: Individual stream processing (initialize, process chunks, complete)

## Submission Pipeline

### Composing Pipelines

```typescript
const submissionPipeline = PipelineBuilder
    .create<SubmissionDependencies, SubmissionData>()
    .step(validateCompatibility)
    // Submission-level pipeline kicks off stream-level pipeline, and can do things like perfom nav on first messages received
    .step(executeStreamsWithNavigation)
    .build();
```

### Basic Stream Execution With Nav

```typescript
const executeComparisonStreams: Step<SubmissionDependencies, SubmissionData> = async (deps, data) => {
    const firstMessagePromises = [];
    
    // Start streams for models in comparison
    data.models.forEach((model) => {
        const firstMessagePromise = startStream(model, {
            onFirstMessage: (threadId) => resolveFirstMessage(threadId)
        });
        firstMessagePromises.push(firstMessagePromise);
    });
    
    // Navigate to comparison page as soon as ALL first messages arrive
    Promise.all(firstMessagePromises).then(threadIds => {
        deps.navigate(deps.buildComparisonUrl(threadIds));
    });
    
    // Wait for both streams to complete
    const results = await waitForAllStreamsToComplete();
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
const onSubmit = async (formData: QueryFormValues) => {
    const submissionData: SubmissionData = {
        formData,
        models: selectedModels
    };
    
    // This is where dependencies are wired up
    const dependencies: SubmissionDependencies = {
        checkCompatibility,
        streamManager,
        analytics,
        navigate,
        buildComparisonUrl
    };
    
    await submissionPipeline(dependencies, submissionData);
};
```
