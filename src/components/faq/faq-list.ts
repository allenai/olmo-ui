import { getFAQIdByShortId } from '@/components/faq/faq-utils';

export interface FAQ {
    question: string;
    answer: string | (() => string);
    shortId?: string; // helps finding a faq with shortId
}

export interface FAQCategory {
    category: string;
    questions: FAQ[];
}

export const faqs: FAQCategory[] = [
    {
        category: 'General',
        questions: [
            {
                question: 'What is the Ai2 Playground?',
                answer: 'The Ai2 Playground allows you to interact with Ai2’s large language models in a user-friendly interface without the need to download anything. You can use it to test LLM capabilities and generate text based on prompts.',
            },
            {
                question: 'Which countries and territories have access to the Playground?',
                answer: 'The Ai2 Playground is designed to be globally accessible, subject to compliance with applicable laws.',
            },
            {
                question: 'How can I contact support?',
                answer: 'If you can’t find an answer to your question on this page, please contact support by emailing [support@allenai.org](mailto:support@allenai.org) or join our [Discord](https://discord.com/invite/vgRQQgE8). Our dedicated team is ready to assist with technical issues, account inquiries, and general questions about Ai2 models and their frameworks.',
            },
        ],
    },
    {
        category: 'Account',
        questions: [
            {
                question: 'How do I access the Playground?',
                answer: 'You can use the Playground and interact with the models without creating an account. Prompts and threads from anonymous use will be regularly deleted.\n\nSigning up for an account will save your prompts and threads and allow you to delete and share them as you choose.',
            },
            {
                question: 'How do I create an account?',
                answer: 'You can create an account by signing in via your Google account.',
            },
            {
                question: 'Can I change the email address associated with my account?',
                answer: 'Your account is linked to your Google account. If you would like to change your email address, please sign in using a different Google account.',
            },
            {
                question: 'How do I delete my Playground account?',
                answer: () => {
                    const deleteSectionLink = getFAQIdByShortId('request-prompt-history-delete');

                    return `Your Playground account is linked to your Google account. You can remove the authorization to share data from your Google account with Playground via [third-party app management](https://support.google.com/accounts/answer/13533235?hl=en&ref_topic=7188760&sjid=15649851997490028435-NC) in your Google account. Please note that removing the authorization does not delete your prompt history from our database. To [delete thread history](${deleteSectionLink}) click the ‘Delete Thread’ button.`;
                },
            },
        ],
    },
    {
        category: 'Models',
        questions: [
            {
                question: 'Which models are served in the Playground?',
                answer: '[OLMo 2](https://allenai.org/olmo) is a family of fully-open language models, developed start-to-finish with open and accessible training data, open-source training code, reproducible training recipes, transparent evaluations, intermediate checkpoints, and more. The Playground is serving the OLMo 2 13B Instruct version of OLMo.\n\n[Tülu 3](https://allenai.org/tulu) is a top-performing instruction model family with fully open fine-tuning data, code, and recipes to serve as a guidebook for modern post-training. Tülu 3 is a fine-tuned version of Llama 3 that was trained on a mix of publicly available, synthetic, and human datasets. The Playground is serving both 70B and 8B versions of Tülu 3.',
            },
            {
                question: 'How accurate and reliable is generated content on the Playground?',
                answer: 'Playground-generated content is built for research and educational purposes only. It is not intended to be accurate or reliable, but rather as a research tool and to help the general public better understand LLMs. Please do not rely on any Playground-generated content and always use your best judgment, fact-check important information, and consider the context when interpreting content generated on the Playground.',
            },
        ],
    },
    {
        category: 'Data & Privacy',
        questions: [
            {
                question: 'What data does Ai2 collect about me?',
                answer: 'We collect data necessary to improve your experience and the performance of OLMo as described in our general [Terms and Conditions of Use and Privacy Policy](https://allenai.org/terms/2024-09-25). This includes interaction data with the model, such as queries and responses.\n\nData from anonymous users of the Playground is regularly deleted.\n\nPlease do not include PII (personally identifiable information) or any other sensitive information in model prompts or elsewhere in the Playground.',
            },
            {
                question: 'How is my data used to improve the Playground’s performance?',
                answer: 'Your data helps us understand how users interact with the Playground and the models it serves. We use this interaction data to identify areas for improvement and to develop new features that advance the scientific and educational purposes of Ai2. We analyze aggregated data to inform updates and enhancements to ensure our models remain effective and relevant for scientific research and education in the public interest. Please see our [Terms of Use](https://allenai.org/terms/2024-09-25) and [Privacy Policy](https://allenai.org/privacy-policy/2022-07-21) for more information.',
            },
            {
                question: 'How can I opt out of Ai2 using my Playground data?',
                answer: 'You can remove your thread from our database by deleting your prompt history within 30 days of its creation. Click the “Delete Thread” button to delete your prompt and the generated response. Please note that you will need to delete your prompt history every 30 days if you do not wish to share any prompt information with us. We currently do not have a permanent “opt out” from prompt history retention; we will also retain the original user information you provided when creating a Playground account, as described in our [Terms of Use](https://allenai.org/terms/2024-09-25) and [Privacy Policy](https://allenai.org/privacy-policy/2022-07-21).',
            },
            {
                question: 'How can I request my prompt history be deleted?',
                answer: 'You can use the “Delete Thread” button to delete your prompt and the generated response. Click the “History” button to view your historical prompts and use the “Delete Thread” button to delete threads within the last 30 days. Threads older than 30 days cannot be deleted via the Playground and will be retained as described in our [Terms of Use](https://allenai.org/terms/2024-09-25) and [Privacy Policy](https://allenai.org/privacy-policy/2022-07-21).',
                shortId: 'request-prompt-history-delete',
            },
            {
                question:
                    'Will Ai2 claim copyright over the outputs I generate with the Playground?',
                answer: 'No, we will not claim copyright over the outputs generated by the Playground.',
            },
            {
                question:
                    'Where can I find additional information about Ai2 Playground use and privacy? ',
                answer: 'Please see [Terms of Use](https://allenai.org/terms/2024-09-25), [Privacy Policy](https://allenai.org/privacy-policy/2022-07-21) and [Responsible Use Guidelines](https://allenai.org/responsible-use) for detailed guidelines on use of Ai2 Playground.',
            },
        ],
    },
] as const;

