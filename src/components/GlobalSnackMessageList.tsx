/**
 * Single display for all errors/messages passed to the app context.
 */

import { Alert, AlertTitle, Snackbar, SnackbarContent } from '@mui/material';

import { useAppContext } from '../AppContext';

const AUTO_HIDE_DURATION = 6000;

export const GlobalSnackMessageList = () => {
    const snackMessages = useAppContext((state) => state.snackMessages);
    const deleteSnackMessage = useAppContext((state) => state.deleteSnackMessage);
    const isOpen = snackMessages.length > 0;

    const handleClose = (id: string) => {
        return () => {
            deleteSnackMessage(id);
        };
    };

    return (
        <>
            {snackMessages.map((msg, index) => (
                <Snackbar
                    key={index}
                    open={isOpen}
                    autoHideDuration={AUTO_HIDE_DURATION}
                    onClose={handleClose(msg.id)}>
                    {msg.type === 'Alert' ? (
                        <Alert
                            key={msg.id}
                            onClose={handleClose(msg.id)}
                            severity={msg.severity}
                            variant="filled">
                            <AlertTitle>{msg.title}</AlertTitle>
                            {msg.message}
                        </Alert>
                    ) : (
                        <SnackbarContent message={msg.message} />
                    )}
                </Snackbar>
            ))}
        </>
    );
};
