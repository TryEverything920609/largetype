import { test, expect } from '@playwright/test'

test('Can show text when typing into the input field and press Cmd+Enter', async ({
  page,
}) => {
  await page.goto('http://localhost:8039/')
  await page.locator('#text-input').fill('Hello World')
  await page.keyboard.press('Meta+Enter')
  await expect(page.locator('#text-output')).toHaveText('Hello World')
})
