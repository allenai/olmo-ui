import { Message, parseMessage } from "@/api/Message";
import { appContext } from "@/AppContext";
import { Role } from '@/api/Role';

describe('SelectedThreadSlice', () => {
    it('should map and set a selected thread', () => {
        const setSelectedThread = appContext.getState().setSelectedThread;
        setSelectedThread(thread);
        expect(appContext.getState().selectedThreadRootId).equals(thread.id);
        expect(appContext.getState().selectedThreadMessages.length).equals(5);
        expect(Object.values(appContext.getState().selectedThreadMessagesById)).toEqual(5)

        const expectedMessage = {
            id: thread.id,
            children: thread.children ? thread.children?.map((childMessage) => childMessage.id) : [],
            selectedChildId: thread.children?.[0].id ?? '',
            content: thread.content,
            role: thread.role,
        }
        expect(appContext.getState().selectedThreadMessagesById[thread.id]).toEqual(expectedMessage);

        const expectedLastChild = {
            "children": null,
            "completion": "cpl_Z0L9Q5Z2C2",
            "content": "One.",
            "created": "2024-04-04T19:47:57.396638+00:00",
            "creator": "murphy@allenai.org",
            "deleted": null,
            "final": true,
            "id": "msg_X2T9X3L5M0",
            "labels": [],
            "logprobs": [],
            "model_type": "chat",
            "opts": {
                "logprobs": null,
                "max_tokens": 2048,
                "n": 1,
                "stop": null,
                "temperature": 1,
                "top_p": 1
            },
            "original": null,
            "parent": "msg_W1O3Y8E0J4",
            "private": false,
            "role": Role.LLM,
            "root": "msg_U6E0D4X1P4",
            "snippet": "One.",
            "template": null
        }
        expect(appContext.getState().selectedThreadMessagesById['msg_X2T9X3L5M0']).toEqual(expectedLastChild)
    })
});

