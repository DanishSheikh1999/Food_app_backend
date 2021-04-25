import CartItem from "../../domain/Cart";
import Cart from "../../domain/Cart";
import Item, { Location } from "../../domain/Item";

export default interface ICartRepo{
    find(userId:string):Promise<Array<CartItem>>
    add(item:Item):Promise<string>
    order(userId:string,location:Location):Promise<string>
    findOrder(userId:string):Promise<Array<CartItem>>
    cancelOrder(userId:string):Promise<string>
}