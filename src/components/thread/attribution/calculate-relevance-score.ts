export const calculateRelevanceScore = (relevanceScore: number, messageLength: number) => {
    if (messageLength === 0) {
        return 0.0;
    }

    // 0.125 is a hyperparam heuristically determined by running distrib_of_score_span.py in infinigram-api
    const score = relevanceScore / (messageLength * 0.18);
    return Math.min(Math.max(score, 0.0), 1.0);
};
