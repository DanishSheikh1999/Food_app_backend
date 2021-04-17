import CartItem from "../../domain/Cart";
import Item from "../../domain/Item";
import ICartRepo from "./ICartRepo";
import mongoose from "mongoose";
import { ItemDocument, ItemModel, ItemSchema } from "../userModels/itemModel";
import { MenuItems } from "../../../restaurant/domain/Menu";
import {
  MenuDocument,
  MenuItemDocument,
  MenuItemModel,
  MenuItemSchema,
  MenuModel,
  MenuSchema,
} from "../../../restaurant/data/metadata/MenuModel";
import Order from "../../domain/Order";
import {
  OrderDocument,
  OrderModel,
  OrderSchema,
} from "../userModels/orderModel";
export default class CartRepo implements ICartRepo {
  constructor(public client: mongoose.Mongoose) {}
  async order(userId: string): Promise<string> {
    let data = await this.find(userId).catch((_) => null);

    return await this._placeOrder(data, userId);
  }
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

  async findOrder(userId: string): Promise<Array<CartItem>> {
    const model = this.client.model<OrderDocument>(
      "Order",
      OrderSchema
    ) as OrderModel;

    const order= await model.findOne({ userId: userId });
    if (!order) return Promise.reject("No orders");
    return await this.parseOrder(order);
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

  async parseOrder(data: OrderDocument): Promise<Array<CartItem>> {
    const model = this.client.model<MenuItemDocument>(
      "MenuItem",
      MenuItemSchema
    ) as MenuItemModel;

    const items = data.items;
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
  async _placeOrder(data: CartItem[] | null, userId: string): Promise<string> {
    if (data == null) {
      return Promise.reject("The cart is empty");
    }

    const model = this.client.model<ItemDocument>(
      "Cart",
      ItemSchema
    ) as ItemModel;

    const cart = (await model.findOne({ userId: userId })) as ItemDocument;

    await model.findOneAndRemove({userId:userId}).catch((_:any)=>Promise.reject("Error in server"))
    let totalPrice = 0;
    data.forEach(
      (value) => (totalPrice += value.menuItem.unitPrice * value.quantity)
    );
    console.log(totalPrice);
    const menuModel = this.client.model<MenuDocument>(
      "Menu",
      MenuSchema
    ) as MenuModel;
    console.log(data[0].menuItem.menuId)
    const menu = (await menuModel.findOne({
      _id: data[0].menuItem.menuId,
    })) as MenuDocument;
    
    const restaurant_id = menu.restaurantId;

    console.log(restaurant_id)
    const orderModel = this.client.model<OrderDocument>(
      "Order",
      OrderSchema
    ) as OrderModel;
    const new_order = new orderModel({
      restaurantId: restaurant_id,
      userId: userId,
      totalPrice: totalPrice,
      items: cart.addedItems,
    });
    await new_order.save();
    return "Order Successfully Placed";
  }
}
