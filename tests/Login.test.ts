import { expect, test } from '@playwright/test'
import LoginPage from '@/pages/Login.page'
import Enviroment from '@/utils/Enviroment'
import { login } from '@/lib/api/auth'

test.describe("[GNN-2] Sign in", () => {
    let loginPage: LoginPage

    test.beforeEach(async({page}) => {
        await page.goto(Enviroment.BASE_URL!)
        await page.getByRole('button').getByText("Sign In").click()
        loginPage = new LoginPage(page)
    })

    test("Check UI", async({page}) => {
        await expect(page.locator("//h2[normalize-space(text())='Sign In']")).toHaveText("Sign In")
        await expect(loginPage.usernameField()).toBeEnabled()
        await expect(loginPage.passwordField()).toBeEnabled()
        await expect(loginPage.togglePwd()).toBeTruthy()
        await expect(loginPage.signinBtn()).toBeVisible()
        await expect(loginPage.createOneBtn()).toBeVisible()
        await expect(loginPage.closeBtn()).toBeVisible()
    })

})