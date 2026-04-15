import { Page } from "@playwright/test";

export default class LoginPage {
    private page: Page;
    constructor(page: Page) {
        this.page = page
    }

    public usernameField = () => this.page.getByPlaceholder("Enter your email or username")

    public passwordField = () => this.page.getByPlaceholder("••••••••")

    public togglePwd = () => {
        return this.page
            .locator("div")
            .filter({ has: this.passwordField() })
            .getByRole('button')
    }

    public signinBtn = () => {
        return this.page
            .locator("//div[contains(@class,'modal-bg border')]")
            .getByRole('button')
            .getByText('Sign In')
    }

    public createOneBtn = () => {
        return this.page
            .getByRole('button')
            .getByText("Create one")
    }

    public closeBtn = () => {
        return this.page
            .locator("(//div[contains(@class,'modal-bg border')]//div)[1]")
            .getByRole('button')
    }
}