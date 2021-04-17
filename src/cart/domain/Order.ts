import CartItem from "./Cart";

export default class Order{
    constructor(
        public readonly restaurantId:String,
        public readonly userId:String,
        public readonly items:Array<CartItem>
    ){}
}