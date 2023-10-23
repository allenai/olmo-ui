import { ClientBase, ObservableChangeAction } from './ClientBase';
import {
    DataChip,
    DataChipApiUrl,
    DataChipList,
    DataChipPost,
    DataChipsApiUrl,
    JSONDataChip,
    JSONDataChipList,
    parseDataChip,
} from './DataChip';

export class DataChipClient extends ClientBase {
    async getDataChips(includeDeleted?: boolean): Promise<DataChipList> {
        const url = `${DataChipsApiUrl}${includeDeleted ? '?deleted=true' : ''}`;
        const resp = await fetch(url, { credentials: 'include' });
        const jsonDataChipList = await this.unpack<JSONDataChipList>(resp);
        return {
            meta: jsonDataChipList.meta,
            dataChips: jsonDataChipList.datachips?.map((m) => parseDataChip(m)) || [],
        };
    }

    async getDataChip(id: string): Promise<DataChip> {
        const url = `${DataChipApiUrl}/${id}`;
        const resp = await fetch(url, { credentials: 'include' });
        const jsonDataChip = await this.unpack<JSONDataChip>(resp);
        return parseDataChip(jsonDataChip);
    }

    async createDataChip(chipData: DataChipPost): Promise<DataChip> {
        const url = `${DataChipApiUrl}`;
        const resp = await fetch(url, {
            credentials: 'include',
            body: JSON.stringify(chipData),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
        const jsonDataChip = await this.unpack<JSONDataChip>(resp);
        this.notifyOnChangeObservers(ObservableChangeAction.Create, jsonDataChip.id);
        return parseDataChip(jsonDataChip);
    }

    async updateDeletedOnDataChip(id: string, deleteValue: boolean = true): Promise<DataChip> {
        const url = `${DataChipApiUrl}/${id}`;
        const resp = await fetch(url, {
            credentials: 'include',
            method: 'PATCH',
            body: JSON.stringify({ deleted: deleteValue }),
            headers: { 'Content-Type': 'application/json' },
        });
        const jsonDataChip = await this.unpack<JSONDataChip>(resp);
        this.notifyOnChangeObservers(ObservableChangeAction.Update, id);
        return parseDataChip(jsonDataChip);
    }
}
