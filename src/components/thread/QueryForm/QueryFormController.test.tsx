// @vitest-environment happy-dom

import { IDLE_NAVIGATION } from '@remix-run/router';
import { screen, waitFor } from '@test-utils';
import userEvent from '@testing-library/user-event';
import type { PropsWithChildren } from 'react';
import type { DeepPartial } from 'react-hook-form';

import type { AppContextState } from '@/AppContext';
import * as AppContext from '@/AppContext';
import { FakeAppContextProvider, useFakeAppContext } from '@/utils/FakeAppContext';
import { renderWithRouter } from '@/utils/test/TestWrapper';

import { QueryFormController } from './QueryFormController';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigation: vi.fn(() => IDLE_NAVIGATION),
    };
});

vi.mock('@/contexts/StreamEventRegistry', () => ({
    useStreamEvent: vi.fn(),
    StreamEventRegistryProvider: ({ children }: PropsWithChildren) => children,
}));

const defaultFileUploadProps = {
    isFileUploadDisabled: false,
    isSendingPrompt: false,
    acceptsFileUpload: true,
    acceptedFileTypes: ['image/*', 'video/*'],
    acceptsMultiple: true,
    allowFilesInFollowups: true,
    maxFilesPerMessage: 10,
    maxTotalFileSize: 5_242_880,
};

const defaultProps = {
    handleSubmit: vi.fn(),
    canEditThread: true,
    placeholderText: 'Enter your prompt',
    autofocus: false,
    areFilesAllowed: true,
    getThreadViewModel: () => undefined,
    onAbort: vi.fn(),
    canPauseThread: false,
    isLimitReached: false,
    fileUploadProps: defaultFileUploadProps,
};

const renderQueryFormController = (
    propsOverrides = {},
    contextOverrides: DeepPartial<AppContextState> = {}
) => {
    const initialStates = {
        isTranscribing: false,
        isProcessingAudio: false,
        ...contextOverrides,
    };

    const props = { ...defaultProps, ...propsOverrides };

    vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

    return renderWithRouter(
        <FakeAppContextProvider initialState={initialStates}>
            <QueryFormController modelSupportsPointingInput={false} {...props} />
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

// helper function to create a mock File
const createMockFile = (name: string, type: string): File => {
    const file = new File(['content'], name, { type });
    return file;
};

describe('QueryFormController - File Upload Validation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render successfully', () => {
        renderQueryFormController();
        expect(screen.getByPlaceholderText('Enter your prompt')).toBeInTheDocument();
    });

    describe('File validation', () => {
        it('should accept a single image file', async () => {
            const { container } = renderQueryFormController();

            // FileTrigger renders a hidden input
            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
            expect(fileInput).toBeInTheDocument();

            const file = createMockFile('test-image.jpg', 'image/jpeg');

            await userEvent.upload(fileInput, file);

            // Should not show any error
            expect(screen.queryByText(/Maximum.*allowed/)).not.toBeInTheDocument();
        });

        it('should accept a single video file', async () => {
            const { container } = renderQueryFormController();

            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
            expect(fileInput).toBeInTheDocument();

            const file = createMockFile('test-video.mp4', 'video/mp4');

            await userEvent.upload(fileInput, file);

            // Should not show any error
            expect(screen.queryByText(/Maximum.*allowed/)).not.toBeInTheDocument();
        });

        it('should accept up to 10 image files', async () => {
            const { container } = renderQueryFormController();

            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
            expect(fileInput).toBeInTheDocument();

            const files = Array.from({ length: 10 }, (_, i) =>
                createMockFile(`image-${i}.jpg`, 'image/jpeg')
            );

            await userEvent.upload(fileInput, files);

            // Should not show any error
            expect(screen.queryByText(/Maximum.*allowed/)).not.toBeInTheDocument();
        });

        it('should reject more than 10 image files', async () => {
            const { container } = renderQueryFormController();

            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
            expect(fileInput).toBeInTheDocument();

            const files = Array.from({ length: 11 }, (_, i) =>
                createMockFile(`image-${i}.jpg`, 'image/jpeg')
            );

            const user = userEvent.setup();
            await user.upload(fileInput, files);

            // Should show error
            await waitFor(() => {
                expect(screen.getByText('Maximum 10 images allowed.')).toBeInTheDocument();
            });
        });

        it('should reject more than 1 video file', async () => {
            const { container } = renderQueryFormController();

            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
            expect(fileInput).toBeInTheDocument();

            const files = [
                createMockFile('video-1.mp4', 'video/mp4'),
                createMockFile('video-2.mp4', 'video/mp4'),
            ];

            const user = userEvent.setup();
            await user.upload(fileInput, files);

            // Should show error
            await waitFor(() => {
                expect(screen.getByText('Maximum 1 video allowed.')).toBeInTheDocument();
            });
        });

        it('should validate after removing a file', async () => {
            const { container } = renderQueryFormController();

            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
            expect(fileInput).toBeInTheDocument();

            const files = Array.from({ length: 11 }, (_, i) =>
                createMockFile(`image-${i}.jpg`, 'image/jpeg')
            );

            const user = userEvent.setup();
            await user.upload(fileInput, files);

            // Should show error initially
            await waitFor(() => {
                expect(screen.getByText('Maximum 10 images allowed.')).toBeInTheDocument();
            });

            const removeButtons = screen.getAllByLabelText(/remove/i);
            await user.click(removeButtons[0]);

            // Error should disappear after removing a file
            await waitFor(() => {
                expect(screen.queryByText('Maximum 10 images allowed.')).not.toBeInTheDocument();
            });
        });
    });

    describe('File upload disabled states', () => {
        it('should disable file upload button when prompt is being sent', () => {
            renderQueryFormController({
                fileUploadProps: {
                    ...defaultFileUploadProps,
                    isSendingPrompt: true,
                },
            });

            const uploadButton = screen.getByTestId('file-upload-btn');
            expect(uploadButton).toBeDisabled();
        });

        it('should not show file upload button when acceptsFileUpload is false', () => {
            renderQueryFormController({
                fileUploadProps: {
                    ...defaultFileUploadProps,
                    acceptsFileUpload: false,
                },
            });

            expect(screen.queryByTestId('file-upload-btn')).not.toBeInTheDocument();
        });
    });
});
