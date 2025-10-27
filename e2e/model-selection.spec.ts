import { expect, test } from './playwright-utils';

test('model selection', async ({ page }) => {
    await page.goto('/');

    const modelSelectLocator = page.getByRole('combobox', { name: 'Model' });
    await expect(modelSelectLocator).toContainText('Tulu2.5');

    await page.goto('/thread/msg_A8E5H1X2O3');
    await expect(modelSelectLocator).toContainText('OLMo-peteish-dpo-preview');

    await page.getByRole('button', { name: 'Thread history', exact: true }).click();
    await page.getByRole('link', { name: 'First existing message' }).click();

    await expect(modelSelectLocator).toContainText('Tulu2.5');

    await page.goto('/?model=OLMo-peteish-dpo-preview');
    await expect(modelSelectLocator).toContainText('OLMo-peteish-dpo-preview');
});

test('model selection searchParam', async ({ page }) => {
    await page.goto('/');

    const modelSelect = page.getByRole('combobox', { name: 'Model' });
    await expect(modelSelect).toHaveText('Tulu2.5');

    await modelSelect.click();
    await page.getByRole('option', { name: 'OLMo-peteish-dpo-preview' }).click();

    await expect(page).toHaveURL(
        (url) => url.searchParams.get('model') === 'OLMo-peteish-dpo-preview'
    );
});

test('multiple thread model selection searchParam', async ({ page }) => {
    await page.goto('/comparison');

    // Select two compatible models (both text models)
    const model1Select = page.getByRole('combobox', { name: 'Model' }).first();
    const model2Select = page.getByRole('combobox', { name: 'Model' }).nth(1);

    await model1Select.click();
    await page.getByRole('option', { name: 'OLMo-peteish-dpo-preview' }).click();

    await expect(page).toHaveURL(
        (
            url // should changing one, add both modes to searchParams
        ) => url.searchParams.get('model-1') === 'OLMo-peteish-dpo-preview'
        // && url.searchParams.get('model-2') === 'tulu2'
    );

    await model2Select.click();
    await page.getByRole('option', { name: 'Tulu2.5' }).click();

    // both should be in URL searchParams now
    await expect(page).toHaveURL(
        (url) =>
            url.searchParams.get('model-1') === 'OLMo-peteish-dpo-preview' &&
            url.searchParams.get('model-2') === 'tulu2'
    );
});
