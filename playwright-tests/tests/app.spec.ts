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

test('create new card', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Sample Spanish Deck')).toBeVisible();
  await page
    .getByTestId('deck-list-item')
    .filter({ hasText: 'Sample Spanish Deck' })
    .getByTestId('deck-settings-icon')
    .click();
  await expect(page.getByText('Deck Settings')).toBeVisible();
  await expect(page.getByText('Deck: Sample Spanish Deck')).toBeVisible();
  await page.getByTestId('fab').click();

  const questionInput = page.getByTestId('question-input');
  await questionInput.click();
  await questionInput.fill('new front');

  const answerInput = page.getByTestId('answer-input');
  await answerInput.click();
  await answerInput.fill('new back');
  await page
    .getByTestId('submit')
    .filter({hasText: 'Add Question'})
    .click();
  await expect(page.getByText('new front')).toBeVisible();
  await expect(page.getByText('new back')).toBeVisible();
});
/*
test('create new card count', async ({ page }) => {
  await page.goto('http://localhost:8081/');

  await expect(page.getByText('Sample Spanish Deck')).toBeVisible();
  await page
    .getByTestId('deck-list-item')
    .filter({ hasText: 'Sample Spanish Deck' })
    .getByTestId('deck-settings-icon')
    .click();
  await expect(page.getByText('Deck Settings')).toBeVisible();
  await expect(page.getByText('Deck: Sample Spanish Deck')).toBeVisible();

  // Create a locator for the items
const screenListItems = page.locator('[data-testid="deck-screen-item"]');

// 2. Force Playwright to wait until at least the first item appears on screen
await screenListItems.first().waitFor({ state: 'visible' });

// 3. Now it is safe to grab the initial count
const initialCount = await screenListItems.count();
const expectedScreenListCount = initialCount + 1;
console.log(`expectedScreenListCount: ${expectedScreenListCount}`);
  // await page.getByTestId('fab').click();

  // const questionInput = page.getByTestId('question-input');
  // await questionInput.click();
  // await questionInput.fill('new front');

  // const answerInput = page.getByTestId('answer-input');
  // await answerInput.click();
  // await answerInput.fill('new back');
  // await page
  //   .getByTestId('submit')
  //   .filter({hasText: 'Add Question'})
  //   .click();
  // await expect(page.getByText('Deck: Sample Spanish Deck')).toBeVisible();
  // const newList = page.locator('[testid="deck-screen-item"]');
  // await newList.first().waitFor({state: 'visible'});
  // await expect(newList).toHaveCount(expectedScreenListCount);
});
*/
test('flip card', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Sample Spanish Deck')).toBeVisible();
  await page.getByText('Sample Spanish Deck').click();

  await expect(page.getByText('Deck: Sample Spanish Deck')).toBeVisible();
  await expect(page.getByText('Question')).toBeVisible();

  await page
    .getByTestId('question-card')
    .click();

  await expect(page.getByText('Answer')).toBeVisible();

  await page
    .getByTestId('answer-card')
    .click();

  await expect(page.getByText('Question')).toBeVisible();

  await page.getByTestId('flip-card-icon').click();

  await expect(page.getByText('Answer')).toBeVisible();
});