export const corpusLinkFaqs: FAQCategory[] = [
    {
        category: 'Training Text Matches',
        questions: [
            {
                question: 'What is Training Text Matches?',
                answer: 'Training Text Matches is a unique feature of Ai2 Playground, connecting pieces of a language model’s output to documents in the model’s training data. Training Text Matches is designed to find verbatim text matches between model outputs and the training corpus that are relatively long and unique. We developed Training Text Matches in the hope that researchers and the general public might find it helpful for inspecting where and how language models might have learned to generate certain word sequences. Training Text Matches is a one-of-a-kind feature and is only made possible by Ai2’s commitment to making large pretraining and post-training datasets open in the interest of advancing scientific research in AI and public understanding of AI systems.',
            },
            {
                question:
                    'Did the model directly reference the documents presented by Training Text Matches when generating the response?',
                answer: 'No. Upon receiving a user prompt, our model first generates a response on its own, and then Training Text Matches scans the model response and retrieves matching documents. This is different from RAG (retrieval-augmented generation) systems, where the model generates responses conditioning on retrieved documents as part of its input context.',
            },
            {
                question: 'What do the different shades of the highlight color mean?',
                answer: 'The shades represent the level of relevance between the best document retrieved for a span and the overall model response. Training Text Matches computes a BM25 relevance score for each retrieved document, and buckets them into three levels: “high relevance”, “medium relevance”, and “low relevance”. A span’s shade is determined by the maximum relevance level achieved by the documents containing that span. Darker shade means higher maximum relevance level.',
            },
            {
                question: 'Why are some documents repeated in the Training Text Matches result?',
                answer: 'Because some documents are repeated in the training dataset of our models. Training Text Matches groups some repeated documents into the same card by matching the URL in their metadata, and you can inspect these repetitions by clicking “View all repeated documents” on the document card. However, there are documents with identical content but different URLs and they will show up as separate document cards.',
            },
            {
                question: 'Why do some highlighted spans begin or end in the middle of a word?',
                answer: 'Training Text Matches processes the model response in granularity of tokens. While it tries to avoid cutting off in the middle of words, there may be some uncaught corner cases.',
            },
            {
                question:
                    'Where do the documents come from? In which training stage is each document used?',
                answer: 'For each document retrieved by Training Text Matches, we show its source (the dataset it comes from) and its usage in training. Our flagship model, [OLMo 2 13B Instruct](https://huggingface.co/allenai/OLMo-2-1124-13B-Instruct), was trained in 3 stages:\n&emsp;&emsp;1. Pre-training: the dataset is [OLMo-mix-1124](https://huggingface.co/datasets/allenai/OLMo-mix-1124). It contains mostly data from the web(the DCLM corpus), as well as other sources like wiki and arxiv.\n&emsp;&emsp;2. Mid-training: the dataset is [Dolmino-mix-1124](https://huggingface.co/datasets/allenai/dolmino-mix-1124). It contains high-quality text data and a mixture of math-heavy data.Some documents in this dataset already appeared in the pretraining dataset, and we excluded them so as to reduce duplicates.\n&emsp;&emsp;3. Post-training: it has 3 sub-stages: \n&emsp;&emsp;&emsp;&emsp;a. Supervised fine-tuning(SFT): the dataset is [Tulu 3 SFT mix](https://huggingface.co/datasets/allenai/tulu-3-sft-olmo-2-mixture)\n&emsp;&emsp;&emsp;&emsp;b. Preference learning(DPO): the dataset is [Tulu 3 preference mix](https://huggingface.co/datasets/allenai/olmo-2-1124-13b-preference-mix)\n&emsp;&emsp;&emsp;&emsp;c. RL with verifiable rewards(RLVR): the dataset is [Tulu 3 RLVR](https://huggingface.co/datasets/allenai/RLVR-GSM-MATH-IF-Mixed-Constraints)\n\n We consider the union of all the above datasets as “training data” of the OLMo 2 13B Instruct model, and when matching model outputs with the training text we consider all these datasets.',
            },
            {
                question: 'Why does Training Text Matches not support Tulu 3 models?',
                answer: 'Because we do not have access to the full training data of Tulu 3. While their post-training data is open, Tulu 3 is developed on top of the base Llama-3.1 models, whose pre-training data is not openly accessible. Showing Training Text Matches results with only post-training data would give an incomplete picture, so we disabled it on Tulu 3.',
            },
        ],
    },
] as const;
