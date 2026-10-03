import { expect, test } from "@playwright/test";

test.use({
  viewport: {
    height: 1020,
    width: 1280,
  },
});

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Sample Spanish Deck")).toBeVisible();

  await page.getByTestId("deck-list").getByTestId("deck-list-item").first().getByTestId("deck-settings-icon").click();
  await expect(page.getByText("Deck: Sample Spanish Deck")).toBeVisible();
  await expect(page.getByTestId("deck-screen-list")).toBeVisible();
});

test("cancel closes an empty add question form", async ({ page }) => {
  await page.getByTestId("fab").click();
  await page.getByText("Cancel").click();
  await expect(page.getByTestId("deck-screen-list")).toBeVisible();
});

test("cancel with unsaved input asks before discarding", async ({ page }) => {
  await page.getByTestId("fab").click();
  await page.getByTestId("question-input").fill("test");

  // backing out of the discard dialog keeps the input
  await page.getByText("Cancel").click();
  await page.getByRole("dialog").getByText("Cancel").click();
  await expect(page.getByTestId("question-input")).toHaveValue("test");

  await page.getByTestId("cancel").getByText("Cancel").click();
  await page.getByText("Discard", { exact: true }).click();
  await expect(page.getByTestId("question-input")).not.toBeVisible();
});

test("submit adds the question to the deck", async ({ page }) => {
  await page.getByTestId("fab").click();
  await page.getByTestId("question-input").fill("test q");
  await page.getByTestId("answer-input").fill("test a");
  await page.getByTestId("submit").getByText("Add Question").click();
  await expect(page.getByText("Q: test q")).toBeVisible();
  await expect(page.getByText("A: test a")).toBeVisible();
});
