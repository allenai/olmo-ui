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
                question: 'How accurate and reliable is generated content on the Playground?',
                answer: 'Playground-generated content is built for research and educational purposes only. It is not intended to be accurate or reliable, but rather as a research tool and to help the general public better understand LLMs. Please do not rely on any Playground-generated content and always use your best judgment, fact-check important information, and consider the context when interpreting content generated on the Playground.',
            },

            {
                question: 'Which models on the Playground are multimodal and how do I use them?',
                answer: 'Models with the "Multimodal" label can handle non-text input. The "Molmo" models require a file to be send with the first message and don’t allow files to be sent with follow-up messages.',
            },
        ],
    },
    {
        category: 'Data & Privacy',
        questions: [
            {
                question: 'What data does Ai2 collect about me?',
                answer: 'We collect data necessary to improve your experience and the performance of Olmo as described in our general [Terms and Conditions of Use](https://allenai.org/terms/) and [Privacy Policy](https://allenai.org/privacy-policy/). This includes interaction data with the model, such as queries and responses.\n\nPlease do not include PII (personally identifiable information) or any other sensitive information in model prompts or elsewhere in the Playground.',
            },
            {
                question: 'Will my data be used to train Ai2 models?',
                answer: 'Text-based data that you submit will be used to train models after a process to remove identifying data. Your data will not be added to a public dataset unless you opt in through the "Data collection" menu in your user profile settings. Files such as images or video you submit will only be used to train Ai2 models if you opt in through the "Data collection" menu. Please see our [Terms of Use](https://allenai.org/terms/) and [Privacy Policy](https://allenai.org/privacy-policy/) for more information.',
            },
            {
                question: 'How is my data used to improve the Playground website’s performance?',
                answer: 'Your data helps us understand how users interact with the Playground and the models it serves. We use this interaction data to identify areas for improvement and to develop new features that advance the scientific and educational purposes of Ai2. We analyze aggregated data to inform updates and enhancements to ensure our models remain effective and relevant for scientific research and education in the public interest. Please see our [Terms of Use](https://allenai.org/terms/) and [Privacy Policy](https://allenai.org/privacy-policy/) for more information.',
            },
            {
                question: 'How can I opt out of Ai2 using my Playground data?',
                answer: 'You can remove your thread from our database by deleting your prompt history within 30 days of its creation. Click the “Delete Thread” button to delete your prompt and the generated response. Please note that you will need to delete your prompt history every 30 days if you do not wish to share any prompt information with us. Any data you submit and do not delete can be used to train models as described in our [Terms of Use](https://allenai.org/terms/) and [Privacy Policy](https://allenai.org/privacy-policy/). You can opt out of having your data shared in public datasets through the "Data collection" menu in your user profile settings.',
            },
            {
                question: 'How can I request my prompt history be deleted?',
                answer: 'You can use the “Delete Thread” button to delete your prompt and the generated response. Click the “History” button to view your historical prompts and use the “Delete Thread” button to delete threads (including image data when applicable) within the last 30 days. You can request that personal data be removed through our [Personal Data Removal Request form](https://docs.google.com/forms/d/1sTsGVb6TV5lXw2jH95u2nKGc0wQ3PqzFShJdzv8XgN0/edit?ts=68df4a57).',
                shortId: 'request-prompt-history-delete',
            },
            {
                question:
                    'Will Ai2 claim copyright over the outputs I generate with the Playground?',
                answer: 'No, we will not claim copyright over the outputs generated by the Playground.',
            },
            {
                question:
                    'Where can I find additional information about Ai2 Playground use and privacy?',
                answer: 'Please see [Terms of Use](https://allenai.org/terms/), [Privacy Policy](https://allenai.org/privacy-policy/) and [Responsible Use Guidelines](https://allenai.org/responsible-use) for detailed guidelines on use of Ai2 Playground.',
            },
        ],
    },
    {
        category: 'Safety & Trust',
        questions: [
            {
                question:
                    'I am a copyright holder and I’ve found my or my company’s copyrighted material displayed in Playground. How can I request that it be removed?',
                answer: 'Please submit a request on this [form](https://docs.google.com/forms/d/e/1FAIpQLSeKD4gs_NfizDWhmDmHAsfrZ9uYAmflYWHc3aQQIG-nKfcESw/viewform) and we will review it. Any display of copyrighted material in Playground results falls within fair use. Although Ai2 is not legally required to remove this material, we take requests from rights holders seriously and will remove specific content to the extent feasible out of respect for their creative efforts, balanced against the need for our AI artifacts to support open science and reproducible research experiments.',
            },
            {
                question:
                    'I noticed personally identifiable information in a model output or other results in the Playground. Where can I report this?',
                answer: 'Please submit a request on this [form](https://docs.google.com/forms/d/e/1FAIpQLSeW04KYtx8P8RdpMAz1eDouVHdMyXLS0kZ7dwa2GcvBqjfoyA/viewform) and we will review it. We use filtering, data minimization, anonymization and other responsible data privacy practices to prevent the inadvertent communication of PII on the Playground. We respect the rights of data subjects to request removal in compliance with law.',
            },
            {
                question:
                    'I’m seeing toxic content in model outputs or other results in the Playground. Where can I report this?',
                answer: 'We use industry standard moderation and filtering tools to prevent toxic results, so we are sorry to hear you encountered upsetting content. Please use the ‘flag’ functionality provided below the specific model output to indicate an inappropriate response. We study these flags to better understand where the model or the filtering may have gone wrong and how we can improve the response in the future.',
            },
        ],
    },
    {
        category: 'Voice transcription',
        questions: [
            {
                question: 'How does speech-to-text (STT) on the Playground work?',
                answer: 'The Ai2 Playground uses OlmoASR for speech-to-text functionality. OlmoASR is our open-source automatic speech recognition model trained from scratch on a curated, large-scale dataset to deliver low-latency, high-accuracy transcription.',
            },
            {
                question: 'How do I start an STT recording on the Playground?',
                answer: 'To interact with the LLMs in the Playground via your voice, click the microphone icon ![microphone icon](/icons/mic-icon.svg) in the chat input, grant microphone access when prompted, then simply speak your prompt.',
            },
            {
                question: 'How do I stop recording?',
                answer: 'When you’re finished speaking, click the check mark icon ![check mark icon](/icons/check-icon.svg) to see your fully transcribed query. Press the ![close](/icons/close-icon.svg) icon to cancel audio capture.',
            },
            {
                question: 'What are the limitations of OlmoASR?',
                answer: 'The Playground’s transcription feature has some limitations. It may not work equally well for all languages, accents, and dialects, and it may not recognize microphones on certain devices. Recordings are limited to 25 seconds in length.\n\nIf you’re encountering problems, please ensure that your web browser and operating system is up to date.',
            },
        ],
    },
] as const;

