import {
  expect,
  test,
} from "@playwright/test";

test('should load home screen', async ({ page }) => {
  // Navigate to your Expo web app
  await page.goto('/');

  // Verify the screen or text components load correctly
  await expect(page.getByText('Flashcard Library')).toBeVisible();
  await expect(page.getByText('Saved Decks')).toBeVisible();
  await expect(page.getByText('Sample Spanish Deck')).toBeVisible();

  await expect(page.getByTestId('menu-icon')).toBeVisible();
  await expect(page.getByTestId('light-dark-icon')).toBeVisible();
  await expect(page.getByTestId('help-icon')).toBeVisible();
  await expect(page.getByTestId('download-icon')).toBeVisible();
  await expect(page.getByTestId('deck-settings-icon')).toBeVisible();
});

test('should load deck create / load modal', async ({ page }) => {
  // Navigate to your Expo web app
  await page.goto('/');
  await expect(page.getByTestId('fab')).toBeVisible();
  await page.getByTestId('fab').click();
  await expect(page.getByTestId('Create Deck')).toBeVisible();
  await expect(page.getByTestId('Import TXT')).toBeVisible();
  await expect(page.getByTestId('Import CSV')).toBeVisible();
  await expect(page.getByTestId('File Help')).toBeVisible();
  // await page.getByTestId('prev-page-icon').click();
  // await page.getByTestId('next-page-icon').click();
});

test('should load review screen', async ({ page }) => {
  // Navigate to your Expo web app
  await page.goto('/');

  // Verify the screen or text components load correctly
  await expect(page.getByText('Sample Spanish Deck')).toBeVisible();
  const listItem = page.getByText('Sample Spanish Deck');
  await listItem.click();

  await expect(page.getByTestId('back-arrow-icon')).toBeVisible();
  await expect(page.getByText('Review Deck')).toBeVisible();
  await expect(page.getByText('Deck: Sample Spanish Deck')).toBeVisible();
  await expect(page.getByText('Q -> A')).toBeVisible();
  await expect(page.getByText('A -> Q')).toBeVisible();
  await expect(page.getByText('Question')).toBeVisible();
  await expect(page.getByText('Card 1 of 29')).toBeVisible();

  // const helpButton = page.getByTestId('help-button').nth(1);
  // await helpButton.click();
  // await expect(page.getByText('Review Help')).toBeVisible();
  // const helpButton2 = page.getByTestId('help-close-button').nth(1);
  // await helpButton2.click();
  // await expect(page.getByText('Review Help')).toBeHidden();
});
