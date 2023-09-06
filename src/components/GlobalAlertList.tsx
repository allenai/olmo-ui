/**
 * Single display for all errors/messages passed to the app context.
 */

import React from 'react';
import { Alert, AlertTitle, Stack } from '@mui/material';

import { useAppContext } from '../AppContext';

export enum AlertMessageSeverity {
    Error = 'error',
    Info = 'info',
    Success = 'success',
    Warning = 'warning',
}

export interface AlertMessage {
    id: string;
    title: string;
    message: string;
    severity: AlertMessageSeverity;
}

export const GlobalAlertList = () => {
    const { alertMessages, deleteAlertMessage } = useAppContext();

    const handleClose = (id: string) => {
        deleteAlertMessage(id);
    };

    return (
        <Stack spacing={1} paddingBottom={1}>
            {alertMessages.map((msg) => (
                <Alert key={msg.id} onClose={() => handleClose(msg.id)} severity={msg.severity}>
                    <AlertTitle>{msg.title}</AlertTitle>
                    {msg.message}
                </Alert>
            ))}
        </Stack>
    );
};
