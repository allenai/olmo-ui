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
                answer: 'Playground-generated content is built for research and educational purposes only and is intended to be used as a research tool to demonstrate model performance and to help the general public better understand AI models. Please do not rely on any Playground-generated content for accuracy and fact-check important information. Always use your best judgment and consider the context when interpreting Playground results.',
            },

            {
                question: 'Which models on the Playground are multimodal and how do I use them?',
                answer: 'Models with the "Multimodal" label can handle non-text input. The "Molmo" models require an image or video file to be sent with the first message. Note that Molmo models don’t allow additional files to be sent with follow-up messages after a thread has been started. If you would like to query Molmo about another image or video, start a new thread.',
            },
        ],
    },
    {
        category: 'Data & Privacy',
        questions: [
            {
                question: 'What data does Ai2 collect about me?',
                answer: 'We collect data necessary to improve your experience and the performance of the AI models made available in the Playground,as described in our general [Terms and Conditions of Use](https://allenai.org/terms/) and [Privacy Policy](https://allenai.org/privacy-policy/). This data includes your text conversations  with models on the Playground and any content you upload to a multimodal model (e.g. images or videos)..\n\nPlease do not include personal (e.g. names, addresses), sensitive (e.g. health, financial), or confidential/proprietary information in your conversations or uploads on Playground.',
            },
            {
                question: 'Will my data be used to train Ai2 models?',
                answer: 'Yes, your text inputs on and text outputs from models on the Playground will be used  to train AI models after a process to remove identifying data.  Files you upload to the Playground will only be used to train AI models if you opt-in to publishing your uploaded content in an open, public research dataset curated by Ai2 for research purposes. You may choose to contribute to open, public datasets when you accept the Terms of Use for the Playground during your first visit, and you may change your selection at any time through the "Data collection" menu. Please see our [Terms of Use](https://allenai.org/terms/) and [Privacy Policy](https://allenai.org/privacy-policy/) for more information.',
            },
            {
                question: 'How is my data used to improve the Playground website’s performance?',
                answer: 'Your data helps us understand how users interact with the Playground and the models available on the Playground. We use this interaction data to identify areas for improvement and to develop new features that advance the scientific and educational purposes of Ai2. We analyze aggregated data to inform updates and enhancements to ensure our models remain effective and relevant for scientific research and education in the public interest. Please see our [Terms of Use](https://allenai.org/terms/) and [Privacy Policy](https://allenai.org/privacy-policy/) for more information.',
            },
            {
                question: 'How can I remove my Playground conversations from future AI training?',
                answer: 'Although you cannot opt out of sharing your Playground conversations and uploads with Ai2, you can delete past threads from your prompt history. If you delete your thread within 30 days of creation, the text will be removed from the database Ai2 uses to train future AI models. Click the “Delete Thread” button to delete your prompt and the generated response. Please note that any prompts you submit and do not delete within 30 days may be used for AI training as described in our [Terms of Use](https://allenai.org/terms/) and [Privacy Policy](https://allenai.org/privacy-policy/).  Ai2 will not train future AI models on images or videos uploaded by users unless you opt-in to publishing your uploaded content in an open, public research dataset curated by Ai2 for research purposes.',
            },
            {
                question: 'How can I request my prompt history be deleted?',
                answer: 'You can use the “Delete Thread” button to delete your prompt and the generated response. Click the “History” button to view your historical prompts and use the “Delete Thread” button to delete threads (including image data when applicable) within the last 30 days. You can request that personal data be removed through our [Personal Data Removal Request form](https://docs.google.com/forms/d/1sTsGVb6TV5lXw2jH95u2nKGc0wQ3PqzFShJdzv8XgN0/edit?ts=68df4a57).',
                shortId: 'request-prompt-history-delete',
            },
            {
                question:
                    'How can I change my consent to publish my Playground interactions in open, public datasets curated by Ai2 for scientific research? ',
                answer: 'You can opt out of having your text conversations OR your uploaded content published in open, public research dataset, even after entering and using Playground. Navigate to the "Data collection" menu in your user profile settings, and then select _____ to change your publication consents. Your consent to publication will be applied on a going forward basis from the date of the change. Please note that revocation of consent to publication is not retroactive, and any conversations or uploads contributed before the change will remain in the open, public datasets curated by Ai2. ',
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
                question:
                    'What do the different shades of the highlight color mean in OlmoTrace results?',
                answer: 'The shades represent the level of relevance between the best document retrieved for a span and the overall model response. OlmoTrace computes a BM25 relevance score for each retrieved document, and buckets them into three levels: “high relevance”, “medium relevance”, and “low relevance”. A span’s shade is determined by the maximum relevance level achieved by the documents containing that span. Darker shade means higher maximum relevance level.',
            },
            {
                question: 'Why are some documents repeated in the OlmoTrace results?',
                answer: 'Because some documents are repeated in the training dataset of our models. OlmoTrace groups some repeated documents into the same card by matching the URL in their metadata, and you can inspect these repetitions by clicking “View all repeated documents” on the document card. Documents with identical content but different URLs and will show up as separate document cards.',
            },
            {
                question:
                    'Why do some highlighted spans in OlmoTrace begin or end in the middle of a word?',
                answer: 'OlmoTrace processes the model response based on tokens rather than words. While OlmoTrace tries to avoid cutting off spans in the middle of words, there may be some uncaught corner cases.',
            },
        ],
    },
] as const;
