import { expect, test } from './playwright-utils';

test('model selection', async ({ page }) => {
    await page.goto('/');

    // HACK: The OLMoTrace tooltip gets in the way, this disables it on future loads.
    await page.evaluate(() => {
        localStorage.setItem('has_exposed_olmotrace', 'true');
    });

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
