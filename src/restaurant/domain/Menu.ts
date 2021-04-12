export default class Menu {
  constructor(
    public readonly id: string,
    public readonly restaurnatId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly displayImageUrl:string,
    public readonly items:Array<MenuItems>
  ) {}
}

export class MenuItems{
    constructor(
      public readonly id: string,
      public readonly menuId: string,
    public readonly name:string,
    public readonly description: string,
    public readonly imageUrls:Array<string>,
    public readonly unitPrice:number
    ){}
}