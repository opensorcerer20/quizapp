import {
  expect,
  test,
} from "@playwright/test";

test.use({
  viewport: {
    height: 1020,
    width: 1280
  }
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:8081/');
  await expect(page.getByText('Sample Spanish Deck')).toBeVisible();

  // expect(await page
  //   .getByTestId('deck-list')
  //   .getByTestId('deck-list-item').all()).toHaveLength(29);

  await page
    .getByTestId('deck-list')
    .getByTestId('deck-list-item')
    .first()
    .getByTestId('deck-settings-icon')
    .click();
  await expect(page.getByText('Deck: Sample Spanish Deck')).toBeVisible();
  expect(page
    .getByTestId('deck-screen-list')).toBeVisible();
  // expect(page
  //   .getByTestId('deck-screen-list')
  //   .getByTestId('deck-screen-item')).toHaveCount(29);

  await page.getByTestId('fab').click();
  await page.getByText('Cancel').click();
  await expect(page.getByTestId('deck-screen-list')).toBeVisible();

  await page.getByTestId('fab').click();
  await page.getByTestId('question-input').click();
  await page.getByTestId('question-input').fill('test');
  await page.getByText('Cancel').click();
  await page.getByRole('dialog').getByText('Cancel').click();
  await expect(page.getByTestId('question-input')).toBeVisible();
  expect(await page.getByTestId('question-input').inputValue()).toBe('test');

  await page.getByTestId('cancel').getByText('Cancel').click();
  await page.getByText('Discard', { exact: true }).click();
  await expect(page.getByTestId('question-input')).not.toBeVisible();

  await page.getByTestId('fab').click();
  await page.getByTestId('question-input').click();
  await page.getByTestId('question-input').fill('test q');
  await page.getByTestId('answer-input').click();
  await page.getByTestId('answer-input').fill('test a');
  await page.getByTestId('submit').getByText('Add Question').click();
  await expect(page.getByText('Q: test q')).toBeVisible();
  await expect(page.getByText('A: test a')).toBeVisible();
});