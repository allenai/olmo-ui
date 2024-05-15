interface FAQ {
    question: string;
    answer: string;
}

interface FAQCategory {
    category: string;
    questions: FAQ[];
}

export const faqs: FAQCategory[] = [
    {
        category: 'General',
        questions: [
            {
                question: 'What is AI2 OLMo?',
                answer: 'AI2’s Open Language Model (OLMo) is a Large Language Model (LLM) framework intentionally designed to provide access to data, training code, models, and evaluation code necessary to advance the science of generative AI. Through open research, we aim to empower academics and researchers to study the science of language models collectively.\n\nThe OLMo framework is designed to aid researchers in training and experimenting with large language models. The OLMo artifacts are available for direct download on [Hugging Face](https://huggingface.co/collections/allenai/olmo-suite-65aeaae8fe5b6b2122b46778) and [GitHub](https://github.com/allenai/OLMo).',
            },
            {
                question: 'What can I use OLMo Playground for?',
                answer: "The OLMo Playground allows you to interact with AI2’s large language models in a user-friendly interface. You can use it to test LLM capabilities and generate text based on prompts. It's a valuable tool for educational purposes, research experiments, and developing a deeper understanding of LLMs' behavior and potential applications.",
            },
            {
                question: 'What is the AI2 Dataset Explorer?',
                answer: "The Dataset Explorer is an interactive part of the OLMo Platform that allows you to delve into the datasets used to train our LLMs. It provides insights into the diversity and composition of the data, enabling exploration of the types of information that contribute to the model. We hope the transparency can foster trust and understanding of the model's foundational elements. Currently, this tool indexes Dolma version 1.0. ",
            },
            {
                question: 'How are results generated and ranked in the Dataset Explorer?',
                answer: 'The Dataset Explorer retrieves results by matching your query to words in the documents. For example, a search for the query `dataset explorer` will retrieve documents that contain the word `dataset`, the word `explorer`, or both words.  Documents that contain both terms will be ranked higher.\n\nSearch results are ordered based on the [BM25 scoring algorithm](https://en.wikipedia.org/wiki/Okapi_BM25), which generally gives a higher score to documents that contain the query terms more often. Common terms contribute less to the score, while rare ones contribute more. For example, since the term `the` occurs frequently throughout the dataset, it will not contribute much to the overall document ranking. BM25 also adjusts for document length variations and prevents one term from dominating others.\n\nPro tip: Use quotation marks around your term to search for an exact match to your search phrase.',
            },
            {
                question: 'What type of data is used to train OLMo?',
                answer: 'OLMo is built on the [AI2 Dolma dataset](https://blog.allenai.org/dolma-3-trillion-tokens-open-llm-corpus-9a0ff4b8da64), an open dataset of 3 trillion tokens from a diverse mix of web content, academic publications, code, books, and encyclopedic materials. It is generally available for download from the Hugging Face Hub and is the largest open dataset to date for LLM training. For more technical details on the model, read our [Getting Started with OLMo technical blog](https://blog.allenai.org/olmo-open-language-model-87ccfc95f580).',
            },
            {
                question: "How up-to-date is OLMo's training data?",
                answer: 'The [OLMo-7B-Instruct](https://huggingface.co/allenai/OLMo-7B-Instruct) model is trained on data collected up until March 2023. Its training data only includes events or publications before that date.',
            },
            {
                question: 'How accurate and reliable is OLMo-generated content?',
                answer: 'OLMo-generated content is built for experimental and research use only. It is not intended to be accurate or reliable, but rather as a research tool. Please use your judgment, fact-check important information, and consider the context when interpreting or using OLMo-generated content.',
            },
            {
                question: 'Can OLMo be biased or produce inappropriate content?',
                answer: 'Yes, like any large language model trained on mostly[ unfiltered internet data](https://arxiv.org/abs/2104.08758), OLMo reflects existing biases and can generate [toxic](https://spectrum.ieee.org/open-ais-powerful-text-generating-tool-is-ready-for-business), [unethical](https://arxiv.org/abs/2009.06807), and [harmful content](https://aclanthology.org/D19-1339/). We have tried to mitigate this when designing OLMo, but it still contains biases. Please be mindful of OLMo’s research-driven purpose and use your judgment when using OLMo-generated content. We are committed to supporting research and education in this area by providing open tools and fostering a future where LLMs are less biased.',
            },
            {
                question: 'How will AI2 mitigate harmful bias and other negative effects of OLMo?',
                answer: 'We understand that OLMo, like other LLMs, can produce biased content and has the risk of being misused. However, we believe that by opening up our framework and data, we can empower researchers and AI practitioners to gain deeper insights into the science of LLMs, which is critical to building the next generation of safe and trustworthy AI. Instead of building the most accurate or safe LLM, we are focused on fostering research around all areas of LLM development, including safety and accuracy.',
            },
            {
                question:
                    'I found some potentially objectionable content in the Data Explorer. How can I report it for review?',
                answer: "You can request a review of any document from Dolma by selecting the 'Flag for Review' button and providing an explanation for why the content should be reviewed. Your feedback helps us understand how to improve the presentation of results.\n\nTo understand the AI2 Dolma dataset design principles, read our [Dolma blog post](https://blog.allenai.org/dolma-3-trillion-tokens-open-llm-corpus-9a0ff4b8da64) published in August 2023.",
            },
            {
                question:
                    'How does the OLMo and the dataset(s) address/comply with copyright issues/laws?',
                answer: 'Starting with our OLMo project, AI2 has worked to implement “Fair Use by Design” into the development process for AI artifacts. This means we identified decision points where we could modify training data to transform it in a manner that we believe would meet the criteria for the fair use exception to copyright infringement.\n\nSimply put, the overarching principle is that our AI artifacts and anything they generate should not compete with the original source material or negatively affect the value of the copyrighted work to the greatest extent reasonably possible while still remaining useful for scientific research.',
            },
            {
                question: 'Which countries and territories have access to OLMo?',
                answer: 'OLMo is designed to be globally accessible, subject to compliance with applicable laws. ',
            },
            {
                question: 'Does OLMo support other languages outside of English?',
                answer: 'Currently, OLMo only supports the English language. ',
            },
            // {
            //     question: 'How can I contact support?',
            //     answer: 'If you can’t find an answer to your question on this page, you can contact support by reaching out to our Discord community [ link to be inserted when available]. Our dedicated team is ready to assist with technical issues, account inquiries, and general questions about OLMo and its framework.',
            // },
        ],
    },
    {
        category: 'Account',
        questions: [
            {
                question: 'How do I create an account?',
                answer: 'You can create an account by signing in via your Google account. We plan to extend support to other sign-in methods in the future.',
            },
            {
                question: 'Can I change the email address associated with my account?',
                answer: 'No, your account is linked to your Google account. If you would like to change the email address, please sign in from a different Google account.',
            },
            {
                question: 'How can I delete my account?',
                answer: 'Your account is linked to your Google account. You can remove the authorization via security settings in your Google account. Please note that removing the authorization does not delete your chat history from our database.',
            },
        ],
    },
    {
        category: 'Data & Privacy',
        questions: [
            {
                question: 'What data does AI2 collect about me?',
                answer: 'We collect data necessary to improve your experience and the performance of OLMo as described in our general [Terms and Conditions of Use and Privacy Policy](https://allenai.org/terms). This includes interaction data with the model, such as queries and responses, to refine and enhance OLMo’s capabilities. ',
            },
            {
                question: 'How is my data used to improve OLMo’s performance?',
                answer: 'Your data helps us understand how users interact with OLMo, identify areas for improvement, and develop new features. We analyze aggregate data to inform updates and enhancements to ensure OLMo remains effective and relevant. Please see our Privacy Policy for more information.',
            },
            {
                question: 'How can I opt out of my data being used for model improvement?',
                answer: 'We currently do not provide a way to opt out. However, you can delete your chat history within 30 days via the deletion function in the interactions threads interface. Deleted messages will be removed from our database.',
            },
            {
                question: 'How long does AI2 retain my chat history and personal information?',
                answer: 'We retain chat history and personal information for a period necessary to fulfill the purposes outlined in our [Privacy Policy](https://allenai.org/privacy-policy), after which it is securely deleted.',
            },
            {
                question: 'Is my personal data and chat history shared with third parties?',
                answer: 'We may share aggregated and anonymized data with the AI research community to empower more research that is critical for the next generation of safe and trustworthy AI. Please refrain from sending confidential information to the OLMo Playground. Details may be found in our [Privacy Policy](https://allenai.org/privacy-policy).',
            },
            {
                question: 'How can I request to delete my chat history?',
                answer: 'You can request data deletion via the deletion function in the interactions threads interface. We will guide you through the process and ensure your data is promptly removed in accordance with our Terms and Conditions of Use, privacy and data retention policies.',
            },
            {
                question: 'Will AI2 claim copyright over the outputs I generate with OLMo?',
                answer: 'No, we do not claim copyright over the outputs generated by OLMo.',
            },
            {
                question:
                    "What are AI2's policies regarding sharing and publication of OLMo-generated content?",
                answer: 'We encourage users to review our [Terms and Conditions of Use](https://allenai.org/terms) for detailed guidelines on our preferred approach to sharing and publication.',
            },
        ],
    },
] as const;
