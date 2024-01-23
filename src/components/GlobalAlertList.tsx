/**
 * Single display for all errors/messages passed to the app context.
 */

import React from 'react';
import { Alert, AlertTitle, Snackbar } from '@mui/material';

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

const ALERT_HIDE_DURATION = 6000;

export const GlobalAlertList = () => {
    const { alertMessages, deleteAlertMessage } = useAppContext();
    const isOpen = alertMessages.length > 0;

    const handleClose = (id: string) => {
        return () => deleteAlertMessage(id);
    };

    return (
        <>
            {alertMessages.map((msg) => (
                <Snackbar
                    open={isOpen}
                    autoHideDuration={ALERT_HIDE_DURATION}
                    onClose={handleClose(msg.id)}>
                    <Alert
                        key={msg.id}
                        onClose={handleClose(msg.id)}
                        severity={msg.severity}
                        sx={{ width: '100%' }}
                        variant="filled">
                        <AlertTitle>{msg.title}</AlertTitle>
                        {msg.message}
                    </Alert>
                </Snackbar>
            ))}
        </>
    );
};
