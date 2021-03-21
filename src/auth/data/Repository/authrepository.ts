import IAuthRepo from "../../domain/IAuthrepo";
import  User from "../../domain/user";
import {Mongoose } from 'mongoose'
import { UserModel, UserSchema } from "../UserModels/usermodel";

export default class AuthRepository implements IAuthRepo{
    constructor(private readonly client: Mongoose ){}
    
    async find(email: string): Promise<User> {
        const users = this.client.model<UserModel>("Users",UserSchema)
    
        const user =await  users.findOne({email:email} )
        if(!user) return Promise.reject("No User Found with the email")
        return new User(
            user.id,
            user.email,
            user.name,
            user.password??"",
            user.type

        )
    }
    public async add(email: string, name: string, type: string,passwordHash?: string): Promise<string> {
        const userModel = this.client.model<UserModel>("Users",UserSchema)
        const savedUser = new userModel({
            type:type,
            email:email,
            name:name,
        })
        if(type=="email")
            savedUser.password=passwordHash
        await savedUser.save()
        return savedUser.id;
    }

}