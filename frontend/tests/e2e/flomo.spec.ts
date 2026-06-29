import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
});

test("renders the flomo mine layout and supports complete memo CRUD", async ({
  page
}) => {
  await page.goto("/");

  await expect(page.getByTestId("sidebar")).toBeVisible();
  await expect(page.getByText("天然")).toBeVisible();
  await expect(page.getByText("PRO")).toBeVisible();
  await expect(page.getByTestId("heatmap")).toBeVisible();
  await expect(page.getByRole("button", { name: /全部笔记/ })).toHaveClass(/active/);
  await expect(page.getByLabel("搜索笔记")).toBeVisible();
  await expect(page.getByLabel("现在的想法是")).toBeVisible();

  const firstStat = page.getByLabel("统计").locator("strong").first();
  await expect.poll(async () => Number(await firstStat.textContent())).toBeGreaterThanOrEqual(4);
  const memoTotal = Number(await firstStat.textContent());
  expect(memoTotal).toBeGreaterThanOrEqual(4);
  await expect(page.getByTestId("memo-card")).toHaveCount(Math.min(80, memoTotal));

  await page.getByLabel("搜索笔记").fill("现实约束");
  await expect(page.getByText(/约束必须外部化/)).toBeVisible();
  await page.getByLabel("搜索笔记").fill("");

  await page.getByTestId("tag-filter-技能提升").click();
  await expect(page.getByTestId("memo-card").first()).toBeVisible();
  await page.getByRole("button", { name: /全部笔记/ }).click();

  await page.getByLabel("现在的想法是").fill("新的 flomo 记录 #测试");
  await page.getByLabel("发送笔记").click();
  await expect(page.getByText("新的 flomo 记录")).toBeVisible();
  await expect(page.getByTestId("memo-list").getByText("#测试", { exact: true })).toBeVisible();

  await page.getByLabel(/更多操作/).first().click();
  await page.getByRole("button", { name: "编辑笔记" }).click();
  await page.getByLabel("编辑笔记内容").fill("修改后的 flomo 记录 #测试");
  await page.getByRole("button", { name: "保存编辑" }).click();
  await expect(page.getByText("修改后的 flomo 记录")).toBeVisible();

  await page.getByLabel(/更多操作/).first().click();
  await page.getByRole("button", { name: "删除笔记" }).click();
  await expect(page.getByText("修改后的 flomo 记录")).not.toBeVisible();
});
