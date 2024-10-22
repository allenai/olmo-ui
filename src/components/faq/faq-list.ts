import { getFAQAnchorLinkByShortId } from '@/components/faq/faq-utils';

export interface FAQ {
    question: string;
    answer: string | (() => string);
    shortId?: string; // assign it with a value and use it in your markdown link to achieve interlinking between questions
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
                answer: 'The Ai2 Playground allows you to interact with Ai2’s large language models and datasets in a user-friendly interface without the need to download anything. You can use it to test LLM capabilities and generate text based on prompts. And, unique to the Ai2 Playground, you can view documents from the pretraining data that have exact text matches in the model response with CorpusLink.\n\nRead more about the Ai2 Playground: [https://allenai.org/playground](https://allenai.org/playground)',
            },
            {
                question: 'Which countries and territories have access to the Playground?',
                answer: 'The Ai2 Playground is designed to be globally accessible, subject to compliance with applicable laws.',
            },
            {
                question: 'Does the Ai2 Playground support languages other than English?',
                answer: 'Currently, the Ai2 Playground is available only in English. OLMoE and OLMoE-mix also support only the English language.',
            },
            {
                question: 'How can I contact support?',
                answer: 'If you can’t find an answer to your question on this page, you can contact support by emailing support@allenai.org. Our dedicated team is ready to assist with technical issues, account inquiries, and general questions about OLMo and its framework.',
            },
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
                question: 'Can I change the email address associated with my account',
                answer: 'Your account is linked to your Google account. If you would like to change your email address, please sign in using a different Google account.',
            },
            {
                question: 'How do I delete my Playground account?',
                answer: () => {
                    const deleteSectionLink = getFAQAnchorLinkByShortId(
                        'request-prompt-history-delete'
                    );

                    return `Your Playground account is linked to your Google account and so cannot be deleted. Instead, you can remove the authorization to share data from your Google account with Ai2 via [third-party app management](https://support.google.com/accounts/answer/13533235?hl=en&ref_topic=7188760&sjid=15649851997490028435-NC) in your Google account. Please note that removing the authorization does not delete your prompt history from our database.  To [delete thread history](${deleteSectionLink}) click the ‘Delete Thread’ button.`;
                },
            },
        ],
    },
    {
        category: 'OLMo',
        questions: [
            {
                question: 'What is Ai2 OLMo?',
                answer: '[Ai2’s Open Language Model (OLMo)](https://allenai.org/olmo) is a highly performant, truly open large language model (LLM) framework intentionally designed to provide access to data, training code, models, and evaluation code necessary to advance the science of generative AI and to educate the general public about the capabilities of AI systems.',
            },
            {
                question: 'How accurate and reliable is OLMo-generated content?',
                answer: 'OLMo-generated content is built for research and educational purposes only. It is not intended to be accurate or reliable, but rather as a research tool and to help the general public better understand LLMs. Please do not rely on any OLMo-generated content and always use your best judgment, fact-check important information, and consider the context when interpreting OLMo. ',
            },
            {
                question: 'What type of data is used to train OLMo?',
                answer: 'OLMoE is trained on the Ai2 [OLMoE-mix-0924](https://huggingface.co/datasets/allenai/OLMoE-mix-0924) dataset, including a diverse mix of web content, academic publications, code, math, and encyclopedic materials. Use the Dataset Explorer in the Ai2 Playground to examine OLMoE-mix.',
            },
            {
                question: 'How up-to-date is OLMo’s training data?',
                answer: 'The OLMoE-Instruct model is trained on the [OLMoE-mix dataset](https://huggingface.co/datasets/allenai/OLMoE-mix-0924), which consists of training data collected up until December 2023. Accordingly, the OLMoE-Instruct model only includes events or publications before that date.',
            },
            {
                question: 'How are prompts flagged as inappropriate?',
                answer: 'We use Ai2’s WildGuard moderation tool to detect prompt harmfulness. In cases where the Playground flags a prompt as “inappropriate”, it indicates that WildGuard has identified the input as problematic or harmful.\n\nExamples of prompts that would be flagged as inappropriate are: *How do I make ricin?* Or *Write a Twitter thread posing as an expert about how vaccines cause autism.*\n\nTo learn more about WildGuard, read [The AI2 Safety Toolkit blog post](https://blog.allenai.org/the-ai2-safety-toolkit-datasets-and-models-for-safe-and-responsible-llms-development-10abc05f6c80) or [the WildGuard paper](https://www.semanticscholar.org/paper/WildGuard%3A-Open-One-Stop-Moderation-Tools-for-and-Han-Rao/deb3fccb5b68041ea0f5c724f08b2d840fa51eaa).',
                shortId: 'wildguard-intro',
            },
            {
                question: 'What is CorpusLink?',
                answer: 'CorpusLink is a Playground feature that links parts of the model output to documents in the training corpus. CorpusLink is designed to find verbatim matches between model outputs and the training corpus for text spans that are relatively long and relatively unique (appear at least once but not more than 10 times in the training corpus). We developed CorpusLink in the hope that researchers and the general public might find it helpful for inspecting where and how Ai2’s models ***might*** have learned to generate certain word sequences. CorpusLink is a one-of-a-kind feature and is only made possible by Ai2’s commitment to making large pretraining and post-training datasets open in the interest of advancing scientific research in AI and public understanding of AI systems.\n\nAfter the model generates a response to user input, several substrings of the model output will be highlighted, and a “CorpusLink” panel will show up on the right side of the screen. The highlights indicate relatively long substrings that appear verbatim at least once, but no more than 10 times, in the training corpus of this model. This encourages the highlighted spans to be informative and unique enough to warrant further inspection.\n\nIn the CorpusLink panel is a collection of documents from the training corpus that contain at least one of the highlighted substrings. Sometimes, an entire highlighted substring may not be present contiguously in any single document, but different parts of the substring are present (possibly in different documents) and together they cover the full substring.\n\nIf you click on a highlight, the CorpusLink panel will show documents corresponding to the highlighted substring. Click “Clear selection” or the highlight itself to show all highlights and documents again.',
                shortId: 'corpuslink-intro',
            },
            {
                question: 'Why are some CorpusLink documents repeated in the results?',
                answer: 'Because some documents are repeated in the training dataset of our models. If a document contains one of the spans and is retrieved, it means all its repetitions are retrieved as well. While we group some repeated documents into the same card by matching the URL in their metadata, there are documents with identical content but different URLs and they will show up as separate cards in the CorpusLink result.',
            },
            {
                question:
                    'How can I see which sources in the dataset were used to create the response to my OLMo prompt?',
                answer: 'Directly identifying which data in the dataset was used for a particular response is not currently feasible for a number of reasons:\n\n**Scale:** LLMs, including OLMo are trained on datasets which contain billions of text documents. Pinpointing the exact data used for a specific response would require sifting through an immense amount of information.\n**Aggregation:** During training, OLMo processes and aggregates information from numerous text sources. As a result, a single response may incorporate knowledge and patterns from a wide range of texts, making it impossible to attribute an output to any one particular source in the training data.\n**Embeddings:** LLMs, including OLMo, encode information from the dataset into high-dimensional vector representations known as embeddings. These embeddings capture semantic and syntactic relationships between words and phrases. While they retain the essence of the original data, it’s not possible to reverse-engineer them to identify specific sources because these embeddings represent the structure and meaning of the English language itself rather than any single instance of those semantic and syntactic relationships in a source text.',
            },
            {
                question: 'What am I allowed to do with generated responses from the Playground?',
                answer: 'The Ai2 Playground is intended for research and educational purposes.  You own the outputs of your prompts. For more details about what can be done with generated responses, please review Ai2’s [Terms of Use](https://allenai.org/terms/2024-09-25) and [Responsible Use Guidelines.](https://allenai.org/responsible-use)',
            },
            {
                question: 'Can OLMo be biased or produce inappropriate content?',
                answer: 'Yes, like any large language model trained on mostly unfiltered internet data, OLMo reflects existing biases and can generate toxic, unethical, and harmful content. We have tried to mitigate this when designing OLMo, but it still contains biases and will produce inappropriate content. Please be mindful of OLMo’s research and educational purposes and always use your best judgment when interpreting OLMo-generated content: OLMo is open to the public and research community to show precisely what LLMs can -- and can’t do -- based on the current state of the art. Pursuant to these scientific and educational purposes, Ai2 is providing open tools like Playground and OLMo to support the development of tools that will make LLMs less biased, safer, and more trustworthy in the future.\n\nRead more about [Ai2’s approach to safeguarding AI development](https://allenai.org/research-principles#safety) with open research',
            },
        ],
    },
    {
        category: 'Dataset Explorer',
        questions: [
            {
                question: 'What is the Ai2 Dataset Explorer?',
                answer: 'The Ai2 Dataset Explorer is an interactive part of the Ai2 Playground that allows you to delve into the dataset used to train [OLMo](https://allenai.org/olmo). Dataset Explorer provides insights into the diversity and composition of the training data used for OLMo, which enables public exploration of the types of information that contribute to the model. We hope this unique transparency into OLMO’s training data will support deeper scientific insights and greater understanding of the foundational elements of LLMs by the general public. Currently, Dataset Explorer tool indexes [OLMoE-mix-0924](https://huggingface.co/datasets/allenai/OLMoE-mix-0924).',
                shortId: 'dataset-explorer-intro',
            },
            {
                question: 'How are results generated and ranked in the Dataset Explorer?',
                answer: 'The Dataset Explorer retrieves documents that contain your query verbatim. For example, a search for the query ‘dataset explorer’ will retrieve documents that contain this string. Note that the query is case-sensitive. Documents are not ranked in a particular order. If you would like to narrow down the search results, try making the query longer and more specific.',
            },
            {
                question: 'How does the ‘harmful content’ filtering work?',
                answer: 'To minimize the risk of encountering documents with disturbing content while exploring the dataset, we’ve implemented a simple filter that scans document previews for offensive language. If the preview contains at least two different “bad” words or at least one “really bad” word, the text is automatically blurred. You have the option to reveal the blurred text if you choose to do so.\n\nPlease note that our filter only detects a specific predetermined set of toxic or offensive words, and this list is not intended to be comprehensive of all “bad” words or words you might find offensive. Although our filters will be running when you access the Dataset Explorer, you should still expect to encounter potentially offensive or harmful content not captured by those filters.',
            },
            {
                question:
                    'I found some potentially objectionable content in the Dataset Explorer. How can I report it for review?',
                answer: 'You can request a review of any document from the Dataset Explorer by selecting the “Flag for Review” button and providing an explanation for why the content should be reviewed. Your feedback helps us understand how to improve the presentation of results and how to improve our filters and safeguards for the Dataset Explorer. Please note that not all data flagged as objectionable will be removed from the Dataset Explorer because some objectionable content has a legitimate research purpose for researchers investigating bias, harmful content, and effective safety interventions.',
            },
            {
                question: 'Why do some of the links in the Dataset Explorer not work?',
                answer: 'As you explore the dataset, you might come across dead links; this is normal and dead links will increase in frequency as the dataset ages. Some sources may no longer be accessible because the open web is a living information ecosystem that is constantly evolving and replacing old content with new. If you’re looking to access archived internet resources, which may include the dataset source material, the Internet Archive’s [Wayback Machine](https://archive.org/web/) can be a valuable tool.',
            },
        ],
    },
    {
        category: 'Data & Privacy',
        questions: [
            {
                question: 'What data does Ai2 collect about me?',
                answer: 'We collect data necessary to improve your experience and the performance of OLMo as described in our general [Terms and Conditions of Use and Privacy Policy](https://allenai.org/terms/2024-09-25). This includes interaction data with the model, such as queries and responses, which we use to refine and enhance OLMo’s capabilities as a scientific and educational artifact and to improve our safety tools.\n\nPlease do not include PII (personally identifiable information) in OLMo prompts or Dataset Explorer searches.',
            },
            {
                question: 'How is my data used to improve the Playground’s performance?',
                answer: 'Your data helps us understand how users interact with the Playground, including the model and dataset presented on the Playground, in the Dataset Explorer, and through the CorpusLinks. We use this interaction data to identify areas for improvement and to develop new features that advance the scientific and educational purposes of OLMo. We analyze aggregated data to inform updates and enhancements to ensure OLMo remains effective and relevant for scientific research and education in the public interest. Please see our [Terms of Use](https://allenai.org/terms/2024-09-25) and [Privacy Policy](https://allenai.org/privacy-policy/2022-07-21) for more information.',
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
