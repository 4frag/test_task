export class ICatPopupContext {
  edit: boolean
  buttonText: string
  catId?: number

  constructor(edit: boolean, buttonText: string, catId: number | undefined | null) {
    if (edit && catId) {
      this.catId = catId
    }

    this.edit = edit
    this.buttonText = buttonText
  }
}