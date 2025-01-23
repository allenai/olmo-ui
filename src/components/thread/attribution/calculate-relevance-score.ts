export type AttributionBucket = 'low' | 'medium' | 'high';

export const calculateRelevanceScore = (relevanceScore: number, messageLength: number) => {
    if (messageLength === 0) {
        return 0.0;
    }

    // 0.18 is a hyperparam heuristically determined by running distrib_of_score_span.py in infinigram-api
    const score = relevanceScore / (messageLength * 0.18);
    return Math.min(Math.max(score, 0.0), 1.0);
};

export const getBucketForScorePercentile = (scorePercentile: number): AttributionBucket =>
    scorePercentile >= 0.7 ? 'high' : scorePercentile >= 0.5 ? 'medium' : 'low';
