import mongoose from 'mongoose';
import Restaurant, { Address, Location } from '../../domain/Restaurant';
import pagination from 'mongoose-paginate-v2'
export interface RestaurantDoc extends mongoose.Document{
    name: string
    type:string
    rating:number
    display_img_url:string
    location:{coordinates:Location}
    address:Address
}

export interface RestaurantModel extends mongoose.PaginateModel<RestaurantDoc>{}


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

const RestaurantSchema = new mongoose.Schema({
    name:{type:String,required:true,index:true},
    type:{type:String,required:true},
    rating:{type:Number,required:true,min:0,max:5},
    display_img_url:{type:String,required:true},
    location:{
        type:pointSchema,
        index:true,
        required:true,
    },
    address:{
        street:{type:String,required:true},
        city:{type:String,required:true},
        district:{type:String,required:true},
        state:{type:String,required:true},
        pinCode:{type:Number,required:true}
    }

})

RestaurantSchema.index({"name":"text"})
RestaurantSchema.index({"location":"2dsphere"})
RestaurantSchema.plugin(pagination)
export default RestaurantSchema