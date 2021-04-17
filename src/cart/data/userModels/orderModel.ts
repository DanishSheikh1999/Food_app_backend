import * as mongoose from 'mongoose'

export interface OrderDocument extends mongoose.Document{
    restaurantId:string,
    userId:string,
    totalPrice:number
    items:{
        menuItemId:string,
        quantity:number
    }[]
}

export interface OrderModel extends mongoose.Model<OrderDocument>{}

export const OrderSchema = new mongoose.Schema({
    restaurantId:{type:String,required:true},
    userId:{type:String,required:true},
    totalPrice:{type:Number,required:true},
    items:{type:[{menuItemId:String,quantity:Number}],required:true}
})