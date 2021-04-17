import CartItem from "./Cart";

export default class Order{
    constructor(
        public readonly restaurantId:string,
        public readonly userId:string,
        public readonly totalPrice:number,
        public readonly items:Array<OrderItem>
    ){}
}

export class OrderItem{
    constructor(public readonly menuItemId:string,public readonly quantity:number){}
}