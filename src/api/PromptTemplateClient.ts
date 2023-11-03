import { ClientBase } from './ClientBase';
import {
    PromptTemplate,
    PromptTemplateApiUrl,
    PromptTemplateList,
    PromptTemplatePost,
    PromptTemplatesApiUrl,
    JSONPromptTemplate,
    JSONPromptTemplateList,
    parsePromptTemplate,
    PromptTemplatePatch,
} from './PromptTemplate';

export class PromptTemplateClient extends ClientBase {
    async getPromptTemplateList(includeDeleted?: boolean): Promise<PromptTemplateList> {
        const url = `${PromptTemplatesApiUrl}${includeDeleted ? '?deleted=true' : ''}`;
        const resp = await fetch(url, { credentials: 'include' });
        const jsonPromptTemplateList = await this.unpack<JSONPromptTemplateList>(resp);
        return jsonPromptTemplateList.map((m) => parsePromptTemplate(m)) || [];
    }

    async getPromptTemplate(id: string): Promise<PromptTemplate> {
        const url = `${PromptTemplateApiUrl}/${id}`;
        const resp = await fetch(url, { credentials: 'include' });
        const jsonPromptTemplate = await this.unpack<JSONPromptTemplate>(resp);
        return parsePromptTemplate(jsonPromptTemplate);
    }

    async createPromptTemplate(chipData: PromptTemplatePost): Promise<PromptTemplate> {
        const url = `${PromptTemplateApiUrl}`;
        const resp = await fetch(url, {
            credentials: 'include',
            body: JSON.stringify(chipData),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
        const jsonPromptTemplate = await this.unpack<JSONPromptTemplate>(resp);
        return parsePromptTemplate(jsonPromptTemplate);
    }

    async patchPromptTemplate(
        id: string,
        patchValues: PromptTemplatePatch
    ): Promise<PromptTemplate> {
        const url = `${PromptTemplateApiUrl}/${id}`;
        const resp = await fetch(url, {
            credentials: 'include',
            method: 'PATCH',
            body: JSON.stringify(patchValues),
            headers: { 'Content-Type': 'application/json' },
        });
        const jsonPromptTemplate = await this.unpack<JSONPromptTemplate>(resp);
        return parsePromptTemplate(jsonPromptTemplate);
    }
}