export const corpusLinkFaqs: FAQCategory[] = [
    {
        category: 'OlmoTrace',
        questions: [
            {
                question: 'What is OlmoTrace?',
                answer: 'OlmoTrace is a feature in the Ai2 Playground that traces the outputs of language models back to their full, multi-trillion-token training data in real time. With OlmoTrace, you can inspect where and how language models may have learned to generate certain word sequences. OlmoTrace is a one-of-a-kind feature and is made possible by Ai2’s commitment to making large pretraining and post-training datasets open in the interest of advancing scientific research in AI and public understanding of AI systems.',
            },
            {
                question:
                    'Did the model directly reference the documents presented by OlmoTrace when generating the response?',
                answer: 'No. Upon receiving a user prompt, our model first generates a response on its own, and then OlmoTrace scans the model response and retrieves matching documents. This is different from RAG (retrieval-augmented generation) systems, where the model generates responses conditioning on retrieved documents as part of its input context.',
            },
            {
                question: 'What do the different shades of the highlight color mean?',
                answer: 'The shades represent the level of relevance between the best document retrieved for a span and the overall model response. OlmoTrace computes a BM25 relevance score for each retrieved document, and buckets them into three levels: “high relevance”, “medium relevance”, and “low relevance”. A span’s shade is determined by the maximum relevance level achieved by the documents containing that span. Darker shade means higher maximum relevance level.',
            },
            {
                question: 'Why are some documents repeated in the OlmoTrace result?',
                answer: 'Because some documents are repeated in the training dataset of our models. OlmoTrace groups some repeated documents into the same card by matching the URL in their metadata, and you can inspect these repetitions by clicking “View all repeated documents” on the document card. However, there are documents with identical content but different URLs and they will show up as separate document cards.',
            },
            {
                question: 'Why do some highlighted spans begin or end in the middle of a word?',
                answer: 'OlmoTrace processes the model response in granularity of tokens. While it tries to avoid cutting off in the middle of words, there may be some uncaught corner cases.',
            },
            {
                question:
                    'Where do the documents come from? In which training stage is each document used?',
                answer: 'For each document retrieved, OlmoTrace shows its source (the dataset it comes from) and its usage in training. For example, our flagship model, [Olmo 2 32B Instruct](https://huggingface.co/allenai/Olmo-2-0325-32B-Instruct), was trained in 3 stages:\n&emsp;&emsp;1. Pre-training: the dataset is [olmo-mix-1124](https://huggingface.co/datasets/allenai/olmo-mix-1124). It contains mostly data from the web (the DCLM corpus), as well as other sources like wiki and arxiv.\n&emsp;&emsp;2. Mid-training: the dataset is [dolmino-mix-1124](https://huggingface.co/datasets/allenai/dolmino-mix-1124). It contains high-quality text data and a mixture of math-heavy data. Some documents in this dataset already appeared in the pretraining dataset, and we excluded them so as to reduce duplicates.\n&emsp;&emsp;3. Post-training: it has 3 sub-stages: \n&emsp;&emsp;&emsp;&emsp;a. Supervised fine-tuning (SFT): the dataset is [tulu-3-sft-olmo-2-mixture-0225](https://huggingface.co/datasets/allenai/tulu-3-sft-olmo-2-mixture-0225)\n&emsp;&emsp;&emsp;&emsp;b. Preference learning (DPO): the dataset is [olmo-2-0325-32b-preference-mix](https://huggingface.co/datasets/allenai/olmo-2-0325-32b-preference-mix)\n&emsp;&emsp;&emsp;&emsp;c. RL with verifiable rewards (RLVR): the dataset is [RLVR-GSM-MATH-IF-Mixed-Constraints](https://huggingface.co/datasets/allenai/RLVR-GSM-MATH-IF-Mixed-Constraints)\n\n We consider the union of all the above datasets as “training data” of the Olmo 2 32B Instruct model, and when matching model outputs with the training text we consider all these datasets.',
            },
        ],
    },
] as const;
