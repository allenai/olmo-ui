import { MessageChunk, Thread } from '@/api/playgroundApi/thread';
import { Role } from '@/api/Role';

export const MULTI_MODAL_USER_MESSAGE_ID = 'multi-modal-count';
const MULTI_MODAL_MESSAGE_ID = 'multi-modal-count-response';
export const fakeMultiModalStreamMessages: Array<Thread | MessageChunk> = [
    {
        id: MULTI_MODAL_USER_MESSAGE_ID,
        messages: [
            {
                content: 'multimodaltest: count the boats',
                snippet: 'multimodaltest: count the boats',
                creator: 'murphy@allenai.org',
                role: Role.User,
                opts: {
                    maxTokens: 2048,
                    temperature: 1,
                    n: 1,
                    topP: 1,
                },
                root: MULTI_MODAL_USER_MESSAGE_ID,
                created: new Date().toDateString(),
                fileUrls: [
                    'https://storage.googleapis.com/ai2-playground-molmo/msg_U4F9V3S4C1/msg_U4F9V3S4C1-0.png',
                ],
                final: false,
                private: false,
                labels: [],
                id: '',
                isLimitReached: false,
                isOlderThan30Days: false,
                modelHost: '',
                modelId: '',
            },
            {
                id: MULTI_MODAL_MESSAGE_ID,
                content: '',
                snippet: '',
                creator: 'murphy@allenai.org',
                role: Role.LLM,
                opts: {
                    maxTokens: 2048,
                    temperature: 1,
                    n: 1,
                    topP: 1,
                },
                root: MULTI_MODAL_USER_MESSAGE_ID,
                created: new Date().toDateString(),
                parent: MULTI_MODAL_USER_MESSAGE_ID,
                final: false,
                private: false,
                modelType: 'chat',
                labels: [],
                isLimitReached: false,
                isOlderThan30Days: false,
                modelHost: '',
                modelId: '',
            },
        ],
    },
    {
        message: MULTI_MODAL_MESSAGE_ID,
        content: '',
    },
    {
        message: MULTI_MODAL_MESSAGE_ID,
        content:
            'Counting the <points x1="9.1" y1="11.7" x2="17.2" y2="41.3" x3="19.6" y3="3.4" x4="26.8" y4="54.4" x5="30.8" y5="1.6" x6="34.1"',
    },
    {
        message: MULTI_MODAL_MESSAGE_ID,
        content:
            ' y6="75.6" x7="36.0" y7="9.9" x8="37.5" y8="28.3" x9="40.9" y9="0.6" x10="43.4" y10="12.4" x11="45.9" y11="27.8" x12="47.8" y12="1.4" x13="51.9" y13="41.6" x14="53.7" y14="26.6" x15="54.6" y15="63.2" x16="56.9" y16="8.2" x17="59.2" ',
    },
    {
        message: MULTI_MODAL_MESSAGE_ID,
        content:
            'y17="40.0" x18="60.3" y18="85.9" x19="63.1" y19="27.3" x20="64.7" y20="5.8" x21="65.3" y21="61.4" x22="68.8" y22="38.7" x23="70.8" y23="5.6" x24="75.0" y24="60.5" x25="79.5" y25="35.4" x26="80.2" y26="82.2" x27="80.3" y27="21.2" x28="84.5" y28="57.7" x29="85.3" y29="22.2" x30="86.2" y30="6.2" x31="91.6" y31="3.4" x32="93.8" y32="55.7" x33="94.1" y33="33.1" x34="96.8" y34="21.7" x35="98.4" y35="2.6" x36="99.3" y36="54.4" x37="99.5" y37="20.9" alt="the boats">the boats</po',
    },
    {
        message: MULTI_MODAL_MESSAGE_ID,
        content: 'ints> shows a total of 37.',
    },
    {
        id: MULTI_MODAL_USER_MESSAGE_ID,
        messages: [
            {
                content: 'multimodaltest: count the boats',
                snippet: 'multimodaltest: count the boats',
                creator: 'murphy@allenai.org',
                role: Role.User,
                opts: {
                    maxTokens: 2048,
                    temperature: 1,
                    n: 1,
                    topP: 1,
                },
                root: MULTI_MODAL_USER_MESSAGE_ID,
                created: new Date().toDateString(),
                final: true,
                private: false,
                labels: [],
                id: '',
                isLimitReached: false,
                isOlderThan30Days: false,
                modelHost: '',
                modelId: '',
            },
            {
                id: MULTI_MODAL_MESSAGE_ID,
                content:
                    'Counting the <points x1="9.1" y1="11.7" x2="17.2" y2="41.3" x3="19.6" y3="3.4" x4="26.8" y4="54.4" x5="30.8" y5="1.6" x6="34.1" y6="75.6" x7="36.0" y7="9.9" x8="37.5" y8="28.3" x9="40.9" y9="0.6" x10="43.4" y10="12.4" x11="45.9" y11="27.8" x12="47.8" y12="1.4" x13="51.9" y13="41.6" x14="53.7" y14="26.6" x15="54.6" y15="63.2" x16="56.9" y16="8.2" x17="59.2" y17="40.0" x18="60.3" y18="85.9" x19="63.1" y19="27.3" x20="64.7" y20="5.8" x21="65.3" y21="61.4" x22="68.8" y22="38.7" x23="70.8" y23="5.6" x24="75.0" y24="60.5" x25="79.5" y25="35.4" x26="80.2" y26="82.2" x27="80.3" y27="21.2" x28="84.5" y28="57.7" x29="85.3" y29="22.2" x30="86.2" y30="6.2" x31="91.6" y31="3.4" x32="93.8" y32="55.7" x33="94.1" y33="33.1" x34="96.8" y34="21.7" x35="98.4" y35="2.6" x36="99.3" y36="54.4" x37="99.5" y37="20.9" alt="the boats">the boats</points> shows a total of 37.',
                snippet:
                    'Counting the <points x1="9.1" y1="11.7" x2="17.2" y2="41.3" x3="19.6" y3="3.4" x4="26.8" y4="54.4" x5="30.8" y5="1.6" x6="34.1" y6="75.6" x7="36.0" y7="9.9" x8="37.5" y8="28.3" x9="40.9" y9="0.6" x10="43.4" y10="12.4" x11="45.9" y11="27.8" x12="47.8" y12="1.4" x13="51.9" y13="41.6" x14="53.7" y14="26.6" x15="54.6" y15="63.2" x16="56.9" y16="8.2" x17="59.2" y17="40.0" x18="60.3" y18="85.9" x19="63.1" y19="27.3" x20="64.7" y20="5.8" x21="65.3" y21="61.4" x22="68.8" y22="38.7" x23="70.8" y23="5.6" x24="75.0" y24="60.5" x25="79.5" y25="35.4" x26="80.2" y26="82.2" x27="80.3" y27="21.2" x28="84.5" y28="57.7" x29="85.3" y29="22.2" x30="86.2" y30="6.2" x31="91.6" y31="3.4" x32="93.8" y32="55.7" x33="94.1" y33="33.1" x34="96.8" y34="21.7" x35="98.4" y35="2.6" x36="99.3" y36="54.4" x37="99.5" y37="20.9" alt="the boats">the boats</points> shows a total of 37.',
                creator: 'murphy@allenai.org',
                role: Role.LLM,
                opts: {
                    maxTokens: 2048,
                    temperature: 1,
                    n: 1,
                    topP: 1,
                },
                root: MULTI_MODAL_USER_MESSAGE_ID,
                created: new Date().toDateString(),
                parent: MULTI_MODAL_USER_MESSAGE_ID,
                // logprobs: [],
                completion: 'cpl_R5T5K6B4C9',
                final: true,
                private: false,
                modelType: 'chat',
                labels: [],
                isLimitReached: false,
                isOlderThan30Days: false,
                modelHost: '',
                modelId: '',
            },
        ],
    },
];
