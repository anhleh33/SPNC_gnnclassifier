import { expect, test } from '@playwright/test'
import Enviroment from '@/utils/Enviroment'
import SignUpPage from '@/page/Signup.page'

const myInfo = {
    fullname: "Le Hoang Anh",
    username: "lehoanganh",
    email: "anhhne@mailto.plus",
    password: "12345678x@X",
    confirm_password: "12345678x@X"
}

test.describe('[GNN-02] Sign Up', () => {
    let signup: SignUpPage

    test.beforeEach(async({page}) => {
        await page.goto(Enviroment.BASE_URL!);
        signup = new SignUpPage(page)
        await page.waitForTimeout(5000)
        await signup.accessToSignUpForm()
    })

    test('Check UI', async({page}) => {
        await expect(await page.locator("//h2[contains(@class,'text-2xl font-semibold')]").textContent()).toBe("Sign Up")
        await expect(signup.eleFullNameField()).toBeVisible()
        await expect(signup.eleUsernameField()).toBeVisible()
        await expect(signup.eleEmailField()).toBeVisible()
        await expect(signup.elePasswordField()).toBeVisible()
        await expect(signup.eleConfirmPasswordField()).toBeVisible()
        await expect(signup.SignUpButton()).toBeVisible()
    })

    test('Acceptance of fields', async({page}) => {
        await signup.eleFullNameField().fill(myInfo.fullname)
        await signup.eleUsernameField().fill(myInfo.username)
        await signup.eleEmailField().fill(myInfo.email)
        await signup.elePasswordField().fill(myInfo.password)
        await signup.eleConfirmPasswordField().fill(myInfo.confirm_password)
        

        await expect(signup.eleFullNameField()).toHaveValue(myInfo.fullname)
        await expect(signup.eleUsernameField()).toHaveValue(myInfo.username)
        await expect(signup.eleEmailField()).toHaveValue(myInfo.email)
        await signup.changePasswordToggle()
        await signup.changeConfirmPasswordToggle()
        await expect(signup.elePasswordField()).toHaveValue(myInfo.password)
        await expect(signup.eleConfirmPasswordField()).toHaveValue(myInfo.confirm_password)
    })


})