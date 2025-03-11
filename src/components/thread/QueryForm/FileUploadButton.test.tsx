import { render, screen } from '@test-utils';

import * as AppContext from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';

import { FileUploadButton } from './FileUploadButton';

describe('FileUploadButton', () => {
    it('should render successfully when isMultiModalEnabled flag is enabled and the selected model accepts file upload', () => {
        const initialStates = {
            selectedModel: {
                id: 'Molmo',
                accepts_files: true,
                accepted_file_types: ['image/png'],
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

    it("should be disabled if the model doesn't accept file uploads for followup messages", () => {
        const initialStates = {
            selectedModel: {
                id: 'Molmo',
                accepts_files: true,
                accepted_file_types: ['image/png'],
                allow_files_in_followups: false,
            },
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
                accepts_files: true,
                accepted_file_types: ['image/png'],
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
