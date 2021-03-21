import * as mongoose from "mongoose"

export interface UserModel extends mongoose.Document{
    type:string,
    email:string,
    name:string,
    password?:string,
    
}

export const UserSchema = new mongoose.Schema({
    type:{ type:String,required:true},
    email:{type:String,required:true},
    password:String,
    name:String


})