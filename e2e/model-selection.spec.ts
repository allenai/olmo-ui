import { PARAM_SELECTED_MODEL } from '@/pages/queryParameterConsts';

import { expect, test } from './playwright-utils';

test('model selection', async ({ page }) => {
    await page.goto('/');

    const modelSelectLocator = page.getByRole('combobox', { name: 'Model' });
    await expect(modelSelectLocator).toContainText('Tulu2.5');

    await page.goto('/thread/msg_A8E5H1X2O3');
    await expect(modelSelectLocator).toContainText('Olmo-peteish-dpo-preview');

    await page.getByRole('button', { name: 'Thread history', exact: true }).click();
    await page.getByRole('link', { name: 'First existing message' }).click();

    await expect(modelSelectLocator).toContainText('Tulu2.5');

    await page.goto('/?model=Olmo-peteish-dpo-preview');
    await expect(modelSelectLocator).toContainText('Olmo-peteish-dpo-preview');
});

test('model selection searchParam', async ({ page }) => {
    await page.goto('/');

    const modelSelect = page.getByRole('combobox', { name: 'Model' });
    await expect(modelSelect).toHaveText('Tulu2.5');

    await modelSelect.click();
    await page.getByRole('option', { name: 'Olmo-peteish-dpo-preview' }).click();

    await expect(page).toHaveURL(
        (url) => url.searchParams.get(PARAM_SELECTED_MODEL) === 'Olmo-peteish-dpo-preview'
    );
});

test('multiple thread model selection searchParam', async ({ page }) => {
    await page.goto('/comparison');

    // Select two compatible models (both text models)
    const model1Select = page.getByRole('combobox', { name: 'Model' }).first();
    const model2Select = page.getByRole('combobox', { name: 'Model' }).nth(1);

    await model2Select.click();
    await page.getByRole('option', { name: 'Tulu2.5' }).click();

    // first was already tulu2, we changed the second, so they should both be the same now
    await expect(page).toHaveURL(
        (url) =>
            url.searchParams.get('model-1') === 'tulu2' &&
            url.searchParams.get('model-2') === 'tulu2'
    );

    await model1Select.click();
    await page.getByRole('option', { name: 'Olmo-peteish-dpo-preview' }).click();

    // now we changed the first to be Olmo-peteish-...
    await expect(page).toHaveURL(
        (url) =>
            url.searchParams.get('model-1') === 'Olmo-peteish-dpo-preview' &&
            url.searchParams.get('model-2') === 'tulu2'
    );
});

test('presists model searchParam on new thread', async ({ page }) => {
    await page.goto('/');

    const modelSelect = page.getByRole('combobox', { name: 'Model' });
    await modelSelect.click();
    await page.getByRole('option', { name: 'Olmo-peteish-dpo-preview' }).click();

    await page.getByRole('link', { name: 'New chat' }).click();

    // should still have the url parameter
    await expect(page).toHaveURL(
        (url) => url.searchParams.get(PARAM_SELECTED_MODEL) === 'Olmo-peteish-dpo-preview'
    );
});