const thread: Message = parseMessage({
    "children": [
        {
            "children": [
                {
                    "children": [
                        {
                            "children": [
                                {
                                    "children": [
                                        {
                                            "children": null,
                                            "completion": "cpl_Z0L9Q5Z2C2",
                                            "content": "One.",
                                            "created": "2024-04-04T19:47:57.396638+00:00",
                                            "creator": "murphy@allenai.org",
                                            "deleted": null,
                                            "final": true,
                                            "id": "msg_X2T9X3L5M0",
                                            "labels": [],
                                            "logprobs": [],
                                            "model_type": "chat",
                                            "opts": {
                                                "logprobs": null,
                                                "max_tokens": 2048,
                                                "n": 1,
                                                "stop": null,
                                                "temperature": 1,
                                                "top_p": 1
                                            },
                                            "original": null,
                                            "parent": "msg_W1O3Y8E0J4",
                                            "private": false,
                                            "role": Role.LLM,
                                            "root": "msg_U6E0D4X1P4",
                                            "snippet": "One.",
                                            "template": null
                                        }
                                    ],
                                    "completion": null,
                                    "content": "say one word",
                                    "created": "2024-04-04T19:47:57.389223+00:00",
                                    "creator": "murphy@allenai.org",
                                    "deleted": null,
                                    "final": true,
                                    "id": "msg_W1O3Y8E0J4",
                                    "labels": [],
                                    "logprobs": null,
                                    "model_type": null,
                                    "opts": {
                                        "logprobs": null,
                                        "max_tokens": 2048,
                                        "n": 1,
                                        "stop": null,
                                        "temperature": 1,
                                        "top_p": 1
                                    },
                                    "original": null,
                                    "parent": "msg_Y7H3X7B0E0",
                                    "private": false,
                                    "role": Role.User,
                                    "root": "msg_U6E0D4X1P4",
                                    "snippet": "say one word",
                                    "template": null
                                }
                            ],
                            "completion": "cpl_Z7D4B5S1Q0",
                            "content": "One.",
                            "created": "2024-04-04T19:47:02.880054+00:00",
                            "creator": "murphy@allenai.org",
                            "deleted": null,
                            "final": true,
                            "id": "msg_Y7H3X7B0E0",
                            "labels": [
                                {
                                    "comment": null,
                                    "created": new Date("2024-04-09T19:41:30.175762+00:00"),
                                    "creator": "murphy@allenai.org",
                                    "deleted": null,
                                    "id": "lbl_S2Q0K3L3I2",
                                    "message": "msg_Y7H3X7B0E0",
                                    "rating": 1
                                }
                            ],
                            "logprobs": [],
                            "model_type": "chat",
                            "opts": {
                                "logprobs": null,
                                "max_tokens": 2048,
                                "n": 1,
                                "stop": null,
                                "temperature": 1,
                                "top_p": 1
                            },
                            "original": null,
                            "parent": "msg_P5H4Y7O9N2",
                            "private": false,
                            "role": Role.LLM,
                            "root": "msg_U6E0D4X1P4",
                            "snippet": "One.",
                            "template": null
                        }
                    ],
                    "completion": null,
                    "content": "say one word",
                    "created": "2024-04-04T19:47:02.872148+00:00",
                    "creator": "murphy@allenai.org",
                    "deleted": null,
                    "final": true,
                    "id": "msg_P5H4Y7O9N2",
                    "labels": [],
                    "logprobs": null,
                    "model_type": null,
                    "opts": {
                        "logprobs": null,
                        "max_tokens": 2048,
                        "n": 1,
                        "stop": null,
                        "temperature": 1,
                        "top_p": 1
                    },
                    "original": null,
                    "parent": "msg_H4I0H5F0G5",
                    "private": false,
                    "role": Role.User,
                    "root": "msg_U6E0D4X1P4",
                    "snippet": "say one word",
                    "template": null
                }
            ],
            "completion": "cpl_M7C5B1X1A5",
            "content": "Fifty words is the minimum length required for a written communication to be considered a \"letter\" in the English language. In the past, letters were often written and exchanged for purposes of communication, and these requirements were established to ensure that the sender's message could be effectively conveyed. Today, the use of technology has made it increasingly common to communicate through other means, such as email or text message, but the tradition of using a written format for important communications remains.",
            "created": "2024-04-04T19:43:55.822429+00:00",
            "creator": "murphy@allenai.org",
            "deleted": null,
            "final": true,
            "id": "msg_H4I0H5F0G5",
            "labels": [
                {
                    "comment": null,
                    "created": new Date("2024-04-09T19:41:39.107441+00:00"),
                    "creator": "murphy@allenai.org",
                    "deleted": null,
                    "id": "lbl_S5D2O1Z7I5",
                    "message": "msg_H4I0H5F0G5",
                    "rating": 1
                }
            ],
            "logprobs": [],
            "model_type": "chat",
            "opts": {
                "logprobs": null,
                "max_tokens": 2048,
                "n": 1,
                "stop": null,
                "temperature": 1,
                "top_p": 1
            },
            "original": null,
            "parent": "msg_U6E0D4X1P4",
            "private": false,
            "role": Role.LLM,
            "root": "msg_U6E0D4X1P4",
            "snippet": "Fifty words is the minimum length required for a written communication to be considered a \"letter\"…",
            "template": null
        }
    ],
    "completion": null,
    "content": "say fifty words",
    "created": "2024-04-04T19:43:55.800770+00:00",
    "creator": "murphy@allenai.org",
    "deleted": null,
    "final": true,
    "id": "msg_U6E0D4X1P4",
    "labels": [],
    "logprobs": null,
    "model_type": null,
    "opts": {
        "logprobs": null,
        "max_tokens": 2048,
        "n": 1,
        "stop": null,
        "temperature": 1,
        "top_p": 1
    },
    "original": null,
    "parent": null,
    "private": false,
    "role": Role.User,
    "root": "msg_U6E0D4X1P4",
    "snippet": "say fifty words",
    "template": null
})
