import * as mongoose from 'mongoose';
export interface ItemDocument extends mongoose.Document {
    userId:string,
    addedItems:{
        menuItemId:string,
        quantity:number
    }[]
}

export interface ItemModel extends mongoose.Model<ItemDocument>{}

 export const ItemSchema = new mongoose.Schema({
    userId:{type:String,required:true},
    addedItems:{type:[{menuItemId:String,quantity:Number}],required:true}
})

