import { expect, Page } from "@playwright/test";

export default class LoginPage {
    private page: Page;
    constructor(page: Page) {
        this.page = page
    }

    public eleEmailField = () => {
        return this.page.locator("(//input[@data-slot='input'])[1]")
    }

    public elePasswordField = () => {
        return this.page.locator("(//input[@data-slot='input'])[2]")
    }

    public LoginButton() {
        return this.page.locator("//button[@type='submit']")
    }

    public async LogintoGNN(name: string, pwd: string, page:Page) {
        await expect(this.eleEmailField()).toBeVisible()
        await expect(this.elePasswordField()).toBeVisible()
        await this.eleEmailField().fill(name)
        await this.elePasswordField().fill(pwd)
        await this.LoginButton().click()
        // await page.waitForTimeout(2000)
    }

    public changePasswordToggle = async () => {
        await this.page.click("(//button[contains(@class,'inline-flex items-center')])[3]")
    }

    accessToLoginForm = async () => {
        await this.page.click("(//button[@data-slot='button'])[1]")
    }

    async closeLoginForm() {
        await this.page.click("(//h2[contains(@class,'text-2xl font-semibold')]/following-sibling::button)[1]")
    }

    public redirectToSignUpForm = async () => {
        await this.page.click("//button[normalize-space(text())='Create one']")
    }
}