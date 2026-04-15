import { Page } from "@playwright/test";

export default class SignupPage {
    private page: Page
    constructor(page: Page){
        this.page = page
    }

    public fullNameField = () => this.page.locator("//input[@placeholder='Enter your full name']")

    public userNameField = () => this.page.locator("//input[@placeholder='Choose a username']")

    public emailField = () => this.page.locator("//input[@placeholder='Enter your email']")
    
    public passwordField = () => this.page.locator("(//input[@placeholder='••••••••'])[1]")
    
    public confirmPasswordField = () => this.page.locator("(//input[@placeholder='••••••••'])[2]")
    
    public signupBtn = () => this.page.locator("//div[@class='space-y-2']/following-sibling::button[1]")
    
    public signinBtn = () => this.page.locator("//button[normalize-space(text())='Sign in']")
}