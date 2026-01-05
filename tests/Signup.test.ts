import { expect, test } from '@playwright/test'
import Enviroment from '@/utils/Enviroment'
import SignUpPage from '@/page/Signup.page'

const myInfo = {
    fullname: "Jessica",
    username: "jessica123",
    email: "jessbt@mailto.plus",
    password: "12345678x@X",
    confirm_password: "12345678x@X"
}

test.describe('[GNN-02] Sign Up', () => {
    let signup: SignUpPage

    test.beforeEach(async ({ page }) => {
        await page.goto(Enviroment.BASE_URL!);
        signup = new SignUpPage(page)
        await page.waitForTimeout(5000)
        await signup.accessToSignUpForm()
    })

    test('Check UI', async ({ page }) => {
        await expect(await page.locator("//h2[contains(@class,'text-2xl font-semibold')]").textContent()).toBe("Sign Up")
        await expect(signup.eleFullNameField()).toBeVisible()
        await expect(signup.eleUsernameField()).toBeVisible()
        await expect(signup.eleEmailField()).toBeVisible()
        await expect(signup.elePasswordField()).toBeVisible()
        await expect(signup.eleConfirmPasswordField()).toBeVisible()
        await expect(signup.SignUpButton()).toBeVisible()
    })

    test('Acceptance of fields', async ({ page }) => {
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

    test('Redirect to Sign In form', async ({ page }) => {
        await signup.redirectToSignInForm()
        await expect(await page.locator("//h2[contains(@class,'text-2xl font-semibold')]").textContent()).toBe("Sign Up")
    })

    test('Check if username IS ALREADY HAD in database', async ({ page }) => {
        await signup.eleUsernameField().fill("testuser")
        await page.waitForTimeout(3000)
        await expect(await page.locator("(//div[contains(@class,'px-3 py-2')])[2]").textContent()).toBe("Not available")
    })

    test('Check if username IS NOT HAD in database', async ({ page }) => {
        await signup.eleUsernameField().fill("noexisting")
        await page.waitForTimeout(3000)
        await expect(await page.locator("(//div[contains(@class,'px-3 py-2')])[2]").textContent()).toBe(" Available")
    })

    test('Sign up an user', async ({ page }) => {
        await signup.SignUptoGNN(myInfo.fullname, myInfo.username, myInfo.email, myInfo.password, page)
        // await expect(page.getByText('Sign up successful! Logging in ...')).toBeVisible({ timeout: 15000 });
        await page.waitForTimeout(5000)
        await expect(page.locator("(//button[contains(@class,'flex items-center')])[2]")).toBeVisible()
        await expect(page.locator(`//span[normalize-space(text())='${myInfo.username}']`)).toBeVisible()
    })

    test('Check API after signing up successfully', async({request}) => {
        const response = await request.get(process.env.NEXT_PUBLIC_API_URL! + `/users/check?username=${myInfo.username}`)
        await expect(response.ok()).toBeTruthy()

        const json = await response.json()
        await expect(json.available).toBe(false)
    })
})