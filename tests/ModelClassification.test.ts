import LoginPage from '@/pages/Login.page'
import Upload from '@/pages/Upload.page'
import Enviroment from '@/utils/Enviroment'
import { expect, test } from '@playwright/test'

test.describe("[GNN-3] Model Classification", () => {
    let imageUploadPage: Upload
    let loginPage: LoginPage
    const user = {
        username: Enviroment.USERNAME,
        password: Enviroment.PASSWORD
    }
    const fileName = 'Sinhhoc11'

    test.beforeEach(async ({page}) => {
        await page.goto(Enviroment.BASE_URL!)
        imageUploadPage = new Upload(page)
        loginPage = new LoginPage(page)
        await page.getByRole('button').getByText("Sign In").click()
        await loginPage.loginWithUser(user.username, user.password)
    })

    test('Check UI before uploading an image', async({page}) => {
        let userAccount = page.locator("body > div.min-h-screen.bg-background > header > div > div > button > span")
        await expect(userAccount).toBeVisible()
        await expect(userAccount).toContainText(user.username)
        await expect(imageUploadPage.uploadInput()).toBeVisible()
    })
})