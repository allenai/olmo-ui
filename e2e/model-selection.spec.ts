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
