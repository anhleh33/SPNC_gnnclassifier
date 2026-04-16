import { Page } from "@playwright/test";
import path from "path";

export default class Upload {
    private uploadPage: Page

    constructor(upload: Page) {
        this.uploadPage = upload
    }

    public uploadInput = () => this.uploadPage.locator("//input[@accept='image/*']")

    public modelDropdown = () => this.uploadPage.getByRole('combobox')

    public classifyImageBtn = () => this.uploadPage.locator("//div[contains(@class,'flex gap-4')]").filter({ has: this.modelDropdown() }).getByText("Classify Image")

    public newImageBtn = () => this.uploadPage.getByRole('button').getByText("New Image")

    public reclassifyBtn = () => this.uploadPage.getByRole('button').getByText("Reclassify")

    public async uploadUserImage(fileName: string) {
        const filePath = path.resolve(__dirname, `../samples/${fileName}.png`);
        await this.uploadInput().setInputFiles(filePath)
    }

    public clickNewImage = () => this.newImageBtn().click()

    public reclassifyImage = () => this.reclassifyBtn().click()

    public modelOption = (name: string) => this.uploadPage.getByRole('option', { name: name });

    public changeModel = async (model: string) => {
        await this.modelDropdown().click()
        await this.modelOption(model).click()

        console.log(`Expected (from Array): ${model}`);
        console.log(`Actual (from Dropdown): ${await this.modelDropdown().textContent()}`);
        if (model == await this.modelDropdown().textContent()) {
            console.log("✅ Match: UI matches the array value.");
        } else {
            console.log("❌ Mismatch: UI shows something else.");
        }
    }
}