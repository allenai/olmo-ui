import { GridSortDirection } from '@mui/x-data-grid';

import { OlmoStateCreator } from '@/AppContext';
import {
    CreateLabelRequest,
    Label,
    LabelApiUrl,
    LabelClient,
    LabelList,
    LabelsApiUrl,
    LabelsClient,
} from '../api/Label';
import { Message } from '../api/Message';
import { RemoteState } from '../contexts/util';
import { errorToAlert } from './AlertMessageSlice';

export interface LabelSlice {
    labelRemoteState?: RemoteState;
    allLabelsRemoteState?: RemoteState;
    label: Label | null;
    deleteLabel: (labelId: string, msg: Message) => Promise<void>;
    postLabel: (newLabel: CreateLabelRequest, msg: Message) => Promise<void>;
    updateLabel: (
        newLabelRequest: CreateLabelRequest,
        currentLabel?: Label
    ) => Promise<Label | undefined>;
    allLabels: LabelList | null;
    getAllLabels: (offset: number, size: number) => Promise<void>;
    getAllSortedLabels: (field: string, sort: GridSortDirection) => Promise<void>;
    getAllFilteredLabels: (creator?: string, message?: string, rating?: number) => Promise<void>;
}

const labelClient = new LabelClient();
const labelsClient = new LabelsClient();

export const createLabelSlice: OlmoStateCreator<LabelSlice> = (set, get) => ({
    labelRemoteState: undefined,
    allLabelsRemoteState: undefined,
    label: null,
    allLabels: null,

    deleteLabel: async (labelId: string, message: Message): Promise<void> => {
        const { addAlertMessage } = get();
        set({ labelRemoteState: RemoteState.Loading });
        try {
            await labelClient.deleteLabel(labelId);

            // EFFECT: add the label to the correct message
            message.labels = [];

            set({ labelRemoteState: RemoteState.Loaded });
        } catch (err) {
            addAlertMessage(
                errorToAlert(
                    `delete-${LabelApiUrl}-${labelId}-${new Date().getTime()}`.toLowerCase(),
                    `Error deleting label. ${labelId}`,
                    err
                )
            );
            set({ labelRemoteState: RemoteState.Error });
        }
    },

    postLabel: async (newLabel: CreateLabelRequest, message: Message): Promise<void> => {
        const { addAlertMessage } = get();
        set({ labelRemoteState: RemoteState.Loading });
        try {
            const label = await labelClient.createLabel(newLabel);

            // EFFECT: add the new label to the message
            message.labels = [label];

            set({
                label,
                labelRemoteState: RemoteState.Loaded,
            });
        } catch (err) {
            addAlertMessage(
                errorToAlert(
                    `post-${LabelApiUrl}-${new Date().getTime()}`.toLowerCase(),
                    `Error making new label.`,
                    err
                )
            );
            set({ labelRemoteState: RemoteState.Error });
        }
    },

    /**
     * Update the status of current label
     */
    updateLabel: async (
        newLabelRequest: CreateLabelRequest,
        currentLabel?: Label
    ): Promise<Label | undefined> => {
        const { addAlertMessage } = get();
        const continueAfterDelete = currentLabel?.rating !== newLabelRequest.rating;
        let returnLabel = currentLabel;
        set({ labelRemoteState: RemoteState.Loading });

        try {
            if (currentLabel !== undefined) {
                await labelClient.deleteLabel(currentLabel.id);
                returnLabel = undefined;
            }

            if (continueAfterDelete) {
                const newLabel = await labelClient.createLabel(newLabelRequest);
                returnLabel = newLabel;
            }

            set({ labelRemoteState: RemoteState.Loaded });
        } catch (error) {
            addAlertMessage(
                errorToAlert(
                    `change-${LabelApiUrl}-${new Date().getTime()}`.toLowerCase(),
                    `Error changing new label.`,
                    error
                )
            );
            set({ labelRemoteState: RemoteState.Error });
        }
        return Promise.resolve(returnLabel);
    },

    getAllLabels: async (offset: number = 0, limit: number = 10) => {
        const { addAlertMessage } = get();
        set({ allLabelsRemoteState: RemoteState.Loading });
        try {
            const allLabels = await labelsClient.getAllLabels({
                pagination: { offset, limit },
            });

            set({
                allLabels,
                allLabelsRemoteState: RemoteState.Loaded,
            });
        } catch (err) {
            addAlertMessage(
                errorToAlert(
                    `fetch-${LabelsApiUrl}-${new Date().getTime()}`.toLowerCase(),
                    `Error getting labels.`,
                    err
                )
            );
            set({ allLabelsRemoteState: RemoteState.Error });
        }
    },

    getAllSortedLabels: async (fieldName: string, sort: GridSortDirection) => {
        const { addAlertMessage } = get();
        set({ allLabelsRemoteState: RemoteState.Loading });
        try {
            const allLabels = await labelsClient.getAllLabels({
                sort: { field: fieldName, order: sort },
            });

            set({
                allLabels,
                allLabelsRemoteState: RemoteState.Loaded,
            });
        } catch (err) {
            addAlertMessage(
                errorToAlert(
                    `fetch-${LabelsApiUrl}-${new Date().getTime()}`.toLowerCase(),
                    `Error getting labels.`,
                    err
                )
            );
            set({ allLabelsRemoteState: RemoteState.Error });
        }
    },

    getAllFilteredLabels: async (creator?: string, message?: string, rating?: number) => {
        const { addAlertMessage } = get();
        set({ allLabelsRemoteState: RemoteState.Loading });
        try {
            const allLabels = await labelsClient.getAllLabels({
                filter: {
                    creator,
                    message,
                    rating,
                },
            });

            set({
                allLabels,
                allLabelsRemoteState: RemoteState.Loaded,
            });
        } catch (err) {
            addAlertMessage(
                errorToAlert(
                    `fetch-${LabelsApiUrl}-${new Date().getTime()}`.toLowerCase(),
                    `Error getting labels.`,
                    err
                )
            );
            set({ allLabelsRemoteState: RemoteState.Error });
        }
    },
});
