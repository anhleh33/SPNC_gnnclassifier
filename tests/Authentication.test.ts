import { expect, test } from '@playwright/test'
import LoginPage from '@/page/Login.page'
import Enviroment from '@/utils/Enviroment'

test.describe("[GNN-01] Login", () => {
    let login: LoginPage
    test.beforeEach(async ({ page }) => {
        await page.goto(Enviroment.BASE_URL!)
        login = new LoginPage(page)
        await page.waitForTimeout(5000)
        await login.accessToLoginForm()
    })

    test('Check UI', async ({ page }) => {
        await expect(await page.locator("//h2[contains(@class,'text-2xl font-semibold')]").textContent()).toBe("Sign In")
        await expect(login.eleEmailField()).toBeVisible()
        await expect(login.elePasswordField()).toBeVisible()
        await expect(login.LoginButton()).toBeVisible()
    })

    test('Acceptance of fields', async ({ page }) => {
        await login.eleEmailField().fill(Enviroment.USER!)
        await login.elePasswordField().fill(Enviroment.PWD!)
        await expect(login.eleEmailField()).toHaveValue(Enviroment.USER!)
        await expect(login.elePasswordField()).toHaveValue(Enviroment.PWD!);
    })

    test('Redirect to Sign Up form', async ({ page }) => {
        await login.redirectToSignUpForm()
        await expect(await page.locator("//h2[contains(@class,'text-2xl font-semibold')]").textContent()).toBe("Sign Up")
    })

    test('Login with INVALID credentials', async ({ page }) => {
        await login.LogintoGNN("faker", "nopass", page)
        await expect(await page.locator("//span[contains(@class,'text-sm font-medium')]").getByText("Incorrect username or password")).toBeVisible({ timeout: 5000 })
    })

    test('Login with VALID credentials', async ({ page }) => {
        await login.LogintoGNN(Enviroment.USER!, Enviroment.PWD!, page)
        await expect(await page.locator("//span[contains(@class,'text-sm font-medium')]").getByText("Logged in successfully!")).toBeVisible({ timeout: 5000 })
    })
})

test.describe('[GNN-02] Sign Up', () => {
    
})