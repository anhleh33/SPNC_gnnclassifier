import { expect, test } from '@playwright/test'
import LoginPage from '@/pages/Login.page'
import Enviroment from '@/utils/Enviroment'

test.describe("[GNN-2] Sign in", () => {
    let loginPage: LoginPage
    console.log(`>> Test Suite: [GNN-2] Sign in`);

    test.beforeEach(async({page}) => {
        console.log(`>> Starting Test: Navigating to ${Enviroment.BASE_URL}`);
        await page.goto(Enviroment.BASE_URL!)
        await page.getByRole('button').getByText("Sign In").click()
        loginPage = new LoginPage(page)
    })
    test("Check UI of sign in form", async({page}) => {
        console.log(`>> Check UI of sign in form`);
        await expect(page.locator("//h2[normalize-space(text())='Sign In']")).toHaveText("Sign In")
        await expect(loginPage.usernameField()).toBeVisible()
        await expect(loginPage.passwordField()).toBeVisible()
        await expect(loginPage.togglePwd()).toBeTruthy()
        await expect(loginPage.signinBtn()).toBeVisible()
        await expect(loginPage.createOneBtn()).toBeVisible()
        await expect(loginPage.closeBtn()).toBeVisible()
    })
    test("Login as a valid user", async({page}) => {
        console.log(`>> Login as a valid user`);
        await loginPage.loginWithUser(Enviroment.USERNAME!, Enviroment.PASSWORD!)
        let userAccount = page.locator("body > div.min-h-screen.bg-background > header > div > div > button > span")
        await expect(userAccount).toBeVisible()
        await expect(userAccount).toContainText(Enviroment.USERNAME!)
    })
    test("Redirect to Sign Up form", async({page}) => {
        console.log(`>> Redirect to Sign Up form`);
        await loginPage.directSignUp()
        await expect(page.locator("(//div[contains(@class,'modal-bg border')]//div)[1]").getByRole('heading')).toHaveText("Sign Up")
    })
    test("Close Sign In form", async({page}) => {
        console.log(`>> Close Sign In form`);
        await loginPage.closeBtn().click({timeout: 2000})
        await expect(page.locator("body > div.min-h-screen.bg-background > header > div > button").getByRole('heading')).toHaveText("Graph-Based Image Classifier")
    })
})