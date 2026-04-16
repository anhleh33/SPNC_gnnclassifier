import LoginPage from '@/pages/Login.page'
import Upload from '@/pages/Upload.page'
import Enviroment from '@/utils/Enviroment'
import { expect, test } from '@playwright/test'

test.describe("[GNN-3] Model Classification", () => {
    console.log(`>> Test Suite: [GNN-3] Model Classification`);
    let imageUploadPage: Upload
    let loginPage: LoginPage
    const user = {
        username: Enviroment.USERNAME,
        password: Enviroment.PASSWORD
    }

    const models:Array<string> = ['kNN-Voting', 'GraphSAGE-I_v2', 'GraphSAGE-E_kNN']
    const fileName:string = 'Sinhhoc11'

    test.beforeEach(async ({page}) => {
        console.log(`>> Starting Test: Navigating to ${Enviroment.BASE_URL}`);
        await page.goto(Enviroment.BASE_URL!)
        imageUploadPage = new Upload(page)
        loginPage = new LoginPage(page)
        await page.getByRole('button').getByText("Sign In").click()
        await loginPage.loginWithUser(user.username!, user.password!)
    })

    test('Before uploading an image', async({page}) => {
        console.log(`>> Before uploading an image`);
        let userAccount = page.locator("body > div.min-h-screen.bg-background > header > div > div > button > span")
        await expect(userAccount).toBeVisible()
        await expect(userAccount).toContainText(user.username!)
        await expect(page.locator('div').getByText("Click to browse or drag and drop your image here")).toBeVisible()
    })
    
    test('After uploading an image', async({page}) => {
        console.log(`>> After uploading an image`);
        await imageUploadPage.uploadUserImage(fileName)
        await expect(imageUploadPage.classifyImageBtn()).toBeVisible()
        await expect(imageUploadPage.modelDropdown()).toBeVisible()

        await expect(page.getByText("Upload Time")).toBeVisible()
        await expect(page.getByText("Status")).toBeVisible()

        await imageUploadPage.changeModel(models[1])
        await expect(imageUploadPage.modelDropdown()).toContainText(models[1])
        
        await imageUploadPage.changeModel(models[2])
        await expect(imageUploadPage.modelDropdown()).toContainText(models[2])

        await imageUploadPage.changeModel(models[0])
        await expect(imageUploadPage.modelDropdown()).toContainText(models[0])
    })

    test('After classification', async({page}) => {
        console.log(`>> After classification`);
        await imageUploadPage.uploadUserImage(fileName)
        await expect(imageUploadPage.classifyImageBtn()).toBeVisible()
        await expect(imageUploadPage.modelDropdown()).toBeVisible()

        await imageUploadPage.classifyImageBtn().click()
        await page.getByText('Processing image with chosen model').waitFor({state: 'hidden', timeout: 15000})

        await expect(page.locator("(//div[contains(@class,'p-6 rounded-lg')])[1]").getByRole('heading')).toBeVisible()
        await expect(page.locator("(//div[@data-slot='card'])[2]")).toBeVisible()
        await expect(page.locator("(//div[@data-slot='card'])[3]")).toBeVisible()
        await expect(page.locator("(//div[contains(@class,'grid grid-cols-2')]/following-sibling::div)[2]")).toBeVisible()
        await expect(page.locator("(//div[@data-slot='card']/following-sibling::div)[2]")).toBeVisible()

        await imageUploadPage.changeModel(models[2])
        await expect(imageUploadPage.modelDropdown()).toContainText(models[2])
    })
})