import { Alert, AlertTitle, Button, FormHelperText } from '@mui/material';
import { Fragment } from 'react';

export const ArchivedAlert = ({
    onRestore,
    disabled,
}: {
    onRestore: () => void;
    disabled?: boolean;
}) => (
    <Alert
        severity="warning"
        action={
            <Button disabled={disabled} variant="outlined" size="small" onClick={onRestore}>
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
        {data.map((d, i) => {
            return (
                <Fragment key={d}>
                    {d} {i < data.length - 1 ? <span>&#183; </span> : null}
                </Fragment>
            );
        })}
    </FormHelperText>
);
