import { OlmoStateCreator } from '@/AppContext';

export enum AlertMessageSeverity {
    Error = 'error',
    Info = 'info',
    Success = 'success',
    Warning = 'warning',
}

export enum SnackMessageType {
    Alert = 'alert',
    Brief = 'brief',
}

export type SnackMessage = {
    id: string;
    message: string;
} & (
    | {
          type: SnackMessageType.Alert;
          title: string;
          severity: AlertMessageSeverity;
      }
    | {
          type: SnackMessageType.Brief;
          title?: never;
          severity?: never;
      }
);

export function errorToAlert(id: string, title: string, error: unknown): SnackMessage {
    const message = error instanceof Error ? `${error.message} (${error.name})` : `${error}`;
    return {
        type: SnackMessageType.Alert,
        id,
        title,
        message,
        severity: AlertMessageSeverity.Error,
    };
}

export interface SnackMessageSlice {
    snackMessages: SnackMessage[];
    addSnackMessage: (message: SnackMessage) => void;
    deleteSnackMessage: (messageId: string) => void;
}

export const creatSnackMessageSlice: OlmoStateCreator<SnackMessageSlice> = (set) => ({
    snackMessages: [],
    // adds a message to the list of messages to show.
    // we show all messages not dismissed by the user until a new page load.
    addSnackMessage: (message: SnackMessage) => {
        set((state) => ({
            snackMessages: [...state.snackMessages, message],
        }));
    },
    // remove a message from the list.
    // this is usually accomplished by the user dismissing a message, but we can add logic to remove in other ways.
    deleteSnackMessage: (messageId: string) => {
        set((state) => ({
            snackMessages: state.snackMessages.filter((m) => m.id !== messageId),
        }));
    },
});
