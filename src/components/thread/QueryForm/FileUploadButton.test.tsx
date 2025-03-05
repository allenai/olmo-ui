import { render, screen } from '@test-utils';

import { Model } from '@/api/Model';
import * as AppContext from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';

import { FileUploadButton } from './FileUploadButton';

describe('FileUploadButton', () => {
    it('should render successfully when isMultiModalEnabled flag is enabled and the selected model accepts file upload', () => {
        const initialStates = {
            selectedModel: {
                id: 'Molmo',
                accepted_file_types: ['image/png'],
                accepts_files: true,
            },
            selectedThreadMessages: ['systemMessage', 'userMessage', 'llmMessage'],
        };
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        render(
            <FakeAppContextProvider initialState={initialStates}>
                <FileUploadButton />
            </FakeAppContextProvider>,
            {
                wrapperProps: {
                    featureToggles: {
                        isMultiModalEnabled: true,
                    },
                },
            }
        );

        expect(screen.getByLabelText('Upload file')).toBeVisible();
    });

    it('should be disabled if the model only accepts file upload for the first message', () => {
        const selectedModel = {
            id: 'Molmo',
            accepted_file_types: ['image/png'],
            require_file_to_prompt: 'first_message',
            accepts_files: true,
        } satisfies Model;
        const initialStates = {
            selectedModel,
            selectedThreadMessages: ['userMessage', 'llmMessage'],
        };
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        render(
            <FakeAppContextProvider initialState={initialStates}>
                <FileUploadButton />
            </FakeAppContextProvider>,
            {
                wrapperProps: {
                    featureToggles: {
                        isMultiModalEnabled: true,
                    },
                },
            }
        );

        expect(screen.getByTestId('file-upload-btn')).toBeDisabled();
    });

    it('should be disabled when prompt is being sent', () => {
        const initialStates = {
            selectedModel: {
                id: 'Molmo',
                accepted_file_types: ['image/png'],
                accepts_files: true,
            },
            selectedThreadMessages: ['userMessage', 'llmMessage'],
            streamPromptState: RemoteState.Loading,
        };
        vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

        render(
            <FakeAppContextProvider initialState={initialStates}>
                <FileUploadButton />
            </FakeAppContextProvider>,
            {
                wrapperProps: {
                    featureToggles: {
                        isMultiModalEnabled: true,
                    },
                },
            }
        );

        expect(screen.getByTestId('file-upload-btn')).toBeDisabled();
    });
});
