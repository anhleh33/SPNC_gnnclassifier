import { expect, test } from '@playwright/test'
import LoginPage from '../page/LoginPage'
import Enviroment from '../ultis/Enviroment'

test.describe("Login Page", () => {
    let login: LoginPage;

    test.beforeEach(async ({ page }) => {
        await page.goto(Enviroment.BASE_URL!)
        login = new LoginPage(page) 
        await page.locator("(//button[contains(@class,'inline-flex items-center')])[1]").click()
        await expect(page.locator("//h2[contains(@class,'text-2xl font-semibold')]")).toHaveText("Sign In")
        console.log(`The current web: ${Enviroment.BASE_URL}`)
    })

    test("Login page UI", async({page}) => {
        await expect(page.locator("(//label[contains(@class,'text-sm font-medium')])[1]")).toHaveText("Email or Username")
        await expect(login.usernameField()).toBeEnabled()
        await expect(page.locator("(//label[contains(@class,'text-sm font-medium')])[2]")).toHaveText("Password")
        await expect(login.pwdField()).toBeEnabled()
        await expect(login.signinBtn()).toBeEnabled()
        await expect(login.redirectSignupPage()).toBeEnabled()
    })
})