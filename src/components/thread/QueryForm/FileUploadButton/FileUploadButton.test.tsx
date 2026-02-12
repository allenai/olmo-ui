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
    maxTotalFileSize: 5_242_880,
};

const defaultModel: Model = {
    id: 'Molmo',
    acceptsFiles: true,
    acceptedFileTypes: ['image/png'],
    promptType: 'multi_modal',
    description: '',
    informationUrl: 'https://allenai.org',
    host: 'modal',
    internal: false,
    isDeprecated: false,
    isVisible: true,
    modelType: 'chat',
    name: 'Molmo',
    maxTokensDefault: 2048,
    maxTokensLower: 1,
    maxTokensUpper: 2048,
    maxTokensStep: 1,
    stopDefault: null,
    temperatureDefault: 0.7,
    temperatureLower: 0,
    temperatureUpper: 1,
    temperatureStep: 0.01,
    topPDefault: 1,
    topPLower: 0.01,
    topPUpper: 1,
    topPStep: 0.01,
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
            <FileUploadButton name="files" {...props} />
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
        expect(screen.getByTestId('file-upload-btn')).toBeVisible();
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
