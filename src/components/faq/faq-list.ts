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
                answer: 'If you can’t find an answer to your question on this page, please contact support by emailing support@allenai.org. Our dedicated team is ready to assist with technical issues, account inquiries, and general questions about Ai2 models and their frameworks.',
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
                answer: 'You can create an account by signing in via your Google account. We plan to extend support to other sign-in methods in the future.',
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
                answer: '[Tülu 3](https://allenai.org/tulu) is a top-performing instruction model family with fully open fine-tuning data, code, and recipes to serve as a guidebook for modern post-training. Tülu 3 is a fine-tuned version of Llama 3 that was trained on a mix of publicly available, synthetic, and human datasets. The Playground is serving both 70B and 8B. ',
            },
            {
                question: 'What type of data is used to train the models?',
                answer: 'We produce Llama Tülu3 models through a three-stage post-training recipe on top of pre-trained language models. Our post-training process begins with collecting a variety of prompts to be allocated across multiple stages of optimization. We perform supervised fine-tuning on new capability-focused synthetic data mixed with existing instruction datasets. We then perform preference tuning on on-policy synthetic preference data. We finish training Llama Tülu3 with our new method, Reinforcement Learning with Verifiable Rewards.',
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
                answer: 'Your data helps us understand how users interact with the Playground and the models it serves.  We use this interaction data to identify areas for improvement and to develop new features that advance the scientific and educational purposes of Ai2. We analyze aggregated data to inform updates and enhancements to ensure our models remain effective and relevant for scientific research and education in the public interest. Please see our [Terms of Use](https://allenai.org/terms/2024-09-25) and [Privacy Policy](https://allenai.org/privacy-policy/2022-07-21) for more information.',
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
