import { Page } from "@playwright/test";
import { emit } from "process";

export default class SignUpPage {
    private page: Page;
    constructor(page: Page) {
        this.page = page
    }

    public eleFullNameField = () => {
        return this.page.locator("(//input[@data-slot='input'])[1]")
    }

    public eleUsernameField = () => {
        return this.page.locator("(//input[@data-slot='input'])[2]")
    }

    public eleEmailField = () => {
        return this.page.locator("(//input[@data-slot='input'])[3]")
    }

    public elePasswordField = () => {
        return this.page.locator("(//label[normalize-space(text())='Password']/following::input)[1]")
    }

    public eleConfirmPasswordField = () => {
        return this.page.locator("(//label[normalize-space(text())='Password']/following::input)[2]")
    }

    public SignUpButton() {
        return this.page.locator("//button[@type='submit']")
    }

    public async SignUptoGNN(fullname: string, username: string, email: string, pwd: string, page:Page) {
        let confirmPwd: string = pwd
        await this.eleFullNameField().fill(fullname)
        await this.eleUsernameField().fill(username)
        await this.eleEmailField().fill(email)
        await this.elePasswordField().fill(pwd)
        await this.eleConfirmPasswordField().fill(confirmPwd)
        await this.SignUpButton().click()
    }

    public changePasswordToggle = async () => {
        await this.page.click("(//button[@type='button'])[2]")
    }

    public changeConfirmPasswordToggle = async() => {
        await this.page.click("(//button[@type='button'])[3]")
    }

    accessToSignUpForm = async () => {
        await this.page.click("(//button[@data-slot='button'])[2]")
    }

    async closeLoginForm() {
        await this.page.click("(//h2[contains(@class,'text-2xl font-semibold')]/following-sibling::button)[1]")
    }

    public redirectToSignUpForm = async () => {
        await this.page.click("//button[normalize-space(text())='Sign in']")
    }
}