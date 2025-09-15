import { render, screen } from '@test-utils';
import type { DeepPartial } from 'react-hook-form';

import type { Model } from '@/api/playgroundApi/additionalTypes';
import type { AppContextState } from '@/AppContext';
import * as AppContext from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';

import { FileUploadButton, type FileuploadPropsBase } from './FileUploadButton';

const defaultFileUploadProps: FileuploadPropsBase = {
    isFileUploadDisabled: false,
    isSendingPrompt: false,
    acceptsFileUpload: true,
    acceptedFileTypes: ['image/png'],
    acceptsMultiple: false,
    allowFilesInFollowups: true,
};

const defaultModel: Model = {
    id: 'Molmo',
    accepts_files: true,
    accepted_file_types: ['image/png'],
    prompt_type: 'multi_modal',
    description: '',
    information_url: 'https://allenai.org',
    host: 'modal',
    internal: false,
    is_deprecated: false,
    is_visible: true,
    model_type: 'chat',
    name: 'Molmo',
};

const renderFileUploadButton = (
    propsOverrides: Partial<FileuploadPropsBase> = {},
    contextOverrides: DeepPartial<AppContextState> = {}
) => {
    const initialStates = {
        selectedModel: defaultModel,
        selectedThreadMessages: ['systemMessage', 'userMessage', 'llmMessage'],
        ...contextOverrides,
    };

    const props = { ...defaultFileUploadProps, ...propsOverrides };

    vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

    return render(
        <FakeAppContextProvider initialState={initialStates}>
            <FileUploadButton {...props} />
        </FakeAppContextProvider>,
        {
            wrapperProps: {
                featureToggles: {
                    isMultiModalEnabled: true,
                },
            },
        }
    );
};

describe('FileUploadButton', () => {
    it('should render successfully when isMultiModalEnabled flag is enabled and the selected model accepts file upload', () => {
        renderFileUploadButton();
        expect(screen.getByLabelText('Upload file')).toBeVisible();
    });

    it("should be disabled if the model doesn't accept file uploads for followup messages", () => {
        renderFileUploadButton(
            {
                isFileUploadDisabled: true,
                allowFilesInFollowups: false,
            },
            {
                selectedThreadMessages: ['userMessage', 'llmMessage'],
            }
        );

        expect(screen.getByTestId('file-upload-btn')).toBeDisabled();
    });

    it('should be disabled when prompt is being sent', () => {
        renderFileUploadButton(
            {
                isSendingPrompt: true,
                allowFilesInFollowups: false,
            },
            {
                selectedThreadMessages: ['userMessage', 'llmMessage'],
                streamPromptState: RemoteState.Loading,
            }
        );

        expect(screen.getByTestId('file-upload-btn')).toBeDisabled();
    });
});
