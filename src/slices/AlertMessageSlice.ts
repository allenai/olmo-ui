import { StateCreator } from 'zustand';

import { AlertMessage, AlertMessageSeverity } from '../components/GlobalAlertList';

export interface AlertMessageSlice {
    alertMessages: AlertMessage[];
    addAlertMessage: (newAlertMessage: AlertMessage) => void;
    deleteAlertMessage: (alertMessageId: string) => void;
}

export function errorToAlert(id: string, title: string, error: any): AlertMessage {
    const message = error instanceof Error ? `${error.message} (${error.name})` : `${error}`;
    return { id, title, message, severity: AlertMessageSeverity.Error };
}

export const createAlertMessageSlice: StateCreator<AlertMessageSlice> = (set) => ({
    alertMessages: [],
    // adds a message to the list of messages to show.
    // we show all messages not dismissed by the user until a new page load.
    addAlertMessage: (newAlertMessage) => {
        set((state) => ({
            alertMessages: [...state.alertMessages, newAlertMessage],
        }));
    },
    // remove a message from the list.
    // this is usually accomplished by the user dismissing a message, but we can add logic to remove in other ways.
    deleteAlertMessage: (alertMessageId) => {
        set((state) => ({
            alertMessages: state.alertMessages.filter((m) => m.id !== alertMessageId),
        }));
    },
});
