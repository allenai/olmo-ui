import { FieldError, Input, Select, SelectListBoxItem, Stack } from '@allenai/varnish-ui';
import { type ReactNode, useState } from 'react';

type FileSizeUnit = 'KiB' | 'MiB';

type FileSizeValue = { amount?: number; unit?: FileSizeUnit };

interface FileSizeInputProps {
    name: string;
    onChange: (value: string) => void;
    value?: string | number | { amount?: number; unit?: FileSizeUnit } | null;
    errorMessage?: ReactNode;
}

export const FileSizeInput = ({
    name,
    onChange,
    value = { amount: undefined, unit: 'KiB' },
    errorMessage,
}: FileSizeInputProps) => {
    const [fileSize, setFileSize] = useState<FileSizeValue>(() => {
        if (typeof value === 'object' && value != null) {
            return value;
        }

        if (typeof value === 'string') {
            const [amount, unit] = value.split(' ');
            return { amount: Number(amount), unit: unit as FileSizeUnit };
        }

        if (typeof value === 'number') {
            return { amount: value / 1024, unit: 'KiB' };
        }

        return { amount: undefined, unit: 'KiB' };
    });

    const handleChange = (newValue: FileSizeValue) => {
        if (!newValue.amount) {
            return;
        }

        const stringValue = `${newValue.amount} ${newValue.unit}`;
        onChange(stringValue);
    };

    return (
        <Stack direction="row" spacing={10}>
            <Input
                name={`${name}.amount`}
                label="File Size"
                type="number"
                inputMode="decimal"
                value={fileSize.amount?.toString()}
                onChange={(value) => {
                    const newValue = { ...fileSize, amount: Number(value) };
                    setFileSize(newValue);
                    handleChange(newValue);
                }}
            />
            <Select
                name={`${name}.unit`}
                label="Unit"
                selectedKey={fileSize.unit}
                onSelectionChange={(key) => {
                    const newValue = { ...fileSize, unit: key as FileSizeUnit };
                    setFileSize(newValue);
                    handleChange(newValue);
                }}>
                <SelectListBoxItem id="KiB" text="KiB" textValue="KiB" />
                <SelectListBoxItem id="MiB" text="MiB" textValue="MiB" />
            </Select>
            {!!errorMessage && <FieldError>{errorMessage}</FieldError>}
        </Stack>
    );
};
