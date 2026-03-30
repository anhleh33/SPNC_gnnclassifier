import { expect, Locator, Page } from "@playwright/test";

export default class LoginPage{
    private page: Page;

    constructor(page: Page){
        this.page = page
    }

    public usernameField(): Locator {
        return this.page.locator("(//input[contains(@class,'file:text-foreground placeholder:text-muted-foreground')])[1]")
    }
    public pwdField(): Locator{
        return this.page.locator("(//input[contains(@class,'file:text-foreground placeholder:text-muted-foreground')])[2]")
    }
    public signinBtn(): Locator{
        return this.page.locator("//button[@type='submit']")
    }
    public redirectSignupPage(): Locator{
        return this.page.locator("(//button[@type='button'])[3]")
    }

    public fillUsername = async(username: string) => {
        await this.usernameField().fill(username)
    }
    public async fillPwd(pwd: string){
        await this.pwdField().fill(pwd)
    }
    public async clicktoSignInbtn(){
        await this.signinBtn().click()
    }
}