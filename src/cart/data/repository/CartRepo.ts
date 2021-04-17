import  CartItem from "../../domain/Cart";
import Item from "../../domain/Item";
import ICartRepo from "./ICartRepo";
import mongoose from "mongoose";
import { ItemDocument, ItemModel, ItemSchema } from "../userModels/itemModel";
import { MenuItems } from "../../../restaurant/domain/Menu";
import {
  MenuItemDocument,
  MenuItemModel,
  MenuItemSchema,
} from "../../../restaurant/data/metadata/MenuModel";
export default class CartRepo implements ICartRepo {
  constructor(public client: mongoose.Mongoose) {}
  async find(userId: string): Promise<Array<CartItem>> {
    const model = this.client.model<ItemDocument>(
      "Cart",
      ItemSchema
    ) as ItemModel;

    const cart = await model.findOne({ userId: userId });
    if (!cart) return Promise.reject("The Cart is empty");
    return await this.parseCart(cart);
  }

  async add(item: Item): Promise<string> {
    const model = this.client.model<ItemDocument>(
      "Cart",
      ItemSchema
    ) as ItemModel;
    const cart = await model.findOne({ userId: item.userId });
    if (cart) {
      console.log(cart);
      const updateItem = cart.addedItems.find(
        (value: any) => value.menuItemId == item.menuItemId
      );
      if (updateItem) {
        console.log(updateItem);
        await model
          .findOneAndUpdate(
            {
              userId: item.userId,
              addedItems: { $elemMatch: { menuItemId: item.menuItemId } },
            },
            { $set: { "addedItems.$.quantity": item.quantity } }
          )
          .catch((_: any) => Promise.reject("Error updating existing records"));

        return Promise.resolve("Added Succesfully");
      }

      await model.findOneAndUpdate(
        { userId: item.userId },
        {
          $push: {
            addedItems: {
              menuItemId: item.menuItemId,
              quantity: item.quantity,
            },
          },
        }
      );
      return Promise.resolve("Added Succesfully");
    }

    const new_cart = new model({
      userId: item.userId,
      addedItems: [{ menuItemId: item.menuItemId, quantity: item.quantity }],
    });
    await new_cart.save();
    return "Added Succesfully";
  }

  async parseCart(data: ItemDocument): Promise<Array<CartItem>> {
    const model = this.client.model<MenuItemDocument>(
      "MenuItem",
      MenuItemSchema
    ) as MenuItemModel;

    const items = data.addedItems;
    let menuItems: CartItem[] = [];
    for (let i = 0; i < items.length; i++) {
      const menuItem = await model.findById(items[i].menuItemId);
      const value = new MenuItems(
        menuItem._id,
        menuItem.menuId,
        menuItem.name,
        menuItem.description,
        menuItem.image_urls,
        menuItem.unit_price
      );

      menuItems.push(new CartItem(value, items[i].quantity));
    }
    return menuItems;
  }
}
