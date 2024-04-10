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
        const url = this.createURL(PromptTemplatesApiUrl);

        if (includeDeleted === true) {
            url.searchParams.set('deleted', 'true');
        }

        const jsonPromptTemplateList = await this.fetch<JSONPromptTemplateList>(url, {
            credentials: 'include',
        });
        return jsonPromptTemplateList.map(parsePromptTemplate) ?? [];
    }

    async getPromptTemplate(id: string): Promise<PromptTemplate> {
        const url = this.createURL(PromptTemplateApiUrl, id);

        const jsonPromptTemplate = await this.fetch<JSONPromptTemplate>(url, {
            credentials: 'include',
        });

        return parsePromptTemplate(jsonPromptTemplate);
    }

    async createPromptTemplate(chipData: PromptTemplatePost): Promise<PromptTemplate> {
        const url = this.createURL(PromptTemplateApiUrl);

        const jsonPromptTemplate = await this.fetch<JSONPromptTemplate>(url, {
            credentials: 'include',
            body: JSON.stringify(chipData),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        return parsePromptTemplate(jsonPromptTemplate);
    }

    async patchPromptTemplate(
        id: string,
        patchValues: PromptTemplatePatch
    ): Promise<PromptTemplate> {
        const url = this.createURL(PromptTemplateApiUrl, id);

        const jsonPromptTemplate = await this.fetch<JSONPromptTemplate>(url, {
            credentials: 'include',
            method: 'PATCH',
            body: JSON.stringify(patchValues),
            headers: { 'Content-Type': 'application/json' },
        });

        return parsePromptTemplate(jsonPromptTemplate);
    }
}
