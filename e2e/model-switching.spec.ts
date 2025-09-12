import { expect, test } from './playwright-utils';

test('model switching warning', async ({ page }) => {
    await page.goto('/');

    const modelSelectLocator = page.getByRole('combobox', { name: 'Model' });
    await expect(modelSelectLocator).toContainText('Tulu2.5');

    const LinkLocator = page.getByRole('link', { name: /^Read more about/i });
    await expect(LinkLocator).toBeVisible();
    await expect(LinkLocator).toContainText('Tulu2.5');
    await expect(LinkLocator).toHaveAttribute('href', 'https://allenai.org');

    await modelSelectLocator.click();
    await page.getByRole('option', { name: 'Molmo' }).dispatchEvent('click');

    await expect(page.getByText('Change model and start a new thread?')).not.toBeAttached();
    await expect(LinkLocator).not.toBeVisible();

    await page.goto('/thread/msg_A8E5H1X2O3');
    await expect(modelSelectLocator).toContainText('OLMo-peteish-dpo-preview');

    await modelSelectLocator.click();
    await page.getByRole('option', { name: 'Molmo' }).dispatchEvent('click');

    await expect(page.getByText('Change model and start a new thread?')).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByText('Change model and start a new thread?')).not.toBeAttached();
    await expect(modelSelectLocator).toContainText('OLMo-peteish-dpo-preview');

    await modelSelectLocator.click();
    await page.getByRole('option', { name: 'Molmo' }).dispatchEvent('click');

    await expect(page.getByText('Change model and start a new thread?')).toBeVisible();
    await page.getByRole('button', { name: 'Change model' }).click();
    await expect(page.getByText('Change model and start a new thread?')).not.toBeAttached();
    await expect(modelSelectLocator).toContainText('Molmo');
    await page.waitForURL('/');
});
