import * as mongoose from 'mongoose'

export interface OrderDocument extends mongoose.Document{
    restaurantId:string,
    userId:string,
    totalPrice:number
    location:{coordinates:Location}
    items:{
        menuItemId:string,
        quantity:number
    }[]
}

const pointSchema = new mongoose.Schema({
    type:{
        type:String,
        default:'Point',
        enum:['Point'],
        required:true
    },
    coordinates:{
        type:{
            longitude:{type:Number},
        latitude:{type:Number}
    }
    ,required:true
    }
})


export interface OrderModel extends mongoose.Model<OrderDocument>{}

export const OrderSchema = new mongoose.Schema({
    restaurantId:{type:String,required:true},
    userId:{type:String,required:true},
    totalPrice:{type:Number,required:true},
    location:{
        type:pointSchema,
        index:true,
        required:true,
    },
    items:{type:[{menuItemId:String,quantity:Number}],required:true}
})