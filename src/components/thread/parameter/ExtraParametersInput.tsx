import { Button, Modal } from '@allenai/varnish-ui';
import { type JsonData, JsonEditor } from 'json-edit-react';
import { useState } from 'react';

import { useQueryContext } from '@/contexts/QueryContext';

const ExtraParametersModal = ({
    isOpen,
    onOpenChange,
}: {
    isOpen: boolean;
    onOpenChange?: (isOpen: boolean) => void;
}) => {
    return (
        <Modal
            isDismissable
            fullWidth
            heading="Extra parameters"
            size="large"
            isOpen={isOpen}
            onOpenChange={onOpenChange}>
            <p>
                Add extra parameters to send to the model. These will be sent on the request through
                the <code>extra_body</code> parameter.
            </p>
            <ExtraParametersInput />
        </Modal>
    );
};

export const ExtraParametersInput = () => {
    const { extraParameters, setExtraParameters } = useQueryContext();

    const handleData = (data: JsonData) => {
        if (typeof data === 'object') {
            if (data == null || Array.isArray(data)) {
                // something weird happened
            } else {
                setExtraParameters(data as Record<string, unknown>);
            }
        }
    };

    return (
        <JsonEditor
            id="extra-parameters"
            data={extraParameters ?? {}}
            setData={handleData}
            rootName="params"
            maxWidth="100%"
        />
    );
};

export const ExtraParametersToggle = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button
                size="small"
                color="primary"
                variant="text"
                onClick={() => {
                    setIsModalOpen(true);
                }}>
                Add extra parameters
            </Button>
            <ExtraParametersModal
                isOpen={isModalOpen}
                onOpenChange={(isOpen) => {
                    setIsModalOpen(isOpen);
                }}
            />
        </>
    );
};
