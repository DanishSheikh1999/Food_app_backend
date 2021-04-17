import { MenuItems } from "../../restaurant/domain/Menu";


export default class CartItem {
  constructor(
    public readonly menuItem:MenuItems,
    public readonly quantity: number
  ) {}
}
