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
    max_tokens_default: 2048,
    max_tokens_lower: 1,
    max_tokens_upper: 2048,
    max_tokens_step: 1,
    stop_default: null,
    temperature_default: 0.7,
    temperature_lower: 0,
    temperature_upper: 1,
    temperature_step: 0.01,
    top_p_default: 1,
    top_p_lower: 0.01,
    top_p_upper: 1,
    top_p_step: 0.01,
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
    it('should render when selected model accepts file uploads', () => {
        renderFileUploadButton();
        expect(screen.getByLabelText('Upload file(s)')).toBeVisible();
    });

    //
    it.skip("should be disabled if the model doesn't accept file uploads for followup messages", () => {
        renderFileUploadButton({
            isFileUploadDisabled: false,
            allowFilesInFollowups: false,
        });

        expect(screen.getByTestId('file-upload-btn')).toBeDisabled();
    });

    it('should be disabled when prompt is being sent', () => {
        renderFileUploadButton(
            {
                isSendingPrompt: true,
                allowFilesInFollowups: false,
            },
            {
                streamPromptState: RemoteState.Loading,
            }
        );

        expect(screen.getByTestId('file-upload-btn')).toBeDisabled();
    });
});
