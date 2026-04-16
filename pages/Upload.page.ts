import { Page } from "@playwright/test";
import path from "path";

export default class Upload {
    private uploadPage: Page

    constructor(upload: Page){
        this.uploadPage = upload
    }

    public uploadInput = () => this.uploadPage.getByText("Click to browse or drag and drop")

    public modelDropdown = () => this.uploadPage.getByRole('combobox')

    public classifyImageBtn = () => this.uploadPage.locator("//div[contains(@class,'flex gap-4')]").filter({has: this.modelDropdown()}).getByText("Classify Image")

    public newImageBtn = () => this.uploadPage.getByRole('button').getByText("New Image")

    public reclassifyBtn = () => this.uploadPage.getByRole('button').getByText("Reclassify")

    public async uploadUserImage(fileName: string){
        const filePath = path.resolve(__dirname, `../../samples/${fileName}.png`);
        await this.uploadInput().setInputFiles(filePath)
    }

    public clickNewImage = () => this.newImageBtn().click()

    public reclassifyImage = () => this.reclassifyBtn().click()

    public changeModel = (model: string) => this.modelDropdown().selectOption(model)
}