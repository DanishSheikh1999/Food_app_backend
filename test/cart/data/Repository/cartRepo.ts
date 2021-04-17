import mongoose from "mongoose"
import AuthRepository from "../../../../src/auth/data/Repository/authrepository"
import dotenv from "dotenv"

import chai,{assert, expect} from 'chai'
import charAsPromised from 'chai-as-promised'
import CartRepo from "../../../../src/cart/data/repository/CartRepo"
import Item from "../../../../src/cart/domain/Item"

chai.use(charAsPromised)
dotenv.config()
describe("CartRepository",()=>{

    let client:mongoose.Mongoose
    let sut:CartRepo
     beforeEach(()=>{
         client = new mongoose.Mongoose()
         const connectionString = encodeURI(process.env.Dev_DB as string)
         
         client.connect(connectionString,{
                useNewUrlParser:true,
                useUnifiedTopology:true
         })
         sut = new CartRepo(client)
     })
        after(()=>
        {
            client.disconnect()
        })

        it("should add succesfully",async()=>{
            const userId = "123456789"
            const menuItem  = "606df27aae5aad68e3931cd4"
            const quantity = 3
            const item = new Item(userId,menuItem,quantity)
            // const result = await sut.find(userId)
            const result = await sut.add(item)
            expect(result).to.not.be.null
           expect(result).to.be.equal("Added Succesfully")
            // console.log(result.items)
        })

        
})