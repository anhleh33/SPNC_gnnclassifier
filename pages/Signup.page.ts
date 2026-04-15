import User from "@/utils/User";
import { Page } from "@playwright/test";
import { TIMEOUT } from "dns";

export default class SignupPage {
    private page: Page
    constructor(page: Page){
        this.page = page
    }

    public fullNameField = () => this.page.getByPlaceholder("Enter your full name")

    public userNameField = () => this.page.getByPlaceholder("Choose a username")

    public emailField = () => this.page.getByPlaceholder("Enter your email")
    
    public passwordField = () => this.page.getByPlaceholder("••••••••").first()
    
    public confirmPasswordField = () => this.page.getByPlaceholder("••••••••").last()
    
    public signupBtn = () => this.page.locator('form').getByRole('button').getByText('Sign Up')
    
    public signinBtn = () => this.page.locator('form').getByRole('button').getByText('Sign In')
    
    public fillFullname = (fullname: string) => this.fullNameField().fill(fullname)
    
    public fillUsername = (username: string) => this.userNameField().fill(username)

    public fillEmail = (email: string) => this.emailField().fill(email)

    public fillPassword = (password: string) => this.passwordField().fill(password)

    public confirmPassword = (password: string) => this.confirmPasswordField().fill(password)

    public clickSignUpBtn = () => this.signupBtn().click()

    public clickSignInBtn = () => this.signinBtn().click()

    public signupNewUser = async(user: User) => {
        await this.fullNameField().fill(user.fullName);
        await this.userNameField().fill(user.username);
        await this.emailField().fill(user.email);
        await (await this.passwordField()).fill(user.password);
        await (await this.confirmPasswordField()).fill(user.password);
        await this.page.waitForTimeout(3000)
        await this.signupBtn().click();
    }
}