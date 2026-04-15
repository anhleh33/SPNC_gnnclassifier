import SignupPage from '@/pages/Signup.page'
import Enviroment from '@/utils/Enviroment'
import { expect, test } from '@playwright/test'
import User from '../utils/User'

const randomSuffix = Date.now();

test.describe("[GNN-1] Sign up", () => {
    let signupPage: SignupPage
    const user = new User(`Jessica Cao ${randomSuffix}`, `jessica${randomSuffix}`, `jess${randomSuffix}@mailto.plus`, '12345678x@X')

    test.beforeEach(async ({ page }) => {
        await page.goto(Enviroment.BASE_URL!)
        await page.getByRole('button').getByText("Sign Up").click()
        signupPage = new SignupPage(page)
    })
    test("Check UI of sign up form", async ({ page }) => {
        await expect(page.locator("(//div[contains(@class,'modal-bg border')]//div)[1]").getByRole('heading')).toHaveText("Sign Up")
        await expect(signupPage.fullNameField()).toBeVisible()
        await expect(signupPage.userNameField()).toBeVisible()
        await expect(signupPage.emailField()).toBeVisible()
        await expect(await signupPage.passwordField()).toBeVisible()
        await expect(await signupPage.confirmPasswordField()).toBeVisible()
        await expect(signupPage.signupBtn()).toBeVisible()
        await expect(signupPage.signinBtn()).toBeVisible()
    })
    test("Sign up a new account", async ({ page }) => {
        await signupPage.signupNewUser(user)
        let userAccount = page.locator("body > div.min-h-screen.bg-background > header > div > div > button > span")
        await expect(userAccount).toBeVisible()
        await expect(userAccount).toContainText(user.username)
    })
    // test("Redirect to Sign In form", async({page}) => {
    //     await signupPage.clickSignInBtn()
    //     await expect(page.locator("(//div[contains(@class,'modal-bg border')]//div)[1]").getByRole('heading')).toHaveText("Sign In")
    // })

})