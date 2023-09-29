import React from 'react';
import { Alert, Button, FormHelperText, AlertTitle } from '@mui/material';

export const ArchivedAlert = ({ onRestore }: { onRestore: () => void }) => (
    <Alert
        severity="warning"
        action={
            <Button variant="outlined" size="small" onClick={onRestore}>
                Restore Data Chip
            </Button>
        }>
        <AlertTitle>This Data Chip has been archived.</AlertTitle>
        It may still be in use in previous messages. However, it is not an option for future
        messages.
    </Alert>
);

export const Metadata = ({ data }: { data: string[] }) => (
    <FormHelperText>
        {data.map((d, j) => {
            return (
                <React.Fragment key={d}>
                    {d} {j < data.length - 1 ? <span>&#183; </span> : null}
                </React.Fragment>
            );
        })}
    </FormHelperText>
);
